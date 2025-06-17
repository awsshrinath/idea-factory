/**
 * Checks if the content is appropriate.
 * @param content The content to check.
 * @returns True if the content is appropriate, false otherwise.
 */
export const isAppropriate = (content: string): boolean => {
  // Placeholder: a real implementation would check against a list of banned words or use an AI classifier.
  const inappropriateWords = ['badword1', 'badword2'];
  const hasInappropriateWord = inappropriateWords.some(word => content.toLowerCase().includes(word));
  return !hasInappropriateWord;
}; 