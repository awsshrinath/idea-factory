
import { useMutation } from '@tanstack/react-query';

interface TextGenerationPayload {
  prompt: string;
  // Add other text generation options here
}

interface ImageGenerationPayload {
  prompt: string;
  // Add other image generation options here
}

export const useContentGeneration = () => {
  const textMutation = useMutation({
    mutationFn: async (payload: TextGenerationPayload) => {
      const response = await fetch('/ai/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Failed to generate text');
      return response.json();
    },
  });

  const imageMutation = useMutation({
    mutationFn: async (payload: ImageGenerationPayload) => {
      const response = await fetch('/ai/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Failed to generate image');
      return response.json();
    },
  });

  return {
    text: {
      data: textMutation.data,
      error: textMutation.error,
      isLoading: textMutation.isPending,
      generate: textMutation.mutate,
    },
    image: {
      data: imageMutation.data,
      error: imageMutation.error,
      isLoading: imageMutation.isPending,
      generate: imageMutation.mutate,
    },
  };
};
