/**
 * Checks if the content is a duplicate.
 * @param content The content to check.
 * @param existingContent A list of existing content to check against.
 * @returns True if the content is a duplicate, false otherwise.
 */
export const isDuplicate = (content: string, existingContent: string[]): boolean => {
  // Placeholder: a real implementation would use a more sophisticated check, like hashing.
  return existingContent.includes(content);
}; 