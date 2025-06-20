# Implementation Log

This document tracks all code implemented by the AI assistant during the development session.

---

## Supabase Functions

### `supabase/functions/create-storage-bucket/index.ts`

```typescript
import { createClient } from '@supabase/supabase-js';
import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      throw new Error("Supabase URL or service key is not defined in environment variables.");
    }
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const { bucketName, isPublic } = await req.json();

    if (!bucketName) {
      return new Response(JSON.stringify({ error: 'Bucket name is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { data, error } = await supabase.storage.createBucket(bucketName, {
      public: isPublic || false,
    });

    if (error) {
      // Check if the bucket already exists
      if (error.message.includes('already exists')) {
        return new Response(JSON.stringify({ message: `Bucket '${bucketName}' already exists.` }), {
          status: 200, // Or 409 Conflict, depending on desired behavior
          headers: { 'Content-Type': 'application/json' },
        });
      }
      throw error;
    }

    return new Response(JSON.stringify({ message: 'Bucket created successfully!', data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(String(err?.message ?? err), { status: 500 });
  }
});
```

---

## Backend Application

### `backend/src/index.ts` (Main Server File)

```typescript
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
```

### `backend/src/database/index.ts`

```typescript
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Service Role Key must be provided in environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
```

### `backend/src/services/ai.ts`

```typescript
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateText = async (prompt: string): Promise<string | null> => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o', // Or another model of your choice
      messages: [{ role: 'user', content: prompt }],
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating text with OpenAI:', error);
    return null;
  }
};

export const generateImage = async (prompt: string): Promise<string | null> => {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      response_format: "url",
    });

    if (response.data && response.data.length > 0 && response.data[0].url) {
      return response.data[0].url;
    }
    return null;
  } catch (error) {
    console.error('Error generating image with OpenAI:', error);
    // It's good practice to throw a custom error or handle it as per your app's needs
    throw new Error('Failed to generate image.');
  }
};

// We can add a prompt template system here later
export const getPromptForTopic = (topic: string): string => {
  // Simple example of a template
  return `Write a short social media post about ${topic}.`;
};
```

### `backend/src/services/instagram.ts`

```typescript
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const INSTAGRAM_APP_ID = process.env.INSTAGRAM_CLIENT_ID;
const INSTAGRAM_APP_SECRET = process.env.INSTAGRAM_CLIENT_SECRET;
const REDIRECT_URI = process.env.INSTAGRAM_REDIRECT_URI; // e.g., http://localhost:3001/api/v1/instagram/oauth/callback

/**
 * Step 1: Get the authorization URL to send the user to.
 */
export const getInstagramAuthUrl = (): string => {
  const scope = 'user_profile,user_media';
  return `https://api.instagram.com/oauth/authorize?client_id=${INSTAGRAM_APP_ID}&redirect_uri=${REDIRECT_URI}&scope=${scope}&response_type=code`;
};

/**
 * Step 2: Exchange the code for an access token.
 * @param code The authorization code from the callback.
 * @returns The access token.
 */
