
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../api/ApiClient';

interface UseApiOptions {
  enabled?: boolean;
  staleTime?: number;
  cacheTime?: number;
}

export const useApi = () => {
  const queryClient = useQueryClient();

  // GET request
  const useGet = (url: string, options: UseApiOptions = {}) => {
    return useQuery({
      queryKey: [url],
      queryFn: () => apiClient.get(url),
      enabled: options.enabled,
      staleTime: options.staleTime,
      gcTime: options.cacheTime,
    });
  };

  // POST request
  const usePost = (url: string) => {
    return useMutation({
      mutationFn: (data: any) => apiClient.post(url, data),
      onSuccess: () => {
        queryClient.invalidateQueries();
      },
    });
  };

  // PUT request
  const usePut = (url: string) => {
    return useMutation({
      mutationFn: (data: any) => apiClient.put(url, data),
      onSuccess: () => {
        queryClient.invalidateQueries();
      },
    });
  };

  // DELETE request
  const useDelete = (baseUrl: string) => {
    return useMutation({
      mutationFn: (id: string) => apiClient.delete(`${baseUrl}/${id}`),
      onSuccess: () => {
        queryClient.invalidateQueries();
      },
    });
  };

  // Custom invalidation
  const invalidateQueries = (queryKey?: string[]) => {
    if (queryKey) {
      queryClient.invalidateQueries({ queryKey });
    } else {
      queryClient.invalidateQueries();
    }
  };

  return {
    useGet,
    usePost,
    usePut,
    useDelete,
    invalidateQueries,
  };
};
