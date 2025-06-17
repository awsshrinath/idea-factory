import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const INSTAGRAM_APP_ID = process.env.INSTAGRAM_CLIENT_ID;
const INSTAGRAM_APP_SECRET = process.env.INSTAGRAM_CLIENT_SECRET;
const REDIRECT_URI = process.env.INSTAGRAM_REDIRECT_URI; // e.g., http://localhost:3001/api/v1/instagram/oauth/callback

/**
 * Step 1: Get the authorization URL to send the user to.
 */
export const getInstagramAuthUrl = (): string => {
  const scope = 'user_profile,user_media';
  return `https://api.instagram.com/oauth/authorize?client_id=${INSTAGRAM_APP_ID}&redirect_uri=${REDIRECT_URI}&scope=${scope}&response_type=code`;
};

/**
 * Step 2: Exchange the code for an access token.
 * @param code The authorization code from the callback.
 * @returns The access token.
 */
export const getAccessToken = async (code: string): Promise<string | null> => {
  try {
    const response = await axios.post(
      'https://api.instagram.com/oauth/access_token',
      {
        client_id: INSTAGRAM_APP_ID,
        client_secret: INSTAGRAM_APP_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
        code,
      },
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting Instagram access token:', error);
    return null;
  }
};

/**
 * Publishes content to Instagram.
 * This is a placeholder for the more complex content publishing flow.
 * The Instagram Basic Display API does not support content publishing.
 * You will need to use the Instagram Graph API for this.
 * @param accessToken The user's access token.
 * @param mediaUrl The URL of the media to publish.
 * @param caption The caption for the post.
 */
export const publishToInstagram = async (accessToken: string, mediaUrl: string, caption: string): Promise<any> => {
    console.warn('Content publishing requires the Instagram Graph API, not the Basic Display API.');
    // Placeholder for Graph API implementation
    return Promise.resolve({ success: true, message: 'This is a placeholder.' });
}; 