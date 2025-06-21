
import { useCallback } from 'react';
import { apiClient } from '@/api';
import { useApi } from './useApi';
=======

import { useMutation } from '@tanstack/react-query';


interface TextGenerationResponse {
  result: string;
}

interface ImageGenerationResponse {
  imageUrl: string;
}


const generateText = (prompt: string, platform: string) => 
  apiClient.post<TextGenerationResponse>('/ai/text', { prompt, platform });

const generateImage = (prompt: string, style: string) => 
  apiClient.post<ImageGenerationResponse>('/ai/image', { prompt, style });


export const useContentGeneration = () => {
  const textApi = useApi(generateText);
  const imageApi = useApi(generateImage);

  return {
    generateText: textApi.execute,
    textData: textApi.data,
    textStatus: textApi.status,
    textError: textApi.error,
    
    generateImage: imageApi.execute,
    imageData: imageApi.data,
    imageStatus: imageApi.status,
    imageError: imageApi.error,

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
