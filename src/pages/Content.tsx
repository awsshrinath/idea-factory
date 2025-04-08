
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ContentForm } from "@/components/content/ContentForm";
import { TrendingTopics } from "@/components/content/TrendingTopics";
import { RecentContent } from "@/components/content/RecentContent";
import { ContentPreview } from "@/components/content/ContentPreview";
import { PromptTemplates } from "@/components/content/PromptTemplates";
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export type Platform = "linkedin" | "twitter" | "facebook";
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

  return (
    <div className="min-h-screen flex bg-background overflow-x-hidden w-full">
      <Sidebar />
      <main className={cn(
        "flex-1 p-2 md:p-3 lg:p-4 animate-fade-in w-full max-w-full",
        isMobile ? "ml-0 pt-16" : "ml-64", // Add top padding on mobile for the menu button
        "overflow-x-hidden"
      )}>
        <div className="max-w-7xl mx-auto space-y-4 w-full">
          {/* Header Section - Modern, compact style */}
          <div className="mb-2 animate-slide-in-right px-1">
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

          {/* Main Content Layout - Responsive Grid */}
          <div className={cn(
            "grid gap-4",
            isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-3"
          )}>
            {/* Content Form + Preview Column (2/3 width on desktop) */}
            <div className={cn(
              "space-y-4 w-full",
              !isMobile && "lg:col-span-2"
            )}>
              {/* Content Form */}
              <div className="transform hover:scale-[1.005] transition-transform duration-300 w-full">
                <ContentForm
                  formData={formData}
                  onChange={setFormData}
                />
              </div>
              
              {/* Live Preview Section */}
              <div className="w-full">
                <h2 className={cn(
                  "font-bold px-1 mb-2 bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent flex items-center gap-2",
                  isMobile ? "text-lg" : "text-xl"
                )}>
                  Live Preview
                </h2>
                <div className="transform hover:scale-[1.005] transition-transform duration-300 w-full">
                  <ContentPreview formData={formData} onContentChange={(newContent) => {
                    setFormData(prev => ({...prev, description: newContent}));
                  }} />
                </div>
              </div>
            </div>
            
            {/* Right Sidebar (1/3 width on desktop) */}
            <div className={cn(
              "space-y-4 w-full",
              isMobile ? "mt-2" : ""
            )}>
              <div className="transform hover:scale-[1.005] transition-transform duration-300 w-full">
                <TrendingTopics
                  onSelect={(topic) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: topic.description,
                    }))
                  }
                />
              </div>
              <div className="transform hover:scale-[1.005] transition-transform duration-300 w-full">
                <RecentContent />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
