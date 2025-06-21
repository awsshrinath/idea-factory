import { useState, useCallback } from 'react';
import { apiClient } from '@/api';
import { useApi } from './useApi';

interface SignedUrlResponse {
  signedUrl: string;
  path: string;
}

const getSignedUrl = (fileName: string, fileType: string) =>
  apiClient.post<SignedUrlResponse>('/storage/upload', { fileName, fileType });

export const useFileUpload = () => {
  const [progress, setProgress] = useState(0);
  const getSignedUrlApi = useApi(getSignedUrl);

  const uploadFile = useCallback(
    async (file: File) => {
      try {
        const { data: signedUrlData } = await getSignedUrlApi.execute(file.name, file.type);
        
        if (!signedUrlData) {
          throw new Error('Failed to get a signed URL.');
        }

        const { signedUrl, path } = signedUrlData;

        return new Promise<string>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('PUT', signedUrl, true);
          xhr.setRequestHeader('Content-Type', file.type);

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const percentage = Math.round((event.loaded * 100) / event.total);
              setProgress(percentage);
            }
          };

          xhr.onload = () => {
            if (xhr.status === 200) {
              // The path of the uploaded file is returned.
              const publicUrl = apiClient.post('/storage/public-url', { path }) as Promise<string>;
              resolve(publicUrl);
            } else {
              reject(new Error(`Upload failed with status: ${xhr.status}`));
            }
          };

          xhr.onerror = () => {
            reject(new Error('File upload failed due to a network error.'));
          };

          xhr.send(file);
        });
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    [getSignedUrlApi.execute]
  );

  return {
    upload: uploadFile,
    progress,
    isLoading: getSignedUrlApi.status === 'loading',
    error: getSignedUrlApi.error,
  };
}; 