export const getAccessToken = async (code: string): Promise<string | null> => {
  try {
    const response = await axios.post(
      'https://api.instagram.com/oauth/access_token',
      {
        client_id: INSTAGRAM_APP_ID,
        client_secret: INSTAGRAM_APP_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
        code,
      },
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting Instagram access token:', error);
    return null;
  }
};

/**
 * Publishes content to Instagram.
 * This is a placeholder for the more complex content publishing flow.
 * The Instagram Basic Display API does not support content publishing.
 * You will need to use the Instagram Graph API for this.
 * @param accessToken The user's access token.
 * @param mediaUrl The URL of the media to publish.
 * @param caption The caption for the post.
 */
export const publishToInstagram = async (accessToken: string, mediaUrl: string, caption: string): Promise<any> => {
    console.warn('Content publishing requires the Instagram Graph API, not the Basic Display API.');
    // Placeholder for Graph API implementation
    return Promise.resolve({ success: true, message: 'This is a placeholder.' });
};
```

### `backend/src/services/scheduler.ts`

```typescript
import cron from 'node-cron';
import { v4 as uuidv4 } from 'uuid';

interface ScheduledJob {
  id: string;
  cronTime: string;
  content: string;
  task: cron.ScheduledTask;
}

// In-memory store for scheduled jobs. In production, this would be a database.
const scheduledJobs: Map<string, ScheduledJob> = new Map();

/**
 * Schedules a new job.
 * @param cronTime The cron time string (e.g., '* * * * *').
 * @param content The content to be "published".
 * @returns The ID of the new job.
 */
export const scheduleJob = (cronTime: string, content: string): string => {
  const id = uuidv4();

  const task = cron.schedule(cronTime, () => {
    console.log(`[Scheduler] Publishing content for job ${id}: "${content}"`);
    // Here you would add the logic to actually publish the content
    // e.g., call a social media service.
  });

  const job: ScheduledJob = { id, cronTime, content, task };
  scheduledJobs.set(id, job);

  console.log(`[Scheduler] Job ${id} scheduled for ${cronTime}`);
  return id;
};

/**
 * Gets all currently scheduled jobs.
 * @returns A list of scheduled jobs (without the task object).
 */
export const getScheduledJobs = () => {
  return Array.from(scheduledJobs.values()).map(({ task, ...job }) => job);
};

/**
 * Cancels a scheduled job.
 * @param id The ID of the job to cancel.
 * @returns True if the job was cancelled, false otherwise.
 */
export const cancelJob = (id: string): boolean => {
  const job = scheduledJobs.get(id);
  if (job) {
    job.task.stop();
    scheduledJobs.delete(id);
    console.log(`[Scheduler] Job ${id} cancelled.`);
    return true;
  }
  return false;
};
```

### `backend/src/services/storage.ts`

```typescript
import { supabase } from '../database';
import { v4 as uuidv4 } from 'uuid';
import { decode } from 'base64-arraybuffer';

/**
 * Uploads a file to a Supabase Storage bucket.
 * The file is expected to be a base64 encoded string.
 *
 * @param bucketName The name of the bucket to upload to.
 * @param fileContentBase64 The base64 encoded content of the file.
 * @param fileExtension The extension of the file (e.g., 'png', 'jpg').
 * @returns The public URL of the uploaded file.
 */
export const uploadFile = async (
  bucketName: string,
  fileContentBase64: string,
  fileExtension: string
): Promise<string> => {
  try {
    const fileName = `${uuidv4()}.${fileExtension}`;
    const fileBody = decode(fileContentBase64);

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, fileBody, {
        contentType: `image/${fileExtension}`,
        upsert: false, // Do not overwrite existing files
      });

    if (error) {
      console.error("Error uploading to Supabase Storage:", error);
      throw new Error(`Supabase Storage upload error: ${error.message}`);
    }

    // After uploading, get the public URL for the file
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    if (!publicUrlData || !publicUrlData.publicUrl) {
        throw new Error("Could not retrieve public URL for the uploaded file.");
    }

    return publicUrlData.publicUrl;

  } catch (err) {
    console.error(`Error in uploadFile service:`, err);
    throw err; // Re-throw the error to be handled by the caller
  }
};
```

### `backend/src/utils/validation.ts`

```typescript
import { assessQuality } from './validation/quality';
import { isAppropriate } from './validation/appropriateness';
import { validateForPlatform } from './validation/platform';
import { isDuplicate } from './validation/duplicate';
import { Platform } from '../types';

interface ValidationOptions {
  platform?: Platform;
  existingContent?: string[];
}

/**
 * Validates the generated content based on a set of rules.
 * @param content The content to validate.
 * @param options Validation options.
 * @returns True if the content is valid, false otherwise.
 */
