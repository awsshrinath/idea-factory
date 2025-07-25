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

### `src/api/ApiError.ts`
```typescript
export class ApiError extends Error {
    public readonly status: number;
    public readonly code: string | undefined;
  
    constructor(message: string, status: number, code?: string) {
      super(message);
      this.status = status;
      this.code = code;
      Object.setPrototypeOf(this, ApiError.prototype);
    }
  
    static networkError(originalError: Error) {
      return new ApiError(
        'Network error: Please check your connection.', 
        -1, 
        'NETWORK_ERROR'
      );
    }
  
    static unknown(originalError: any) {
      return new ApiError(
        'An unexpected error occurred.',
        -2,
        'UNKNOWN_ERROR'
      );
    }
  }
  
  export function isApiError(error: unknown): error is ApiError {
    return error instanceof ApiError;
  }
```

### `src/hooks/api/useApi.ts`
```typescript
import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { ApiError, isApiError } from '@/api/ApiError';

type ApiStatus = 'idle' | 'loading' | 'success' | 'error';

interface UseApiState<T> {
  data: T | null;
  status: ApiStatus;
  error: ApiError | null;
}

interface UseApiOptions {
  showSuccessToast?: boolean;
  successMessage?: string;
  showErrorToast?: boolean;
  errorMessage?: string;
}

export const useApi = <T, P extends any[]>(
  apiFunc: (...args: P) => Promise<T>,
  options: UseApiOptions = {}
) => {
  const { 
    showSuccessToast = true, 
    successMessage = 'Operation successful!',
    showErrorToast = true, 
    errorMessage,
  } = options;

  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    status: 'idle',
    error: null,
  });

  const mounted = useRef(true);

  const execute = useCallback(async (...args: P) => {
    if (!mounted.current) return;

    setState(prevState => ({ ...prevState, status: 'loading', error: null }));
    
    try {
      const response = await apiFunc(...args);
      if (mounted.current) {
        setState({ data: response, status: 'success', error: null });
        if (showSuccessToast) {
          toast.success(successMessage);
        }
      }
      return { data: response, error: null };
    } catch (err) {
      const error = isApiError(err) ? err : ApiError.unknown(err);
      if (mounted.current) {
        setState({ data: null, status: 'error', error });
        if (showErrorToast) {
          toast.error(errorMessage || error.message);
        }
      }
      return { data: null, error };
    }
  }, [apiFunc, showSuccessToast, successMessage, showErrorToast, errorMessage]);

  return { ...state, execute };
};
```

### `src/components/system/ErrorBoundary.tsx`
```typescript
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorDisplay } from './ErrorDisplay';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <ErrorDisplay 
          error={this.state.error}
          onReset={() => this.setState({ hasError: false, error: null })} 
        />
      );
    }

    return this.props.children;
  }
}
```

### `src/components/system/ErrorDisplay.tsx`
```typescript
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ApiError } from '@/api';

interface ErrorDisplayProps {
  error: Error | ApiError | null;
  onReset: () => void;
  title?: string;
}

export const ErrorDisplay = ({
  error,
  onReset,
  title = "Oops! Something went wrong.",
}: ErrorDisplayProps) => {
  const errorMessage = 
    error instanceof ApiError 
      ? error.message 
      : error?.message || 'An unexpected error occurred.';

  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center space-y-4 rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center text-destructive"
    >
      <AlertTriangle className="h-10 w-10" />
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm">{errorMessage}</p>
      </div>
      <Button
        variant="destructive"
        onClick={onReset}
        className="bg-destructive/80 hover:bg-destructive"
      >
        Try Again
      </Button>
    </div>
  );
};
```

### `src/components/system/OfflineIndicator.tsx`
```typescript
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center space-x-2 rounded-lg bg-secondary p-3 text-secondary-foreground shadow-lg">
      <WifiOff className="h-5 w-5" />
      <span>You are currently offline.</span>
    </div>
  );
};
```

### `src/hooks/useOnlineStatus.ts`
```typescript
import { useState, useEffect } from 'react';

export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};
```

---

## API Client

### `src/api/ApiClient.ts`

