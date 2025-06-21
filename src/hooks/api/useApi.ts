import { useState, useCallback, useRef, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { ApiError, isApiError } from '@/api';
import { ErrorDisplay } from '@/components/system/ErrorDisplay';

type ApiStatus = 'idle' | 'loading' | 'success' | 'error';

interface State<T> {
  data: T | null;
  status: ApiStatus;
  error: string | null;
  ErrorComponent: ReactNode;
}

type ApiRequest<T, P extends any[]> = (...args: P) => Promise<T>;

interface UseApiOptions<T> {
  initialData?: T;
  showSuccessToast?: boolean;
  successToastMessage?: string;
  showErrorToast?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

export const useApi = <T, P extends any[]>(
  apiRequest: ApiRequest<T, P>,
  options: UseApiOptions<T> = {}
) => {
  const [state, setState] = useState<State<T>>({
    data: options.initialData || null,
    status: 'idle',
    error: null,
    ErrorComponent: null,
  });

  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const reset = useCallback(() => {
    setState({
        data: options.initialData || null,
        status: 'idle',
        error: null,
        ErrorComponent: null,
    });
  }, [options.initialData]);

  const execute = useCallback(
    async (...args: P) => {
      setState(prevState => ({ ...prevState, status: 'loading', error: null, ErrorComponent: null }));
      try {
        const result = await apiRequest(...args);
        if (mountedRef.current) {
          setState({ data: result, status: 'success', error: null });
          if (options.showSuccessToast) {
            toast.success(options.successToastMessage || 'Operation successful!');
          }
          if (options.onSuccess) {
            options.onSuccess(result);
          }
        }
        return { data: result, error: null };
      } catch (err) {
        if (mountedRef.current) {
          const errorMessage = isApiError(err) ? err.message : 'An unexpected error occurred.';
          
          const retryCallback = () => {
            execute(...args);
          };

          setState({ 
              data: null, 
              status: 'error', 
              error: errorMessage,
              ErrorComponent: <ErrorDisplay message={errorMessage} onRetry={retryCallback} />
          });

          if (options.showErrorToast) {
            toast.error(errorMessage);
          }
          if (options.onError) {
            options.onError(errorMessage);
          }
        }
        return { data: null, error: err };
      }
    },
    [apiRequest, options]
  );

  return { ...state, execute, reset };
}; 