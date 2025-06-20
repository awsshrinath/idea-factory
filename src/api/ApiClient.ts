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