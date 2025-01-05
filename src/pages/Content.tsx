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

export type Platform = "linkedin" | "twitter" | "facebook";
export type Tone = "professional" | "friendly" | "casual" | "creative";

export interface ContentFormData {
  description: string;
  platforms: Platform[];
  tone: Tone;
}

export function Content() {
  const [formData, setFormData] = useState<ContentFormData>({
    description: "",
    platforms: [],
    tone: "professional",
  });

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 animate-fade-in">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="mb-8 animate-slide-in-right">
            <div className="flex items-center gap-2">
              <h1 className="text-4xl font-bold font-heading bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
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
            <p className="text-lg text-muted-foreground mt-2">
              Use AI to generate professional, engaging, and platform-ready content
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Form and Recent Content */}
            <div className="lg:col-span-2 space-y-8">
              <div className="transform hover:scale-[1.01] transition-transform duration-300">
                <ContentForm
                  formData={formData}
                  onChange={setFormData}
                />
              </div>
              <div className="transform hover:scale-[1.01] transition-transform duration-300">
                <RecentContent />
              </div>
            </div>

            {/* Right Column - Preview and Trending Topics */}
            <div className="space-y-8">
              <div className="transform hover:scale-[1.01] transition-transform duration-300">
                <ContentPreview formData={formData} />
              </div>
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
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}