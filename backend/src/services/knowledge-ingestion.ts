import { addToKnowledgeBase, addMultipleToKnowledgeBase } from './vector-search';
import { generateEmbeddings } from './ai';
import * as fs from 'fs/promises';
import * as path from 'path';

// Knowledge source types
export interface KnowledgeSource {
  id: string;
  name: string;
  type: 'text' | 'pdf' | 'web' | 'api' | 'csv' | 'json';
  url?: string;
  content?: string;
  metadata: Record<string, any>;
  lastUpdated: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

// Ingestion job interface
export interface IngestionJob {
  id: string;
  sourceId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  documentsProcessed: number;
  totalDocuments: number;
  errors: string[];
  startedAt?: Date;
  completedAt?: Date;
}

// Document chunk interface
export interface DocumentChunk {
  content: string;
  metadata: Record<string, any>;
  source: string;
  chunkIndex: number;
  totalChunks: number;
}

class KnowledgeIngestionEngine {
  private jobs: Map<string, IngestionJob> = new Map();
  private sources: Map<string, KnowledgeSource> = new Map();

  // Text chunking for large documents
  chunkText(text: string, maxChunkSize: number = 1000, overlap: number = 100): DocumentChunk[] {
    const chunks: DocumentChunk[] = [];
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    let currentChunk = '';
    let chunkIndex = 0;
    
    for (const sentence of sentences) {
      const sentenceWithPeriod = sentence.trim() + '.';
      
      if (currentChunk.length + sentenceWithPeriod.length > maxChunkSize && currentChunk.length > 0) {
        chunks.push({
          content: currentChunk.trim(),
          metadata: { chunkIndex, totalChunks: 0 }, // Will update totalChunks later
          source: 'text_ingestion',
          chunkIndex,
          totalChunks: 0
        });
        
        // Add overlap
        const words = currentChunk.split(' ');
        const overlapWords = words.slice(-Math.floor(overlap / 5)); // Approximate word overlap
        currentChunk = overlapWords.join(' ') + ' ' + sentenceWithPeriod;
        chunkIndex++;
      } else {
        currentChunk += (currentChunk ? ' ' : '') + sentenceWithPeriod;
      }
    }
    
    // Add final chunk
    if (currentChunk.trim()) {
      chunks.push({
        content: currentChunk.trim(),
        metadata: { chunkIndex, totalChunks: 0 },
        source: 'text_ingestion',
        chunkIndex,
        totalChunks: 0
      });
    }
    
    // Update totalChunks
    chunks.forEach(chunk => {
      chunk.totalChunks = chunks.length;
      chunk.metadata.totalChunks = chunks.length;
    });
    
    return chunks;
  }

  // Process different content types
  async processTextContent(content: string, source: string, metadata: Record<string, any> = {}): Promise<string[]> {
    const chunks = this.chunkText(content);
    const documentIds: string[] = [];
    
    for (const chunk of chunks) {
      const enhancedMetadata = {
        ...metadata,
        ...chunk.metadata,
        originalSource: source,
        processedAt: new Date().toISOString(),
        contentType: 'text_chunk'
      };
      
      const docId = await addToKnowledgeBase(chunk.content, enhancedMetadata, source);
      if (docId) {
        documentIds.push(docId);
      }
    }
    
    return documentIds;
  }

  async processJSONContent(jsonData: any, source: string, metadata: Record<string, any> = {}): Promise<string[]> {
    const documentIds: string[] = [];
    
    // Handle different JSON structures
    if (Array.isArray(jsonData)) {
      // Array of objects
      for (let i = 0; i < jsonData.length; i++) {
        const item = jsonData[i];
        const content = typeof item === 'string' ? item : JSON.stringify(item, null, 2);
        
        const enhancedMetadata = {
          ...metadata,
          arrayIndex: i,
          contentType: 'json_item',
          processedAt: new Date().toISOString()
        };
        
        const docId = await addToKnowledgeBase(content, enhancedMetadata, source);
        if (docId) documentIds.push(docId);
      }
    } else if (typeof jsonData === 'object') {
      // Single object or nested structure
      const content = JSON.stringify(jsonData, null, 2);
      const chunks = this.chunkText(content, 800); // Smaller chunks for JSON
      
      for (const chunk of chunks) {
        const enhancedMetadata = {
          ...metadata,
          ...chunk.metadata,
          contentType: 'json_chunk',
          processedAt: new Date().toISOString()
        };
        
        const docId = await addToKnowledgeBase(chunk.content, enhancedMetadata, source);
        if (docId) documentIds.push(docId);
      }
    }
    
    return documentIds;
  }

