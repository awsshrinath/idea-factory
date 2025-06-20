
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
import { Sparkles, Video, Wand2 } from "lucide-react";

export function Videos() {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex bg-background relative overflow-x-hidden">
      <MultimediaPremiumBackground />
      <Sidebar />
      <main className={cn(
        "flex-1 relative z-10 animate-fadeIn",
        isMobile ? "ml-0 pt-20" : "ml-64 pl-8"
      )}>
        <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-8">
          {/* Enhanced Header */}
          <div className="mb-8">
            <div className="space-y-3">
              <h1 className={cn(
                "enterprise-heading",
                isMobile ? "text-3xl" : "text-4xl"
              )}>
                AI Video Creation
              </h1>
              <p className="premium-body text-lg max-w-2xl">
                Transform your ideas into professional videos with intelligent automation
              </p>
            </div>
          </div>

          {/* Enhanced Hero Section */}
          <section className="mb-8">
            <div className="premium-card premium-card-hover rounded-2xl p-8 backdrop-blur-sm border border-white/10">
              <HeroSection />
            </div>
          </section>

          {/* Enhanced Video Examples */}
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="premium-heading text-2xl">Example Videos</h2>
              <Video className="h-5 w-5 text-purple-400 animate-pulse" />
            </div>
            <div className="premium-card premium-card-hover rounded-2xl p-6 backdrop-blur-sm border border-white/10">
              <VideoExampleCarousel />
            </div>
          </section>

          {/* Enhanced Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form Column */}
            <div className="lg:col-span-2 space-y-8">
              <div className="premium-card premium-card-hover rounded-2xl p-8 backdrop-blur-sm border border-white/10">
                <h3 className="premium-heading text-xl mb-6 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-teal-600/20 to-cyan-600/20 flex items-center justify-center border border-teal-500/20">
                    <Wand2 className="h-4 w-4 text-teal-400" />
                  </div>
                  Video Generator
                </h3>
                <MainForm onGenerateVideo={() => {}} />
              </div>
              
              <div className="premium-card premium-card-hover rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                <h3 className="premium-heading text-lg mb-4 flex items-center gap-2">
                  <div className="h-6 w-6 rounded-md bg-gradient-to-br from-emerald-600/20 to-green-600/20 flex items-center justify-center border border-emerald-500/20">
                    <Sparkles className="h-3 w-3 text-emerald-400" />
                  </div>
                  Recent Videos
                </h3>
                <RecentVideosSection />
              </div>
            </div>

            {/* Sidebar Column */}
            <div className="space-y-8">
              <div className="premium-card premium-card-hover rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                <h3 className="premium-heading text-lg mb-4 flex items-center gap-2">
                  <div className="h-6 w-6 rounded-md bg-gradient-to-br from-purple-600/20 to-indigo-600/20 flex items-center justify-center border border-purple-500/20">
                    <Sparkles className="h-3 w-3 text-purple-400" />
                  </div>
                  Suggestions
                </h3>
                <VideoSuggestions onSuggestionClick={() => {}} />
              </div>
              
              <div className="premium-card premium-card-hover rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                <h3 className="premium-heading text-lg mb-4 flex items-center gap-2">
                  <div className="h-6 w-6 rounded-md bg-gradient-to-br from-amber-600/20 to-orange-600/20 flex items-center justify-center border border-amber-500/20">
                    <Sparkles className="h-3 w-3 text-amber-400" />
                  </div>
                  Pro Tips
                </h3>
                <TipsSection />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
