
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ContentForm } from '@/components/content/ContentForm';
import { ContentPreview } from '@/components/content/ContentPreview';
import { RecentContent } from '@/components/content/RecentContent';
import { TrendingTopics } from '@/components/content/TrendingTopics';
import { PromptTemplates } from '@/components/content/PromptTemplates';
import { ContentFormData } from '@/types/content';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function Content() {
  const [formData, setFormData] = useState<ContentFormData>({
    prompt: '',
    platform: 'instagram',
    tone: 'professional',
    length: 'medium',
    language: 'english',
    model: 'gpt-4'
  });
  
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!formData.prompt.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a prompt for your content"
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedContent('');

    try {
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: formData
      });

      if (error) throw error;
      
      if (data?.content) {
        setGeneratedContent(data.content);
        toast({
          title: "Success!",
          description: "Your content has been generated successfully",
        });
      }
    } catch (error: any) {
      console.error('Error generating content:', error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: error.message || 'Failed to generate content. Please try again.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            AI Content Generator
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create engaging content for social media, blogs, and marketing campaigns with the power of AI
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          <div className="space-y-6">
            <ContentForm 
              formData={formData}
              onChange={setFormData}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
            />
            
            <Separator className="bg-white/10" />
            
            <PromptTemplates onSelect={(template) => setFormData({...formData, prompt: template})} />
          </div>

          <div className="space-y-6">
            <ContentPreview 
              content={generatedContent}
              formData={formData}
              onContentChange={setGeneratedContent}
            />
            
            <Separator className="bg-white/10" />
            
            <TrendingTopics onSelect={(topic) => setFormData({...formData, prompt: topic})} />
          </div>
        </div>

        <div className="mt-12">
          <RecentContent />
        </div>
      </div>
    </div>
  );
}
