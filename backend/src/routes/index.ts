import { Router } from 'express';
import aiRoutes from './ai';
import jobsRoutes from './jobs';
import storageRoutes from './storage';
import schedulerRoutes from './scheduler';
import instagramRoutes from './instagram';
import contentRoutes from './content';
import databaseRoutes from './database';

const router = Router();

// Mount routes
router.use('/ai', aiRoutes);
router.use('/jobs', jobsRoutes);
router.use('/storage', storageRoutes);
router.use('/scheduler', schedulerRoutes);
router.use('/instagram', instagramRoutes);
router.use('/content', contentRoutes);
router.use('/database', databaseRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    name: 'Idea Factory API',
    version: '1.0.0',
    endpoints: {
      '/ai': 'AI content generation endpoints',
      '/jobs': 'Background job management',
      '/storage': 'File storage operations',
      '/scheduler': 'Content scheduling',
      '/instagram': 'Instagram integration',
      '/content': 'Enhanced content management system',
      '/database': 'Database schema management and setup',
      '/health': 'Health check'
    }
  });
});

export default router;
