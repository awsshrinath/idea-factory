import { ExtendedCharacterProfile, CharacterInteraction } from './character-profile';
import { generateEmbeddings, calculateCosineSimilarity } from './ai';
import { getCharacterProfile, getCharacterHistory } from './character-profile';

// Character consistency metrics
export interface ConsistencyMetrics {
  overallScore: number;
  toneConsistency: number;
  vocabularyConsistency: number;
  styleConsistency: number;
  personalityConsistency: number;
  improvementSuggestions: string[];
}

// Response pattern analysis
export interface ResponsePattern {
  pattern: string;
  frequency: number;
  examples: string[];
  consistency_score: number;
}

// Character learning data
export interface CharacterLearningData {
  characterId: string;
  patterns: ResponsePattern[];
  commonPhrases: string[];
  toneMarkers: string[];
  vocabularyUsage: { [word: string]: number };
  consistencyTrend: number[];
}

class CharacterConsistencyEngine {
  // Advanced consistency scoring using multiple factors
  async calculateAdvancedConsistency(
    characterId: string,
    responseText: string,
    previousInteractions: CharacterInteraction[] = []
  ): Promise<ConsistencyMetrics> {
    const character = await getCharacterProfile(characterId);
    if (!character) {
      throw new Error('Character not found');
    }

    const metrics: ConsistencyMetrics = {
      overallScore: 0,
      toneConsistency: 0,
      vocabularyConsistency: 0,
      styleConsistency: 0,
      personalityConsistency: 0,
      improvementSuggestions: [],
    };

    // 1. Tone Consistency Analysis
    metrics.toneConsistency = this.analyzeToneConsistency(character, responseText);

    // 2. Vocabulary Consistency Analysis
    metrics.vocabularyConsistency = this.analyzeVocabularyConsistency(character, responseText);

    // 3. Style Consistency Analysis
    metrics.styleConsistency = await this.analyzeStyleConsistency(character, responseText, previousInteractions);

    // 4. Personality Consistency Analysis
    metrics.personalityConsistency = this.analyzePersonalityConsistency(character, responseText);

    // Calculate overall score
    metrics.overallScore = (
      metrics.toneConsistency * 0.25 +
      metrics.vocabularyConsistency * 0.20 +
      metrics.styleConsistency * 0.30 +
      metrics.personalityConsistency * 0.25
    );

    // Generate improvement suggestions
    metrics.improvementSuggestions = this.generateImprovementSuggestions(metrics, character);

    return metrics;
  }

  // Tone consistency analysis
  private analyzeToneConsistency(character: ExtendedCharacterProfile, responseText: string): number {
    const toneIndicators = {
      formal: {
        positive: ['therefore', 'however', 'furthermore', 'consequently', 'moreover', 'nevertheless'],
        negative: ['yeah', 'nah', 'cool', 'awesome', 'dude', 'gonna']
      },
      casual: {
        positive: ['yeah', 'cool', 'awesome', 'hey', 'sup', 'gonna', 'wanna'],
        negative: ['therefore', 'consequently', 'furthermore', 'henceforth']
      },
      friendly: {
        positive: ['great', 'wonderful', 'excited', 'love', 'amazing', 'fantastic', 'thanks'],
        negative: ['unfortunately', 'regrettably', 'disappointing']
      },
      professional: {
        positive: ['please', 'thank you', 'regarding', 'sincerely', 'appreciate', 'consider'],
        negative: ['whatever', 'dunno', 'meh', 'nah']
      }
    };

    const targetTone = character.tone.toLowerCase();
    const indicators = toneIndicators[targetTone as keyof typeof toneIndicators];
    
    if (!indicators) return 0.7; // Default score for unknown tones

    const text = responseText.toLowerCase();
    let positiveMatches = 0;
    let negativeMatches = 0;

    indicators.positive.forEach(word => {
      if (text.includes(word)) positiveMatches++;
    });

    indicators.negative.forEach(word => {
      if (text.includes(word)) negativeMatches++;
    });

    // Calculate tone consistency score
    const totalMatches = positiveMatches + negativeMatches;
    if (totalMatches === 0) return 0.8; // Neutral score for no matches

    return Math.max(0, (positiveMatches - negativeMatches * 2) / totalMatches);
  }

