import { Router, Request, Response } from 'express';
import { getInstagramAuthUrl, getAccessToken } from '../services/instagram';

const router = Router();

/**
 * Redirects the user to the Instagram authorization page.
 */
router.get('/oauth/authorize', (req: Request, res: Response) => {
  const authUrl = getInstagramAuthUrl();
  res.redirect(authUrl);
});

/**
 * Handles the callback from Instagram after authorization.
 * Exchanges the code for an access token.
 */
router.get('/oauth/callback', async (req: Request, res: Response) => {
  const { code } = req.query;

  if (typeof code !== 'string') {
    return res.status(400).json({ error: 'Invalid authorization code' });
  }

  try {
    const accessToken = await getAccessToken(code);
    if (accessToken) {
      // In a real application, you would save the access token to the database
      // associated with the user.
      res.status(200).json({ message: 'Successfully authenticated with Instagram.', accessToken });
    } else {
      res.status(500).json({ error: 'Failed to get access token' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An internal server error occurred' });
  }
});

export default router; 