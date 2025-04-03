
import { Sidebar } from "@/components/Sidebar";
import { ScheduleHeader } from "@/components/schedule/ScheduleHeader";
import { QuickStats } from "@/components/schedule/QuickStats";
import { FilterSection } from "@/components/schedule/FilterSection";
import { CalendarView } from "@/components/schedule/CalendarView";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export function Schedule() {
  const isMobile = useIsMobile();
  
  return (
    <div className={cn(
      "min-h-screen flex overflow-x-hidden",
      isMobile && "bg-[#111827]" // Dark background for mobile
    )}>
      <Sidebar />
      <main className={cn(
        "flex-1 p-4 md:p-6 lg:p-8",
        isMobile ? "ml-0 pt-16" : "ml-64", // Add top padding on mobile for the menu button
        "w-full max-w-full"
      )}>
        <div className="max-w-7xl mx-auto">
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
