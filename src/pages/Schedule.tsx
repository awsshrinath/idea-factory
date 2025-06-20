
import { Sidebar } from "@/components/Sidebar";
import { ScheduleHeader } from "@/components/schedule/ScheduleHeader";
import { QuickStats } from "@/components/schedule/QuickStats";
import { FilterSection } from "@/components/schedule/FilterSection";
import { CalendarView } from "@/components/schedule/CalendarView";
import { MultimediaPremiumBackground } from "@/components/ui/multimedia-premium-background";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Calendar, Sparkles, BarChart3 } from "lucide-react";

export function Schedule() {
  const isMobile = useIsMobile();
  
  return (
    <div className={cn(
      "min-h-screen flex overflow-x-hidden relative",
      "bg-gradient-to-br from-[#181818] via-[#1E1E2F] to-[#101018]"
    )}>
      <MultimediaPremiumBackground />
      <Sidebar />
      <main className={cn(
        "flex-1 py-6 lg:py-8 relative z-10 animate-fadeIn",
        "w-full max-w-full",
        isMobile ? "ml-0 pt-20 px-4" : "ml-64 pl-8 pr-8"
      )}>
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Enhanced Header */}
          <div className="mb-8">
            <div className="space-y-3">
              <h1 className={cn(
                "enterprise-heading",
                isMobile ? "text-3xl" : "text-4xl"
              )}>
                Content Scheduler
              </h1>
              <p className="premium-body text-lg max-w-2xl">
                Plan and automate your content calendar strategically
              </p>
            </div>
          </div>

          <ScheduleHeader />
          
          {/* Enhanced Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[350px,1fr] gap-8">
            {/* Enhanced Left Sidebar */}
            <div className="space-y-8">
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="premium-heading text-lg">Quick Stats</h2>
                  <BarChart3 className="h-4 w-4 text-purple-400 animate-pulse" />
                </div>
                <QuickStats />
              </section>
              
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="premium-heading text-lg">Filters</h2>
                  <Sparkles className="h-4 w-4 text-purple-400 animate-pulse" />
                </div>
                <FilterSection />
              </section>
            </div>

            {/* Enhanced Calendar Section */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="premium-heading text-2xl">Schedule Calendar</h2>
                <Calendar className="h-5 w-5 text-purple-400 animate-pulse" />
              </div>
              <div className="premium-card premium-card-hover rounded-2xl backdrop-blur-sm border border-white/10">
                <CalendarView />
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
