
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ContentForm } from "@/components/content/ContentForm";
import { TrendingTopics } from "@/components/content/TrendingTopics";
import { RecentContent } from "@/components/content/RecentContent";
import { ContentPreview } from "@/components/content/ContentPreview";
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
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <main className={cn(
        "flex-1 p-4 md:p-8 animate-fade-in",
        isMobile ? "ml-0" : "ml-64"
      )}>
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Section */}
          <div className="mb-6 animate-slide-in-right">
            <div className="flex items-center gap-2">
              <h1 className={cn(
                "font-bold font-heading bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent",
                isMobile ? "text-2xl" : "text-4xl"
              )}>
                Create Your Next Masterpiece
              </h1>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="w-5 h-5 text-muted-foreground hover:text-secondary transition-colors" />
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
              "text-muted-foreground mt-2",
              isMobile ? "text-base" : "text-lg"
            )}>
              Use AI to generate professional, engaging, and platform-ready content
            </p>
          </div>

          {/* Main Content Layout - Mobile Responsive */}
          <div className="space-y-6">
            {/* Content Form */}
            <div className="transform hover:scale-[1.01] transition-transform duration-300">
              <ContentForm
                formData={formData}
                onChange={setFormData}
              />
            </div>
            
            {/* Live Preview Section - Now Full Width */}
            <div className="w-full">
              <h2 className={cn(
                "font-bold mb-4 bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent flex items-center gap-2",
                isMobile ? "text-xl" : "text-2xl"
              )}>
                Live Preview
              </h2>
              <div className="transform hover:scale-[1.01] transition-transform duration-300">
                <ContentPreview formData={formData} onContentChange={(newContent) => {
                  setFormData(prev => ({...prev, description: newContent}));
                }} />
              </div>
            </div>
            
            {/* Sidebar Content Moved Below - Mobile Stacked, Desktop Two Column */}
            <div className={cn(
              "grid gap-6",
              isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
            )}>
              <div className="transform hover:scale-[1.01] transition-transform duration-300">
                <TrendingTopics
                  onSelect={(topic) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: topic.description,
                    }))
                  }
                />
              </div>
              <div className="transform hover:scale-[1.01] transition-transform duration-300">
                <RecentContent />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
