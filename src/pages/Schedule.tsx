import { Sidebar } from "@/components/Sidebar";
import { ScheduleHeader } from "@/components/schedule/ScheduleHeader";
import { QuickStats } from "@/components/schedule/QuickStats";
import { FilterSection } from "@/components/schedule/FilterSection";
import { CalendarView } from "@/components/schedule/CalendarView";

export function Schedule() {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
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