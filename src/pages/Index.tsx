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
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Video, Home, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-x-hidden w-full">
      <Sidebar />
      <main className={cn(
        "flex-1 p-2 md:p-3 lg:p-6 animate-fadeIn w-full max-w-full",
        isMobile ? "ml-0 pt-16" : "ml-64",
      )}>
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Enhanced Header with Breadcrumbs and User Profile */}
          <div className="flex items-center justify-between mb-6">
            <nav className="flex items-center gap-2 text-sm text-slate-400 animate-fadeIn">
              <Home className="h-4 w-4" />
              <ChevronRight className="h-3 w-3" />
              <span className="font-semibold text-slate-200 bg-slate-700/30 px-3 py-1.5 rounded-lg border border-slate-600/40">
                Dashboard
              </span>
            </nav>
            
            <UserProfile />
          </div>

          <div className="flex justify-end mb-6">
            <Link to="/videos">
              <Button className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white group shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 animate-pulse hover:shadow-indigo-500/25">
                <Video className="mr-2 h-4 w-4 group-hover:animate-bounce" />
                Create Videos
                <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs font-semibold">⌘K</span>
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
