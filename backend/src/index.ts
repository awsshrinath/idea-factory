import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import { startJobWorker } from './worker/jobs';

dotenv.config();

const JWT_SECRET = process.env.SUPABASE_JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('Supabase JWT Secret must be provided in environment variables.');
}

declare global {
  namespace Express {
    export interface Request {
      user?: string | jwt.JwtPayload;
    }
  }
}

const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Authentication token is required.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    // Log token usage
    if (typeof decoded === 'object' && decoded.sub) {
      console.log(`[Auth] User ${decoded.sub} accessed ${req.originalUrl}`);
    }
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

const app = express();
const port = process.env.PORT || 3001;

// CORS Configuration
const allowedOrigins =
  process.env.NODE_ENV === 'production'
    ? [process.env.FRONTEND_URL || '']
    : ['http://localhost:5173', 'http://127.0.0.1:5173'];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(limiter);

// Health check endpoint
app.get('/api/v1/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// Add routes here
import aiRoutes from './routes/ai';
app.use('/api/v1/ai', authMiddleware, aiRoutes);

import instagramRoutes from './routes/instagram';
app.use('/api/v1/instagram', authMiddleware, instagramRoutes);

import schedulerRoutes from './routes/scheduler';
app.use('/api/v1/scheduler', authMiddleware, schedulerRoutes);

import storageRoutes from './routes/storage';
app.use('/api/v1/storage', authMiddleware, storageRoutes);

import jobsRoutes from './routes/jobs';
app.use('/api/v1/jobs', authMiddleware, jobsRoutes);

// Example: import contentRoutes from './routes/content';
// app.use('/api/v1/content', contentRoutes);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
  startJobWorker();
}); 