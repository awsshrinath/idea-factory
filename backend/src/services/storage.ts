import { supabase } from '../database';
import { v4 as uuidv4 } from 'uuid';
import { decode } from 'base64-arraybuffer';

/**
 * Uploads a file to a Supabase Storage bucket.
 * The file is expected to be a base64 encoded string.
 *
 * @param bucketName The name of the bucket to upload to.
 * @param fileContentBase64 The base64 encoded content of the file.
 * @param fileExtension The extension of the file (e.g., 'png', 'jpg').
 * @returns The public URL of the uploaded file.
 */
export const uploadFile = async (
  bucketName: string,
  fileContentBase64: string,
  fileExtension: string
): Promise<string> => {
  try {
    const fileName = `${uuidv4()}.${fileExtension}`;
    const fileBody = decode(fileContentBase64);

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, fileBody, {
        contentType: `image/${fileExtension}`,
        upsert: false, // Do not overwrite existing files
      });

    if (error) {
      console.error("Error uploading to Supabase Storage:", error);
      throw new Error(`Supabase Storage upload error: ${error.message}`);
    }

    // After uploading, get the public URL for the file
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    if (!publicUrlData || !publicUrlData.publicUrl) {
        throw new Error("Could not retrieve public URL for the uploaded file.");
    }

    return publicUrlData.publicUrl;

  } catch (err) {
    console.error(`Error in uploadFile service:`, err);
    throw err; // Re-throw the error to be handled by the caller
  }
}; 