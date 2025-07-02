import OpenAI from 'openai';
import dotenv from 'dotenv';
import axios from 'axios';
import axiosRetry from 'axios-retry';

dotenv.config();

const openaiApiKey = process.env.OPENAI_API_KEY;

// Initialize OpenAI client for enhanced capabilities
const openai = new OpenAI({
    apiKey: openaiApiKey,
});

const apiClient = axios.create({
    baseURL: 'https://api.openai.com/v1',
    headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
    },
});

axiosRetry(apiClient, {
    retries: 3,
    retryDelay: (retryCount) => {
        console.log(`Retrying request, attempt: ${retryCount}`);
        return retryCount * 2000; // Exponential backoff
    },
    retryCondition: (error) => {
        // Retry on network errors or 5xx server errors
        return error.code !== 'ECONNABORTED' && (!error.response || error.response.status >= 500);
    },
});

// RAG and MCP related interfaces
export interface RAGContext {
    content: string;
    metadata: Record<string, any>;
    relevanceScore: number;
    source: string;
}

export interface CharacterProfile {
    id: string;
    name: string;
    personality: string;
    tone: string;
    vocabulary: string[];
    background: string;
    writingStyle: string;
}

export interface MCPRequest {
    prompt: string;
    characterId?: string;
    context?: RAGContext[];
    temperature?: number;
    maxTokens?: number;
}

export const generateText = async (prompt: string): Promise<string | null> => {
  if (!openaiApiKey) {
    console.error('OpenAI API key not configured.');
    return null;
  }

  try {
    const response = await apiClient.post('/chat/completions', {
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
    });
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating text with OpenAI:', error);
    return null;
  }
};

export const generateImage = async (prompt: string): Promise<string | null> => {
  if (!openaiApiKey) {
    console.error('OpenAI API key not configured.');
    return null;
  }

  try {
    const response = await apiClient.post('/images/generations', {
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1024',
    });
    return response.data.data[0].url;
  } catch (error) {
    console.error('Error generating image with DALL-E 3:', error);
    return null;
  }
};

// Enhanced OpenAI Embedding Service
export const generateEmbeddings = async (text: string): Promise<number[] | null> => {
  if (!openaiApiKey) {
    console.error('OpenAI API key not configured.');
    return null;
  }

  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });
    
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embeddings:', error);
    return null;
  }
};

// Enhanced RAG-powered content generation
export const generateRAGContent = async (request: MCPRequest): Promise<string | null> => {
  if (!openaiApiKey) {
    console.error('OpenAI API key not configured.');
    return null;
  }

  try {
    // Build context-aware prompt
    let contextPrompt = request.prompt;
    
    if (request.context && request.context.length > 0) {
      const contextText = request.context
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, 5) // Use top 5 most relevant contexts
        .map(ctx => `[Context from ${ctx.source}]: ${ctx.content}`)
        .join('\n\n');
      
      contextPrompt = `Based on the following context information:\n\n${contextText}\n\nPlease respond to: ${request.prompt}`;
    }

    // Add character consistency if character profile provided
    if (request.characterId) {
      // This will be enhanced when character service is implemented
      contextPrompt = `[Character Context]: Maintain consistent personality and tone.\n\n${contextPrompt}`;
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: contextPrompt }],
      temperature: request.temperature || 0.7,
      max_tokens: request.maxTokens || 1000,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating RAG content:', error);
    return null;
  }
};

// Vector similarity calculation
export const calculateCosineSimilarity = (vectorA: number[], vectorB: number[]): number => {
  if (vectorA.length !== vectorB.length) {
    throw new Error('Vectors must have the same length');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vectorA.length; i++) {
    dotProduct += vectorA[i] * vectorB[i];
    normA += vectorA[i] * vectorA[i];
    normB += vectorB[i] * vectorB[i];
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (normA * normB);
};

// Enhanced prompt template system with context awareness
export const getPromptForTopic = (topic: string): string => {
  // Simple example of a template
  return `Write a short social media post about ${topic}.`;
};

export const getContextAwarePrompt = (
  topic: string, 
  platform: string, 
  tone: string, 
  context?: RAGContext[]
): string => {
  let basePrompt = `Create a ${tone} ${platform} post about ${topic}.`;
  
  if (context && context.length > 0) {
    const contextInfo = context
      .slice(0, 3)
      .map(ctx => ctx.content)
      .join(' ');
    basePrompt += ` Consider this background information: ${contextInfo}`;
  }
  
  return basePrompt;
}; 