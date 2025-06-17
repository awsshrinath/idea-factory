import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.get('/api/v1/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// Add routes here
import aiRoutes from './routes/ai';
app.use('/api/v1/ai', aiRoutes);

import instagramRoutes from './routes/instagram';
app.use('/api/v1/instagram', instagramRoutes);

import schedulerRoutes from './routes/scheduler';
app.use('/api/v1/scheduler', schedulerRoutes);

import storageRoutes from './routes/storage';
app.use('/api/v1/storage', storageRoutes);

// Example: import contentRoutes from './routes/content';
// app.use('/api/v1/content', contentRoutes);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
}); 