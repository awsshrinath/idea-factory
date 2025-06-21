import { apiClient } from '@/api';
import { useApi } from './useApi';

interface ScheduledJob {
  id: string;
  cronTime: string;
  content: string;
}

const scheduleJob = (cronTime: string, content: string) =>
  apiClient.post<ScheduledJob>('/scheduler', { cronTime, content });

const getJobs = () =>
  apiClient.get<ScheduledJob[]>('/scheduler');

const cancelJob = (id: string) =>
  apiClient.delete(`/scheduler/${id}`);

export const useScheduler = () => {
  const scheduleApi = useApi(scheduleJob);
  const getJobsApi = useApi(getJobs);
  const cancelApi = useApi(cancelJob);

  return {
    scheduleJob: scheduleApi.execute,
    schedulingStatus: scheduleApi.status,
    schedulingError: scheduleApi.error,

    getScheduledJobs: getJobsApi.execute,
    jobs: getJobsApi.data,
    loadingJobsStatus: getJobsApi.status,
    jobsError: getJobsApi.error,

    cancelJob: cancelApi.execute,
    cancellingStatus: cancelApi.status,
    cancellingError: cancelApi.error,
  };
}; 