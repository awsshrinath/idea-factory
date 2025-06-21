
import { useApi } from './useApi';

interface HealthStatus {
  status: 'ok' | 'error';
  timestamp: string;
}

export const useHealthCheck = () => {
  const { useGet } = useApi();
  const healthQuery = useGet('/health');

  const checkHealth = () => {
    // For manual health checks, we can use refetch
    healthQuery.refetch();
  };

  return {
    checkHealth,
    status: (healthQuery.data as HealthStatus)?.status || 'unknown',
    lastChecked: (healthQuery.data as HealthStatus)?.timestamp,
    isLoading: healthQuery.isLoading,
    error: healthQuery.error,
  };
};
