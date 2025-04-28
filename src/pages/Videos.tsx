
import { Sidebar } from "@/components/Sidebar";
import { VideoExampleCarousel } from "@/components/videos/VideoExampleCarousel";
import { VideoSuggestions } from "@/components/videos/VideoSuggestions";
import { TipsSection } from "@/components/videos/TipsSection";
import { HeroSection } from "@/components/videos/hero/HeroSection";
import { MainForm } from "@/components/videos/form/MainForm";
import { RecentVideosSection } from "@/components/videos/recent/RecentVideosSection";

export function Videos() {
  return (
    <div className="min-h-screen flex bg-[#1E1E2E]">
      <Sidebar />
      <main className="flex-1 ml-64">
        <div className="max-w-[1400px] mx-auto py-8 px-6">
          <HeroSection />
          <VideoExampleCarousel />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2 space-y-6">
              <MainForm onGenerateVideo={() => {}} />
              <RecentVideosSection />
            </div>

            <div className="space-y-6">
              <VideoSuggestions onSuggestionClick={() => {}} />
              <TipsSection />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
