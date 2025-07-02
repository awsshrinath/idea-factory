import { Router, Request, Response } from 'express';
import { 
  generateText, 
  getPromptForTopic, 
  generateImage,
  generateRAGContent,
  generateEmbeddings,
  getContextAwarePrompt,
  MCPRequest
} from '../services/ai';
import { 
  addToKnowledgeBase,
  searchKnowledgeBase,
  getKnowledgeBaseStats,
  enhanceWithContext
} from '../services/vector-search';
import {
  createCharacterProfile,
  getCharacterProfile,
  buildCharacterPrompt,
  recordCharacterInteraction,
  getCharacterStats
} from '../services/character-profile';
import {
  calculateCharacterConsistency,
  validateCharacterResponse,
  improveCharacterConsistency
} from '../services/character-consistency';
import {
  ingestTextContent,
  ingestJSONData,
  ingestCSVData,
  processBatchIngestion,
  createAndRunIngestionJob,
  getIngestionJob,
  getIngestionStats,
  validateIngestionData
} from '../services/knowledge-ingestion';

const router = Router();

router.post('/generate-text', async (req: Request, res: Response) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const generatedContent = await generateText(prompt);
    if (generatedContent) {
      res.status(200).json({ content: generatedContent });
    } else {
      res.status(500).json({ error: 'Failed to generate content' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An internal server error occurred' });
  }
});

router.post('/generate-from-topic', async (req: Request, res: Response) => {
    const { topic } = req.body;

    if (!topic) {
        return res.status(400).json({ error: 'Topic is required' });
    }

    try {
        const prompt = getPromptForTopic(topic);
        const generatedContent = await generateText(prompt);
        if (generatedContent) {
            res.status(200).json({ content: generatedContent });
        } else {
            res.status(500).json({ error: 'Failed to generate content' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An internal server error occurred' });
    }
});

router.post('/image', async (req: Request, res: Response) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const imageUrl = await generateImage(prompt);
    if (imageUrl) {
      res.status(200).json({ imageUrl });
    } else {
      res.status(500).json({ error: 'Failed to generate image' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate image' });
  }
});

// Enhanced RAG+MCP Content Generation Endpoints

router.post('/rag-generate', async (req: Request, res: Response) => {
  const { prompt, characterId, temperature, maxTokens, searchQuery } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    // Search for relevant context if searchQuery provided
    let context = [];
    if (searchQuery) {
      context = await searchKnowledgeBase(searchQuery, 5);
    }

    // Build MCP request
    const mcpRequest: MCPRequest = {
      prompt,
      characterId,
      context,
      temperature,
      maxTokens,
    };

    // Generate content with RAG context
    const generatedContent = await generateRAGContent(mcpRequest);
    
    if (generatedContent) {
      // Record interaction if character is used
      if (characterId) {
        await recordCharacterInteraction(characterId, prompt, generatedContent);
      }

      res.status(200).json({ 
        content: generatedContent,
        contextUsed: context.length > 0,
        contextSources: context.map(c => c.source),
        characterId
      });
    } else {
      res.status(500).json({ error: 'Failed to generate content' });
    }
  } catch (error) {
    console.error('RAG generation error:', error);
    res.status(500).json({ error: 'An internal server error occurred' });
  }
});

router.post('/enhance-with-context', async (req: Request, res: Response) => {
  const { query, contextLimit } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  try {
    const enhanced = await enhanceWithContext(query, contextLimit || 3);
    res.status(200).json(enhanced);
  } catch (error) {
    console.error('Context enhancement error:', error);
    res.status(500).json({ error: 'Failed to enhance with context' });
  }
});

// Knowledge Base Management Endpoints

router.post('/knowledge/add', async (req: Request, res: Response) => {
  const { content, metadata = {}, source = 'user_input' } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }

  try {
    const documentId = await addToKnowledgeBase(content, metadata, source);
    
    if (documentId) {
      res.status(201).json({ 
        documentId,
        message: 'Document added to knowledge base successfully'
      });
    } else {
      res.status(500).json({ error: 'Failed to add document to knowledge base' });
    }
  } catch (error) {
    console.error('Knowledge base add error:', error);
    res.status(500).json({ error: 'An internal server error occurred' });
  }
});

router.get('/knowledge/search', async (req: Request, res: Response) => {
  const { query, limit = 5 } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const results = await searchKnowledgeBase(query as string, parseInt(limit as string));
    res.status(200).json({ results, count: results.length });
  } catch (error) {
    console.error('Knowledge search error:', error);
    res.status(500).json({ error: 'Failed to search knowledge base' });
  }
});

router.get('/knowledge/stats', async (req: Request, res: Response) => {
  try {
    const stats = await getKnowledgeBaseStats();
    res.status(200).json(stats);
  } catch (error) {
    console.error('Knowledge stats error:', error);
    res.status(500).json({ error: 'Failed to get knowledge base stats' });
  }
});

// Character Profile Management Endpoints

router.post('/character/create', async (req: Request, res: Response) => {
  const { name, personality, tone, background, writingStyle, vocabulary = [] } = req.body;

  if (!name || !personality || !tone) {
    return res.status(400).json({ 
      error: 'Name, personality, and tone are required' 
    });
  }

  try {
    const characterId = await createCharacterProfile(
      name,
      personality,
      tone,
      background || '',
      writingStyle || 'adaptive',
      vocabulary
    );

    res.status(201).json({ 
      characterId,
      message: 'Character profile created successfully'
    });
  } catch (error) {
    console.error('Character creation error:', error);
    res.status(500).json({ error: 'Failed to create character profile' });
  }
});

router.get('/character/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const character = await getCharacterProfile(id);
    
    if (character) {
      res.status(200).json({ character });
    } else {
      res.status(404).json({ error: 'Character not found' });
    }
  } catch (error) {
    console.error('Character retrieval error:', error);
    res.status(500).json({ error: 'Failed to retrieve character' });
  }
});

