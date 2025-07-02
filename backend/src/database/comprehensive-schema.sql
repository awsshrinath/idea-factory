-- Comprehensive Database Schema for Idea Factory Backend
-- This schema includes all necessary tables for a complete content management and AI-powered platform

-- ==========================================
-- USER MANAGEMENT & PROFILES
-- ==========================================

-- User Profiles (Extended user information)
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE,
    display_name VARCHAR(100),
    bio TEXT,
    avatar_url TEXT,
    website VARCHAR(255),
    location VARCHAR(100),
    timezone VARCHAR(50) DEFAULT 'UTC',
    preferences JSONB DEFAULT '{}',
    subscription_tier VARCHAR(20) DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
    subscription_expires_at TIMESTAMPTZ,
    usage_limits JSONB DEFAULT '{"content_per_month": 50, "ai_generations": 100}',
    last_active_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- User Sessions (Track user activity)
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    device_info JSONB,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    last_activity_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- ==========================================
-- SOCIAL MEDIA INTEGRATIONS
-- ==========================================

-- Social Media Accounts (User connected accounts)
CREATE TABLE IF NOT EXISTS social_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL CHECK (platform IN ('instagram', 'twitter', 'facebook', 'linkedin', 'youtube', 'tiktok')),
    account_id VARCHAR(255) NOT NULL,
    username VARCHAR(100),
    display_name VARCHAR(255),
    profile_picture_url TEXT,
    access_token TEXT, -- Encrypted in production
    refresh_token TEXT, -- Encrypted in production
    token_expires_at TIMESTAMPTZ,
    account_metadata JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    connected_at TIMESTAMPTZ DEFAULT NOW(),
    last_synced_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, platform, account_id)
);

-- Social Media Posts (Track posted content)
CREATE TABLE IF NOT EXISTS social_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID REFERENCES content_items(id) ON DELETE SET NULL,
    social_account_id UUID NOT NULL REFERENCES social_accounts(id) ON DELETE CASCADE,
    platform_post_id VARCHAR(255),
    post_url TEXT,
    caption TEXT,
    media_urls TEXT[],
    hashtags TEXT[],
    mentions TEXT[],
    post_type VARCHAR(50) DEFAULT 'post' CHECK (post_type IN ('post', 'story', 'reel', 'video', 'carousel')),
    status VARCHAR(50) DEFAULT 'published' CHECK (status IN ('scheduled', 'published', 'failed', 'deleted')),
    published_at TIMESTAMPTZ,
    platform_metrics JSONB DEFAULT '{}',
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- AI & RAG SYSTEM TABLES
-- ==========================================

-- Knowledge Base Documents
CREATE TABLE IF NOT EXISTS knowledge_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    document_type VARCHAR(50) DEFAULT 'text' CHECK (document_type IN ('text', 'pdf', 'web', 'api', 'csv', 'json')),
    source_url TEXT,
    source_metadata JSONB DEFAULT '{}',
    embedding VECTOR(1536), -- OpenAI embedding dimension
    embedding_model VARCHAR(50) DEFAULT 'text-embedding-3-small',
    chunk_index INTEGER DEFAULT 0,
    total_chunks INTEGER DEFAULT 1,
    tags TEXT[],
    is_public BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Character Profiles for Content Generation
CREATE TABLE IF NOT EXISTS character_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    personality TEXT NOT NULL,
    tone VARCHAR(50) NOT NULL,
    vocabulary TEXT[] DEFAULT '{}',
    background TEXT DEFAULT '',
    writing_style TEXT DEFAULT 'adaptive',
    example_responses TEXT[] DEFAULT '{}',
    consistency_score DECIMAL(3,2) DEFAULT 0.80,
    usage_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Character Interactions (Track AI character consistency)
