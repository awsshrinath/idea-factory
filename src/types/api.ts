export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  signal?: AbortSignal;
} 