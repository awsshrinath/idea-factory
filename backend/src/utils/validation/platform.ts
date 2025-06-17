import { Platform } from '../../types';

/**
 * Validates content against platform-specific rules.
 * @param content The content to validate.
 * @param platform The platform to validate against.
 * @returns True if the content is valid for the platform, false otherwise.
 */
export const validateForPlatform = (content: string, platform: Platform): boolean => {
  const length = content.length;
  switch (platform) {
    case Platform.Twitter:
      return length <= 280;
    case Platform.Instagram:
      return length <= 2200;
    // Add other platforms here
    default:
      return true;
  }
}; 