/**
 * Extends the native `RequestInit` interface to add support for
 * structured query parameters (`params`) and a request payload (`data`).
 * This is used by the `ApiClient` to construct fetch requests.
 */
export interface RequestConfig extends Omit<RequestInit, 'body'> {
  params?: Record<string, any>;
  data?: unknown;
}

/**
 * Defines the structure for a generic API response, primarily used
 * in React Query or other data-fetching hooks to standardize the
 * shape of data returned from the API.
 * @template T The type of the data payload.
 */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'; 