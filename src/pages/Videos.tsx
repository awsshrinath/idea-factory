
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { WorkflowSelection } from '@/components/videos/WorkflowSelection';
import { MainForm } from '@/components/videos/form/MainForm';
import { RecentVideosSection } from '@/components/videos/recent/RecentVideosSection';
import { HeroSection } from '@/components/videos/hero/HeroSection';
import { TipsSection } from '@/components/videos/TipsSection';
import { Sidebar } from "@/components/Sidebar";
import { MultimediaPremiumBackground } from "@/components/ui/multimedia-premium-background";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export function Videos() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<"direct" | "fine-tuned" | null>(null);
  const isMobile = useIsMobile();

  const handleWorkflowSelect = (type: "direct" | "fine-tuned") => {
    setSelectedWorkflow(type);
  };

  return (
    <div className="min-h-screen flex bg-background overflow-x-hidden w-full relative">
      <MultimediaPremiumBackground />
      <Sidebar />
      <main className={cn(
        "flex-1 animate-fadeIn w-full max-w-full relative z-10",
        "p-6 md:p-8",
        isMobile ? "ml-0 pt-20" : "ml-64 pl-8",
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
              <div className="text-center">
                <h1 className="text-3xl font-bold text-white mb-4">
                  {selectedWorkflow === 'direct' ? 'Direct Video Generation' : 'Fine-Tuned Video Generation'}
                </h1>
              </div>

              <Card className="premium-card border border-white/10 shadow-lg backdrop-blur-sm">
                <CardContent className="p-6">
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
