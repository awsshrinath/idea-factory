
import { useState } from 'react';
import { CalendarView } from '@/components/schedule/CalendarView';
import { QuickStats } from '@/components/schedule/QuickStats';
import { AddPostModal } from '@/components/schedule/AddPostModal';
import { FilterSection } from '@/components/schedule/FilterSection';
import { ScheduleHeader } from '@/components/schedule/ScheduleHeader';
import { MobileNavigation } from "@/components/MobileNavigation";
import { Sidebar } from "@/components/Sidebar";
import { MultimediaPremiumBackground } from "@/components/ui/multimedia-premium-background";
import { useMobileOptimized } from "@/hooks/use-mobile-optimized";
import { cn } from "@/lib/utils";

export function Schedule() {
  const { isMobile, getCardPadding } = useMobileOptimized();
  const [events] = useState([
    {
      id: '1',
      title: 'Instagram Post',
      start: '2024-03-20T10:00:00',
      backgroundColor: '#8B5CF6'
    },
    {
      id: '2', 
      title: 'LinkedIn Article',
      start: '2024-03-21T14:00:00',
      backgroundColor: '#06B6D4'
    }
  ]);

  const handleDateSelect = (selectInfo: any) => {
    console.log('Date selected:', selectInfo);
  };

  const handleEventClick = (clickInfo: any) => {
    console.log('Event clicked:', clickInfo);
  };

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
        <div className="container mx-auto">
          <ScheduleHeader />
          
          <div className="space-y-6">
            <QuickStats />
            
            <div className={cn(
              "gap-6",
              isMobile ? "flex flex-col space-y-6" : "grid lg:grid-cols-4"
            )}>
              <div className={cn(
                isMobile ? "order-2" : "lg:col-span-1"
              )}>
                <FilterSection />
              </div>
              
              <div className={cn(
                isMobile ? "order-1" : "lg:col-span-3"
              )}>
                <CalendarView 
                  events={events}
                  onDateSelect={handleDateSelect}
                  onEventClick={handleEventClick}
                />
              </div>
            </div>
          </div>

          <AddPostModal />
        </div>
      </main>
    </div>
  );
}
