import { Router, Request, Response } from 'express';
import { scheduleJob, getScheduledJobs, cancelJob } from '../services/scheduler';
import cron from 'node-cron';

const router = Router();

router.post('/', (req: Request, res: Response) => {
  const { cronTime, content } = req.body;

  if (!cronTime || !content) {
    return res.status(400).json({ error: 'cronTime and content are required' });
  }

  if (!cron.validate(cronTime)) {
    return res.status(400).json({ error: 'Invalid cronTime format' });
  }

  const jobId = scheduleJob(cronTime, content);
  res.status(201).json({ message: 'Job scheduled successfully', jobId });
});

router.get('/', (req: Request, res: Response) => {
  const jobs = getScheduledJobs();
  res.status(200).json(jobs);
});

router.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const success = cancelJob(id);
  if (success) {
    res.status(200).json({ message: 'Job cancelled successfully' });
  } else {
    res.status(404).json({ error: 'Job not found' });
  }
});

export default router; 