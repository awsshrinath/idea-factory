// Database Types for Comprehensive Schema

// ==========================================
// USER MANAGEMENT TYPES
// ==========================================

export interface UserProfile {
  id: string;
  user_id: string;
  username?: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  website?: string;
  location?: string;
  timezone: string;
  preferences: Record<string, any>;
  subscription_tier: 'free' | 'pro' | 'enterprise';
  subscription_expires_at?: Date;
  usage_limits: {
    content_per_month: number;
    ai_generations: number;
  };
  last_active_at: Date;
  created_at: Date;
  updated_at: Date;
}

export interface UserSession {
  id: string;
  user_id: string;
  session_token: string;
  ip_address?: string;
  user_agent?: string;
  device_info?: Record<string, any>;
  started_at: Date;
  last_activity_at: Date;
  expires_at: Date;
  is_active: boolean;
}

// ==========================================
// SOCIAL MEDIA TYPES
// ==========================================

export type SocialPlatform = 'instagram' | 'twitter' | 'facebook' | 'linkedin' | 'youtube' | 'tiktok';

export interface SocialAccount {
  id: string;
  user_id: string;
  platform: SocialPlatform;
  account_id: string;
  username?: string;
  display_name?: string;
  profile_picture_url?: string;
  access_token?: string;
  refresh_token?: string;
  token_expires_at?: Date;
  account_metadata: Record<string, any>;
  is_active: boolean;
  connected_at: Date;
  last_synced_at: Date;
  created_at: Date;
  updated_at: Date;
}

export type PostType = 'post' | 'story' | 'reel' | 'video' | 'carousel';
export type PostStatus = 'scheduled' | 'published' | 'failed' | 'deleted';

export interface SocialPost {
  id: string;
  content_id?: string;
  social_account_id: string;
  platform_post_id?: string;
  post_url?: string;
  caption?: string;
  media_urls: string[];
  hashtags: string[];
  mentions: string[];
  post_type: PostType;
  status: PostStatus;
  published_at?: Date;
  platform_metrics: Record<string, any>;
  error_message?: string;
  created_at: Date;
  updated_at: Date;
}

// ==========================================
// AI & RAG TYPES
// ==========================================

export type DocumentType = 'text' | 'pdf' | 'web' | 'api' | 'csv' | 'json';
export type DocumentStatus = 'active' | 'archived' | 'deleted';

export interface KnowledgeDocument {
  id: string;
  user_id?: string;
  title: string;
  content: string;
  document_type: DocumentType;
  source_url?: string;
  source_metadata: Record<string, any>;
  embedding?: number[]; // Vector embedding
  embedding_model: string;
  chunk_index: number;
  total_chunks: number;
  tags: string[];
  is_public: boolean;
  status: DocumentStatus;
  created_at: Date;
  updated_at: Date;
}

