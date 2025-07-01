import { supabase } from '../database';
import { generateText, generateImage } from '../services/ai';
import { jobEvents } from '../events';
import { JobError } from '../types/errors';

const adaptPromptForPlatform = (prompt: string, platform?: string): string => {
    if (!platform) {
        return prompt;
    }

    switch (platform.toLowerCase()) {
        case 'instagram':
            return `${prompt}\n\nPlease also generate 5-10 relevant hashtags for Instagram.`;
        case 'youtube':
            return `Create a compelling YouTube video description for the following idea:\n\n${prompt}\n\nInclude a title suggestion and relevant keywords for SEO.`;
        case 'twitter':
            return `Condense the following idea into a tweet (max 280 characters):\n\n${prompt}`;
        case 'linkedin':
            return `Write a professional LinkedIn post based on this idea:\n\n${prompt}\n\nKeep the tone professional and engaging.`;
        case 'facebook':
            return `Create a Facebook post from this idea:\n\n${prompt}\n\nMake it friendly and encourage discussion.`;
        default:
            return prompt;
    }
};

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const withRetries = async <T>(fn: () => Promise<T>, retries = 3, delayMs = 1000, finalErr: JobError): Promise<T> => {
    let lastError: Error | undefined;
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error as Error;
            console.log(`Attempt ${i + 1} failed. Retrying in ${delayMs}ms...`);
            await delay(delayMs * (i + 1)); // Exponential backoff
        }
    }
    const finalError = new Error(finalErr);
    if (lastError) {
        finalError.stack = lastError.stack;
    }
    throw finalError;
}

const processJob = async (job: any) => {
    console.log(`Processing job: ${job.id}`);
    try {
        let resultUrl = null;

        const adaptedPrompt = adaptPromptForPlatform(job.prompt, job.platform);

        // For now, we'll just handle 'text' or 'image' based on a simple prompt check
        // This will be replaced by a proper platform/type check later
        if (job.platform && ['instagram_image', 'dall-e'].includes(job.platform.toLowerCase())) {
            const imageUrl = await withRetries(
                () => generateImage(adaptedPrompt),
                3, 
                1000,
                JobError.AI_SERVICE_ERROR
            );
            if (!imageUrl) {
                throw new Error(JobError.AI_SERVICE_ERROR);
            }
            // In a real scenario, we might upload this to our own storage
            // For now, we'll use the direct URL from DALL-E
            resultUrl = imageUrl;
        } else {
            const textContent = await withRetries(
                () => generateText(adaptedPrompt),
                3,
                1000,
                JobError.AI_SERVICE_ERROR
            );
            if (!textContent) {
                throw new Error(JobError.AI_SERVICE_ERROR);
            }
            // Upload the text content as a file to Supabase Storage
            const fileName = `${job.user_id}/${job.id}.txt`;
            const { data, error } = await withRetries(
                () => supabase.storage
                    .from('generated_content')
                    .upload(fileName, textContent, {
                        contentType: 'text/plain;charset=UTF-8',
                        upsert: true,
                    }),
                3,
                1000,
                JobError.SUPABASE_UPLOAD_ERROR
            );

            if (error) {
                throw new Error(JobError.SUPABASE_UPLOAD_ERROR);
            }

            const { data: { publicUrl } } = supabase.storage.from('generated_content').getPublicUrl(fileName);
            resultUrl = publicUrl;
        }

        // Update job status to completed
        const { data: updatedJob } = await supabase
            .from('content_generation_jobs')
            .update({ 
                status: 'completed', 
                result_url: resultUrl,
                updated_at: new Date().toISOString() 
            })
            .eq('id', job.id)
            .select()
            .single();

        console.log(`Finished processing job: ${job.id}`);
        jobEvents.emit('jobCompleted', updatedJob);

    } catch (err: any) {
        console.error(`Error processing job ${job.id}:`, err);
        // Update job status to failed
        const { data: failedJob } = await supabase
            .from('content_generation_jobs')
            .update({ 
                status: 'failed', 
                error_message: err.message || JobError.UNKNOWN_ERROR,
                updated_at: new Date().toISOString() 
            })
            .eq('id', job.id)
            .select()
            .single();
            
        jobEvents.emit('jobFailed', failedJob);
    }
};

const pollForJobs = async () => {
    console.log('Polling for jobs...');
    try {
        const { data: jobs, error } = await supabase
            .from('content_generation_jobs')
            .select('*')
            .eq('status', 'pending')
            .order('created_at', { ascending: true })
            .limit(1);

        if (error) {
            console.error('Error polling for jobs:', error);
            return;
        }

        if (jobs && jobs.length > 0) {
            const job = jobs[0];
            const { data: processingJob } = await supabase
                .from('content_generation_jobs')
                .update({ status: 'processing', updated_at: new Date().toISOString() })
                .eq('id', job.id)
                .select()
                .single();
            
            jobEvents.emit('jobProcessing', processingJob);
            await processJob(job);
        }
    } catch (err) {
        console.error('An unexpected error occurred during polling:', err);
    }
};

export const startJobWorker = () => {
    console.log('Starting job worker...');
    // Poll every 10 seconds
    setInterval(pollForJobs, 10000); 
}; 