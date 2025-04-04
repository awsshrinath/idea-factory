import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ContentFormData, Platform, Tone, AIModel, Language } from "@/pages/Content";
import { Sparkles, Wand2, AlertCircle, CheckCircle, RefreshCw, Info, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { PlatformSelector } from "./PlatformSelector";
import { ToneSelector } from "./ToneSelector";
import { ModelLanguageSelector } from "./ModelLanguageSelector";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ContentFormProps {
  formData: ContentFormData;
  onChange: (data: ContentFormData) => void;
}

const MAX_CHARS = 500;
const PLACEHOLDER_TEXT = "Write a professional LinkedIn post about AI in healthcare...\n\nOr try:\n- Share 5 tips for effective social media marketing\n- Announce a new product launch\n- Create an engaging Twitter thread about industry trends";

const promptTemplates = [
  {
    title: "Product Launch",
    prompt: "Announce the launch of [product name], a new [product type] that helps [target audience] solve [problem]. Highlight key features like [feature 1], [feature 2], and how it compares to alternatives. Include a call to action for early access or demos."
  },
  {
    title: "Thought Leadership",
    prompt: "Share insights on the future of [industry] and how [emerging trend] is transforming the way we [key activity]. Discuss the challenges of [common problem] and offer a unique perspective on how [solution approach] can create new opportunities."
  },
  {
    title: "Motivational Quote",
    prompt: "Create an inspirational post about [topic] that encourages [target audience] to overcome [challenge]. Include a memorable quote and personal reflection on why this message matters in today's professional environment."
  },
  {
    title: "Announcement",
    prompt: "Share exciting news about [event/milestone] happening on [date]. Explain why this matters to [audience] and how it relates to [industry trend]. Invite people to [specific action] and mention any special details they should know."
  },
  {
    title: "Industry Tips",
    prompt: "Share 5 practical tips for professionals in [industry] looking to improve their [skill/area]. For each tip, provide a brief explanation and an actionable takeaway that readers can implement immediately."
  },
];

export function ContentForm({ formData, onChange }: ContentFormProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [showError, setShowError] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    setCharCount(formData.description.length);
  }, [formData.description]);

  const handlePlatformToggle = (platform: Platform) => {
    onChange({
      ...formData,
      platforms: formData.platforms.includes(platform)
        ? formData.platforms.filter((p) => p !== platform)
        : [...formData.platforms, platform],
    });
  };

  const applyTemplate = (promptTemplate: string) => {
    onChange({
      ...formData,
      description: promptTemplate,
    });
  };

  const generateContent = async (isRegenerateAction = false) => {
    const actionType = isRegenerateAction ? setIsRegenerating : setIsGenerating;
    actionType(true);
    setShowError(false);
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

      if (error) throw error;

      if (data?.content) {
        onChange({
          ...formData,
          description: data.content,
        });

        toast({
          title: isRegenerateAction ? "Regenerated" : "Success",
          description: isRegenerateAction ? "Content regenerated successfully!" : "Content generated successfully!",
          variant: "default",
          action: (
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-1 text-accent" />
            </div>
          ),
        });
      } else {
        throw new Error(data?.error || 'Failed to generate content');
      }
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        variant: "destructive",
        title: isRegenerateAction ? "Error regenerating content" : "Error generating content",
        description: error.message || "An unexpected error occurred",
      });
    } finally {
      actionType(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (charCount > MAX_CHARS) {
      setShowError(true);
      return;
    }
    
    await generateContent(false);
  };

  const handleRegenerate = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (charCount > MAX_CHARS) {
      setShowError(true);
      return;
    }
    
    await generateContent(true);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6 bg-gradient-to-br from-[#121212] to-[#1a1a1a] p-4 md:p-6 rounded-xl shadow-[0_12px_12px_rgba(0,0,0,0.2)] border border-[rgba(255,255,255,0.05)]">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-[#E0E0E0] italic flex items-center gap-2 text-[14px] font-[500]">
              Describe your idea or post topic
              <Tooltip>
                <TooltipTrigger>
                  <Sparkles className="w-4 h-4 text-primary/60" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Describe your content idea in detail. Be specific about your goals and audience.</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-primary/60" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Try: "Write a product launch announcement for an AI platform."</p>
                </TooltipContent>
              </Tooltip>
            </label>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="ml-auto text-sm bg-transparent border border-white/10 hover:bg-white/5 flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" />
                  <span>Use template</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="bg-background border-b border-white/10 px-3 py-2">
                  <h4 className="font-medium text-sm">Prompt Templates</h4>
                  <p className="text-xs text-muted-foreground">Select a template to get started quickly</p>
                </div>
                <div className="p-1 max-h-60 overflow-y-auto">
                  {promptTemplates.map((template) => (
                    <Button
                      key={template.title}
                      variant="ghost"
                      className="w-full justify-start text-left h-auto py-2 px-3 mb-1 hover:bg-white/5 flex flex-col items-start"
                      onClick={() => applyTemplate(template.prompt)}
                    >
                      <span className="font-medium text-white">{template.title}</span>
                      <span className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{template.prompt.substring(0, 60)}...</span>
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          <Textarea
            placeholder={PLACEHOLDER_TEXT}
            value={formData.description}
            onChange={(e) => {
              onChange({ ...formData, description: e.target.value });
              setCharCount(e.target.value.length);
            }}
            className={cn(
              "h-28 md:h-32 bg-background/50 text-foreground border-accent/20 focus:border-primary transition-all duration-300 rounded-lg resize-none hover:border-primary/50 placeholder:text-[#B0B0B0]",
              showError && "border-red-500 focus:border-red-500"
            )}
          />
          <div className="flex justify-between items-center text-sm">
            <span className={cn(
              "text-[#B0B0B0]",
              charCount > MAX_CHARS && "text-red-500"
            )}>
              {charCount}/{MAX_CHARS} characters
            </span>
            {showError && (
              <span className="text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                Character limit exceeded
              </span>
            )}
          </div>
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

        <div className={cn(
          "flex gap-3",
          isMobile ? "flex-col" : "flex-row"
        )}>
          <Button
            type="submit"
            size={isMobile ? "default" : "lg"}
            isLoading={isGenerating}
            className={cn(
              "transition-all duration-300 bg-gradient-to-r from-[#00C6FF] to-[#0072FF] text-white rounded-lg shadow-lg group hover:shadow-[0_0_15px_rgba(0,198,255,0.6)] hover:scale-[1.03]",
              isMobile ? "h-12 w-full" : "flex-1 h-12"
            )}
            disabled={!formData.description || formData.platforms.length === 0 || isGenerating || isRegenerating || charCount > MAX_CHARS}
          >
            <Wand2 className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
            {isGenerating ? "Generating..." : "Generate Content"}
          </Button>
          
          <Button
            type="button"
            size={isMobile ? "default" : "lg"}
            variant="outline"
            isLoading={isRegenerating}
            className={cn(
              "transition-all duration-300 text-white bg-transparent border border-white/30 rounded-lg hover:bg-white/5 hover:shadow-[0_0_8px_rgba(255,255,255,0.2)] hover:scale-[1.03]",
              "animate-fade-in",
              isMobile ? "h-12 w-full" : "flex-1 h-12"
            )}
            onClick={handleRegenerate}
            disabled={!formData.description || formData.platforms.length === 0 || isGenerating || isRegenerating || charCount > MAX_CHARS}
          >
            <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
            {isRegenerating ? "Regenerating..." : "Regenerate"}
          </Button>
        </div>

        {formData.platforms.length === 0 && (
          <Alert className="bg-muted border-accent/20">
            <AlertDescription className="text-[#B0B0B0]">
              Select at least one platform to generate content
            </AlertDescription>
          </Alert>
        )}
      </div>
    </form>
  );
}