  // Vocabulary consistency analysis
  private analyzeVocabularyConsistency(character: ExtendedCharacterProfile, responseText: string): number {
    if (character.vocabulary.length === 0) return 0.8; // Default score if no vocabulary defined

    const text = responseText.toLowerCase();
    const usedVocabulary = character.vocabulary.filter(word => 
      text.includes(word.toLowerCase())
    );

    const consistencyScore = usedVocabulary.length / Math.min(character.vocabulary.length, 10);
    return Math.min(consistencyScore + 0.5, 1.0); // Add base score
  }

  // Style consistency analysis using embeddings
  private async analyzeStyleConsistency(
    character: ExtendedCharacterProfile,
    responseText: string,
    previousInteractions: CharacterInteraction[]
  ): Promise<number> {
    if (previousInteractions.length === 0) return 0.8; // Default for new characters

    try {
      const responseEmbedding = await generateEmbeddings(responseText);
      if (!responseEmbedding) return 0.5;

      // Compare with recent character responses
      const recentResponses = previousInteractions
        .slice(0, 5)
        .map(interaction => interaction.response);

      const similarities: number[] = [];
      
      for (const response of recentResponses) {
        const embedding = await generateEmbeddings(response);
        if (embedding) {
          const similarity = calculateCosineSimilarity(responseEmbedding, embedding);
          similarities.push(similarity);
        }
      }

      if (similarities.length === 0) return 0.5;

      // Average similarity score
      const avgSimilarity = similarities.reduce((sum, sim) => sum + sim, 0) / similarities.length;
      return Math.max(0.3, avgSimilarity); // Minimum threshold
    } catch (error) {
      console.error('Style consistency analysis error:', error);
      return 0.5;
    }
  }

  // Personality consistency analysis
  private analyzePersonalityConsistency(character: ExtendedCharacterProfile, responseText: string): number {
    const personalityTraits = {
      outgoing: ['excited', 'love', 'amazing', 'share', 'tell', 'show'],
      introverted: ['think', 'consider', 'reflect', 'perhaps', 'might'],
      analytical: ['because', 'analyze', 'data', 'evidence', 'logic', 'reason'],
      creative: ['imagine', 'create', 'inspire', 'dream', 'artistic', 'unique'],
      empathetic: ['understand', 'feel', 'compassion', 'care', 'support', 'help'],
      confident: ['definitely', 'certainly', 'absolutely', 'sure', 'confident'],
      humble: ['maybe', 'possibly', 'try', 'attempt', 'hope', 'think']
    };

    const personality = character.personality.toLowerCase();
    const text = responseText.toLowerCase();
    
    let matchScore = 0;
    let totalPossible = 0;

    // Check for personality trait matches
    Object.entries(personalityTraits).forEach(([trait, words]) => {
      if (personality.includes(trait)) {
        totalPossible += words.length;
        words.forEach(word => {
          if (text.includes(word)) matchScore += 1;
        });
      }
    });

    if (totalPossible === 0) return 0.8; // Default for unrecognized personality

    return Math.min((matchScore / totalPossible) + 0.6, 1.0);
  }

  // Generate improvement suggestions
  private generateImprovementSuggestions(
    metrics: ConsistencyMetrics,
    character: ExtendedCharacterProfile
  ): string[] {
    const suggestions: string[] = [];

    if (metrics.toneConsistency < 0.7) {
      suggestions.push(`Improve tone consistency by using more ${character.tone} language patterns`);
    }

    if (metrics.vocabularyConsistency < 0.6) {
      suggestions.push(`Incorporate more character-specific vocabulary: ${character.vocabulary.slice(0, 3).join(', ')}`);
    }

    if (metrics.styleConsistency < 0.6) {
      suggestions.push('Maintain consistent writing style and sentence structure');
    }

    if (metrics.personalityConsistency < 0.7) {
      suggestions.push(`Better reflect the ${character.personality} personality traits in responses`);
    }

    if (metrics.overallScore < 0.7) {
      suggestions.push('Consider reviewing character profile and previous interactions for consistency patterns');
    }

    return suggestions;
  }

