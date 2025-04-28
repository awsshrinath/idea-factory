
import { Sidebar } from "@/components/Sidebar";
import { VideoExampleCarousel } from "@/components/videos/VideoExampleCarousel";
import { VideoSuggestions } from "@/components/videos/VideoSuggestions";
import { TipsSection } from "@/components/videos/TipsSection";
import { HeroSection } from "@/components/videos/hero/HeroSection";
import { MainForm } from "@/components/videos/form/MainForm";
import { RecentVideosSection } from "@/components/videos/recent/RecentVideosSection";

export function Videos() {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-background via-background/95 to-background/90">
      <Sidebar />
      <main className="flex-1 ml-64 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto py-8 px-4 md:px-6 space-y-6">
          <HeroSection />
          <VideoExampleCarousel />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 space-y-5">
              <MainForm onGenerateVideo={() => {}} />
              <RecentVideosSection />
            </div>

            <div className="space-y-5">
              <VideoSuggestions onSuggestionClick={() => {}} />
              <TipsSection />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
