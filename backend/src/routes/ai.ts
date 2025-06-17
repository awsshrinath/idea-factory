import { Router, Request, Response } from 'express';
import { generateText, getPromptForTopic, generateImage } from '../services/ai';

const router = Router();

router.post('/generate-text', async (req: Request, res: Response) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const generatedContent = await generateText(prompt);
    if (generatedContent) {
      res.status(200).json({ content: generatedContent });
    } else {
      res.status(500).json({ error: 'Failed to generate content' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An internal server error occurred' });
  }
});

router.post('/generate-from-topic', async (req: Request, res: Response) => {
    const { topic } = req.body;

    if (!topic) {
        return res.status(400).json({ error: 'Topic is required' });
    }

    try {
        const prompt = getPromptForTopic(topic);
        const generatedContent = await generateText(prompt);
        if (generatedContent) {
            res.status(200).json({ content: generatedContent });
        } else {
            res.status(500).json({ error: 'Failed to generate content' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An internal server error occurred' });
    }
});

router.post('/image', async (req: Request, res: Response) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const imageUrl = await generateImage(prompt);
    if (imageUrl) {
      res.status(200).json({ imageUrl });
    } else {
      res.status(500).json({ error: 'Failed to generate image' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate image' });
  }
});

export default router; 