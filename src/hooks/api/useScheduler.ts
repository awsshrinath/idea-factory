
import { useApi } from './useApi';

interface ScheduledJob {
  id: string;
  cronTime: string;
  content: string;
}

export const useScheduler = () => {
  const { useGet, usePost, useDelete } = useApi();

  const scheduleApi = usePost('/scheduler');
  const getJobsApi = useGet('/scheduler');
  const cancelApi = useDelete('/scheduler');

  return {
    scheduleJob: scheduleApi.mutate,
    schedulingStatus: scheduleApi.status,
    schedulingError: scheduleApi.error,

    getScheduledJobs: getJobsApi.refetch,
    jobs: getJobsApi.data as ScheduledJob[],
    loadingJobsStatus: getJobsApi.isLoading ? 'loading' : 'idle',
    jobsError: getJobsApi.error,

    cancelJob: cancelApi.mutate,
    cancellingStatus: cancelApi.status,
    cancellingError: cancelApi.error,
  };
};
