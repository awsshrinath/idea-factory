import cron from 'node-cron';
import { v4 as uuidv4 } from 'uuid';

interface ScheduledJob {
  id: string;
  cronTime: string;
  content: string;
  task: cron.ScheduledTask;
}

// In-memory store for scheduled jobs. In production, this would be a database.
const scheduledJobs: Map<string, ScheduledJob> = new Map();

/**
 * Schedules a new job.
 * @param cronTime The cron time string (e.g., '* * * * *').
 * @param content The content to be "published".
 * @returns The ID of the new job.
 */
export const scheduleJob = (cronTime: string, content: string): string => {
  const id = uuidv4();

  const task = cron.schedule(cronTime, () => {
    console.log(`[Scheduler] Publishing content for job ${id}: "${content}"`);
    // Here you would add the logic to actually publish the content
    // e.g., call a social media service.
  });

  const job: ScheduledJob = { id, cronTime, content, task };
  scheduledJobs.set(id, job);

  console.log(`[Scheduler] Job ${id} scheduled for ${cronTime}`);
  return id;
};

/**
 * Gets all currently scheduled jobs.
 * @returns A list of scheduled jobs (without the task object).
 */
export const getScheduledJobs = () => {
  return Array.from(scheduledJobs.values()).map(({ task, ...job }) => job);
};

/**
 * Cancels a scheduled job.
 * @param id The ID of the job to cancel.
 * @returns True if the job was cancelled, false otherwise.
 */
export const cancelJob = (id: string): boolean => {
  const job = scheduledJobs.get(id);
  if (job) {
    job.task.stop();
    scheduledJobs.delete(id);
    console.log(`[Scheduler] Job ${id} cancelled.`);
    return true;
  }
  return false;
}; 