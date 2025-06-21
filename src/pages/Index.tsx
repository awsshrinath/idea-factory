
import { Sidebar } from "@/components/Sidebar";
import { MobileNavigation } from "@/components/MobileNavigation";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { MobileCard, MobileCardContent, MobileCardHeader, MobileCardTitle } from "@/components/ui/mobile-card";
import { PersonalizedGreeting } from "@/components/dashboard/PersonalizedGreeting";
import { WorkflowActions } from "@/components/dashboard/WorkflowActions";
import { SmartInsights } from "@/components/dashboard/SmartInsights";
import { ContentPipeline } from "@/components/dashboard/ContentPipeline";
import { PerformanceMetrics } from "@/components/dashboard/PerformanceMetrics";
import { TipsCarousel } from "@/components/dashboard/TipsCarousel";
import { HeroBanner } from "@/components/dashboard/HeroBanner";
import { UserProfile } from "@/components/dashboard/UserProfile";
import { MultimediaPremiumBackground } from "@/components/ui/multimedia-premium-background";
import { useMobileOptimized } from "@/hooks/use-mobile-optimized";
import { cn } from "@/lib/utils";
import { Video, Home, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const { isMobile, getGridCols, getCardPadding, getTouchTargetSize } = useMobileOptimized();
  
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
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Enhanced Header with Breadcrumbs and User Profile */}
          <div className={cn(
            "flex items-center justify-between mb-6",
            isMobile && "flex-col gap-4"
          )}>
            <nav className="flex items-center gap-2 text-sm text-muted-foreground animate-fadeIn">
              <Home className="h-4 w-4" />
              <ChevronRight className="h-3 w-3" />
              <span className="font-semibold text-foreground bg-muted/30 px-3 py-1.5 rounded-lg border border-white/10">
                Dashboard
              </span>
            </nav>
            
            <UserProfile />
          </div>

          <div className={cn(
            "flex justify-end mb-6",
            isMobile && "justify-center"
          )}>
            <Link to="/videos">
              <EnhancedButton 
                variant={isMobile ? "mobile" : "premium"}
                size={isMobile ? "mobile" : "default"}
                className={cn(
                  "bg-gradient-accent hover:shadow-glow text-white group shadow-card hover:shadow-card-hover transition-all duration-300",
                  getTouchTargetSize()
                )}
              >
                <Video className="mr-2 h-4 w-4 group-hover:animate-float" />
                Create Videos
                {!isMobile && (
                  <span className="ml-2 bg-white/15 px-2 py-0.5 rounded-full text-xs font-semibold">⌘K</span>
                )}
              </EnhancedButton>
            </Link>
          </div>
          
          <div className="space-y-6">
            <PersonalizedGreeting />
            <HeroBanner />
            
            {/* Mobile-optimized grid for workflow actions */}
            <div className={cn(
              "grid gap-4 md:gap-6",
              getGridCols(3, 2, 1)
            )}>
              <WorkflowActions />
            </div>
            
            <SmartInsights />
            <ContentPipeline />
            <PerformanceMetrics />
            <TipsCarousel />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
