import { useCallback } from 'react';
import { apiClient } from '@/api';
import { useApi } from './useApi';

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
  };
}; 