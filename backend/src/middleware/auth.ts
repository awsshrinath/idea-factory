import { Request, Response, NextFunction } from 'express';

// This is a placeholder, you'll need to define `user` on the Express Request object
declare global {
  namespace Express {
    export interface Request {
      user?: any; // Replace 'any' with your User type
    }
  }
}

// Implement proper auth middleware
export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
    // const { data: { user }, error } = await supabase.auth.getUser(token);
    // if (error || !user) {
    //   throw new Error('Invalid token');
    // }
    // req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
}; 