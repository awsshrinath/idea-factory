
import { useMutation } from '@tanstack/react-query';

interface UploadPayload {
  file: File;
  bucket?: string;
  path?: string;
}

export const useFileUpload = () => {
  const uploadMutation = useMutation({
    mutationFn: async (payload: UploadPayload) => {
      const formData = new FormData();
      formData.append('file', payload.file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('Failed to upload file');
      return response.json();
    },
  });

  return {
    data: uploadMutation.data,
    error: uploadMutation.error,
    isLoading: uploadMutation.isPending,
    upload: uploadMutation.mutate,
  };
};
