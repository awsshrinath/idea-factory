
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { MobileNavigation } from "@/components/MobileNavigation";
import { ContentForm } from '@/components/content/ContentForm';
import { ContentPreview } from '@/components/content/ContentPreview';
import { RecentContent } from '@/components/content/RecentContent';
import { TrendingTopics } from '@/components/content/TrendingTopics';
import { PromptTemplates } from '@/components/content/PromptTemplates';
import { Sidebar } from "@/components/Sidebar";
import { MultimediaPremiumBackground } from "@/components/ui/multimedia-premium-background";
import { useMobileOptimized } from "@/hooks/use-mobile-optimized";
import { cn } from "@/lib/utils";

export function Content() {
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const { isMobile, getCardPadding } = useMobileOptimized();

  const handleContentGenerated = (content: string) => {
    setGeneratedContent(content);
  };

  return (
    <div className="min-h-screen flex bg-background overflow-x-hidden w-full relative">
      <MultimediaPremiumBackground />
      <Sidebar />
      <MobileNavigation />
      <main className={cn(
        "flex-1 animate-fadeIn w-full max-w-full relative z-10 transition-all duration-300",
        getCardPadding(),
        isMobile ? "ml-0 pt-20 px-4" : "ml-64 pl-8 p-6 md:p-8",
      )}>
        <div className="container mx-auto">
          <div className={cn(
            "text-center mb-8",
            isMobile && "mb-6"
          )}>
            <h1 className={cn(
              "font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4",
              isMobile ? "text-3xl" : "text-4xl"
            )}>
              AI Content Generator
            </h1>
            <p className={cn(
              "text-muted-foreground max-w-2xl mx-auto",
              isMobile ? "text-lg px-4" : "text-xl"
            )}>
              Create engaging content for social media, blogs, and marketing campaigns with the power of AI
            </p>
          </div>

          <div className={cn(
            "gap-8 max-w-7xl mx-auto",
            isMobile ? "flex flex-col space-y-6" : "grid lg:grid-cols-2"
          )}>
            <div className="space-y-6">
              <ContentForm onContentGenerated={handleContentGenerated} />
              
              <Separator className="bg-white/10" />
              
              <PromptTemplates onSelectTemplate={(template: string) => console.log('Template selected:', template)} />
            </div>

            <div className="space-y-6">
              <ContentPreview 
                content={generatedContent}
                platform="instagram"
                tone="professional"
              />
              
              <Separator className="bg-white/10" />
              
              <TrendingTopics onTopicSelect={(topic: string) => console.log('Topic selected:', topic)} />
            </div>
          </div>

          <div className={cn(
            "mt-12",
            isMobile && "mt-8"
          )}>
            <RecentContent />
          </div>
        </div>
      </main>
    </div>
  );
}
