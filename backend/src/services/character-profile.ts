import { CharacterProfile } from './ai';
import { generateEmbeddings } from './ai';

// Extended character profile with consistency tracking
export interface ExtendedCharacterProfile extends CharacterProfile {
  examples: string[];
  dislikes: string[];
  conversationStyle: string;
  knowledgeAreas: string[];
  responsePatterns: string[];
  consistency_score: number;
  usage_count: number;
  created_at: Date;
  updated_at: Date;
}

// Character interaction tracking
export interface CharacterInteraction {
  id: string;
  characterId: string;
  prompt: string;
  response: string;
  consistency_score: number;
  feedback: string | null;
  timestamp: Date;
}

// In-memory character store (would be replaced with database in production)
class CharacterProfileStore {
  private profiles: Map<string, ExtendedCharacterProfile> = new Map();
  private interactions: Map<string, CharacterInteraction[]> = new Map();

  // Character profile management
  async createCharacter(profile: Omit<CharacterProfile, 'id'>): Promise<string> {
    const id = `char_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const extendedProfile: ExtendedCharacterProfile = {
      ...profile,
      id,
      examples: [],
      dislikes: [],
      conversationStyle: 'adaptive',
      knowledgeAreas: [],
      responsePatterns: [],
      consistency_score: 0,
      usage_count: 0,
      created_at: new Date(),
      updated_at: new Date(),
    };

    this.profiles.set(id, extendedProfile);
    this.interactions.set(id, []);
    
    return id;
  }

  async getCharacter(id: string): Promise<ExtendedCharacterProfile | null> {
    return this.profiles.get(id) || null;
  }

  async updateCharacter(id: string, updates: Partial<ExtendedCharacterProfile>): Promise<boolean> {
    const existing = this.profiles.get(id);
    if (!existing) return false;

    const updated = {
      ...existing,
      ...updates,
      id, // Ensure ID doesn't change
      updated_at: new Date(),
    };

    this.profiles.set(id, updated);
    return true;
  }

  async deleteCharacter(id: string): Promise<boolean> {
    const deleted = this.profiles.delete(id);
    if (deleted) {
      this.interactions.delete(id);
    }
    return deleted;
  }

  async getAllCharacters(): Promise<ExtendedCharacterProfile[]> {
    return Array.from(this.profiles.values());
  }

  // Character interaction tracking
  async recordInteraction(
    characterId: string,
    prompt: string,
    response: string,
    consistency_score: number = 0.8
  ): Promise<string> {
    const interactionId = `int_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const interaction: CharacterInteraction = {
      id: interactionId,
      characterId,
      prompt,
      response,
      consistency_score,
      feedback: null,
      timestamp: new Date(),
    };

    const interactions = this.interactions.get(characterId) || [];
    interactions.push(interaction);
    this.interactions.set(characterId, interactions);

    // Update character usage count and consistency score
    const character = this.profiles.get(characterId);
    if (character) {
      character.usage_count += 1;
      // Running average of consistency scores
      character.consistency_score = 
        (character.consistency_score * (character.usage_count - 1) + consistency_score) / character.usage_count;
      character.updated_at = new Date();
      this.profiles.set(characterId, character);
    }

    return interactionId;
  }

  async getCharacterInteractions(characterId: string, limit: number = 10): Promise<CharacterInteraction[]> {
    const interactions = this.interactions.get(characterId) || [];
    return interactions
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }
}

// Singleton character store
const characterStore = new CharacterProfileStore();

// Public API functions
export const createCharacterProfile = async (
  name: string,
  personality: string,
  tone: string,
  background: string,
  writingStyle: string,
  vocabulary: string[] = []
): Promise<string> => {
  return characterStore.createCharacter({
    name,
    personality,
    tone,
    vocabulary,
    background,
    writingStyle,
  });
};

export const getCharacterProfile = async (id: string): Promise<ExtendedCharacterProfile | null> => {
  return characterStore.getCharacter(id);
};

export const updateCharacterProfile = async (
  id: string,
  updates: Partial<ExtendedCharacterProfile>
): Promise<boolean> => {
  return characterStore.updateCharacter(id, updates);
};

export const deleteCharacterProfile = async (id: string): Promise<boolean> => {
  return characterStore.deleteCharacter(id);
};

