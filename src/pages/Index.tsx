
import { Sidebar } from "@/components/Sidebar";
import { Bell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { PerformanceMetrics } from "@/components/dashboard/PerformanceMetrics";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
        <div className="max-w-7xl mx-auto">
          <div className={cn(
            "flex justify-between items-center mb-8",
            isMobile && "px-2 flex-col items-center gap-4"
          )}>
            <div className={cn(
              isMobile && "text-center"
            )}>
              <h1 className={cn(
                "font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent",
                isMobile ? "text-2xl" : "text-4xl"
              )}>
                Welcome back, Creator!
              </h1>
              <p className="text-muted-foreground mt-2">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="bg-gradient-to-br from-[#1D2433] to-[#283047] border border-white/10 
                                hover:shadow-lg transition-all duration-300"
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Create new content</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="bg-gradient-to-br from-[#1D2433] to-[#283047] border border-white/10 
                                hover:shadow-lg transition-all duration-300"
                    >
                      <Bell className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Notifications</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <QuickActions />
          <PerformanceMetrics />
          <RecentActivity />
        </div>
      </main>
    </div>
  );
};

export default Index;