```typescript
import { supabase } from '@/integrations/supabase/client';
import { ApiError, isApiError } from './ApiError';

// --- Type Definitions ---
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestConfig extends Omit<RequestInit, 'method' | 'body'> {
  method?: HttpMethod;
  data?: unknown;
  params?: Record<string, any>;
  onUploadProgress?: (progress: number) => void;
  useAuth?: boolean; // Default true, set to false for public endpoints
  retries?: number;
  retryDelay?: number;
  useCache?: boolean;
  cacheTTL?: number; // Time-to-live in milliseconds
}

interface CacheEntry<T> {
    timestamp: number;
    data: T;
}

// --- Token Management ---
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      // The original request function will be re-called with the new token.
      // We just need to resolve the promise that is waiting for the token.
      prom.resolve(token); 
    }
  });
  failedQueue = [];
};

const getRefreshedToken = async (): Promise<string> => {
    const { data, error } = await supabase.auth.refreshSession();
    if (error || !data.session) {
      await supabase.auth.signOut();
      throw new ApiError('Session expired. Please log in again.', 401, 'SESSION_EXPIRED');
    }
    return data.session.access_token;
}

// --- Core ApiClient Class ---
class ApiClient {
  private readonly baseUrl: string;
  private pendingRequests = new Map<string, Promise<any>>();
  private cache = new Map<string, CacheEntry<any>>();

  constructor() {
    this.baseUrl = this.getBaseUrl();
  }

  private getBaseUrl(): string {
    const envUrl = import.meta.env.VITE_API_URL;
    if (envUrl) return envUrl;
    return import.meta.env.PROD
      ? 'https://your-production-api.com/api/v1' // Replace with your actual prod URL
      : 'http://localhost:3000/api/v1';
  }

  public async get<T>(endpoint: string, config?: Omit<RequestConfig, 'data'>): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  public async post<T>(endpoint:string, data: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'POST', data });
  }
  
  public async put<T>(endpoint:string, data: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'PUT', data });
  }

  public async patch<T>(endpoint:string, data: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'PATCH', data });
  }

  public async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  private async request<T>(
    endpoint: string,
    config: RequestConfig
  ): Promise<T> {
    const { useCache = false, cacheTTL = 300000, method = 'GET' } = config;
    const requestKey = `${method}:${endpoint}:${JSON.stringify(config.data)}:${JSON.stringify(config.params)}`;

    if (method === 'GET' && useCache) {
        const cached = this.cache.get(requestKey);
        if (cached && (Date.now() - cached.timestamp < cacheTTL)) {
            return Promise.resolve(cached.data as T);
        }
    }

    if (this.pendingRequests.has(requestKey)) {
      return this.pendingRequests.get(requestKey) as Promise<T>;
    }

    const requestPromise = this.executeRequest<T>(endpoint, config).then(data => {
        if (method === 'GET' && useCache) {
            this.cache.set(requestKey, { timestamp: Date.now(), data });
        }
        return data;
    }).finally(() => {
      this.pendingRequests.delete(requestKey);
    });

    this.pendingRequests.set(requestKey, requestPromise);
    return requestPromise;
  }

  private async executeRequest<T>(
    endpoint: string,
    config: RequestConfig
  ): Promise<T> {
    const { retries = 3, retryDelay = 1000 } = config;

    for (let i = 0; i < retries; i++) {
        try {
            return await this.performRequest<T>(endpoint, config);
        } catch (error) {
            if (isApiError(error) && error.status === 401) {
                // Handle token refresh logic
                if (isRefreshing) {
                    // If a refresh is already in progress, wait for it to complete
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve: () => resolve(this.request(endpoint, config)), reject });
                    });
                }
                
                isRefreshing = true;
                
                try {
                    const newToken = await getRefreshedToken();
                    processQueue(null, newToken);
                    // Retry the original request with the new token
                    return this.performRequest<T>(endpoint, config);
                } catch (refreshError) {
                    processQueue(refreshError as Error, null);
                    throw refreshError;
                } finally {
                    isRefreshing = false;
                }
            }

            // For other errors, check if we should retry
            const isRetryable = !isApiError(error) || (error.status && error.status >= 500);

            if (isRetryable && i < retries - 1) {
                await new Promise(resolve => setTimeout(resolve, retryDelay * (i + 1))); // Exponential backoff
                continue;
            }

            throw error; // Rethrow if not retryable or retries exhausted
        }
    }
    // This part should be unreachable, but TypeScript needs it to know a promise is always returned.
    throw new Error("Request failed after all retries.");
  }

  private async performRequest<T>(endpoint: string, config: RequestConfig): Promise<T> {
    const {
        data,
        params,
        method = 'GET',
        useAuth = true,
        ...restConfig
    } = config;

    const headers = new Headers(restConfig.headers || {});
    if (!headers.has('Content-Type') && data) {
        headers.set('Content-Type', 'application/json');
    }
    
    if (useAuth) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
            headers.set('Authorization', `Bearer ${session.access_token}`);
        } else if (isRefreshing) {
            // Wait for the token to be refreshed
            await new Promise((resolve, reject) => failedQueue.push({ resolve, reject }));
            const { data: { session: newSession } } = await supabase.auth.getSession();
            if (newSession?.access_token) {
                 headers.set('Authorization', `Bearer ${newSession.access_token}`);
            }
        }
    }

    const url = new URL(`${this.baseUrl}${endpoint}`);
    if (params) {
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    }

    const fetchOptions: RequestInit = {
        ...restConfig,
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
    };

    try {
        const response = await fetch(url.toString(), fetchOptions);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({})); // Gracefully handle non-JSON error bodies
            throw new ApiError(
                errorData?.message || `Request failed with status ${response.status}`,
                response.status,
                errorData?.code
            );
        }
        
        // Handle no-content responses
        if (response.status === 204) {
            return undefined as T;
        }

        return await response.json();

    } catch (error) {
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
            // Network error
            throw ApiError.networkError(error);
        }
        if (isApiError(error)) {
            throw error; // Re-throw known API errors
        }
        // Catch other unexpected errors
        throw ApiError.unknown(error);
    }
  }
}

export const apiClient = new ApiClient();
```

