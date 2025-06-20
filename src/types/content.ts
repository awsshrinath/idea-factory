export type Platform = "linkedin" | "twitter" | "facebook" | "instagram" | "youtube";
export type Tone = "professional" | "friendly" | "casual" | "creative";
export type AIModel = "chatgpt" | "deepseek";
export type Language = "English" | "Spanish" | "French" | "German" | "Chinese";

export interface ContentFormData {
  description: string;
  platforms: Platform[];
  tone: Tone;
  aiModel: AIModel;
  language: Language;
}

export interface GeneratedContent {
  id: string;
  description: string;
  platform: Platform[];
  tone: Tone;
  language: Language;
  ai_model: AIModel;
  generated_text: string | null;
  version: number;
  created_at: string;
  updated_at: string;
}