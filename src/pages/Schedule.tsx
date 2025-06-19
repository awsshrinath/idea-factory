import { Sidebar } from "@/components/Sidebar";
import { ScheduleHeader } from "@/components/schedule/ScheduleHeader";
import { QuickStats } from "@/components/schedule/QuickStats";
import { FilterSection } from "@/components/schedule/FilterSection";
import { CalendarView } from "@/components/schedule/CalendarView";
import { MultimediaPremiumBackground } from "@/components/ui/multimedia-premium-background";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

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
        "flex-1 px-6 md:px-10 lg:px-14 py-4 md:py-6 lg:py-8 relative z-10",
        isMobile ? "ml-0 pt-16" : "ml-64",
        "w-full max-w-full"
      )}>
        <div className="max-w-7xl mx-auto page-container">
          <ScheduleHeader />
          
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[300px,1fr] gap-8">
            {/* Left Sidebar */}
            <div className="space-y-6">
              <QuickStats />
              <FilterSection />
            </div>

            {/* Calendar Section */}
            <CalendarView />
          </div>
        </div>
      </main>
    </div>
  );
}
