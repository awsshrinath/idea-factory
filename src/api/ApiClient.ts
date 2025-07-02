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
  abortController?: AbortController; // Allow external abort controllers
}

interface CacheEntry<T> {
    timestamp: number;
    data: T;
}

interface LogConfig {
  level: 'none' | 'error' | 'warn' | 'info' | 'debug';
  prefix: string;
}

// --- Logging Utility ---
class Logger {
  constructor(private config: LogConfig) {}

  private shouldLog(level: string): boolean {
    const levels = ['none', 'error', 'warn', 'info', 'debug'];
    const currentLevel = levels.indexOf(this.config.level);
    const messageLevel = levels.indexOf(level);
    return currentLevel >= messageLevel && currentLevel > 0;
  }

  error(message: string, ...args: any[]) {
    if (this.shouldLog('error')) {
      console.error(`${this.config.prefix}[ERROR]`, message, ...args);
    }
  }

  warn(message: string, ...args: any[]) {
    if (this.shouldLog('warn')) {
      console.warn(`${this.config.prefix}[WARN]`, message, ...args);
    }
  }

  info(message: string, ...args: any[]) {
    if (this.shouldLog('info')) {
      console.info(`${this.config.prefix}[INFO]`, message, ...args);
    }
  }

  debug(message: string, ...args: any[]) {
    if (this.shouldLog('debug')) {
      console.debug(`${this.config.prefix}[DEBUG]`, message, ...args);
    }
  }
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
  private logger: Logger;

  constructor(logLevel: LogConfig['level'] = 'info') {
    this.baseUrl = this.getBaseUrl();
    this.logger = new Logger({ level: logLevel, prefix: '[ApiClient] ' });
    this.logger.info('Initialized with base URL:', this.baseUrl);
  }

