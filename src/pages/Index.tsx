
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { PersonalizedGreeting } from "@/components/dashboard/PersonalizedGreeting";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { CreatorSuggestions } from "@/components/dashboard/CreatorSuggestions";
import { LatestProjects } from "@/components/dashboard/LatestProjects";
import { PerformanceMetrics } from "@/components/dashboard/PerformanceMetrics";
import { TipsCarousel } from "@/components/dashboard/TipsCarousel";
import { HeroBanner } from "@/components/dashboard/HeroBanner";
import { QuickLinkBar } from "@/components/dashboard/QuickLinkBar";
import { UserProfile } from "@/components/dashboard/UserProfile";
import { MultimediaPremiumBackground } from "@/components/ui/multimedia-premium-background";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Video, Home, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex bg-background overflow-x-hidden w-full relative">
      <MultimediaPremiumBackground />
      <Sidebar />
      <main className={cn(
        "flex-1 p-6 md:p-8 animate-fadeIn w-full max-w-full relative z-10",
        isMobile ? "ml-0 pt-20" : "ml-64 pl-8",
      )}>
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Enhanced Header with Breadcrumbs and User Profile */}
          <div className="flex items-center justify-between mb-6">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground animate-fadeIn">
              <Home className="h-4 w-4" />
              <ChevronRight className="h-3 w-3" />
              <span className="font-semibold text-foreground bg-muted/30 px-3 py-1.5 rounded-lg border border-white/10">
                Dashboard
              </span>
            </nav>
            
            <UserProfile />
          </div>

          <div className="flex justify-end mb-6">
            <Link to="/videos">
              <Button className="premium-button bg-gradient-accent hover:shadow-glow text-white group shadow-card hover:shadow-card-hover transition-all duration-200 micro-bounce">
                <Video className="mr-2 h-4 w-4 group-hover:animate-float" />
                Create Videos
                <span className="ml-2 bg-white/15 px-2 py-0.5 rounded-full text-xs font-semibold">⌘K</span>
              </Button>
            </Link>
          </div>
          
          <QuickLinkBar />
          <PersonalizedGreeting />
          <HeroBanner />
          <QuickActions />
          <CreatorSuggestions />
          <LatestProjects />
          <PerformanceMetrics />
          <TipsCarousel />
        </div>
      </main>
    </div>
  );
};

export default Index;