router.get('/character/:id/stats', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const stats = await getCharacterStats(id);
    
    if (stats.character) {
      res.status(200).json(stats);
    } else {
      res.status(404).json({ error: 'Character not found' });
    }
  } catch (error) {
    console.error('Character stats error:', error);
    res.status(500).json({ error: 'Failed to get character stats' });
  }
});

router.post('/character/:id/generate', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { prompt, searchQuery, temperature, maxTokens } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    // Get character profile
    const character = await getCharacterProfile(id);
    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }

    // Search for context if provided
    let context = [];
    if (searchQuery) {
      context = await searchKnowledgeBase(searchQuery, 3);
    }

    // Build character-specific prompt
    const characterPrompt = await buildCharacterPrompt(id, prompt);

    // Generate content with character consistency
    const mcpRequest: MCPRequest = {
      prompt: characterPrompt,
      characterId: id,
      context,
      temperature,
      maxTokens,
    };

    const generatedContent = await generateRAGContent(mcpRequest);
    
    if (generatedContent) {
      // Record the interaction
      await recordCharacterInteraction(id, prompt, generatedContent);

      res.status(200).json({ 
        content: generatedContent,
        characterId: id,
        contextUsed: context.length > 0,
        characterName: character.name
      });
    } else {
      res.status(500).json({ error: 'Failed to generate character content' });
    }
  } catch (error) {
    console.error('Character generation error:', error);
    res.status(500).json({ error: 'An internal server error occurred' });
  }
});

// Embedding Service Endpoint

router.post('/embeddings', async (req: Request, res: Response) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    const embeddings = await generateEmbeddings(text);
    
    if (embeddings) {
      res.status(200).json({ 
        embeddings,
        dimensions: embeddings.length
      });
    } else {
      res.status(500).json({ error: 'Failed to generate embeddings' });
    }
  } catch (error) {
    console.error('Embeddings error:', error);
    res.status(500).json({ error: 'An internal server error occurred' });
  }
});

// Character Consistency Endpoints

router.post('/character/:id/consistency', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { responseText } = req.body;

  if (!responseText) {
    return res.status(400).json({ error: 'Response text is required' });
  }

  try {
    const metrics = await calculateCharacterConsistency(id, responseText);
    res.status(200).json({ metrics });
  } catch (error) {
    console.error('Consistency calculation error:', error);
    res.status(500).json({ error: 'Failed to calculate consistency' });
  }
});

router.post('/character/:id/validate', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { responseText, minScore = 0.7 } = req.body;

  if (!responseText) {
    return res.status(400).json({ error: 'Response text is required' });
  }

  try {
    const validation = await validateCharacterResponse(id, responseText, minScore);
    res.status(200).json(validation);
  } catch (error) {
    console.error('Response validation error:', error);
    res.status(500).json({ error: 'Failed to validate response' });
  }
});

