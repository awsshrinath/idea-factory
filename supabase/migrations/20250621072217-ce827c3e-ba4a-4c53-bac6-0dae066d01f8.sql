
-- Create video projects table for managing complete video productions
CREATE TABLE public.video_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  prompt TEXT NOT NULL,
  niche TEXT, -- business, education, entertainment, lifestyle, news, tutorials
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'processing', 'completed', 'failed')),
  video_url TEXT,
  thumbnail_url TEXT,
  duration INTEGER, -- in seconds
  settings JSONB DEFAULT '{}', -- comprehensive project settings
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create video effects library table
CREATE TABLE public.video_effects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- transitions, overlays, color_grading, animations
  effect_data JSONB NOT NULL, -- effect configuration and parameters
  preview_url TEXT,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create audio library table for background music and sound effects
CREATE TABLE public.audio_library (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- background_music, sound_effects, ambient
  mood TEXT, -- upbeat, calm, dramatic, corporate, cinematic
  audio_url TEXT NOT NULL,
  duration INTEGER, -- in seconds
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user brand settings table
CREATE TABLE public.user_brand_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  brand_name TEXT,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#6366f1',
  secondary_color TEXT DEFAULT '#8b5cf6',
  font_family TEXT DEFAULT 'Inter',
  voice_id TEXT, -- ElevenLabs voice ID
  brand_style TEXT DEFAULT 'modern', -- modern, corporate, creative, minimal
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create video templates table
CREATE TABLE public.video_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  niche TEXT NOT NULL,
  description TEXT,
  template_data JSONB NOT NULL, -- complete template configuration
  preview_url TEXT,
  is_premium BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create caption styles table
CREATE TABLE public.caption_styles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  style_data JSONB NOT NULL, -- font, size, color, position, animation
  preview_url TEXT,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for video_projects
ALTER TABLE public.video_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own video projects"
  ON public.video_projects
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own video projects"
  ON public.video_projects
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own video projects"
  ON public.video_projects
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own video projects"
  ON public.video_projects
  FOR DELETE
  USING (auth.uid() = user_id);

-- Add RLS policies for user_brand_settings
ALTER TABLE public.user_brand_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own brand settings"
  ON public.user_brand_settings
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own brand settings"
  ON public.user_brand_settings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own brand settings"
  ON public.user_brand_settings
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Make other tables public read (effects, audio, templates, captions)
ALTER TABLE public.video_effects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audio_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.caption_styles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view video effects"
  ON public.video_effects
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view audio library"
  ON public.audio_library
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view video templates"
  ON public.video_templates
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view caption styles"
  ON public.caption_styles
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert sample data for video effects
INSERT INTO public.video_effects (name, category, effect_data) VALUES
('Fade In', 'transitions', '{"type": "fade", "duration": 1.0, "direction": "in"}'),
('Fade Out', 'transitions', '{"type": "fade", "duration": 1.0, "direction": "out"}'),
('Slide Left', 'transitions', '{"type": "slide", "duration": 0.8, "direction": "left"}'),
('Zoom In', 'transitions', '{"type": "zoom", "duration": 1.2, "scale": 1.2}'),
('Cinematic', 'color_grading', '{"contrast": 1.2, "saturation": 0.9, "temperature": "warm", "vignette": true}'),
('Vibrant', 'color_grading', '{"contrast": 1.1, "saturation": 1.3, "brightness": 1.05, "highlights": true}'),
('Corporate', 'color_grading', '{"contrast": 1.0, "saturation": 0.95, "temperature": "neutral", "professional": true}'),
('Logo Overlay', 'overlays', '{"type": "logo", "position": "top-right", "opacity": 0.8, "size": "medium"}'),
('Lower Third', 'overlays', '{"type": "text", "position": "bottom-left", "animation": "slide-in", "duration": 3.0}'),
('Text Reveal', 'animations', '{"type": "text", "effect": "typewriter", "speed": 0.05, "sound": true}');

-- Insert sample data for audio library
INSERT INTO public.audio_library (name, category, mood, audio_url, duration) VALUES
('Corporate Inspiration', 'background_music', 'corporate', '/audio/corporate-inspiration.mp3', 180),
('Upbeat Energy', 'background_music', 'upbeat', '/audio/upbeat-energy.mp3', 210),
('Calm Focus', 'background_music', 'calm', '/audio/calm-focus.mp3', 240),
('Dramatic Tension', 'background_music', 'dramatic', '/audio/dramatic-tension.mp3', 195),
('Cinematic Orchestral', 'background_music', 'cinematic', '/audio/cinematic-orchestral.mp3', 300),
('Notification Bell', 'sound_effects', 'neutral', '/audio/notification-bell.mp3', 2),
('Success Chime', 'sound_effects', 'upbeat', '/audio/success-chime.mp3', 3),
('Transition Whoosh', 'sound_effects', 'neutral', '/audio/transition-whoosh.mp3', 1),
('Office Ambience', 'ambient', 'calm', '/audio/office-ambience.mp3', 600),
('City Streets', 'ambient', 'dynamic', '/audio/city-streets.mp3', 450);

-- Insert sample data for video templates
INSERT INTO public.video_templates (name, niche, description, template_data) VALUES
('Business Presentation', 'business', 'Professional template for business content', '{"layout": "corporate", "effects": ["fade_in", "logo_overlay"], "audio": "corporate", "captions": true}'),
('Educational Tutorial', 'education', 'Clean template for educational content', '{"layout": "tutorial", "effects": ["text_reveal", "lower_third"], "audio": "calm", "captions": true}'),
('Social Media Promo', 'entertainment', 'Dynamic template for social content', '{"layout": "dynamic", "effects": ["zoom_in", "vibrant"], "audio": "upbeat", "captions": true}'),
('Product Demo', 'business', 'Showcase template for product demonstrations', '{"layout": "showcase", "effects": ["slide_transitions", "corporate"], "audio": "corporate", "captions": true}'),
('News Report', 'news', 'Professional news-style template', '{"layout": "news", "effects": ["lower_third", "fade_transitions"], "audio": "dramatic", "captions": true}'),
('Lifestyle Vlog', 'lifestyle', 'Casual template for lifestyle content', '{"layout": "casual", "effects": ["natural_transitions", "vibrant"], "audio": "upbeat", "captions": true}');

-- Insert sample data for caption styles
INSERT INTO public.caption_styles (name, style_data) VALUES
('Modern Clean', '{"font": "Inter", "size": 24, "color": "#ffffff", "background": "rgba(0,0,0,0.7)", "position": "bottom", "animation": "fade_in"}'),
('Bold Impact', '{"font": "Poppins", "size": 32, "color": "#ffff00", "stroke": "#000000", "position": "center", "animation": "scale_in"}'),
('Corporate Professional', '{"font": "Roboto", "size": 20, "color": "#ffffff", "background": "#1f2937", "position": "bottom", "animation": "slide_up"}'),
('Creative Handwritten', '{"font": "Dancing Script", "size": 28, "color": "#ff6b6b", "position": "top", "animation": "typewriter"}'),
('Minimal Elegant', '{"font": "Lato", "size": 22, "color": "#f8f9fa", "background": "rgba(0,0,0,0.5)", "position": "bottom", "animation": "fade_in"}');