CREATE TABLE IF NOT EXISTS character_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    character_id UUID NOT NULL REFERENCES character_profiles(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    prompt TEXT NOT NULL,
    response TEXT NOT NULL,
    consistency_score DECIMAL(3,2) DEFAULT 0.80,
    feedback TEXT,
    interaction_metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- CONTENT MANAGEMENT (Enhanced)
-- ==========================================

-- Content Generation Jobs
CREATE TABLE IF NOT EXISTS content_generation_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    job_type VARCHAR(50) NOT NULL CHECK (job_type IN ('text', 'image', 'video', 'audio', 'batch')),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
    input_data JSONB NOT NULL,
    output_data JSONB,
    ai_model VARCHAR(100),
    character_id UUID REFERENCES character_profiles(id),
    progress INTEGER DEFAULT 0,
    error_message TEXT,
    processing_time_ms INTEGER,
    cost_cents INTEGER DEFAULT 0,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content Media Files
CREATE TABLE IF NOT EXISTS content_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size INTEGER,
    file_url TEXT NOT NULL,
    storage_path TEXT,
    media_type VARCHAR(50) CHECK (media_type IN ('image', 'video', 'audio', 'document')),
    dimensions JSONB, -- {width: 1920, height: 1080}
    duration_seconds INTEGER,
    alt_text TEXT,
    caption TEXT,
    metadata JSONB DEFAULT '{}',
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- ANALYTICS & TRACKING
-- ==========================================

-- User Activity Logs
CREATE TABLE IF NOT EXISTS user_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id UUID REFERENCES user_sessions(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id UUID,
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Platform Analytics
CREATE TABLE IF NOT EXISTS platform_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    platform VARCHAR(50) NOT NULL,
    metrics JSONB NOT NULL DEFAULT '{}',
    total_posts INTEGER DEFAULT 0,
    total_engagement INTEGER DEFAULT 0,
    reach INTEGER DEFAULT 0,
    impressions INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, date, platform)
);

-- API Usage Tracking
CREATE TABLE IF NOT EXISTS api_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    status_code INTEGER NOT NULL,
    response_time_ms INTEGER,
    request_size_bytes INTEGER,
    response_size_bytes INTEGER,
    ip_address INET,
    user_agent TEXT,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- AUTOMATION & SCHEDULING
-- ==========================================

-- Automation Rules
CREATE TABLE IF NOT EXISTS automation_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    trigger_type VARCHAR(50) NOT NULL CHECK (trigger_type IN ('schedule', 'webhook', 'event', 'manual')),
    trigger_config JSONB NOT NULL DEFAULT '{}',
    action_type VARCHAR(50) NOT NULL CHECK (action_type IN ('post_content', 'generate_content', 'send_notification', 'update_data')),
    action_config JSONB NOT NULL DEFAULT '{}',
    conditions JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    last_executed_at TIMESTAMPTZ,
    execution_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scheduled Tasks
CREATE TABLE IF NOT EXISTS scheduled_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    task_type VARCHAR(50) NOT NULL,
    task_data JSONB NOT NULL DEFAULT '{}',
    scheduled_for TIMESTAMPTZ NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    error_message TEXT,
    result_data JSONB,
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- NOTIFICATIONS & MESSAGING
-- ==========================================

-- User Notifications
CREATE TABLE IF NOT EXISTS user_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error', 'reminder')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    action_url TEXT,
    action_label VARCHAR(100),
    metadata JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- System Settings
CREATE TABLE IF NOT EXISTS system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    updated_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- INDEXES FOR PERFORMANCE
-- ==========================================

-- User and Profile Indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);

-- Social Media Indexes
CREATE INDEX IF NOT EXISTS idx_social_accounts_user_id ON social_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_social_accounts_platform ON social_accounts(platform);
CREATE INDEX IF NOT EXISTS idx_social_posts_content_id ON social_posts(content_id);
CREATE INDEX IF NOT EXISTS idx_social_posts_account_id ON social_posts(social_account_id);

-- Knowledge and AI Indexes
CREATE INDEX IF NOT EXISTS idx_knowledge_documents_user_id ON knowledge_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_documents_tags ON knowledge_documents USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_character_profiles_user_id ON character_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_character_interactions_character_id ON character_interactions(character_id);