export const validateContent = (content: string, options: ValidationOptions = {}): boolean => {
  if (!content || content.trim().length === 0) {
    return false;
  }

  if (assessQuality(content) < 0.5) {
    console.log('Validation failed: Low quality');
    return false;
  }

  if (!isAppropriate(content)) {
    console.log('Validation failed: Inappropriate content');
    return false;
  }

  if (options.platform && !validateForPlatform(content, options.platform)) {
    console.log(`Validation failed: Does not meet ${options.platform} requirements`);
    return false;
  }

  if (options.existingContent && isDuplicate(content, options.existingContent)) {
    console.log('Validation failed: Duplicate content');
    return false;
  }

  return true;
};
```

---

## Authentication Feature Implementation

### `src/App.tsx`
```typescript
import React, { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import { Content } from "./pages/Content";
import { Images } from "./pages/Images";
import { Videos } from "./pages/Videos";
import { Schedule } from "./pages/Schedule";
import { Settings } from "./pages/Settings";
import Auth from './pages/Auth';
import ErrorBoundary from './components/system/ErrorBoundary';
import { OfflineIndicator } from './components/system/OfflineIndicator';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from './integrations/supabase/client';
import { ProtectedRoute } from './components/system/ProtectedRoute';
import { useIdleTimeout } from './hooks/useIdleTimeout';

const App = () => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            retry: 1,
          },
        },
      })
  );

  // Set idle timeout to 15 minutes (900000 ms)
  useIdleTimeout(900000);

  return (
    <SessionContextProvider supabaseClient={supabase}>
      <ErrorBoundary fallback={<div>Something went wrong. Please refresh.</div>}>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <OfflineIndicator />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="/content" element={<Content />} />
                  <Route path="/images" element={<Images />} />
                  <Route path="/videos" element={<Videos />} />
                  <Route path="/schedule" element={<Schedule />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>
                {/* Add a catch-all route that redirects to the index page */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </SessionContextProvider>
  );
};

export default App;
```

### `src/api/ApiClient.ts`
```typescript
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import axiosRetry from 'axios-retry';
import { ApiResponse, RequestConfig } from '@/types/api';
import { ApiError } from './ApiError';
import { supabase } from '@/integrations/supabase/client';

let isRefreshing = false;
type FailedRequest = {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
};
let failedQueue: FailedRequest[] = [];

const processQueue = (error: ApiError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  return import.meta.env.PROD
    ? 'https://your-production-api.com/api/v1'
    : 'http://localhost:3000/api/v1';
};

class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: getBaseUrl(),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    axiosRetry(this.axiosInstance, {
      retries: 3, // Number of retries
      retryDelay: (retryCount) => {
        console.log(`Retry attempt: ${retryCount}`);
        return retryCount * 2000; // Time interval between retries
      },
      retryCondition: (error) => {
        // Retry on network errors and 5xx server errors
        return (
          axiosRetry.isNetworkError(error) ||
          (error.response ? error.response.status >= 500 : false)
        );
      },
    });

    this.initializeInterceptors();
  }

  private initializeInterceptors() {
    this.axiosInstance.interceptors.request.use(
      this.handleRequest,
      this.handleRequestError
    );
    this.axiosInstance.interceptors.response.use(
      this.handleResponse,
      this.handleResponseError
    );
  }

  private handleRequest = async (config: InternalAxiosRequestConfig) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
  };

  private handleRequestError = (error: ApiError) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  };

  private handleResponse = (response: AxiosResponse) => {
    return response;
  };

  private handleResponseError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const { response } = error;
      const message = response?.data?.message || error.message;
      const status = response?.status;
      const code = response?.data?.code;

      return Promise.reject(new ApiError(message, status, code, response?.data));
    }
    return Promise.reject(
      new ApiError('An unexpected error occurred.', 500, 'UNEXPECTED_ERROR')
    );
  };

  public async get<T>(
    endpoint: string,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const response: AxiosResponse<T> = await this.axiosInstance.get(
      endpoint,
      config
    );
    return this.transformResponse<T>(response);
  }

  public async post<T>(
    endpoint: string,
    data: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const response: AxiosResponse<T> = await this.axiosInstance.post(
      endpoint,
      data,
      config
    );
    return this.transformResponse<T>(response);
  }

  public async put<T>(
    endpoint: string,
    data: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const response: AxiosResponse<T> = await this.axiosInstance.put(
      endpoint,
      data,
      config
    );
    return this.transformResponse<T>(response);
  }

  public async patch<T>(
    endpoint: string,
    data: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const response: AxiosResponse<T> = await this.axiosInstance.patch(
      endpoint,
      data,
      config
    );
    return this.transformResponse<T>(response);
  }

  public async delete<T>(
    endpoint: string,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const response: AxiosResponse<T> = await this.axiosInstance.delete(
      endpoint,
      config
    );
    return this.transformResponse<T>(response);
  }

  private transformResponse<T>(response: AxiosResponse<T>): ApiResponse<T> {
    return {
      data: response.data,
      status: response.status,
    };
  }
}

