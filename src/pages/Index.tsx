
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { PersonalizedGreeting } from "@/components/dashboard/PersonalizedGreeting";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { CreatorSuggestions } from "@/components/dashboard/CreatorSuggestions";
import { LatestProjects } from "@/components/dashboard/LatestProjects";
import { PerformanceMetrics } from "@/components/dashboard/PerformanceMetrics";
import { TipsCarousel } from "@/components/dashboard/TipsCarousel";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const Index = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex bg-background overflow-x-hidden w-full">
      <Sidebar />
      <main className={cn(
        "flex-1 p-4 md:p-6 lg:p-8 animate-fadeIn w-full max-w-full",
        isMobile ? "ml-0 pt-16" : "ml-64", // Add top padding on mobile for the menu button
      )}>
        <div className="max-w-7xl mx-auto space-y-8">
          <PersonalizedGreeting />
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