-- Content and Jobs Indexes
CREATE INDEX IF NOT EXISTS idx_content_generation_jobs_user_id ON content_generation_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_content_generation_jobs_status ON content_generation_jobs(status);
CREATE INDEX IF NOT EXISTS idx_content_media_content_id ON content_media(content_id);
CREATE INDEX IF NOT EXISTS idx_content_media_user_id ON content_media(user_id);

-- Analytics Indexes
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_user_id ON user_activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_created_at ON user_activity_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_platform_analytics_user_date ON platform_analytics(user_id, date);
CREATE INDEX IF NOT EXISTS idx_api_usage_user_id ON api_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_created_at ON api_usage(created_at);

-- Automation Indexes
CREATE INDEX IF NOT EXISTS idx_automation_rules_user_id ON automation_rules(user_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_tasks_scheduled_for ON scheduled_tasks(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_scheduled_tasks_status ON scheduled_tasks(status);

-- Notification Indexes
CREATE INDEX IF NOT EXISTS idx_user_notifications_user_id ON user_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notifications_is_read ON user_notifications(is_read);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_generation_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;

-- User Profiles RLS
CREATE POLICY "Users can manage their own profile" ON user_profiles
    FOR ALL USING (auth.uid() = user_id);

-- User Sessions RLS
CREATE POLICY "Users can view their own sessions" ON user_sessions
    FOR SELECT USING (auth.uid() = user_id);

-- Social Accounts RLS
CREATE POLICY "Users can manage their own social accounts" ON social_accounts
    FOR ALL USING (auth.uid() = user_id);

-- Social Posts RLS
CREATE POLICY "Users can manage posts from their accounts" ON social_posts
    FOR ALL USING (EXISTS (
        SELECT 1 FROM social_accounts 
        WHERE social_accounts.id = social_posts.social_account_id 
        AND social_accounts.user_id = auth.uid()
    ));

-- Knowledge Documents RLS
CREATE POLICY "Users can manage their own knowledge documents" ON knowledge_documents
    FOR ALL USING (auth.uid() = user_id OR is_public = TRUE);

-- Character Profiles RLS
CREATE POLICY "Users can manage their own character profiles" ON character_profiles
    FOR ALL USING (auth.uid() = user_id);

-- Character Interactions RLS
CREATE POLICY "Users can manage their own character interactions" ON character_interactions
    FOR ALL USING (auth.uid() = user_id);

-- Content Generation Jobs RLS
CREATE POLICY "Users can manage their own generation jobs" ON content_generation_jobs
    FOR ALL USING (auth.uid() = user_id);

-- Content Media RLS
CREATE POLICY "Users can manage their own content media" ON content_media
    FOR ALL USING (auth.uid() = user_id);

-- User Activity Logs RLS
CREATE POLICY "Users can view their own activity logs" ON user_activity_logs
    FOR SELECT USING (auth.uid() = user_id);

-- Platform Analytics RLS
CREATE POLICY "Users can view their own analytics" ON platform_analytics
    FOR ALL USING (auth.uid() = user_id);

-- API Usage RLS
CREATE POLICY "Users can view their own API usage" ON api_usage
    FOR SELECT USING (auth.uid() = user_id);

-- Automation Rules RLS
CREATE POLICY "Users can manage their own automation rules" ON automation_rules
    FOR ALL USING (auth.uid() = user_id);

-- Scheduled Tasks RLS
CREATE POLICY "Users can view their own scheduled tasks" ON scheduled_tasks
    FOR SELECT USING (auth.uid() = user_id);

-- User Notifications RLS
CREATE POLICY "Users can manage their own notifications" ON user_notifications
    FOR ALL USING (auth.uid() = user_id);

-- ==========================================
-- FUNCTIONS AND TRIGGERS
-- ==========================================

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at columns
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_accounts_updated_at 
    BEFORE UPDATE ON social_accounts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_posts_updated_at 
    BEFORE UPDATE ON social_posts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_knowledge_documents_updated_at 
    BEFORE UPDATE ON knowledge_documents 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_character_profiles_updated_at 
    BEFORE UPDATE ON character_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_generation_jobs_updated_at 
    BEFORE UPDATE ON content_generation_jobs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_automation_rules_updated_at 
    BEFORE UPDATE ON automation_rules 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Activity logging trigger function
CREATE OR REPLACE FUNCTION log_user_activity()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO user_activity_logs (user_id, action, resource_type, resource_id, details)
        VALUES (NEW.user_id, TG_OP, TG_TABLE_NAME, NEW.id, row_to_json(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO user_activity_logs (user_id, action, resource_type, resource_id, details)
        VALUES (NEW.user_id, TG_OP, TG_TABLE_NAME, NEW.id, jsonb_build_object('old', row_to_json(OLD), 'new', row_to_json(NEW)));
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO user_activity_logs (user_id, action, resource_type, resource_id, details)
        VALUES (OLD.user_id, TG_OP, TG_TABLE_NAME, OLD.id, row_to_json(OLD));
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Activity logging triggers for key tables
CREATE TRIGGER log_content_activity 
    AFTER INSERT OR UPDATE OR DELETE ON content_items 
    FOR EACH ROW EXECUTE FUNCTION log_user_activity();

CREATE TRIGGER log_social_account_activity 
    AFTER INSERT OR UPDATE OR DELETE ON social_accounts 
    FOR EACH ROW EXECUTE FUNCTION log_user_activity();

-- ==========================================
-- USEFUL VIEWS
-- ==========================================

-- User Dashboard Stats
CREATE OR REPLACE VIEW user_dashboard_stats AS
SELECT 
    up.user_id,
    up.display_name,
    up.subscription_tier,
    COUNT(DISTINCT ci.id) as total_content,
    COUNT(DISTINCT sa.id) as connected_accounts,
    COUNT(DISTINCT cp.id) as character_profiles,
    COUNT(DISTINCT cj.id) FILTER (WHERE cj.status = 'completed') as completed_jobs,
    COUNT(DISTINCT kd.id) as knowledge_documents,
    SUM(ca.views) as total_views,
    SUM(ca.likes + ca.shares + ca.comments) as total_engagement
FROM user_profiles up
LEFT JOIN content_items ci ON up.user_id = ci.user_id
LEFT JOIN social_accounts sa ON up.user_id = sa.user_id AND sa.is_active = TRUE
LEFT JOIN character_profiles cp ON up.user_id = cp.user_id AND cp.is_active = TRUE
LEFT JOIN content_generation_jobs cj ON up.user_id = cj.user_id
LEFT JOIN knowledge_documents kd ON up.user_id = kd.user_id AND kd.status = 'active'
LEFT JOIN content_analytics ca ON ci.id = ca.content_id
GROUP BY up.user_id, up.display_name, up.subscription_tier;

-- Recent Activity View
CREATE OR REPLACE VIEW recent_user_activity AS
SELECT 
    ual.*,
    up.display_name,
    up.avatar_url
FROM user_activity_logs ual
JOIN user_profiles up ON ual.user_id = up.user_id
ORDER BY ual.created_at DESC;

-- Content Performance View
CREATE OR REPLACE VIEW content_performance AS
SELECT 
    ci.*,
    ca.views,
    ca.likes,
    ca.shares,
    ca.comments,
    ca.engagement_rate,
    COUNT(sp.id) as social_posts_count,
    ARRAY_AGG(DISTINCT sp.platform) as published_platforms
FROM content_items ci
LEFT JOIN content_analytics ca ON ci.id = ca.content_id
LEFT JOIN social_posts sp ON ci.id = sp.content_id
GROUP BY ci.id, ca.views, ca.likes, ca.shares, ca.comments, ca.engagement_rate;