### `src/api/ApiError.ts`
```typescript
export class ApiError extends Error {
    public readonly status: number;
    public readonly code: string | undefined;
  
    constructor(message: string, status: number, code?: string) {
      super(message);
      this.status = status;
      this.code = code;
      Object.setPrototypeOf(this, ApiError.prototype);
    }
  
    static networkError(originalError: Error) {
      return new ApiError(
        'Network error: Please check your connection.', 
        -1, 
        'NETWORK_ERROR'
      );
    }
  
    static unknown(originalError: any) {
      return new ApiError(
        'An unexpected error occurred.',
        -2,
        'UNKNOWN_ERROR'
      );
    }
  }
  
  export function isApiError(error: unknown): error is ApiError {
    return error instanceof ApiError;
  }
```

### `src/hooks/api/useApi.ts`
```typescript
import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { ApiError, isApiError } from '@/api/ApiError';

type ApiStatus = 'idle' | 'loading' | 'success' | 'error';

interface UseApiState<T> {
  data: T | null;
  status: ApiStatus;
  error: ApiError | null;
}

interface UseApiOptions {
  showSuccessToast?: boolean;
  successMessage?: string;
  showErrorToast?: boolean;
  errorMessage?: string;
}

export const useApi = <T, P extends any[]>(
  apiFunc: (...args: P) => Promise<T>,
  options: UseApiOptions = {}
) => {
  const { 
    showSuccessToast = true, 
    successMessage = 'Operation successful!',
    showErrorToast = true, 
    errorMessage,
  } = options;

  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    status: 'idle',
    error: null,
  });

  const mounted = useRef(true);

  const execute = useCallback(async (...args: P) => {
    if (!mounted.current) return;

    setState(prevState => ({ ...prevState, status: 'loading', error: null }));
    
    try {
      const response = await apiFunc(...args);
      if (mounted.current) {
        setState({ data: response, status: 'success', error: null });
        if (showSuccessToast) {
          toast.success(successMessage);
        }
      }
      return { data: response, error: null };
    } catch (err) {
      const error = isApiError(err) ? err : ApiError.unknown(err);
      if (mounted.current) {
        setState({ data: null, status: 'error', error });
        if (showErrorToast) {
          toast.error(errorMessage || error.message);
        }
      }
      return { data: null, error };
    }
  }, [apiFunc, showSuccessToast, successMessage, showErrorToast, errorMessage]);

  return { ...state, execute };
};
```

### `src/components/system/ErrorBoundary.tsx`
```typescript
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorDisplay } from './ErrorDisplay';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <ErrorDisplay 
          error={this.state.error}
          onReset={() => this.setState({ hasError: false, error: null })} 
        />
      );
    }

    return this.props.children;
  }
}
```

### `src/components/system/ErrorDisplay.tsx`
```typescript
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ApiError } from '@/api';

interface ErrorDisplayProps {
  error: Error | ApiError | null;
  onReset: () => void;
  title?: string;
}

export const ErrorDisplay = ({
  error,
  onReset,
  title = "Oops! Something went wrong.",
}: ErrorDisplayProps) => {
  const errorMessage = 
    error instanceof ApiError 
      ? error.message 
      : error?.message || 'An unexpected error occurred.';

  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center space-y-4 rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center text-destructive"
    >
      <AlertTriangle className="h-10 w-10" />
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm">{errorMessage}</p>
      </div>
      <Button
        variant="destructive"
        onClick={onReset}
        className="bg-destructive/80 hover:bg-destructive"
      >
        Try Again
      </Button>
    </div>
  );
};
```

