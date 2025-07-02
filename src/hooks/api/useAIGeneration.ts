
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface AIGenerationRequest {
  prompt: string;
  platform: string;
  tone: string;
  language: string;
  model: string;
}

interface AIGenerationResponse {
  success: boolean;
  content: string;
  error?: string;
}

export const useAIGeneration = () => {
  return useMutation({
    mutationFn: async (request: AIGenerationRequest): Promise<AIGenerationResponse> => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Authentication required');
      }

      const response = await supabase.functions.invoke('generate-content', {
        body: {
          description: request.prompt,
          platform: request.platform,
          tone: request.tone,
          language: request.language,
          aiModel: request.model
        }
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to generate content');
      }

      return {
        success: response.data.success,
        content: response.data.content,
        error: response.data.error
      };
    },
  });
};
