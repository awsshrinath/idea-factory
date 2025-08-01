
import { useState, useCallback, useEffect, useRef } from 'react';
import { fetchEventSource, EventSourceMessage } from '@microsoft/fetch-event-source';
import { useAuth } from '../useAuth';
import { apiClient } from '../../api/ApiClient';

type JobStatus = 'idle' | 'submitting' | 'processing' | 'completed' | 'failed';

interface JobState {
    jobId: string | null;
    status: JobStatus;
    data: any | null;
    error: string | null;
}

export const useContentJob = () => {
    const { session } = useAuth();
    const [jobState, setJobState] = useState<JobState>({
        jobId: null,
        status: 'idle',
        data: null,
        error: null,
    });
    const ctrlRef = useRef<AbortController | null>(null);

    const submit = useCallback(async (prompt: string, platform: string) => {
        if (!session) {
            setJobState({ ...jobState, error: 'Not authenticated', status: 'failed' });
            return;
        }

        setJobState({ jobId: null, status: 'submitting', data: null, error: null });

        try {
            const response = await apiClient.post<{ jobId: string }>('/jobs/content', { prompt, platform });
            setJobState(prevState => ({ ...prevState, jobId: response.jobId, status: 'processing' }));
        } catch (error: any) {
            setJobState({ jobId: null, status: 'failed', data: null, error: error.message });
        }
    }, [session, jobState]);

    const cancelJob = useCallback(async () => {
        if (!jobState.jobId || !session) {
            setJobState(prevState => ({ ...prevState, error: 'No job to cancel or not authenticated', status: 'failed' }));
            return;
        }

        // Abort any ongoing SSE connection
        if (ctrlRef.current) {
            ctrlRef.current.abort();
        }

        try {
            await apiClient.post(`/jobs/${jobState.jobId}/cancel`, {});
            setJobState(prevState => ({ ...prevState, status: 'failed', error: 'Job cancelled by user.' }));
        } catch (error: any) {
            console.error("Failed to cancel job:", error.message);
            setJobState(prevState => ({ ...prevState, error: `Failed to cancel job: ${error.message}` }));
        }
    }, [session, jobState.jobId]);

    useEffect(() => {
        if (jobState.status !== 'processing' || !jobState.jobId || !session) {
            return;
        }

        ctrlRef.current = new AbortController();
        const ctrl = ctrlRef.current;

        const connect = async () => {
            await fetchEventSource(`${import.meta.env.VITE_API_BASE_URL}/api/v1/jobs/stream`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                },
                signal: ctrl.signal,
                async onopen(response) {
                    if (response.ok && response.headers.get('content-type') === 'text/event-stream') {
                        console.log('SSE connection opened');
                        return; 
                    }
                    throw new Error(`Failed to connect to event stream, status: ${response.status}`);
                },
                onmessage(event: EventSourceMessage) {
                    const parsedData = JSON.parse(event.data);
                    if (parsedData.id !== jobState.jobId) return;

                    if (event.event === 'jobCompleted') {
                        setJobState(prevState => ({ ...prevState, status: 'completed', data: parsedData }));
                        ctrl.abort();
                    } else if (event.event === 'jobFailed') {
                        setJobState(prevState => ({ ...prevState, status: 'failed', error: parsedData.error_message }));
                        ctrl.abort();
                    } else if (event.event === 'jobProcessing') {
                        setJobState(prevState => ({ ...prevState, status: 'processing' }));
                    }
                },
                onerror(err) {
                    console.error('SSE Error:', err);
                    setJobState(prevState => ({ ...prevState, status: 'failed', error: 'Connection error' }));
                    ctrl.abort();
                    throw err;
                },
            });
        };

        connect();

        return () => {
            ctrl.abort();
        };
    }, [jobState.status, jobState.jobId, session]);

    return { ...jobState, submit, cancel: cancelJob };
};