  async processCSVContent(csvData: string, source: string, metadata: Record<string, any> = {}): Promise<string[]> {
    const documentIds: string[] = [];
    const lines = csvData.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) return documentIds; // Need at least header and one row
    
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      
      if (values.length === headers.length) {
        const rowObject: { [key: string]: string } = {};
        headers.forEach((header, index) => {
          rowObject[header] = values[index];
        });
        
        const content = Object.entries(rowObject)
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n');
        
        const enhancedMetadata = {
          ...metadata,
          rowIndex: i - 1,
          headers: headers,
          contentType: 'csv_row',
          processedAt: new Date().toISOString()
        };
        
        const docId = await addToKnowledgeBase(content, enhancedMetadata, source);
        if (docId) documentIds.push(docId);
      }
    }
    
    return documentIds;
  }

  // Job management
  createIngestionJob(sourceId: string): string {
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const job: IngestionJob = {
      id: jobId,
      sourceId,
      status: 'pending',
      progress: 0,
      documentsProcessed: 0,
      totalDocuments: 0,
      errors: []
    };
    
    this.jobs.set(jobId, job);
    return jobId;
  }

  async runIngestionJob(jobId: string): Promise<boolean> {
    const job = this.jobs.get(jobId);
    if (!job) return false;
    
    const source = this.sources.get(job.sourceId);
    if (!source) {
      job.status = 'failed';
      job.errors.push('Source not found');
      return false;
    }
    
    job.status = 'running';
    job.startedAt = new Date();
    
    try {
      let documentIds: string[] = [];
      
      switch (source.type) {
        case 'text':
          if (source.content) {
            documentIds = await this.processTextContent(
              source.content,
              source.name,
              source.metadata
            );
          }
          break;
          
        case 'json':
          if (source.content) {
            const jsonData = JSON.parse(source.content);
            documentIds = await this.processJSONContent(
              jsonData,
              source.name,
              source.metadata
            );
          }
          break;
          
        case 'csv':
          if (source.content) {
            documentIds = await this.processCSVContent(
              source.content,
              source.name,
              source.metadata
            );
          }
          break;
          
        default:
          throw new Error(`Unsupported source type: ${source.type}`);
      }
      
      job.documentsProcessed = documentIds.length;
      job.totalDocuments = documentIds.length;
      job.progress = 100;
      job.status = 'completed';
      job.completedAt = new Date();
      
      // Update source status
      source.status = 'completed';
      source.lastUpdated = new Date();
      
      return true;
    } catch (error) {
      job.status = 'failed';
      job.errors.push(error instanceof Error ? error.message : 'Unknown error');
      job.completedAt = new Date();
      
      source.status = 'failed';
      return false;
    }
  }

  // Batch processing
  async processBatchContent(
    items: Array<{ content: string; metadata?: Record<string, any>; source?: string }>
  ): Promise<{ successful: number; failed: number; documentIds: string[] }> {
    const results = { successful: 0, failed: 0, documentIds: [] as string[] };
    
    for (const item of items) {
      try {
        const documentIds = await this.processTextContent(
          item.content,
          item.source || 'batch_import',
          item.metadata || {}
        );
        
        results.documentIds.push(...documentIds);
        results.successful += documentIds.length;
      } catch (error) {
        console.error('Batch processing error:', error);
        results.failed++;
      }
    }
    
    return results;
  }
}

// Singleton ingestion engine
const ingestionEngine = new KnowledgeIngestionEngine();

