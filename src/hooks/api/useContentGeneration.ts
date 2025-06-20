import { useApi } from './useApi';

interface TextGenerationPayload {
  prompt: string;
  // Add other text generation options here
}

interface ImageGenerationPayload {
  prompt: string;
  // Add other image generation options here
}

export const useContentGeneration = () => {
  const { state: textState, execute: executeText } = useApi<string>();
  const { state: imageState, execute: executeImage } = useApi<string>(); // Assuming image URL is a string

  const generateText = async (payload: TextGenerationPayload) => {
    return executeText('POST', '/ai/text', payload);
  };

  const generateImage = async (payload: ImageGenerationPayload) => {
    return executeImage('POST', '/ai/image', payload);
  };

  return {
    text: {
      data: textState.data,
      error: textState.error,
      isLoading: textState.isLoading,
      generate: generateText,
    },
    image: {
      data: imageState.data,
      error: imageState.error,
      isLoading: imageState.isLoading,
      generate: generateImage,
    },
  };
}; 