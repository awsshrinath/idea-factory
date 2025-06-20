
import { Sidebar } from "@/components/Sidebar";
import { VideoExampleCarousel } from "@/components/videos/VideoExampleCarousel";
import { VideoSuggestions } from "@/components/videos/VideoSuggestions";
import { TipsSection } from "@/components/videos/TipsSection";
import { HeroSection } from "@/components/videos/hero/HeroSection";
import { MainForm } from "@/components/videos/form/MainForm";
import { RecentVideosSection } from "@/components/videos/recent/RecentVideosSection";
import { MultimediaPremiumBackground } from "@/components/ui/multimedia-premium-background";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export function Videos() {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex bg-[#1E1E2E] relative">
      <MultimediaPremiumBackground />
      <Sidebar />
      <main className={cn(
        "flex-1 relative z-10",
        isMobile ? "ml-0 pt-20" : "ml-64 pl-8"
      )}>
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          <HeroSection />
          <div className="mt-8">
            <VideoExampleCarousel />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2 space-y-8">
              <MainForm onGenerateVideo={() => {}} />
              <RecentVideosSection />
            </div>

            <div className="space-y-8">
              <VideoSuggestions onSuggestionClick={() => {}} />
              <TipsSection />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