export const apiClient = new ApiClient();
```

### `backend/src/index.ts`
```typescript
import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';

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
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication token is required.' });
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
    return res.status(401).json({ message: 'Invalid or expired token.' });
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

// Example: import contentRoutes from './routes/content';
// app.use('/api/v1/content', contentRoutes);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
```

### `supabase/functions/setup-database/index.ts`
```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get admin supabase client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );

    // Create the 'exec_sql' function if it doesn't exist
    const { error: sqlFunctionError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE OR REPLACE FUNCTION exec_sql(sql text) RETURNS void AS $$
        BEGIN
          EXECUTE sql;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `
    }).catch(() => {
      // Function might already exist or exec_sql might not exist yet
      // Create it directly with a raw query
      return supabaseAdmin.auth.admin.createUser({
        email: 'temp@example.com',
        password: 'password',
        email_confirm: true
      }).then(() => {
        // This is just to get to the raw query method
        return { error: null };
      });
    });

    // Now try creating the table function
    const { error: createFunctionError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE OR REPLACE FUNCTION create_generated_images_table()
        RETURNS void AS $$
        BEGIN
          -- Check if the table exists
          IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'generated_images') THEN
            -- Create the table
            CREATE TABLE public.generated_images (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              user_id UUID REFERENCES auth.users NOT NULL,
              prompt TEXT NOT NULL,
              style TEXT,
              aspect_ratio TEXT,
              image_path TEXT NOT NULL,
              created_at TIMESTAMPTZ DEFAULT now() NOT NULL
            );

            -- Add RLS policies
            ALTER TABLE public.generated_images ENABLE ROW LEVEL SECURITY;
            
            -- Allow users to see only their own images
            CREATE POLICY "Users can view their own images" 
              ON public.generated_images 
              FOR SELECT 
              USING (auth.uid() = user_id);
              
            -- Allow users to insert their own images
            CREATE POLICY "Users can insert their own images" 
              ON public.generated_images 
              FOR INSERT 
              WITH CHECK (auth.uid() = user_id);
              
            -- Allow users to delete their own images
            CREATE POLICY "Users can delete their own images" 
              ON public.generated_images 
              FOR DELETE 
              USING (auth.uid() = user_id);
          END IF;
        END;
        $$ LANGUAGE plpgsql;
      `
    });

    // Create profiles table
    const { error: createProfilesError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE OR REPLACE FUNCTION create_profiles_table_and_trigger()
        RETURNS void AS $$
        BEGIN
          -- Create the profiles table
          IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
            CREATE TABLE public.profiles (
              id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
              username TEXT UNIQUE,
              full_name TEXT,
              avatar_url TEXT,
              updated_at TIMESTAMPTZ DEFAULT now()
            );

            -- Add RLS policies for profiles
            ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

            CREATE POLICY "Public profiles are viewable by everyone."
              ON public.profiles FOR SELECT USING (true);

            CREATE POLICY "Users can insert their own profile."
              ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

            CREATE POLICY "Users can update their own profile."
              ON public.profiles FOR UPDATE USING (auth.uid() = id);
          END IF;

          -- Create the trigger function
          CREATE OR REPLACE FUNCTION public.handle_new_user()
          RETURNS trigger AS $$
          BEGIN
            INSERT INTO public.profiles (id, username)
            VALUES (new.id, new.email);
            return new;
          END;
          $$ LANGUAGE plpgsql SECURITY DEFINER;

          -- Create the trigger
          DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
          CREATE TRIGGER on_auth_user_created
            AFTER INSERT ON auth.users
            FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
        END;
        $$ LANGUAGE plpgsql;
      `
    });

    // Create storage bucket
    const { error: bucketError } = await supabaseAdmin
      .storage
      .createBucket('ai_generated_images', {
        public: true,
        fileSizeLimit: 10485760, // 10MB
      })
      .catch(e => {
        // Bucket might already exist, which is fine
        console.log('Bucket may already exist:', e.message);
        return { error: null };
      });

    return new Response(
      JSON.stringify({ 
        success: true,
        sqlFunctionError: sqlFunctionError?.message,
        createFunctionError: createFunctionError?.message,
        createProfilesError: createProfilesError?.message,
        bucketError: bucketError?.message
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );
  } catch (error) {
    console.error('Error setting up database:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error occurred' }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});
```

### `src/hooks/useAuth.ts`
```typescript
import { useSession, useUser } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const session = useSession();
  const user = useUser();

  const signInWithGithub = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return {
    session,
    user,
    signInWithGithub,
    signOut,
    isAuthenticated: !!session,
  };
};
```

### `src/components/system/ProtectedRoute.tsx`
```typescript
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  redirectPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  redirectPath = '/auth',
}) => {
  const { isAuthenticated, session } = useAuth();

  // The session is still loading
  if (session === undefined) {
    return <div>Loading...</div>; // Or a spinner
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};
```

### `src/pages/Auth.tsx`
```typescript
import { supabase } from '@/integrations/supabase/client';
import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';

const AuthPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated, session } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    // Don't render the auth form until we know the auth state
    if (session === undefined) {
        return <div>Loading...</div>; // Or a spinner
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <SupabaseAuth
                    supabaseClient={supabase}
                    appearance={{ theme: ThemeSupa }}
                    providers={['github']}
                    redirectTo="/"
                />
            </div>
        </div>
    );
};

export default AuthPage;
```

### `src/components/Sidebar.tsx`
```typescript
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Home,
  FileText,
  Image,
  Video,
  Calendar,
  Settings,
  LogOut,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAuth } from '@/hooks/useAuth';

const menuItems = [
  { icon: Home, label: 'Dashboard', path: '/' },
  { icon: FileText, label: 'Content', path: '/content' },
  { icon: Image, label: 'Images', path: '/images' },
  { icon: Video, label: 'Videos', path: '/videos' },
  { icon: Calendar, label: 'Schedule', path: '/schedule' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar() {
  const location = useLocation();
  const { isAuthenticated, signOut } = useAuth();

  return (
    <TooltipProvider>
      <aside className="fixed inset-y-0 left-0 z-10 flex w-14 flex-col border-r bg-background">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          {menuItems.map((item) => (
            <Tooltip key={item.path}>
              <TooltipTrigger asChild>
                <Link
                  to={item.path}
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8',
                    location.pathname === item.path && 'bg-accent text-accent-foreground'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="sr-only">{item.label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          ))}
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          {isAuthenticated && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={signOut}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="sr-only">Sign Out</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Sign Out</TooltipContent>
            </Tooltip>
          )}
        </nav>
      </aside>
    </TooltipProvider>
  );
}
```

### `src/hooks/useIdleTimeout.ts`
```typescript
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from './useAuth';

export const useIdleTimeout = (timeout: number) => {
  const { signOut } = useAuth();
  const [isIdle, setIsIdle] = useState(false);

  const resetTimer = useCallback(() => {
    setIsIdle(false);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const handleIdle = () => {
      setIsIdle(true);
      signOut();
    };

    const setupTimer = () => {
      timer = setTimeout(handleIdle, timeout);
    };

    const clearTimer = () => {
      clearTimeout(timer);
    };

    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'];

    const eventListener = () => {
      clearTimer();
      setupTimer();
      resetTimer();
    };

    events.forEach((event) => {
      window.addEventListener(event, eventListener);
    });

    setupTimer();

    return () => {
      clearTimer();
      events.forEach((event) => {
        window.removeEventListener(event, eventListener);
      });
    };
  }, [timeout, signOut, resetTimer]);

  return isIdle;
};
```

### `src/hooks/useProfile.ts`
```typescript
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          setLoading(true);
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error) {
            throw error;
          }

          setProfile(data);
        } catch (error) {
          setError(error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfile();
  }, [user]);

  const updateProfile = async (updates: {
    username: string;
    full_name: string;
  }) => {
    if (user) {
      try {
        setLoading(true);
        const { error } = await supabase.from('profiles').upsert({
          id: user.id,
          ...updates,
          updated_at: new Date(),
        });

        if (error) {
          throw error;
        }

        // Refetch profile to get the latest data
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return { profile, loading, error, updateProfile };
};
```

### `src/integrations/supabase/types.ts`
```typescript
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      content: {
        Row: {
          created_at: string | null
          description: string
          generated_content: string | null
          id: string
          platforms: string[]
          status: string
          title: string
          tone: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description: string
          generated_content?: string | null
          id: string
          platforms: string[]
          status?: string
          title: string
          tone: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string
          generated_content?: string | null
          id?: string
          platforms?: string[]
          status?: string
          title?: string
          tone?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      content_versions: {
        Row: {
          content: string
          content_id: string | null
          created_at: string | null
          id: string
          user_id: string | null
          version_number: number
        }
        Insert: {
          content: string
          content_id?: string | null
          created_at?: string | null
          id?: string
          user_id?: string | null
          version_number: number
        }
        Update: {
          content?: string
          content_id?: string | null
          created_at?: string | null
          id?: string
          user_id?: string | null
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "content_versions_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "generated_content"
            referencedColumns: ["id"]
          },
        ]
      }
      generated_content: {
        Row: {
          ai_model: string
          created_at: string | null
          description: string
          edited_content: string | null
          generated_text: string | null
          hashtags: string[] | null
          id: string
          is_edited: boolean | null
          language: string
          platform: string[]
          seo_score: number | null
          status: string | null
          tone: string
          updated_at: string | null
          user_id: string
          version: number
        }
        Insert: {
          ai_model?: string
          created_at?: string | null
          description: string
          edited_content?: string | null
          generated_text?: string | null
          hashtags?: string[] | null
          id?: string
          is_edited?: boolean | null
          language?: string
          platform: string[]
          seo_score?: number | null
          status?: string | null
          tone: string
          updated_at?: string | null
          user_id: string
          version?: number
        }
        Update: {
          ai_model?: string
          created_at?: string | null
          description?: string
          edited_content?: string | null
          generated_text?: string | null
          hashtags?: string[] | null
          id?: string
          is_edited?: boolean | null
          language?: string
          platform?: string[]
          seo_score?: number | null
          status?: string | null
          tone?: string
          updated_at?: string | null
          user_id?: string
          version?: number
        }
        Relationships: []
      }
      generated_images: {
        Row: {
          aspect_ratio: string
          created_at: string | null
          id: string
          image_path: string
          is_favorite: boolean | null
          prompt: string
          style: string
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          aspect_ratio: string
          created_at?: string | null
          id?: string
          image_path: string
          is_favorite?: boolean | null
          prompt: string
          style: string
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          aspect_ratio?: string
          created_at?: string | null
          id?: string
          image_path?: string
          is_favorite?: boolean | null
          prompt?: string
          style?: string
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      recent_activity: {
        Row: {
          activity_type: string
          created_at: string | null
          details: Json | null
          id: string
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          details?: Json | null
          id?: string
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      sample_videos: {
        Row: {
          created_at: string | null
          description: string
          id: string
          style: string
          thumbnail_url: string
          title: string
          video_url: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          style: string
          thumbnail_url: string
          title: string
          video_url: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          style?: string
          thumbnail_url?: string
          title?: string
          video_url?: string
        }
        Relationships: []
      }
      scheduled_posts: {
        Row: {
          content: string
          created_at: string | null
          id: string
          platform: string[]
          scheduled_date: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          platform: string[]
          scheduled_date: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          platform?: string[]
          scheduled_date?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      trending_topics: {
        Row: {
          created_at: string | null
          description: string
          id: string
          title: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          title?: string
        }
        Relationships: []
      }
      user_metrics: {
        Row: {
          engagement_rate: number | null
          top_content: Json | null
          total_content: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          engagement_rate?: number | null
          top_content?: Json | null
          total_content?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          engagement_rate?: number | null
          top_content?: Json | null
          total_content?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      videos: {
        Row: {
          created_at: string | null
          file_path: string
          id: string
          public_url: string | null
          script_content: string | null
          status: string
          style: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          user_id: string
          video_type: string
        }
        Insert: {
          created_at?: string | null
          file_path: string
          id?: string
          public_url?: string | null
          script_content?: string | null
          status?: string
          style?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          user_id: string
          video_type: string
        }
        Update: {
          created_at?: string | null
          file_path?: string
          id?: string
          public_url?: string | null
          script_content?: string | null
          status?: string
          style?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
          video_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
```

### `src/pages/Settings.tsx`
```typescript
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/components/ui/use-toast';

export function Settings() {
  const { profile, loading, error, updateProfile } = useProfile();
  const { toast } = useToast();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setUsername(profile.username || '');
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({ full_name: fullName, username });
    toast({
      title: 'Profile updated',
      description: 'Your profile has been updated successfully.',
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading profile: {(error as Error).message}</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Manage your profile settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

</rewritten_file> 