  // Learn from character interactions
  async analyzeCharacterPatterns(characterId: string): Promise<CharacterLearningData> {
    const character = await getCharacterProfile(characterId);
    const interactions = await getCharacterHistory(characterId, 50);

    if (!character || interactions.length === 0) {
      throw new Error('Insufficient data for pattern analysis');
    }

    const learningData: CharacterLearningData = {
      characterId,
      patterns: [],
      commonPhrases: [],
      toneMarkers: [],
      vocabularyUsage: {},
      consistencyTrend: [],
    };

    // Analyze response patterns
    learningData.patterns = this.extractResponsePatterns(interactions);
    
    // Extract common phrases
    learningData.commonPhrases = this.extractCommonPhrases(interactions);
    
    // Identify tone markers
    learningData.toneMarkers = this.extractToneMarkers(interactions, character.tone);
    
    // Analyze vocabulary usage
    learningData.vocabularyUsage = this.analyzeVocabularyUsage(interactions, character.vocabulary);
    
    // Calculate consistency trend
    learningData.consistencyTrend = this.calculateConsistencyTrend(interactions);

    return learningData;
  }

  private extractResponsePatterns(interactions: CharacterInteraction[]): ResponsePattern[] {
    const patterns: { [key: string]: ResponsePattern } = {};
    
    interactions.forEach(interaction => {
      const sentences = interaction.response.split(/[.!?]+/).filter(s => s.trim().length > 0);
      
      sentences.forEach(sentence => {
        const normalized = sentence.trim().toLowerCase();
        const pattern = this.normalizePattern(normalized);
        
        if (pattern && pattern.length > 10) {
          if (!patterns[pattern]) {
            patterns[pattern] = {
              pattern,
              frequency: 0,
              examples: [],
              consistency_score: 0
            };
          }
          patterns[pattern].frequency++;
          if (patterns[pattern].examples.length < 3) {
            patterns[pattern].examples.push(sentence.trim());
          }
        }
      });
    });

    return Object.values(patterns)
      .filter(p => p.frequency > 1)
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10);
  }

  private normalizePattern(text: string): string {
    // Replace specific words with placeholders to identify patterns
    return text
      .replace(/\b\d+\b/g, '[NUMBER]')
      .replace(/\b[a-z]+ing\b/g, '[VERB-ING]')
      .replace(/\b[a-z]+ed\b/g, '[VERB-ED]')
      .trim();
  }

  private extractCommonPhrases(interactions: CharacterInteraction[]): string[] {
    const phrases: { [key: string]: number } = {};
    
    interactions.forEach(interaction => {
      const words = interaction.response.toLowerCase().split(/\s+/);
      
      // Extract 2-4 word phrases
      for (let i = 0; i < words.length - 1; i++) {
        for (let len = 2; len <= 4 && i + len <= words.length; len++) {
          const phrase = words.slice(i, i + len).join(' ');
          if (phrase.length > 5) {
            phrases[phrase] = (phrases[phrase] || 0) + 1;
          }
        }
      }
    });

    return Object.entries(phrases)
      .filter(([phrase, count]) => count > 1)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([phrase]) => phrase);
  }

  private extractToneMarkers(interactions: CharacterInteraction[], targetTone: string): string[] {
    const toneWords: string[] = [];
    const tonePatterns = {
      formal: /\b(therefore|however|furthermore|consequently|moreover)\b/gi,
      casual: /\b(yeah|cool|awesome|hey|gonna|wanna)\b/gi,
      friendly: /\b(great|wonderful|excited|love|amazing|thanks)\b/gi,
      professional: /\b(please|thank\s+you|regarding|sincerely|appreciate)\b/gi
    };

    const pattern = tonePatterns[targetTone.toLowerCase() as keyof typeof tonePatterns];
    if (!pattern) return [];

    interactions.forEach(interaction => {
      const matches = interaction.response.match(pattern);
      if (matches) {
        toneWords.push(...matches);
      }
    });

    return [...new Set(toneWords)].slice(0, 10);
  }

  private analyzeVocabularyUsage(interactions: CharacterInteraction[], vocabulary: string[]): { [word: string]: number } {
    const usage: { [word: string]: number } = {};
    
    vocabulary.forEach(word => {
      usage[word] = 0;
      interactions.forEach(interaction => {
        if (interaction.response.toLowerCase().includes(word.toLowerCase())) {
          usage[word]++;
        }
      });
    });

    return usage;
  }

  private calculateConsistencyTrend(interactions: CharacterInteraction[]): number[] {
    return interactions
      .slice(0, 20)
      .map(interaction => interaction.consistency_score)
      .reverse();
  }
}

