
import { useState, useEffect } from "react";
import { Separator } from '@/components/ui/separator';
import { MobileNavigation } from "@/components/MobileNavigation";
import { ContentForm } from '@/components/content/ContentForm';
import { ContentPreview } from '@/components/content/ContentPreview';
import { RecentContent } from '@/components/content/RecentContent';
import { TrendingTopics } from '@/components/content/TrendingTopics';
import { PromptTemplates } from '@/components/content/PromptTemplates';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Sidebar } from "@/components/Sidebar";
import { MultimediaPremiumBackground } from "@/components/ui/multimedia-premium-background";
import { useMobileOptimized } from "@/hooks/use-mobile-optimized";
import { useContentJob } from "@/hooks/api/useContentJob";
import { cn } from "@/lib/utils";

export function Content() {
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const { isMobile, getCardPadding } = useMobileOptimized();
  const { jobId, status, data, error, cancel } = useContentJob();

  const handleContentGenerated = (content: string) => {
    setGeneratedContent(content);
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
          setGeneratedContent(textContent);
        } catch (fetchError: any) {
          console.error(fetchError);
        }
      };
      fetchContent();
    }
  }, [status, data]);

  return (
    <div className="min-h-screen flex bg-gray-950 overflow-x-hidden w-full relative">
      <MultimediaPremiumBackground />
      <Sidebar />
      <MobileNavigation />
      <main className={cn(
        "flex-1 animate-fadeIn w-full max-w-full relative z-10 transition-all duration-300",
        getCardPadding(),
        isMobile ? "ml-0 pt-20 px-4" : "ml-64 pl-8 p-8",
      )}>
        <div className="container mx-auto max-w-7xl">
          {/* Premium Header Section */}
          <div className={cn(
            "text-center mb-12",
            isMobile && "mb-8"
          )}>
            <h1 className={cn(
              "font-bold bg-gradient-to-r from-purple-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-6",
              isMobile ? "text-3xl" : "text-4xl"
            )}>
              AI Content Generator
            </h1>
            <p className={cn(
              "text-gray-400 max-w-3xl mx-auto leading-relaxed",
              isMobile ? "text-lg px-4" : "text-xl"
            )}>
              Create engaging content for social media, blogs, and marketing campaigns with the power of AI
            </p>
          </div>

          {/* Main Content Grid */}
          <div className={cn(
            "gap-8 max-w-none mx-auto",
            isMobile ? "flex flex-col space-y-8" : "grid lg:grid-cols-2"
          )}>
            {/* Left Panel - Content Generation */}
            <div className="space-y-8">
              <ContentForm onContentGenerated={handleContentGenerated} />
              
              {/* Generation Status */}
              {(status === 'processing' || status === 'submitting') && (
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Loader2 className="h-5 w-5 animate-spin text-purple-400" />
                      <span className="text-gray-300 font-medium">
                        {status === 'submitting' ? 'Submitting job...' : `Processing... (Job ID: ${jobId})`}
                      </span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={cancel}
                      className="text-gray-400 hover:text-white hover:bg-gray-800"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Error State */}
              {status === 'failed' && (
                <div className="bg-red-900/20 rounded-xl p-6 border border-red-800/50 shadow-lg">
                  <div className="text-red-400">
                    <p className="font-semibold mb-2">Generation failed:</p>
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                </div>
              )}

              <Separator className="bg-gray-800" />
              
              {/* Templates Section */}
              <div className="bg-gray-900 rounded-xl p-8 border border-gray-800 shadow-lg">
                <PromptTemplates onSelectTemplate={(template: string) => console.log('Template selected:', template)} />
              </div>
            </div>

            {/* Right Panel - Preview & Trending */}
            <div className="space-y-8">
              <ContentPreview 
                content={generatedContent}
                platform="instagram"
                tone="professional"
              />
              
              <Separator className="bg-gray-800" />
              
              <div className="bg-gray-900 rounded-xl p-8 border border-gray-800 shadow-lg">
                <TrendingTopics onTopicSelect={(topic: string) => console.log('Topic selected:', topic)} />
              </div>
            </div>
          </div>

          {/* Recent Content Section */}
          <div className={cn(
            "mt-16",
            isMobile && "mt-12"
          )}>
            <div className="bg-gray-900 rounded-xl p-8 border border-gray-800 shadow-lg">
              <RecentContent />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