export const getAllCharacterProfiles = async (): Promise<ExtendedCharacterProfile[]> => {
  return characterStore.getAllCharacters();
};

// Character consistency functions
export const buildCharacterPrompt = async (
  characterId: string,
  basePrompt: string
): Promise<string> => {
  const character = await characterStore.getCharacter(characterId);
  if (!character) {
    return basePrompt;
  }

  const characterContext = `
You are ${character.name}.

Personality: ${character.personality}
Tone: ${character.tone}
Background: ${character.background}
Writing Style: ${character.writingStyle}

${character.vocabulary.length > 0 ? `Preferred vocabulary: ${character.vocabulary.join(', ')}` : ''}
${character.examples.length > 0 ? `Examples of your responses:\n${character.examples.join('\n')}` : ''}

Please respond to the following while maintaining complete consistency with your character:

${basePrompt}`;

  return characterContext;
};

export const recordCharacterInteraction = async (
  characterId: string,
  prompt: string,
  response: string,
  feedback?: string
): Promise<string | null> => {
  const character = await characterStore.getCharacter(characterId);
  if (!character) {
    return null;
  }

  // Calculate consistency score (simplified - would use ML model in production)
  const consistency_score = await calculateConsistencyScore(characterId, response);
  
  return characterStore.recordInteraction(characterId, prompt, response, consistency_score);
};

export const getCharacterHistory = async (
  characterId: string,
  limit: number = 10
): Promise<CharacterInteraction[]> => {
  return characterStore.getCharacterInteractions(characterId, limit);
};

export const getCharacterStats = async (characterId: string): Promise<{
  character: ExtendedCharacterProfile | null;
  recentInteractions: CharacterInteraction[];
  totalInteractions: number;
}> => {
  const character = await characterStore.getCharacter(characterId);
  const interactions = await characterStore.getCharacterInteractions(characterId, 5);
  const allInteractions = await characterStore.getCharacterInteractions(characterId, 1000);

  return {
    character,
    recentInteractions: interactions,
    totalInteractions: allInteractions.length,
  };
};

// Character consistency scoring (simplified implementation)
const calculateConsistencyScore = async (
  characterId: string,
  response: string
): Promise<number> => {
  const character = await characterStore.getCharacter(characterId);
  if (!character) return 0.5;

  // Simple heuristic-based consistency scoring
  let score = 0.8; // Base score

  // Check vocabulary usage
  if (character.vocabulary.length > 0) {
    const usedVocab = character.vocabulary.filter(word => 
      response.toLowerCase().includes(word.toLowerCase())
    ).length;
    score += (usedVocab / character.vocabulary.length) * 0.1;
  }

  // Check tone consistency (very simplified)
  const toneWords = {
    formal: ['therefore', 'however', 'furthermore', 'consequently'],
    casual: ['hey', 'yeah', 'cool', 'awesome'],
    friendly: ['great', 'wonderful', 'excited', 'love'],
    professional: ['please', 'thank you', 'regarding', 'sincerely']
  };

  const relevantWords = toneWords[character.tone as keyof typeof toneWords] || [];
  if (relevantWords.length > 0) {
    const toneMatches = relevantWords.filter(word => 
      response.toLowerCase().includes(word.toLowerCase())
    ).length;
    score += (toneMatches / relevantWords.length) * 0.1;
  }

  return Math.min(score, 1.0);
};

// Learning and improvement functions
export const improveCharacterFromFeedback = async (
  characterId: string,
  interactionId: string,
  feedback: string,
  isPositive: boolean
): Promise<boolean> => {
  const character = await characterStore.getCharacter(characterId);
  if (!character) return false;

  const interactions = await characterStore.getCharacterInteractions(characterId, 100);
  const interaction = interactions.find(i => i.id === interactionId);
  if (!interaction) return false;

  // Update interaction feedback
  interaction.feedback = feedback;

  if (isPositive) {
    // Add response as example
    if (!character.examples.includes(interaction.response)) {
      character.examples.push(interaction.response);
      // Keep only recent examples
      if (character.examples.length > 10) {
        character.examples = character.examples.slice(-10);
      }
    }
  }

  return characterStore.updateCharacter(characterId, character);
};