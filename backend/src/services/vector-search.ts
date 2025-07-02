import { generateEmbeddings, calculateCosineSimilarity, RAGContext } from './ai';

// Vector storage interface
export interface VectorDocument {
  id: string;
  content: string;
  embedding: number[];
  metadata: Record<string, any>;
  source: string;
  createdAt: Date;
}

// In-memory vector store (would be replaced with proper vector DB in production)
class InMemoryVectorStore {
  private documents: Map<string, VectorDocument> = new Map();

  async addDocument(doc: Omit<VectorDocument, 'embedding'>): Promise<boolean> {
    try {
      const embedding = await generateEmbeddings(doc.content);
      if (!embedding) {
        console.error('Failed to generate embedding for document:', doc.id);
        return false;
      }

      const vectorDoc: VectorDocument = {
        ...doc,
        embedding,
      };

      this.documents.set(doc.id, vectorDoc);
      return true;
    } catch (error) {
      console.error('Error adding document to vector store:', error);
      return false;
    }
  }

  async searchSimilar(query: string, limit: number = 5): Promise<RAGContext[]> {
    try {
      const queryEmbedding = await generateEmbeddings(query);
      if (!queryEmbedding) {
        console.error('Failed to generate embedding for query');
        return [];
      }

      const similarities: Array<{ doc: VectorDocument; score: number }> = [];

      for (const doc of this.documents.values()) {
        const similarity = calculateCosineSimilarity(queryEmbedding, doc.embedding);
        similarities.push({ doc, score: similarity });
      }

      // Sort by similarity score and return top results
      const results = similarities
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(({ doc, score }) => ({
          content: doc.content,
          metadata: doc.metadata,
          relevanceScore: score,
          source: doc.source,
        }));

      return results;
    } catch (error) {
      console.error('Error searching similar documents:', error);
      return [];
    }
  }

  async getDocument(id: string): Promise<VectorDocument | null> {
    return this.documents.get(id) || null;
  }

  async deleteDocument(id: string): Promise<boolean> {
    return this.documents.delete(id);
  }

  async getAllDocuments(): Promise<VectorDocument[]> {
    return Array.from(this.documents.values());
  }

  getDocumentCount(): number {
    return this.documents.size;
  }
}

// Singleton vector store instance
const vectorStore = new InMemoryVectorStore();

// Public API functions
export const addToKnowledgeBase = async (
  content: string,
  metadata: Record<string, any> = {},
  source: string = 'user_input'
): Promise<string | null> => {
  const id = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const success = await vectorStore.addDocument({
    id,
    content,
    metadata,
    source,
    createdAt: new Date(),
  });

  return success ? id : null;
};

export const searchKnowledgeBase = async (
  query: string,
  limit: number = 5
): Promise<RAGContext[]> => {
  return vectorStore.searchSimilar(query, limit);
};

export const getKnowledgeDocument = async (id: string): Promise<VectorDocument | null> => {
  return vectorStore.getDocument(id);
};

export const deleteKnowledgeDocument = async (id: string): Promise<boolean> => {
  return vectorStore.deleteDocument(id);
};

export const getKnowledgeBaseStats = async (): Promise<{
  documentCount: number;
  documents: VectorDocument[];
}> => {
  return {
    documentCount: vectorStore.getDocumentCount(),
    documents: await vectorStore.getAllDocuments(),
  };
};

// Batch operations
export const addMultipleToKnowledgeBase = async (
  documents: Array<{
    content: string;
    metadata?: Record<string, any>;
    source?: string;
  }>
): Promise<string[]> => {
  const addedIds: string[] = [];
  
  for (const doc of documents) {
    const id = await addToKnowledgeBase(
      doc.content,
      doc.metadata || {},
      doc.source || 'batch_import'
    );
    if (id) {
      addedIds.push(id);
    }
  }
  
  return addedIds;
};

export const enhanceWithContext = async (
  query: string,
  contextLimit: number = 3
): Promise<{
  query: string;
  context: RAGContext[];
  enhancedPrompt: string;
}> => {
  const context = await searchKnowledgeBase(query, contextLimit);
  
  let enhancedPrompt = query;
  if (context.length > 0) {
    const contextText = context
      .map(ctx => `[${ctx.source}]: ${ctx.content}`)
      .join('\n\n');
    
    enhancedPrompt = `Context Information:\n${contextText}\n\nQuery: ${query}`;
  }
  
  return {
    query,
    context,
    enhancedPrompt,
  };
};