### `src/components/system/OfflineIndicator.tsx`
```typescript
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center space-x-2 rounded-lg bg-secondary p-3 text-secondary-foreground shadow-lg">
      <WifiOff className="h-5 w-5" />
      <span>You are currently offline.</span>
    </div>
  );
};
```

### `src/hooks/useOnlineStatus.ts`
```typescript
import { useState, useEffect } from 'react';

export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};
```

### `src/routes/content.ts`
```typescript
import { Request, Response } from 'express';
import { ApiError } from '@/api';

export const getContent = async (req: Request, res: Response) => {
  try {
    // Implementation of getContent function
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.status).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  }
};

export const createContent = async (req: Request, res: Response) => {
  try {
    // Implementation of createContent function
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.status).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  }
};

export const updateContent = async (req: Request, res: Response) => {
  try {
    // Implementation of updateContent function
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.status).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  }
};

export const deleteContent = async (req: Request, res: Response) => {
  try {
    // Implementation of deleteContent function
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.status).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  }
};

export const generateContent = async (req: Request, res: Response) => {
  try {
    // Implementation of generateContent function
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.status).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  }
};

export const regenerateContent = async (req: Request, res: Response) => {
  try {
    // Implementation of regenerateContent function
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.status).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  }
};

export const submitContentForApproval = async (req: Request, res: Response) => {
  try {
    // Implementation of submitContentForApproval function
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.status).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  }
};

export const approveContent = async (req: Request, res: Response) => {
  try {
    // Implementation of approveContent function
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.status).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  }
};

export const rejectContent = async (req: Request, res: Response) => {
  try {
    // Implementation of rejectContent function
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.status).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  }
};

export const scheduleContent = async (req: Request, res: Response) => {
  try {
    // Implementation of scheduleContent function
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.status).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  }
};

export const getContentAnalytics = async (req: Request, res: Response) => {
  try {
    // Implementation of getContentAnalytics function
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.status).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  }
};

export const bulkContentOperations = async (req: Request, res: Response) => {
  try {
    // Implementation of bulkContentOperations function
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.status).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  }
};

export const getContentDashboard = async (req: Request, res: Response) => {
  try {
    // Implementation of getContentDashboard function
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.status).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  }
};

export const checkContentSetup = async (req: Request, res: Response) => {
  try {
    // Implementation of checkContentSetup function
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.status).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  }
};

export const initializeContentSetup = async (req: Request, res: Response) => {
  try {
    // Implementation of initializeContentSetup function
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.status).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  }
};
```

### `src/database/content-schema.sql`
```sql
CREATE TABLE content (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE content_analytics (
  id SERIAL PRIMARY KEY,
  content_id INT NOT NULL,
  engagement_count INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (content_id) REFERENCES content(id)
);

CREATE TABLE content_approvals (
  id SERIAL PRIMARY KEY,
  content_id INT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (content_id) REFERENCES content(id)
);

CREATE TABLE content_revisions (
  id SERIAL PRIMARY KEY,
  content_id INT NOT NULL,
  revision_number INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (content_id) REFERENCES content(id)
);

CREATE TABLE content_templates (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  template TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE content_campaigns (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE content_templates_campaigns (
  id SERIAL PRIMARY KEY,
  content_template_id INT NOT NULL,
  content_campaign_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (content_template_id) REFERENCES content_templates(id),
  FOREIGN KEY (content_campaign_id) REFERENCES content_campaigns(id)
);

CREATE TABLE row_level_security (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  content_id INT NOT NULL,
  access_type TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (content_id) REFERENCES content(id)
);

CREATE INDEX idx_content_status ON content(status);
CREATE INDEX idx_content_created_at ON content(created_at);
CREATE INDEX idx_content_updated_at ON content(updated_at);
CREATE INDEX idx_content_analytics_engagement_count ON content_analytics(engagement_count);
CREATE INDEX idx_content_approvals_status ON content_approvals(status);
CREATE INDEX idx_content_revisions_revision_number ON content_revisions(revision_number);
CREATE INDEX idx_content_templates_name ON content_templates(name);
CREATE INDEX idx_content_campaigns_name ON content_campaigns(name);
CREATE INDEX idx_row_level_security_user_id ON row_level_security(user_id);
CREATE INDEX idx_row_level_security_content_id ON row_level_security(content_id);
CREATE INDEX idx_row_level_security_access_type ON row_level_security(access_type);
```

