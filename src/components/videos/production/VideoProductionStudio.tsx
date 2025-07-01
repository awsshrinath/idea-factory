
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Settings, Palette, Music, Type, Wand2 } from 'lucide-react';
import { useVideoProduction } from '@/hooks/useVideoProduction';
import { ProductionForm } from './ProductionForm';
import { EffectsLibrary } from './EffectsLibrary';
import { AudioLibrary } from './AudioLibrary';
import { CaptionEditor } from './CaptionEditor';
import { BrandSettings } from './BrandSettings';
import { VideoPreview } from './VideoPreview';
import { TemplateSelector } from './TemplateSelector';
import { Tables } from '@/integrations/supabase/types';

type VideoProject = Tables<"video_projects">;
type AudioTrack = Tables<"audio_library">;
type Template = Tables<"video_templates">;
type CaptionStyle = Tables<"caption_styles">;

export function VideoProductionStudio() {
  const {
    isLoading,
    projects,
    effects,
    audioLibrary,
    templates,
    captionStyles,
    brandSettings,
    loadVideoData,
    createVideoProject
  } = useVideoProduction();

  const [activeProject, setActiveProject] = useState<VideoProject | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [selectedEffects, setSelectedEffects] = useState<any[]>([]);
  const [selectedAudio, setSelectedAudio] = useState<AudioTrack | null>(null);
  const [selectedCaptions, setSelectedCaptions] = useState<CaptionStyle | null>(null);

  useEffect(() => {
    loadVideoData();
  }, [loadVideoData]);

  const handleCreateProject = async (formData: any) => {
    const settings = {
      template: selectedTemplate || undefined,
      effects: selectedEffects,
      audioTrack: selectedAudio || undefined,
      captionStyle: selectedCaptions || undefined,
      brandSettings: brandSettings || undefined,
      customSettings: {
        duration: formData.duration || 30,
        resolution: formData.resolution || '1080p',
        aspectRatio: formData.aspectRatio || '16:9',
        voice: formData.voice,
        language: formData.language || 'en'
      }
    };

    const project = await createVideoProject(
      formData.prompt,
      formData.title,
      settings
    );

    if (project) {
      setActiveProject(project);
    }
  };

  const handleEffectsChange = (effects: any[]) => {
    setSelectedEffects(effects);
  };

  const handleAudioSelect = (audio: AudioTrack) => {
    setSelectedAudio(audio);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Professional Video Production Studio
          </h1>
          <p className="text-xl text-muted-foreground">
            Create studio-quality videos with AI-powered effects, professional audio, and smart captions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Production Panel */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="create" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="create" className="flex items-center gap-2">
                  <Wand2 className="h-4 w-4" />
                  Create
                </TabsTrigger>
                <TabsTrigger value="templates" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Templates
                </TabsTrigger>
                <TabsTrigger value="effects" className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Effects
                </TabsTrigger>
                <TabsTrigger value="audio" className="flex items-center gap-2">
                  <Music className="h-4 w-4" />
                  Audio
                </TabsTrigger>
                <TabsTrigger value="captions" className="flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  Captions
                </TabsTrigger>
                <TabsTrigger value="brand" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Brand
                </TabsTrigger>
              </TabsList>

              <TabsContent value="create" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Create Professional Video</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ProductionForm
                      onSubmit={handleCreateProject}
                      isLoading={isLoading}
                      selectedTemplate={selectedTemplate}
                      selectedEffects={selectedEffects}
                      selectedAudio={selectedAudio}
                      selectedCaptions={selectedCaptions}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="templates">
                <TemplateSelector
                  templates={templates}
                  selectedTemplate={selectedTemplate}
                  onSelect={setSelectedTemplate}
                />
              </TabsContent>

              <TabsContent value="effects">
                <EffectsLibrary
                  effects={effects}
                  selectedEffects={selectedEffects}
                  onSelectionChange={handleEffectsChange}
                />
              </TabsContent>

              <TabsContent value="audio">
                <AudioLibrary
                  audioTracks={audioLibrary}
                  selectedAudio={selectedAudio}
                  onSelect={handleAudioSelect}
                />
              </TabsContent>

              <TabsContent value="captions">
                <CaptionEditor
                  captionStyles={captionStyles}
                  selectedStyle={selectedCaptions}
                  onSelect={setSelectedCaptions}
                />
              </TabsContent>

              <TabsContent value="brand">
                <BrandSettings brandSettings={brandSettings} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Preview and Projects Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <VideoPreview
                  project={activeProject}
                  settings={{
                    template: selectedTemplate,
                    effects: selectedEffects,
                    audio: selectedAudio,
                    captions: selectedCaptions
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {projects.slice(0, 5).map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted/70 transition-colors"
                      onClick={() => setActiveProject(project)}
                    >
                      <div className="w-12 h-8 bg-primary/20 rounded flex items-center justify-center">
                        <Play className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">{project.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {project.status === 'completed' ? 'Ready' : 'Processing...'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