export interface CharacterProfile {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  personality: string;
  tone: string;
  vocabulary: string[];
  background: string;
  writing_style: string;
  example_responses: string[];
  consistency_score: number;
  usage_count: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CharacterInteraction {
  id: string;
  character_id: string;
  user_id: string;
  prompt: string;
  response: string;
  consistency_score: number;
  feedback?: string;
  interaction_metadata: Record<string, any>;
  created_at: Date;
}

// ==========================================
// CONTENT MANAGEMENT TYPES
// ==========================================

export type JobType = 'text' | 'image' | 'video' | 'audio' | 'batch';
export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

export interface ContentGenerationJob {
  id: string;
  user_id: string;
  job_type: JobType;
  status: JobStatus;
  input_data: Record<string, any>;
  output_data?: Record<string, any>;
  ai_model?: string;
  character_id?: string;
  progress: number;
  error_message?: string;
  processing_time_ms?: number;
  cost_cents: number;
  started_at?: Date;
  completed_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export type MediaType = 'image' | 'video' | 'audio' | 'document';

export interface ContentMedia {
  id: string;
  content_id?: string;
  user_id: string;
  file_name: string;
  file_type: string;
  file_size?: number;
  file_url: string;
  storage_path?: string;
  media_type?: MediaType;
  dimensions?: { width: number; height: number };
  duration_seconds?: number;
  alt_text?: string;
  caption?: string;
  metadata: Record<string, any>;
  is_primary: boolean;
  created_at: Date;
}

// ==========================================
// ANALYTICS TYPES
// ==========================================

export interface UserActivityLog {
  id: string;
  user_id?: string;
  session_id?: string;
  action: string;
  resource_type?: string;
  resource_id?: string;
  details: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: Date;
}

export interface PlatformAnalytics {
  id: string;
  user_id: string;
  date: Date;
  platform: string;
  metrics: Record<string, any>;
  total_posts: number;
  total_engagement: number;
  reach: number;
  impressions: number;
  created_at: Date;
}

export interface APIUsage {
  id: string;
  user_id?: string;
  endpoint: string;
  method: string;
  status_code: number;
  response_time_ms?: number;
  request_size_bytes?: number;
  response_size_bytes?: number;
  ip_address?: string;
  user_agent?: string;
  error_message?: string;
  created_at: Date;
}

// ==========================================
// AUTOMATION TYPES
// ==========================================

export type TriggerType = 'schedule' | 'webhook' | 'event' | 'manual';
export type ActionType = 'post_content' | 'generate_content' | 'send_notification' | 'update_data';

export interface AutomationRule {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  trigger_type: TriggerType;
  trigger_config: Record<string, any>;
  action_type: ActionType;
  action_config: Record<string, any>;
  conditions: Record<string, any>;
  is_active: boolean;
  last_executed_at?: Date;
  execution_count: number;
  created_at: Date;
  updated_at: Date;
}

export type TaskStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

export interface ScheduledTask {
  id: string;
  user_id?: string;
  task_type: string;
  task_data: Record<string, any>;
  scheduled_for: Date;
  status: TaskStatus;
  attempts: number;
  max_attempts: number;
  error_message?: string;
  result_data?: Record<string, any>;
  processed_at?: Date;
  created_at: Date;
}

// ==========================================
// NOTIFICATION TYPES
// ==========================================

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'reminder';

export interface UserNotification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  action_url?: string;
  action_label?: string;
  metadata: Record<string, any>;
  is_read: boolean;
  expires_at?: Date;
  created_at: Date;
}

export interface SystemSetting {
  id: string;
  key: string;
  value: Record<string, any>;
  description?: string;
  is_public: boolean;
  updated_by?: string;
  created_at: Date;
  updated_at: Date;
}

// ==========================================
// VIEW TYPES (Read-only)
// ==========================================

export interface UserDashboardStats {
  user_id: string;
  display_name?: string;
  subscription_tier: string;
  total_content: number;
  connected_accounts: number;
  character_profiles: number;
  completed_jobs: number;
  knowledge_documents: number;
  total_views: number;
  total_engagement: number;
}

export interface ContentPerformance {
  id: string;
  user_id: string;
  title: string;
  content: string;
  platform: string;
  status: string;
  views?: number;
  likes?: number;
  shares?: number;
  comments?: number;
  engagement_rate?: number;
  social_posts_count: number;
  published_platforms: string[];
  created_at: Date;
}

// ==========================================
// API RESPONSE TYPES
// ==========================================

export interface DatabaseSetupResult {
  success: boolean;
  tablesCreated: string[];
  errors: string[];
  warnings: string[];
}

export interface DatabaseStatus {
  comprehensive: {
    isComplete: boolean;
    tablesExisting: number;
    tablesMissing: number;
    existingTables: string[];
    missingTables: string[];
    summary: Record<string, number>;
  };
  contentManagement: {
    isComplete: boolean;
    tablesExisting: number;
    tablesMissing: number;
    existingTables: string[];
    missingTables: string[];
  };
  overall: {
    isHealthy: boolean;
    totalTables: number;
    totalMissing: number;
  };
}

export interface MigrationStatus {
  pending: Array<{
    table: string;
    description: string;
    required: boolean;
  }>;
  completed: Array<{
    table: string;
    description: string;
    completedAt: string;
  }>;
  summary: {
    total: number;
    completed: number;
    pending: number;
    completionPercentage: number;
  };
}

// ==========================================
// DATABASE CONFIGURATION
// ==========================================

export interface SchemaSetupConfig {
  enableRLS: boolean;
  createSampleData: boolean;
  enableTriggers: boolean;
  enableViews: boolean;
}