### `src/services/database-setup.ts`
```typescript
import { supabase } from '../database';

export const initializeDatabase = async () => {
  // Implementation of initializeDatabase function
};

export const validateDatabase = async () => {
  // Implementation of validateDatabase function
};

export const createSampleContent = async () => {
  // Implementation of createSampleContent function
};
```

### `src/routes/index.ts`
```typescript
import { Router } from 'express';
import contentRoutes from './content';

const router = Router();

router.use('/content', contentRoutes);

export default router;
```

### `src/index.ts`
```typescript
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import contentRoutes from './routes/content';

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

app.use('/api/v1/content', contentRoutes);

// Example: import contentRoutes from './routes/content';
// app.use('/api/v1/content', contentRoutes);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
```

### `src/SETUP.md`
```
# Setup Instructions

## Environment Variables

1. **SUPABASE_JWT_SECRET**: This is required for JWT authentication.

## Database Setup

1. **Initialize Database**: Run the `initializeDatabase` function in the `database-setup` service.
2. **Validate Database**: Run the `validateDatabase` function in the `database-setup` service.
3. **Create Sample Content**: Run the `createSampleContent` function in the `database-setup` service.

## Authentication

1. **JWT Authentication**: Ensure that JWT authentication is implemented for all endpoints.
2. **Row Level Security (RLS)**: Implement RLS policies for user-specific content isolation.

## API Endpoints

1. **Content Management**:
   - **CRUD Operations**: Implement full CRUD operations for content management.
   - **AI Integration**: Integrate AI for content generation and regeneration.
   - **Approval Workflow**: Implement submit, approve, and reject workflows.
   - **Scheduling**: Implement content scheduling.
   - **Analytics**: Implement analytics tracking and reporting.
   - **Bulk Operations**: Implement bulk operations for efficient content management.
   - **Dashboard**: Implement a dashboard for content metrics and statistics.
   - **Setup**: Implement setup endpoints for database validation and schema initialization.

## Security

1. **JWT Authentication**: Ensure that all endpoints require JWT authentication.
2. **RLS Policies**: Implement RLS policies for user-specific content isolation.
3. **Comprehensive Error Handling**: Implement comprehensive error handling for all API calls.
4. **TypeScript Type Safety**: Ensure that all API calls are type-safe.

## Notes

## Recent Changes

### Authentication System Fixes (Fixed login issues for admin and regular users)

**Files Modified:**

1. **src/integrations/supabase/types.ts** - Added profiles table type definition with role field
2. **supabase/functions/setup-database/index.ts** - Enhanced database setup with role-based profiles and demo users
3. **src/hooks/useAuth.ts** - Updated to handle role-based authentication and profile management
4. **src/components/AuthStatus.tsx** - Enhanced to display user roles and use new auth hook
5. **src/hooks/useProfile.ts** - Updated to work with profiles table including role management
6. **src/pages/Auth.tsx** - Added demo login buttons and better error handling
7. **src/utils/setupDatabase.ts** - Created utility for checking and setting up demo users

**Key Features Added:**

- Role-based authentication system (admin/user)
- Profiles table with role management
- Demo user login functionality
- Enhanced error handling for authentication
- User role display in AuthStatus component
- Automatic profile creation for new users
- Database setup utilities for demo users

**Demo User Credentials:**
- Admin: admin@ideafactory.com / admin123
- Regular User: demo@ideafactory.com / demo123

**Authentication Flow:**
1. Users can sign up/sign in normally
2. Demo buttons provide quick access to test accounts
3. Profiles are automatically created with appropriate roles
4. Role information is displayed in the UI
5. Role-based access control is now available

**Issues Fixed:**
- Missing profiles table in database schema
- No role-based authentication system
- Demo users not properly configured
- Authentication state not properly managed with roles
- Error handling for non-existent demo users

**Next Steps:**
1. Create demo user accounts through the Sign Up form using provided credentials
2. Test role-based functionality
3. Implement role-based route protection if needed

### Backend Compilation Fix & Database Validation (Fixed TypeScript error and added validation)

**Files Modified:**

1. **backend/src/worker/jobs.ts** - Fixed TypeScript compilation error with Error constructor
2. **src/utils/validateDatabase.ts** - Created database validation utility to check existing Supabase setup
3. **src/pages/Auth.tsx** - Added database validation display to show what's already configured

**Key Changes:**
- Fixed Error constructor call that was causing TypeScript compilation failure
- Created validation utility that checks existing database tables and users
- Enhanced Auth page to display current database status from lovable.dev setup
- Added visual indicators for table existence and user accounts

---