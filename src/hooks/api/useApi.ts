import { useState, useCallback, useRef } from 'react';
import { apiClient, ApiError } from '@/api';
import { HttpMethod, RequestConfig } from '@/types/api';
import { toast } from '@/components/ui/use-toast';
import { getErrorMessage } from '@/lib/errors';
import axios from 'axios';

interface UseApiState<T> {
  data: T | null;
  error: ApiError | null;
  isLoading: boolean;
}

type ExecuteApi<T> = (
  method: HttpMethod,
  endpoint: string,
  payload?: unknown,
  config?: RequestConfig
) => Promise<T | null>;

interface UseApiResult<T> {
  state: UseApiState<T>;
  execute: ExecuteApi<T>;
  cancel: () => void;
}

export const useApi = <T>(): UseApiResult<T> => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    error: null,
    isLoading: false,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const execute = useCallback(
    async (
      method: HttpMethod,
      endpoint: string,
      payload?: unknown,
      config?: RequestConfig
    ) => {
      abortControllerRef.current = new AbortController();
      setState({ data: null, error: null, isLoading: true });
      try {
        let response;
        const requestConfig = {
          ...config,
          signal: abortControllerRef.current.signal,
        };

        switch (method) {
          case 'POST':
            response = await apiClient.post<T>(endpoint, payload, requestConfig);
            break;
          case 'PUT':
            response = await apiClient.put<T>(endpoint, payload, requestConfig);
            break;
          case 'PATCH':
            response = await apiClient.patch<T>(
              endpoint,
              payload,
              requestConfig
            );
            break;
          case 'DELETE':
            response = await apiClient.delete<T>(endpoint, requestConfig);
            break;
          case 'GET':
          default:
            response = await apiClient.get<T>(endpoint, requestConfig);
            break;
        }
        setState({ data: response.data, error: null, isLoading: false });
        return response.data;
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log('Request canceled:', err.message);
          setState({ data: null, error: null, isLoading: false });
          return null;
        }
        const apiError =
          err instanceof ApiError
            ? err
            : new ApiError(
                'An unexpected error occurred.',
                500,
                'UNEXPECTED_ERROR'
              );
        setState({ data: null, error: apiError, isLoading: false });

        const message = getErrorMessage(apiError.code);

        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });
        return null;
      }
    },
    []
  );

  const cancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  return { state, execute, cancel };
}; 