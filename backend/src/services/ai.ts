import OpenAI from 'openai';
import dotenv from 'dotenv';
import axios from 'axios';
import axiosRetry from 'axios-retry';

dotenv.config();

const openaiApiKey = process.env.OPENAI_API_KEY;

const apiClient = axios.create({
    baseURL: 'https://api.openai.com/v1',
    headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
    },
});

axiosRetry(apiClient, {
    retries: 3,
    retryDelay: (retryCount) => {
        console.log(`Retrying request, attempt: ${retryCount}`);
        return retryCount * 2000; // Exponential backoff
    },
    retryCondition: (error) => {
        // Retry on network errors or 5xx server errors
        return error.code !== 'ECONNABORTED' && (!error.response || error.response.status >= 500);
    },
});

export const generateText = async (prompt: string): Promise<string | null> => {
  if (!openaiApiKey) {
    console.error('OpenAI API key not configured.');
    return null;
  }

  try {
    const response = await apiClient.post('/chat/completions', {
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
    });
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating text with OpenAI:', error);
    return null;
  }
};

export const generateImage = async (prompt: string): Promise<string | null> => {
  if (!openaiApiKey) {
    console.error('OpenAI API key not configured.');
    return null;
  }

  try {
    const response = await apiClient.post('/images/generations', {
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1024',
    });
    return response.data.data[0].url;
  } catch (error) {
    console.error('Error generating image with DALL-E 3:', error);
    return null;
  }
};

// We can add a prompt template system here later
export const getPromptForTopic = (topic: string): string => {
  // Simple example of a template
  return `Write a short social media post about ${topic}.`;
}; 