import { useState } from 'react';
import { useApi } from './useApi';

interface FileUploadState {
  progress: number;
  isUploading: boolean;
  error: Error | null;
  data: string | null; // Assuming the response is the URL of the uploaded file
}

export const useFileUpload = () => {
  const [state, setState] = useState<FileUploadState>({
    progress: 0,
    isUploading: false,
    error: null,
    data: null,
  });

  const { state: apiState, execute } = useApi<string>();

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    setState((prev) => ({ ...prev, isUploading: true, progress: 0, error: null, data: null }));

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent: ProgressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setState((prev) => ({ ...prev, progress: percentCompleted }));
      },
    };

    const response = await execute('POST', '/storage/upload', formData, config);
    
    if (response) {
      setState((prev) => ({...prev, isUploading: false, data: response}));
    } else {
        setState((prev) => ({...prev, isUploading: false, error: apiState.error as Error | null}));
    }
  };

  return {
    ...state,
    uploadFile,
  };
}; 