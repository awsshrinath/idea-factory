
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MobileNavigation } from "@/components/MobileNavigation";
import { WorkflowSelection } from '@/components/videos/WorkflowSelection';
import { MainForm } from '@/components/videos/form/MainForm';
import { RecentVideosSection } from '@/components/videos/recent/RecentVideosSection';
import { HeroSection } from '@/components/videos/hero/HeroSection';
import { TipsSection } from '@/components/videos/TipsSection';
import { Sidebar } from "@/components/Sidebar";
import { MultimediaPremiumBackground } from "@/components/ui/multimedia-premium-background";
import { useMobileOptimized } from "@/hooks/use-mobile-optimized";
import { cn } from "@/lib/utils";

export function Videos() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<"direct" | "fine-tuned" | null>(null);
  const { isMobile, getCardPadding } = useMobileOptimized();

  const handleWorkflowSelect = (type: "direct" | "fine-tuned") => {
    setSelectedWorkflow(type);
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
          {!selectedWorkflow ? (
            <>
              <HeroSection />
              
              <div className="max-w-4xl mx-auto space-y-8">
                <WorkflowSelection onSelect={handleWorkflowSelect} />
                
                <Separator className="bg-white/10" />
                
                <TipsSection />
                
                <RecentVideosSection />
              </div>
            </>
          ) : (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className={cn(
                "text-center",
                isMobile && "px-4"
              )}>
                <h1 className={cn(
                  "font-bold text-white mb-4",
                  isMobile ? "text-2xl" : "text-3xl"
                )}>
                  {selectedWorkflow === 'direct' ? 'Direct Video Generation' : 'Fine-Tuned Video Generation'}
                </h1>
              </div>

              <Card className={cn(
                "premium-card border border-white/10 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl",
                isMobile && "mx-2"
              )}>
                <CardContent className={cn(
                  getCardPadding()
                )}>
                  <MainForm onSubmit={(data) => console.log('Generate video:', data)} />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