router.post('/character/:id/improve', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { responseText } = req.body;

  if (!responseText) {
    return res.status(400).json({ error: 'Response text is required' });
  }

  try {
    const improvement = await improveCharacterConsistency(id, responseText);
    res.status(200).json(improvement);
  } catch (error) {
    console.error('Response improvement error:', error);
    res.status(500).json({ error: 'Failed to improve response' });
  }
});

// Knowledge Ingestion Endpoints

router.post('/ingest/text', async (req: Request, res: Response) => {
  const { content, sourceName = 'text_input', metadata = {} } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }

  const validation = validateIngestionData(content, 'text');
  if (!validation.isValid) {
    return res.status(400).json({ error: 'Invalid content', details: validation.errors });
  }

  try {
    const documentIds = await ingestTextContent(content, sourceName, metadata);
    res.status(201).json({ 
      documentIds,
      count: documentIds.length,
      message: 'Text content ingested successfully'
    });
  } catch (error) {
    console.error('Text ingestion error:', error);
    res.status(500).json({ error: 'Failed to ingest text content' });
  }
});

router.post('/ingest/json', async (req: Request, res: Response) => {
  const { data, sourceName = 'json_input', metadata = {} } = req.body;

  if (!data) {
    return res.status(400).json({ error: 'JSON data is required' });
  }

  const validation = validateIngestionData(data, 'json');
  if (!validation.isValid) {
    return res.status(400).json({ error: 'Invalid JSON data', details: validation.errors });
  }

  try {
    const documentIds = await ingestJSONData(data, sourceName, metadata);
    res.status(201).json({ 
      documentIds,
      count: documentIds.length,
      message: 'JSON data ingested successfully'
    });
  } catch (error) {
    console.error('JSON ingestion error:', error);
    res.status(500).json({ error: 'Failed to ingest JSON data' });
  }
});

router.post('/ingest/csv', async (req: Request, res: Response) => {
  const { csvContent, sourceName = 'csv_input', metadata = {} } = req.body;

  if (!csvContent) {
    return res.status(400).json({ error: 'CSV content is required' });
  }

  const validation = validateIngestionData(csvContent, 'csv');
  if (!validation.isValid) {
    return res.status(400).json({ error: 'Invalid CSV data', details: validation.errors });
  }

  try {
    const documentIds = await ingestCSVData(csvContent, sourceName, metadata);
    res.status(201).json({ 
      documentIds,
      count: documentIds.length,
      message: 'CSV data ingested successfully'
    });
  } catch (error) {
    console.error('CSV ingestion error:', error);
    res.status(500).json({ error: 'Failed to ingest CSV data' });
  }
});

router.post('/ingest/batch', async (req: Request, res: Response) => {
  const { items } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Items array is required' });
  }

  try {
    const results = await processBatchIngestion(items);
    res.status(201).json({
      ...results,
      message: `Batch ingestion completed: ${results.successful} successful, ${results.failed} failed`
    });
  } catch (error) {
    console.error('Batch ingestion error:', error);
    res.status(500).json({ error: 'Failed to process batch ingestion' });
  }
});

router.post('/ingest/job', async (req: Request, res: Response) => {
  const { name, type, content, metadata = {} } = req.body;

  if (!name || !type || !content) {
    return res.status(400).json({ error: 'Name, type, and content are required' });
  }

  const validation = validateIngestionData(content, type);
  if (!validation.isValid) {
    return res.status(400).json({ error: 'Invalid content', details: validation.errors });
  }

  try {
    const result = await createAndRunIngestionJob(name, type, content, metadata);
    res.status(201).json({
      ...result,
      message: result.success ? 'Ingestion job completed successfully' : 'Ingestion job failed'
    });
  } catch (error) {
    console.error('Ingestion job error:', error);
    res.status(500).json({ error: 'Failed to create and run ingestion job' });
  }
});

router.get('/ingest/job/:jobId', async (req: Request, res: Response) => {
  const { jobId } = req.params;

  try {
    const job = getIngestionJob(jobId);
    if (job) {
      res.status(200).json({ job });
    } else {
      res.status(404).json({ error: 'Job not found' });
    }
  } catch (error) {
    console.error('Job retrieval error:', error);
    res.status(500).json({ error: 'Failed to retrieve job' });
  }
});

router.get('/ingest/stats', async (req: Request, res: Response) => {
  try {
    const stats = getIngestionStats();
    res.status(200).json({ stats });
  } catch (error) {
    console.error('Ingestion stats error:', error);
    res.status(500).json({ error: 'Failed to get ingestion stats' });
  }
});

export default router; 