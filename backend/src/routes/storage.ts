import { Router, Request, Response } from 'express';
import { uploadFile } from '../services/storage';

const router = Router();

router.post('/upload', async (req: Request, res: Response) => {
  const { bucketName, fileContent, fileExtension } = req.body;

  if (!bucketName || !fileContent || !fileExtension) {
    return res.status(400).json({ error: 'bucketName, fileContent (base64), and fileExtension are required' });
  }

  try {
    const publicUrl = await uploadFile(bucketName, fileContent, fileExtension);
    res.status(200).json({ message: 'File uploaded successfully', url: publicUrl });
  } catch (error) {
    console.error('Error in upload route:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

export default router; 