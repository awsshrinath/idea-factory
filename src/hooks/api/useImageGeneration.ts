
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ImageGenerationRequest {
  prompt: string;
  style: string;
  aspectRatio: string;
  detailLevel?: string;
  lighting?: string;
  seed?: string;
}

interface ImageGenerationResponse {
  imageUrl: string;
  fileName: string;
}

export const useImageGeneration = () => {
  return useMutation({
    mutationFn: async (request: ImageGenerationRequest): Promise<ImageGenerationResponse> => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Authentication required');
      }

      const response = await supabase.functions.invoke('generate-image', {
        body: request
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to generate image');
      }

      return response.data;
    },
  });
};
