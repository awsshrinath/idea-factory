import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Platform } from '@/types/content';
import { Wand2, Send } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { PlatformSelector } from './PlatformSelector';
import { ToneSelector } from './ToneSelector';
import { ModelLanguageSelector } from './ModelLanguageSelector';
import { useContentJob } from '@/hooks/api/useContentJob';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ContentFormProps {
  onContentGenerated: (content: string) => void;
}

export function ContentForm({ onContentGenerated }: ContentFormProps) {
  const [prompt, setPrompt] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [tone, setTone] = useState('professional');
  const [language, setLanguage] = useState('English');
  const [model, setModel] = useState('ChatGPT');
  
  const { submit, status, data, error } = useContentJob();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a prompt to generate content.",
      });
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast({
        variant: "destructive",
        title: "Error", 
        description: "Please select at least one platform.",
      });
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "Please log in to generate content.",
        });
        return;
      }

      const fullPrompt = `Create ${tone} content for ${selectedPlatforms.join(', ')} about: ${prompt}. Use ${language} language.`;
      await submit(fullPrompt, selectedPlatforms[0]);
      
    } catch (error: unknown) {
      console.error('Content generation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: errorMessage,
      });
    }
  };

  useEffect(() => {
    if (status === 'completed' && data?.generated_text) {
      onContentGenerated(data.generated_text);
      toast({
        title: "Content generated",
        description: "Your content is ready to use!",
      });
    } else if (status === 'failed' && error) {
      toast({
        variant: "destructive",
        title: "Content generation failed",
        description: error,
      });
    }
  }, [status, data, error, onContentGenerated, toast]);

  return (
    <Card className="premium-card premium-card-hover border border-white/10 shadow-lg backdrop-blur-sm">
      <CardHeader className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600/20 to-indigo-600/20 flex items-center justify-center border border-purple-500/20">
            <Wand2 className="h-4 w-4 text-purple-400" />
          </div>
          <div>
            <CardTitle className="premium-heading text-xl">Content Generator</CardTitle>
            <CardDescription className="premium-body">
              Describe what you want to create and we'll generate engaging content
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label className="premium-subheading text-sm">What would you like to create?</label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your content idea..."
              className="premium-focus bg-white/5 border-white/10 hover:border-white/20 focus:border-purple-400 transition-all duration-300 resize-none"
              rows={4}
            />
            <div className="flex justify-between items-center text-xs">
              <span className="premium-caption">Be specific for better results</span>
              <Badge variant="outline" className="bg-white/5">
                {prompt.length}/500
              </Badge>
            </div>
          </div>

          <PlatformSelector
            selectedPlatforms={selectedPlatforms}
            onPlatformChange={setSelectedPlatforms}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ToneSelector value={tone} onChange={setTone} />
            <ModelLanguageSelector
              language={language}
              model={model}
              onLanguageChange={setLanguage}
              onModelChange={setModel}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full premium-button bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-xl hover:shadow-purple-500/25 border border-purple-500/20 hover:border-purple-400/40 font-semibold text-base micro-bounce disabled:opacity-50"
            disabled={status === 'submitting' || status === 'processing'}
          >
            {status === 'submitting' ? (
              <>
                <Wand2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : status === 'processing' ? (
              <>
                <Wand2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Generate Content
              </>
            )}
          </Button>
        </form>
        
        {error && (
          <div className="premium-card rounded-xl p-4 bg-gradient-to-r from-red-500/10 to-pink-500/5 border border-red-500/20">
            <p className="premium-body text-sm text-red-300">
              {error}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
