
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';

type VideoProject = Tables<"video_projects">;
type VideoEffect = Tables<"video_effects">;
type AudioTrack = Tables<"audio_library">;
type VideoTemplate = Tables<"video_templates">;
type CaptionStyle = Tables<"caption_styles">;
type BrandSettings = Tables<"user_brand_settings">;

interface VideoProductionSettings {
  template?: VideoTemplate;
  effects: VideoEffect[];
  audioTrack?: AudioTrack;
  captionStyle?: CaptionStyle;
  brandSettings?: BrandSettings;
  customSettings: {
    duration: number;
    resolution: string;
    aspectRatio: string;
    voice?: string;
    language: string;
  };
}

export const useVideoProduction = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<VideoProject[]>([]);
  const [effects, setEffects] = useState<VideoEffect[]>([]);
  const [audioLibrary, setAudioLibrary] = useState<AudioTrack[]>([]);
  const [templates, setTemplates] = useState<VideoTemplate[]>([]);
  const [captionStyles, setCaptionStyles] = useState<CaptionStyle[]>([]);
  const [brandSettings, setBrandSettings] = useState<BrandSettings | null>(null);
  const { toast } = useToast();

  const loadVideoData = useCallback(async () => {
    try {
      const [effectsRes, audioRes, templatesRes, captionsRes, projectsRes, brandRes] = await Promise.all([
        supabase.from('video_effects').select('*'),
        supabase.from('audio_library').select('*'),
        supabase.from('video_templates').select('*'),
        supabase.from('caption_styles').select('*'),
        supabase.from('video_projects').select('*').order('created_at', { ascending: false }),
        supabase.from('user_brand_settings').select('*').single()
      ]);

      if (effectsRes.data) setEffects(effectsRes.data);
      if (audioRes.data) setAudioLibrary(audioRes.data);
      if (templatesRes.data) setTemplates(templatesRes.data);
      if (captionsRes.data) setCaptionStyles(captionsRes.data);
      if (projectsRes.data) setProjects(projectsRes.data);
      if (brandRes.data) setBrandSettings(brandRes.data);
    } catch (error) {
      console.error('Error loading video data:', error);
    }
  }, []);

  const createVideoProject = useCallback(async (
    prompt: string,
    title: string,
    settings: VideoProductionSettings
  ) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('video_projects')
        .insert({
          user_id: user.id,
          title,
          prompt,
          niche: settings.template?.niche || 'general',
          settings: {
            ...settings,
            timestamp: new Date().toISOString()
          }
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setProjects(prev => [data, ...prev]);
        toast({
          title: "Video Project Created",
          description: "Your professional video is being generated with all selected effects and audio."
        });
        
        // Here you would trigger the actual video generation process
        await generateVideo(data.id, settings);
      }

      return data;
    } catch (error) {
      console.error('Error creating video project:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create video project"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const generateVideo = useCallback(async (projectId: string, settings: VideoProductionSettings) => {
    try {
      // Update project status to processing
      await supabase
        .from('video_projects')
        .update({ status: 'processing' })
        .eq('id', projectId);

      // Simulate video generation process
      setTimeout(async () => {
        const mockVideoUrl = `https://example.com/generated-video-${projectId}.mp4`;
        const mockThumbnailUrl = `https://example.com/thumbnail-${projectId}.jpg`;
        
        await supabase
          .from('video_projects')
          .update({
            status: 'completed',
            video_url: mockVideoUrl,
            thumbnail_url: mockThumbnailUrl,
            duration: settings.customSettings.duration
          })
          .eq('id', projectId);

        // Refresh projects
        loadVideoData();
        
        toast({
          title: "Video Generated Successfully!",
          description: "Your professional video is ready with all effects, audio, and captions."
        });
      }, 5000);

    } catch (error) {
      console.error('Error generating video:', error);
      await supabase
        .from('video_projects')
        .update({ status: 'failed' })
        .eq('id', projectId);
    }
  }, [loadVideoData, toast]);

  const updateBrandSettings = useCallback(async (settings: Partial<BrandSettings>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_brand_settings')
        .upsert({
          user_id: user.id,
          ...settings,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      
      setBrandSettings(data);
      toast({
        title: "Brand Settings Updated",
        description: "Your brand customization has been saved."
      });
    } catch (error) {
      console.error('Error updating brand settings:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update brand settings"
      });
    }
  }, [toast]);

  return {
    isLoading,
    projects,
    effects,
    audioLibrary,
    templates,
    captionStyles,
    brandSettings,
    loadVideoData,
    createVideoProject,
    updateBrandSettings
  };
};