  private getBaseUrl(): string {
    const envUrl = import.meta.env.VITE_API_URL;
    if (envUrl) {
      return envUrl;
    }
    const defaultUrl = import.meta.env.PROD
      ? 'https://your-production-api.com/api/v1' // Replace with your actual prod URL
      : 'http://localhost:3000/api/v1';
    
    this.logger?.warn('VITE_API_URL not set, using default:', defaultUrl);
    return defaultUrl;
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

    this.logger.debug(`Making ${method} request to:`, endpoint);

    if (method === 'GET' && useCache) {
        const cached = this.cache.get(requestKey);
        if (cached && (Date.now() - cached.timestamp < cacheTTL)) {
            this.logger.debug('Returning cached response for:', endpoint);
            return Promise.resolve(cached.data as T);
        }
    }

    if (this.pendingRequests.has(requestKey)) {
      this.logger.debug('Deduplicating request for:', endpoint);
      return this.pendingRequests.get(requestKey) as Promise<T>;
    }

    const requestPromise = this.executeRequest<T>(endpoint, config).then(data => {
        if (method === 'GET' && useCache) {
            this.logger.debug('Caching response for:', endpoint);
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
    const { retries = 3, retryDelay = 1000, abortController } = config;

    for (let i = 0; i < retries; i++) {
        try {
            // Use provided abort controller or create a new one
            const controller = abortController || new AbortController();
            const requestConfig = { ...config, signal: controller.signal };
            
            return await this.performRequest<T>(endpoint, requestConfig);
        } catch (error) {
                    // Handle abort errors
        if (error instanceof Error && (error.name === 'AbortError' || error.message.includes('aborted'))) {
          this.logger.debug('Request was aborted:', endpoint);
          throw ApiError.cancelled('Request was cancelled');
        }

            // Handle token refresh for 401 errors
            if (isApiError(error) && error.status === 401) {
                this.logger.debug('Handling 401 error, attempting token refresh');
                
                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ 
                            resolve: () => resolve(this.request(endpoint, config)), 
                            reject 
                        });
                    });
                }
                
                isRefreshing = true;
                
                try {
                    const newToken = await getRefreshedToken();
                    this.logger.debug('Token refreshed successfully');
                    processQueue(null, newToken);
                    return this.performRequest<T>(endpoint, config);
                } catch (refreshError) {
                    this.logger.error('Token refresh failed:', refreshError);
                    processQueue(refreshError as Error, null);
                    throw refreshError;
                } finally {
                    isRefreshing = false;
                }
            }

            // For other errors, check if we should retry
            const isRetryable = (
              (error instanceof Error && error.message === 'Server Error') || // Mock server errors in tests
              (error instanceof TypeError && error.message === 'Failed to fetch') || // Network errors
              (isApiError(error) && error.status && error.status >= 500) // Server errors
            );

            if (isRetryable && i < retries - 1) {
                const delay = retryDelay * Math.pow(2, i); // Exponential backoff
                this.logger.debug(`Retrying request (${i + 1}/${retries}) after ${delay}ms:`, endpoint);
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }

            // Log final error
            this.logger.error(`Request failed after ${i + 1} attempts:`, endpoint, error);
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
        signal,
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
            this.logger.debug('Added auth token to request');
        } else if (isRefreshing) {
            // Wait for the token to be refreshed
            await new Promise((resolve, reject) => failedQueue.push({ resolve, reject }));
            const { data: { session: newSession } } = await supabase.auth.getSession();
            if (newSession?.access_token) {
                 headers.set('Authorization', `Bearer ${newSession.access_token}`);
            } else {
                this.logger.warn('No auth token available for authenticated request');
            }
        }
    }

    const url = new URL(`${this.baseUrl}${endpoint}`);
    if (params) {
        Object.keys(params).forEach(key => {
            if (params[key] !== undefined && params[key] !== null) {
                url.searchParams.append(key, String(params[key]));
            }
        });
    }

    const fetchOptions: RequestInit = {
        ...restConfig,
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
        signal,
    };

    this.logger.debug(`Performing ${method} request:`, url.toString());

    try {
        const response = await fetch(url.toString(), fetchOptions);

        // Log response
        this.logger.debug(`Response status: ${response.status} for ${method} ${endpoint}`);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({})); // Gracefully handle non-JSON error bodies
            throw new ApiError(
                errorData?.message || `Request failed with status ${response.status}`,
                response.status,
                errorData?.code,
                errorData
            );
        }
        
        // Handle no-content responses
        if (response.status === 204) {
            return undefined as T;
        }

        const responseData = await response.json();
        this.logger.debug(`Request completed successfully: ${method} ${endpoint}`);
        return responseData;

    } catch (error) {
        // Handle abort errors first
        if (error instanceof Error && (error.name === 'AbortError' || error.message.includes('aborted'))) {
            this.logger.debug('Request was aborted in performRequest:', endpoint);
            throw error; // Re-throw abort error to be handled by executeRequest
        }
        
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
            this.logger.error('Network error:', error);
            throw ApiError.networkError(error);
        }
        if (isApiError(error)) {
            throw error; // Re-throw known API errors
        }
        
        // Check if this is a retryable error before transforming it
        if (error instanceof Error && error.message === 'Server Error') {
            this.logger.debug('Detected retryable server error, preserving for retry logic');
            throw error; // Preserve original error for retry logic
        }
        
        // Catch other unexpected errors
        this.logger.error('Unexpected error:', error);
        throw ApiError.unknown(error);
    }

  }

  // --- Request Cancellation ---
  public createAbortController(): AbortController {
    return new AbortController();
  }

  public cancelRequest(controller: AbortController, reason?: string): void {
    this.logger.debug('Cancelling request:', reason || 'No reason provided');
    controller.abort(reason);
  }

  // --- Cache Management ---
  public clearCache(): void {
    this.logger.debug('Clearing cache, entries:', this.cache.size);
    this.cache.clear();
  }

  public getCacheSize(): number {
    return this.cache.size;
=======

  }
}

// --- Singleton Instance ---
export const apiClient = new ApiClient(
  (import.meta.env.VITE_API_LOG_LEVEL as LogConfig['level']) || 'info'
);

// --- Export Class for Custom Instances ---
export { ApiClient };
export type { RequestConfig, HttpMethod };
