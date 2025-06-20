
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ContentForm } from "@/components/content/ContentForm";
import { TrendingTopics } from "@/components/content/TrendingTopics";
import { RecentContent } from "@/components/content/RecentContent";
import { ContentPreview } from "@/components/content/ContentPreview";
import { PromptTemplates } from "@/components/content/PromptTemplates";
import { MultimediaPremiumBackground } from "@/components/ui/multimedia-premium-background";
import { HelpCircle, Sparkles } from "lucide-react";
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
  const { jobId, status, data, error, submit } = useContentJob();

  const handleSubmit = () => {
    const platform = formData.platforms[0] || 'linkedin';
    submit(formData.description, platform);
  };

  return (
    <div className="min-h-screen flex bg-background overflow-x-hidden relative">
      <MultimediaPremiumBackground />
      <Sidebar />
      <main className={cn(
        "flex-1 animate-fadeIn w-full max-w-full relative z-10",
        "p-6 md:p-8 lg:p-10",
        isMobile ? "ml-0 pt-20" : "ml-64 pl-8"
      )}>
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Enhanced Header Section */}
          <div className="mb-8 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-3">
                <h1 className={cn(
                  "enterprise-heading",
                  isMobile ? "text-3xl" : "text-4xl"
                )}>
                  Create Content
                </h1>
                <p className="premium-body text-lg max-w-2xl">
                  Use AI to craft engaging, platform-ready content in seconds
                </p>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="group">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-600/20 to-indigo-600/20 flex items-center justify-center border border-purple-500/20 group-hover:scale-105 transition-transform duration-300">
                      <HelpCircle className="w-6 h-6 text-purple-400" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="premium-card border border-white/10 bg-slate-900/95 backdrop-blur-xl">
                    <p className="max-w-xs premium-body text-sm">
                      Describe your content idea clearly. Add details like tone,
                      audience, and key points for better results.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Enhanced Prompt Templates */}
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="premium-heading text-2xl">Prompt Templates</h2>
              <Sparkles className="h-5 w-5 text-purple-400 animate-pulse" />
            </div>
            <PromptTemplates onSelectTemplate={(template) => {
              setFormData(prev => ({
                ...prev,
                description: template.prompt
              }));
            }} />
          </section>

          {/* Main Content Layout */}
          <div className={cn(
            "grid gap-8",
            isMobile ? 
              "grid-cols-1" : 
              "grid-cols-1 xl:grid-cols-[1fr,400px]"
          )}>
            {/* Content Form Column */}
            <div className="space-y-8">
              <div className="premium-card premium-card-hover rounded-2xl p-8 backdrop-blur-sm border border-white/10">
                <h3 className="premium-heading text-xl mb-6 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600/20 to-indigo-600/20 flex items-center justify-center border border-purple-500/20">
                    <Sparkles className="h-4 w-4 text-purple-400" />
                  </div>
                  Content Generator
                </h3>
                <ContentForm
                  formData={formData}
                  onChange={setFormData}
                />
                <Button 
                  onClick={handleSubmit} 
                  disabled={status === 'submitting' || status === 'processing'} 
                  className="w-full mt-6 premium-button bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-xl hover:shadow-purple-500/25 border border-purple-500/20 hover:border-purple-400/40 h-12 text-base font-semibold"
                >
                  {status === 'submitting' || status === 'processing' ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating Content...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Generate Content
                    </>
                  )}
                </Button>
                
                {status === 'processing' && (
                  <div className="flex items-center space-x-3 text-muted-foreground mt-4 premium-card rounded-xl p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/5 border border-blue-500/20">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
                    <span className="premium-body">Generating content... (Job ID: {jobId})</span>
                  </div>
                )}

                {status === 'failed' && (
                  <div className="mt-4 premium-card rounded-xl p-4 bg-gradient-to-r from-red-500/10 to-pink-500/5 border border-red-500/20">
                    <p className="premium-subheading text-red-400 mb-2">Generation failed:</p>
                    <p className="premium-body text-sm text-red-300">{error}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Preview and Sidebar Column */}
            <div className="space-y-8">
              <div className="premium-card premium-card-hover rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                <h3 className="premium-heading text-lg mb-4 flex items-center gap-2">
                  <div className="h-6 w-6 rounded-md bg-gradient-to-br from-emerald-600/20 to-green-600/20 flex items-center justify-center border border-emerald-500/20">
                    <Sparkles className="h-3 w-3 text-emerald-400" />
                  </div>
                  Preview
                </h3>
                <ContentPreview
                  formData={formData}
                  onContentChange={(content) => {
                    setFormData(prev => ({...prev, description: content}));
                  }}
                />
              </div>
              
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
