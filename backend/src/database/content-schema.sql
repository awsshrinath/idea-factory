-- Enhanced Content Management Database Schema
-- This file contains the SQL commands to create all necessary tables for the content management system

-- Content Items Table (Main content storage)
CREATE TABLE IF NOT EXISTS content_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT,
    platform VARCHAR(50) NOT NULL DEFAULT 'general',
    tone VARCHAR(50) DEFAULT 'neutral',
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'approved', 'rejected', 'scheduled', 'published')),
    ai_model VARCHAR(50),
    language VARCHAR(10) DEFAULT 'en',
    tags TEXT[], -- PostgreSQL array of strings
    metadata JSONB, -- Store flexible metadata
    platform_config JSONB, -- Platform-specific configuration
    scheduled_for TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content Analytics Table
CREATE TABLE IF NOT EXISTS content_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    engagement_rate DECIMAL(5,2) DEFAULT 0.00,
    platform_metrics JSONB, -- Store platform-specific metrics
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(content_id)
);

-- Content Approvals Table (Approval workflow)
CREATE TABLE IF NOT EXISTS content_approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    approved_by UUID REFERENCES auth.users(id),
    approved_at TIMESTAMPTZ,
    notes TEXT,
    UNIQUE(content_id)
);

-- Content Revisions Table (Version history)
CREATE TABLE IF NOT EXISTS content_revisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
    revision_number INTEGER DEFAULT 1,
    revision_data JSONB NOT NULL, -- Store the complete content state at time of revision
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content Templates Table (Reusable templates)
CREATE TABLE IF NOT EXISTS content_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    template_data JSONB NOT NULL,
    platform VARCHAR(50),
    category VARCHAR(50),
    is_public BOOLEAN DEFAULT FALSE,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content Campaigns Table (Group related content)
CREATE TABLE IF NOT EXISTS content_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'archived')),
    campaign_config JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content Campaign Items (Link content to campaigns)
CREATE TABLE IF NOT EXISTS content_campaign_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES content_campaigns(id) ON DELETE CASCADE,
    content_id UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(campaign_id, content_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_content_items_user_id ON content_items(user_id);
CREATE INDEX IF NOT EXISTS idx_content_items_status ON content_items(status);
CREATE INDEX IF NOT EXISTS idx_content_items_platform ON content_items(platform);
CREATE INDEX IF NOT EXISTS idx_content_items_created_at ON content_items(created_at);
CREATE INDEX IF NOT EXISTS idx_content_items_scheduled_for ON content_items(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_content_items_tags ON content_items USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_content_analytics_content_id ON content_analytics(content_id);
CREATE INDEX IF NOT EXISTS idx_content_approvals_content_id ON content_approvals(content_id);
CREATE INDEX IF NOT EXISTS idx_content_revisions_content_id ON content_revisions(content_id);

-- Row Level Security (RLS) Policies
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_campaign_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for content_items
CREATE POLICY "Users can view their own content" ON content_items
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own content" ON content_items
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own content" ON content_items
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own content" ON content_items
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for content_analytics
CREATE POLICY "Users can view analytics for their content" ON content_analytics
    FOR ALL USING (EXISTS (
        SELECT 1 FROM content_items 
        WHERE content_items.id = content_analytics.content_id 
        AND content_items.user_id = auth.uid()
    ));

-- RLS Policies for content_approvals
CREATE POLICY "Users can manage approvals for their content" ON content_approvals
    FOR ALL USING (EXISTS (
        SELECT 1 FROM content_items 
        WHERE content_items.id = content_approvals.content_id 
        AND content_items.user_id = auth.uid()
    ));

-- RLS Policies for content_revisions
CREATE POLICY "Users can view revisions for their content" ON content_revisions
    FOR ALL USING (EXISTS (
        SELECT 1 FROM content_items 
        WHERE content_items.id = content_revisions.content_id 
        AND content_items.user_id = auth.uid()
    ));

-- RLS Policies for content_templates
CREATE POLICY "Users can manage their own templates" ON content_templates
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view public templates" ON content_templates
    FOR SELECT USING (is_public = TRUE OR auth.uid() = user_id);

-- RLS Policies for content_campaigns
CREATE POLICY "Users can manage their own campaigns" ON content_campaigns
    FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for content_campaign_items
CREATE POLICY "Users can manage items in their campaigns" ON content_campaign_items
    FOR ALL USING (EXISTS (
        SELECT 1 FROM content_campaigns 
        WHERE content_campaigns.id = content_campaign_items.campaign_id 
        AND content_campaigns.user_id = auth.uid()
    ));

-- Functions for automatic timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_content_items_updated_at 
    BEFORE UPDATE ON content_items 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_templates_updated_at 
    BEFORE UPDATE ON content_templates 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_campaigns_updated_at 
    BEFORE UPDATE ON content_campaigns 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Views for common queries
CREATE OR REPLACE VIEW content_with_analytics AS
SELECT 
    ci.*,
    ca.views,
    ca.likes,
    ca.shares,
    ca.comments,
    ca.engagement_rate
FROM content_items ci
LEFT JOIN content_analytics ca ON ci.id = ca.content_id;

CREATE OR REPLACE VIEW content_dashboard_stats AS
SELECT 
    user_id,
    COUNT(*) as total_content,
    COUNT(*) FILTER (WHERE status = 'draft') as draft_count,
    COUNT(*) FILTER (WHERE status = 'published') as published_count,
    COUNT(*) FILTER (WHERE status = 'scheduled') as scheduled_count,
    COUNT(*) FILTER (WHERE status = 'pending_approval') as pending_approval_count,
    SUM(ca.views) as total_views,
    SUM(ca.likes + ca.shares + ca.comments) as total_engagement,
    AVG(ca.engagement_rate) as avg_engagement_rate
FROM content_items ci
LEFT JOIN content_analytics ca ON ci.id = ca.content_id
GROUP BY user_id; 