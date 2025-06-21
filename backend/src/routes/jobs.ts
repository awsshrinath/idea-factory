import express, { Request, Response } from 'express';
import { supabase } from '../database';
import { v4 as uuidv4 } from 'uuid';
import { jobEvents } from '../events';
import { sanitizeInput, isClean } from '../utils/validation';
import { JobError } from '../types/errors';

const COST_PER_TEXT_GENERATION = 0.005; // Example cost in USD
const COST_PER_IMAGE_GENERATION = 0.04; // Example cost in USD

const estimateCost = (prompt: string, platform?: string): number => {
    // This is a simplified estimation. A real implementation would be more complex.
    if (platform && ['instagram_image', 'dall-e'].includes(platform.toLowerCase())) {
        return COST_PER_IMAGE_GENERATION;
    }
    return COST_PER_TEXT_GENERATION;
};

const router = express.Router();

const sseHandler: express.RequestHandler = (req, res) => {
    const userId = (req as any).user?.sub;
    if (!userId) {
        res.status(401).end();
        return;
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const sendEvent = (event: string, data: any) => {
        if (data.user_id === userId) {
            res.write(`event: ${event}\n`);
            res.write(`data: ${JSON.stringify(data)}\n\n`);
        }
    };

    const onJobProcessing = (data: any) => sendEvent('jobProcessing', data);
    const onJobCompleted = (data: any) => sendEvent('jobCompleted', data);
    const onJobFailed = (data: any) => sendEvent('jobFailed', data);

    jobEvents.on('jobProcessing', onJobProcessing);
    jobEvents.on('jobCompleted', onJobCompleted);
    jobEvents.on('jobFailed', onJobFailed);

    req.on('close', () => {
        jobEvents.off('jobProcessing', onJobProcessing);
        jobEvents.off('jobCompleted', onJobCompleted);
        jobEvents.off('jobFailed', onJobFailed);
        res.end();
    });
};

const createJobHandler: express.RequestHandler = async (req, res) => {
    const { prompt, platform } = req.body;
    const userId = (req as any).user?.sub;

    if (!prompt || !userId) {
        res.status(400).json({ message: 'Prompt and user authentication are required.' });
        return;
    }

    const sanitizedPrompt = sanitizeInput(prompt);

    if (!isClean(sanitizedPrompt)) {
        res.status(400).json({ 
            message: 'Prompt contains inappropriate language.',
            errorCode: JobError.PROFANITY_DETECTED 
        });
        return;
    }

    const estimatedCost = estimateCost(sanitizedPrompt, platform);

    try {
        // --- Deduplication Check ---
        const oneHourAgo = new Date(Date.now() - 3600 * 1000).toISOString();
        const { data: existingJob, error: existingJobError } = await supabase
            .from('content_generation_jobs')
            .select('id, status, result_url')
            .eq('user_id', userId)
            .eq('prompt', sanitizedPrompt)
            .eq('platform', platform)
            .eq('status', 'completed')
            .gte('created_at', oneHourAgo)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (existingJob) {
            res.status(200).json({ 
                message: 'Returning result from a recent identical job.', 
                jobId: existingJob.id,
                result_url: existingJob.result_url,
                isDuplicate: true,
            });
            return;
        }
        // --- End Deduplication Check ---

        const { data, error } = await supabase
            .from('content_generation_jobs')
            .insert({
                user_id: userId,
                prompt: sanitizedPrompt,
                platform,
                status: 'pending',
                cost: estimatedCost,
            })
            .select()
            .single();

        if (error) {
            throw error;
        }

        res.status(202).json({ message: 'Job submitted successfully.', jobId: data.id });
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to submit job.', error: error.message });
    }
};

const getJobStatusHandler: express.RequestHandler = async (req, res) => {
    const { jobId } = req.params;
    const userId = (req as any).user?.sub;

    try {
        const { data, error } = await supabase
            .from('content_generation_jobs')
            .select('*')
            .eq('id', jobId)
            .eq('user_id', userId)
            .single();

        if (error) {
            throw error;
        }

        if (!data) {
            res.status(404).json({ message: 'Job not found.' });
            return;
        }

        res.status(200).json(data);
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to get job status.', error: error.message });
    }
};

const cancelJobHandler: express.RequestHandler = async (req, res) => {
    const { jobId } = req.params;
    const userId = (req as any).user?.sub;

    try {
        const { data: job, error: fetchError } = await supabase
            .from('content_generation_jobs')
            .select('id, status')
            .eq('id', jobId)
            .eq('user_id', userId)
            .single();

        if (fetchError) throw fetchError;

        if (!job) {
            res.status(404).json({ message: 'Job not found.' });
            return;
        }

        if (job.status !== 'pending') {
            res.status(400).json({ 
                message: `Cannot cancel job with status '${job.status}'. Only pending jobs can be cancelled.`
            });
            return;
        }

        const { data, error } = await supabase
            .from('content_generation_jobs')
            .update({ status: 'cancelled', updated_at: new Date().toISOString() })
            .eq('id', jobId)
            .select()
            .single();
        
        if (error) throw error;

        res.status(200).json({ message: 'Job cancelled successfully.', job: data });
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to cancel job.', error: error.message });
    }
};

// POST /api/v1/jobs/content - Submit a new content generation job
router.post('/content', createJobHandler);

// GET /api/v1/jobs/:jobId/status - Get job status
router.get('/:jobId/status', getJobStatusHandler);

// POST /api/v1/jobs/:jobId/cancel - Cancel a pending job
router.post('/:jobId/cancel', cancelJobHandler);

// GET /api/v1/jobs/stream - Stream job status updates
router.get('/stream', sseHandler);

export default router; 