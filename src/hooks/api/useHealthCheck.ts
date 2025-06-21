import { apiClient } from '@/api';
import { useApi } from './useApi';

interface HealthStatus {
  status: 'ok' | 'error';
  timestamp: string;
}

const checkHealth = () => apiClient.get<HealthStatus>('/health');

export const useHealthCheck = (options = {}) => {
  const healthApi = useApi(checkHealth, options);

  return {
    checkHealth: healthApi.execute,
    status: healthApi.data?.status || 'unknown',
    lastChecked: healthApi.data?.timestamp,
    isLoading: healthApi.status === 'loading',
    error: healthApi.error,
  };
}; 