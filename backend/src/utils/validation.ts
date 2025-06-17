import { assessQuality } from './validation/quality';
import { isAppropriate } from './validation/appropriateness';
import { validateForPlatform } from './validation/platform';
import { isDuplicate } from './validation/duplicate';
import { Platform } from '../types';

interface ValidationOptions {
  platform?: Platform;
  existingContent?: string[];
}

/**
 * Validates the generated content based on a set of rules.
 * @param content The content to validate.
 * @param options Validation options.
 * @returns True if the content is valid, false otherwise.
 */
export const validateContent = (content: string, options: ValidationOptions = {}): boolean => {
  if (!content || content.trim().length === 0) {
    return false;
  }

  if (assessQuality(content) < 0.5) {
    console.log('Validation failed: Low quality');
    return false;
  }

  if (!isAppropriate(content)) {
    console.log('Validation failed: Inappropriate content');
    return false;
  }

  if (options.platform && !validateForPlatform(content, options.platform)) {
    console.log(`Validation failed: Does not meet ${options.platform} requirements`);
    return false;
  }

  if (options.existingContent && isDuplicate(content, options.existingContent)) {
    console.log('Validation failed: Duplicate content');
    return false;
  }

  return true;
}; 