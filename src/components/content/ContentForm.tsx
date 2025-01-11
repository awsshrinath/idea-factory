import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ContentFormData, Platform, Tone, AIModel, Language } from "@/pages/Content";
import { Sparkles, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { PlatformSelector } from "./PlatformSelector";
import { ToneSelector } from "./ToneSelector";
import { ModelLanguageSelector } from "./ModelLanguageSelector";

interface ContentFormProps {
  formData: ContentFormData;
  onChange: (data: ContentFormData) => void;
}

export function ContentForm({ formData, onChange }: ContentFormProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const { toast } = useToast();

  const handlePlatformToggle = (platform: Platform) => {
    onChange({
      ...formData,
      platforms: formData.platforms.includes(platform)
        ? formData.platforms.filter((p) => p !== platform)
        : [...formData.platforms, platform],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    console.log("Generating content with data:", formData);

    try {
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          description: formData.description,
          platform: formData.platforms[0],
          tone: formData.tone,
          language: formData.language,
          aiModel: formData.aiModel,
        },
      });

      console.log("Response from generate-content:", data);

      if (error) {
        console.error('Function invocation error:', error);
        throw error;
      }

      if (data?.content) {
        // Update the form data with the generated content
        onChange({
          ...formData,
          description: data.content,
        });

        toast({
          title: "Content generated successfully!",
          description: "Your content has been updated in the preview.",
        });
      } else {
        throw new Error(data?.error || 'Failed to generate content');
      }
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        variant: "destructive",
        title: "Error generating content",
        description: error.message || "An unexpected error occurred",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const testOpenAIConnection = async () => {
    setIsTesting(true);
    try {
      const { data, error } = await supabase.functions.invoke('test-openai');
      
      if (error) {
        console.error('Function invocation error:', error);
        throw error;
      }

      if (data?.success) {
        toast({
          title: "OpenAI Connection Test",
          description: "Connection successful! API key is working correctly.",
        });
      } else {
        throw new Error(data?.error || 'Failed to test OpenAI connection');
      }
    } catch (error) {
      console.error('Error testing OpenAI connection:', error);
      toast({
        variant: "destructive",
        title: "OpenAI Connection Test Failed",
        description: error.message || "Failed to connect to OpenAI API. Please check your API key.",
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4 bg-gradient-to-br from-[#1D2433] to-[#283047] p-8 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] border border-white/10 backdrop-blur-sm">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/80 italic flex items-center gap-2">
            Content Description
            <Tooltip>
              <TooltipTrigger>
                <Sparkles className="w-4 h-4 text-primary/60" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Describe your content idea in detail</p>
              </TooltipContent>
            </Tooltip>
          </label>
          <Textarea
            placeholder="Describe your idea… e.g., 'Write about the top 5 benefits of using AI in business.'"
            value={formData.description}
            onChange={(e) => onChange({ ...formData, description: e.target.value })}
            className="h-32 bg-background/50 text-foreground border-accent/20 focus:border-primary transition-all duration-300 rounded-lg resize-none hover:border-primary/50 placeholder:text-muted-foreground/50"
          />
        </div>

        <ModelLanguageSelector
          selectedModel={formData.aiModel}
          selectedLanguage={formData.language}
          onModelSelect={(model) => onChange({ ...formData, aiModel: model })}
          onLanguageSelect={(language) => onChange({ ...formData, language: language })}
        />

        <PlatformSelector
          selectedPlatforms={formData.platforms}
          onPlatformToggle={handlePlatformToggle}
        />

        <ToneSelector
          selectedTone={formData.tone}
          onToneSelect={(tone) => onChange({ ...formData, tone: tone })}
        />

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={testOpenAIConnection}
            className="w-full transition-all duration-300 border-accent/20 hover:border-primary/50"
            disabled={isTesting}
          >
            {isTesting ? "Testing..." : "Test OpenAI Connection"}
          </Button>
          
          <Button
            type="submit"
            size="lg"
            className={cn(
              "w-full transition-all duration-300 bg-gradient-to-r from-[#00C6FF] to-[#0072FF] text-primary-foreground rounded-lg shadow-lg group hover:shadow-[0_0_15px_rgba(0,198,255,0.6)]",
              isGenerating && "animate-pulse"
            )}
            disabled={!formData.description || formData.platforms.length === 0 || isGenerating}
          >
            <Wand2 className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
            {isGenerating ? "Generating..." : "Generate Content"}
          </Button>
        </div>
      </div>
    </form>
  );
}