// Public API functions
export const createKnowledgeSource = (
  name: string,
  type: KnowledgeSource['type'],
  content?: string,
  url?: string,
  metadata: Record<string, any> = {}
): string => {
  const sourceId = `src_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const source: KnowledgeSource = {
    id: sourceId,
    name,
    type,
    content,
    url,
    metadata,
    lastUpdated: new Date(),
    status: 'pending'
  };
  
  ingestionEngine['sources'].set(sourceId, source);
  return sourceId;
};

export const ingestTextContent = async (
  content: string,
  sourceName: string = 'text_input',
  metadata: Record<string, any> = {}
): Promise<string[]> => {
  return ingestionEngine.processTextContent(content, sourceName, metadata);
};

export const ingestJSONData = async (
  jsonData: any,
  sourceName: string = 'json_input',
  metadata: Record<string, any> = {}
): Promise<string[]> => {
  return ingestionEngine.processJSONContent(jsonData, sourceName, metadata);
};

export const ingestCSVData = async (
  csvContent: string,
  sourceName: string = 'csv_input',
  metadata: Record<string, any> = {}
): Promise<string[]> => {
  return ingestionEngine.processCSVContent(csvContent, sourceName, metadata);
};

export const processBatchIngestion = async (
  items: Array<{ content: string; metadata?: Record<string, any>; source?: string }>
): Promise<{ successful: number; failed: number; documentIds: string[] }> => {
  return ingestionEngine.processBatchContent(items);
};

export const createAndRunIngestionJob = async (
  name: string,
  type: KnowledgeSource['type'],
  content: string,
  metadata: Record<string, any> = {}
): Promise<{ jobId: string; sourceId: string; success: boolean }> => {
  const sourceId = createKnowledgeSource(name, type, content, undefined, metadata);
  const jobId = ingestionEngine.createIngestionJob(sourceId);
  const success = await ingestionEngine.runIngestionJob(jobId);
  
  return { jobId, sourceId, success };
};

export const getIngestionJob = (jobId: string): IngestionJob | null => {
  return ingestionEngine['jobs'].get(jobId) || null;
};

export const getAllIngestionJobs = (): IngestionJob[] => {
  return Array.from(ingestionEngine['jobs'].values());
};

export const getKnowledgeSource = (sourceId: string): KnowledgeSource | null => {
  return ingestionEngine['sources'].get(sourceId) || null;
};

export const getAllKnowledgeSources = (): KnowledgeSource[] => {
  return Array.from(ingestionEngine['sources'].values());
};

// Utility functions
export const chunkLargeText = (
  text: string,
  maxChunkSize: number = 1000,
  overlap: number = 100
): DocumentChunk[] => {
  return ingestionEngine.chunkText(text, maxChunkSize, overlap);
};

export const validateIngestionData = (data: any, type: KnowledgeSource['type']): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  switch (type) {
    case 'text':
      if (typeof data !== 'string' || data.trim().length === 0) {
        errors.push('Text content must be a non-empty string');
      }
      break;
      
    case 'json':
      try {
        if (typeof data === 'string') {
          JSON.parse(data);
        } else if (typeof data !== 'object') {
          errors.push('JSON data must be an object or valid JSON string');
        }
      } catch {
        errors.push('Invalid JSON format');
      }
      break;
      
    case 'csv':
      if (typeof data !== 'string' || !data.includes(',')) {
        errors.push('CSV data must be a comma-separated string');
      }
      break;
      
    default:
      errors.push(`Unsupported ingestion type: ${type}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const getIngestionStats = (): {
  totalSources: number;
  totalJobs: number;
  completedJobs: number;
  failedJobs: number;
  pendingJobs: number;
} => {
  const allJobs = getAllIngestionJobs();
  
  return {
    totalSources: getAllKnowledgeSources().length,
    totalJobs: allJobs.length,
    completedJobs: allJobs.filter(job => job.status === 'completed').length,
    failedJobs: allJobs.filter(job => job.status === 'failed').length,
    pendingJobs: allJobs.filter(job => job.status === 'pending').length
  };
};