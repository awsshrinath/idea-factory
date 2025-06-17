
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
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Video } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-background via-background to-muted/20 overflow-x-hidden w-full">
      <Sidebar />
      <main className={cn(
        "flex-1 p-2 md:p-3 lg:p-6 animate-fadeIn w-full max-w-full",
        isMobile ? "ml-0 pt-16" : "ml-64",
      )}>
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex justify-end mb-6">
            <Link to="/videos">
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white group shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Video className="mr-2 h-4 w-4 group-hover:animate-pulse" />
                Create Videos
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
