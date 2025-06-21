
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { Sparkles, Play, Settings } from "lucide-react";
import { Link } from "react-router-dom";

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
              
              {/* Professional Video Studio CTA */}
              <div className="max-w-4xl mx-auto mb-8">
                <Card className="premium-card border border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-purple-400" />
                          <h3 className="text-xl font-bold text-white">Professional Video Studio</h3>
                        </div>
                        <p className="text-purple-100">
                          Create studio-quality videos with advanced effects, professional audio, smart captions, and brand customization
                        </p>
                        <div className="flex items-center gap-4 text-sm text-purple-200">
                          <span className="flex items-center gap-1">
                            <Play className="h-4 w-4" />
                            Advanced Effects
                          </span>
                          <span className="flex items-center gap-1">
                            <Settings className="h-4 w-4" />
                            Professional Audio
                          </span>
                          <span className="flex items-center gap-1">
                            <Sparkles className="h-4 w-4" />
                            Smart Captions
                          </span>
                        </div>
                      </div>
                      <Link to="/video-studio">
                        <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                          <Sparkles className="h-4 w-4 mr-2" />
                          Launch Studio
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
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
