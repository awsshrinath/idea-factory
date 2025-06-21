
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
=======

import axios, {
  AxiosInstance,
  AxiosResponse,
} from 'axios';
import { ApiError } from './ApiError';

export class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
      timeout: 30000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          throw new ApiError(
            error.response.data?.message || error.message,
            error.response.status,
            error.response.data
          );
        }
        throw new ApiError(error.message);
      }
    );
  }

  async get<T>(url: string): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url);
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url);
    return response.data;

  }
}

export const apiClient = new ApiClient();
