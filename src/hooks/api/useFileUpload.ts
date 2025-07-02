
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface FileUploadResponse {
  url: string;
  path: string;
}

export const useFileUpload = () => {
  const uploadMutation = useMutation({
    mutationFn: async ({ file, bucket = 'images', folder = '' }: { 
      file: File; 
      bucket?: string; 
      folder?: string; 
    }): Promise<FileUploadResponse> => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Authentication required');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${folder ? folder + '/' : ''}${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw new Error(`Upload failed: ${error.message}`);
      }

      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      return {
        url: publicUrlData.publicUrl,
        path: data.path
      };
    },
  });

  return {
    upload: uploadMutation.mutate,
    uploadAsync: uploadMutation.mutateAsync,
    isLoading: uploadMutation.isPending,
    error: uploadMutation.error,
    data: uploadMutation.data,
  };
};
