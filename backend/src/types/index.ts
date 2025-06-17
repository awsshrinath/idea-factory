export enum Platform {
    Instagram = 'instagram',
    YouTube = 'youtube',
    Twitter = 'twitter',
    LinkedIn = 'linkedin',
    TikTok = 'tiktok',
}

export interface GenerationOptions {
    // Define properties for text generation
}

export interface GeneratedText {
    // Define properties for generated text
}

export interface ImageStyle {
    // Define properties for image style
}

export interface GeneratedImage {
    // Define properties for generated image
}

export interface VideoOptions {
    // Define properties for video options
}

export interface GeneratedVideo {
    // Define properties for generated video
}

export interface Content {
    // Define properties for content
}

export interface ValidationResult {
    // Define properties for validation result
}

export interface ContentGenerationService {
  generateText(prompt: string, options: GenerationOptions): Promise<GeneratedText>;
  generateImage(prompt: string, style: ImageStyle): Promise<GeneratedImage>;
  generateVideo(imageUrl: string, options: VideoOptions): Promise<GeneratedVideo>;
  validateContent(content: Content): Promise<ValidationResult>;
}

export interface PlatformCredentials {
    // ...
}

export interface AuthResult {
    // ...
}

export interface PublishResult {
    // ...
}

export interface ScheduleResult {
    // ...
}

export interface AnalyticsData {
    // ...
}

export interface SocialMediaPlatform {
  platform: Platform;
  authenticate(credentials: PlatformCredentials): Promise<AuthResult>;
  publishContent(content: Content): Promise<PublishResult>;
  scheduleContent(content: Content, scheduleTime: Date): Promise<ScheduleResult>;
  getAnalytics(contentId: string): Promise<AnalyticsData>;
}

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
    timestamp: string;
    requestId: string;
  };
} 