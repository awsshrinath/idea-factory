import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ContentForm } from "@/components/content/ContentForm";
import { TrendingTopics } from "@/components/content/TrendingTopics";
import { RecentContent } from "@/components/content/RecentContent";
import { ContentPreview } from "@/components/content/ContentPreview";
import { PromptTemplates } from "@/components/content/PromptTemplates";
import { MultimediaPremiumBackground } from "@/components/ui/multimedia-premium-background";
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useContentJob } from "@/hooks/api/useContentJob";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export type Platform = "linkedin" | "twitter" | "facebook" | "instagram" | "youtube";
export type Tone = "professional" | "friendly" | "casual" | "creative";
export type AIModel = "chatgpt" | "deepseek";
export type Language = "English" | "Spanish" | "French" | "German" | "Chinese";

export interface ContentFormData {
  description: string;
  platforms: Platform[];
  tone: Tone;
  aiModel: AIModel;
  language: Language;
}

export function Content() {
  const [formData, setFormData] = useState<ContentFormData>({
    description: "",
    platforms: [],
    tone: "professional",
    aiModel: "chatgpt",
    language: "English",
  });
  const isMobile = useIsMobile();
  const { jobId, status, data, error, submit, cancel } = useContentJob();

  const handleSubmit = () => {
    // For now, we'll just use the first selected platform.
    // This can be expanded to generate content for multiple platforms.
    const platform = formData.platforms[0] || 'linkedin';
    submit(formData.description, platform);
  };

  useEffect(() => {
    if (status === 'completed' && data?.result_url) {
      const fetchContent = async () => {
        try {
          const response = await fetch(data.result_url);
          if (!response.ok) {
            throw new Error('Failed to fetch generated content.');
          }
          const textContent = await response.text();
          setFormData(prev => ({...prev, description: textContent}));
        } catch (fetchError: any) {
          console.error(fetchError);
          // Optionally, set an error state here to inform the user
        }
      };
      fetchContent();
    }
  }, [status, data]);

  return (
    <div className="min-h-screen flex bg-background overflow-x-hidden w-full relative">
      <MultimediaPremiumBackground />
      <Sidebar />
      <main className={cn(
        "flex-1 animate-fade-in w-full max-w-full relative z-10",
        "p-6 md:p-8 lg:p-10",
        isMobile ? "ml-0 pt-20" : "ml-64 pl-8"
      )}>
        <div className={cn(
          "max-w-7xl mx-auto space-y-6 w-full"
        )}>
          {/* Header Section */}
          <div className="mb-6 animate-slide-in-right">
            <div className="flex items-center gap-2 justify-between">
              <h1 className={cn(
                "font-bold font-heading bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent",
                isMobile ? "text-2xl" : "text-3xl"
              )}>
                Create Content
              </h1>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="group">
                    <HelpCircle className="w-5 h-5 text-muted-foreground group-hover:text-secondary transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Describe your content idea clearly. Add details like tone,
                      audience, and key points for better results.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className={cn(
              "text-muted-foreground mt-1",
              isMobile ? "text-sm" : "text-base"
            )}>
              Use AI to craft engaging, platform-ready content in seconds
            </p>
          </div>

          {/* Prompt Templates Carousel */}
          <PromptTemplates onSelectTemplate={(template) => {
            setFormData(prev => ({
              ...prev,
              description: template.prompt
            }));
          }} />

          {/* Main Content Layout */}
          <div className={cn(
            "grid gap-6",
            isMobile ? 
              "grid-cols-1" : 
              "grid-cols-1 xl:grid-cols-[1fr,400px]"
          )}>
            {/* Content Form Column */}
            <div className="space-y-6">
              <ContentForm
                formData={formData}
                onChange={setFormData}
              />
              <Button onClick={handleSubmit} disabled={status === 'submitting' || status === 'processing'} className="w-full">
                {status === 'submitting' || status === 'processing' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Content"
                )}
              </Button>
              
              {(status === 'processing' || status === 'submitting') && (
                <div className="flex items-center justify-between space-x-2 text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>{status === 'submitting' ? 'Submitting job...' : `Processing... (Job ID: ${jobId})`}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
                </div>
              )}

              {status === 'failed' && (
                <div className="text-destructive">
                  <p>Generation failed:</p>
                  <p className="text-sm">{error}</p>
                </div>
              )}

            </div>

            {/* Preview and Sidebar Column */}
            <div className="space-y-6">
              <ContentPreview
                formData={formData}
                onContentChange={(content) => {
                  setFormData(prev => ({...prev, description: content}));
                }}
              />
              <RecentContent />
              <TrendingTopics
                onSelect={(topic) => setFormData((prev) => ({
                  ...prev,
                  description: topic.description,
                }))}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