// Singleton consistency engine
const consistencyEngine = new CharacterConsistencyEngine();

// Public API functions
export const calculateCharacterConsistency = async (
  characterId: string,
  responseText: string
): Promise<ConsistencyMetrics> => {
  const previousInteractions = await getCharacterHistory(characterId, 10);
  return consistencyEngine.calculateAdvancedConsistency(characterId, responseText, previousInteractions);
};

export const getCharacterPatterns = async (characterId: string): Promise<CharacterLearningData> => {
  return consistencyEngine.analyzeCharacterPatterns(characterId);
};

export const validateCharacterResponse = async (
  characterId: string,
  responseText: string,
  minConsistencyScore: number = 0.7
): Promise<{
  isValid: boolean;
  metrics: ConsistencyMetrics;
  suggestions: string[];
}> => {
  const metrics = await calculateCharacterConsistency(characterId, responseText);
  
  return {
    isValid: metrics.overallScore >= minConsistencyScore,
    metrics,
    suggestions: metrics.improvementSuggestions
  };
};

export const improveCharacterConsistency = async (
  characterId: string,
  responseText: string
): Promise<{
  originalScore: number;
  improvedResponse: string;
  newScore: number;
  improvements: string[];
}> => {
  const originalMetrics = await calculateCharacterConsistency(characterId, responseText);
  const character = await getCharacterProfile(characterId);
  
  if (!character) {
    throw new Error('Character not found');
  }

  // Simple improvement suggestions (would use ML model in production)
  let improvedResponse = responseText;
  const improvements: string[] = [];

  // Add character-specific vocabulary
  if (originalMetrics.vocabularyConsistency < 0.7 && character.vocabulary.length > 0) {
    const randomVocab = character.vocabulary[Math.floor(Math.random() * character.vocabulary.length)];
    improvedResponse = `${improvedResponse} ${randomVocab}`;
    improvements.push(`Added character vocabulary: ${randomVocab}`);
  }

  // Improve tone
  if (originalMetrics.toneConsistency < 0.7) {
    const toneAdjustments = {
      formal: ' I believe this approach would be most appropriate.',
      casual: ' That sounds pretty cool to me!',
      friendly: ' I\'m excited to help with this!',
      professional: ' Please let me know if you need any assistance.'
    };
    
    const adjustment = toneAdjustments[character.tone.toLowerCase() as keyof typeof toneAdjustments];
    if (adjustment) {
      improvedResponse += adjustment;
      improvements.push(`Adjusted tone to be more ${character.tone}`);
    }
  }

  const newMetrics = await calculateCharacterConsistency(characterId, improvedResponse);

  return {
    originalScore: originalMetrics.overallScore,
    improvedResponse,
    newScore: newMetrics.overallScore,
    improvements
  };
};