
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { CalendarView } from '@/components/schedule/CalendarView';
import { QuickStats } from '@/components/schedule/QuickStats';
import { AddPostModal } from '@/components/schedule/AddPostModal';
import { FilterSection } from '@/components/schedule/FilterSection';
import { ScheduleHeader } from '@/components/schedule/ScheduleHeader';

export function Schedule() {
  const [events, setEvents] = useState([
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <ScheduleHeader />
        
        <div className="space-y-6">
          <QuickStats />
          
          <div className="grid lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <FilterSection />
            </div>
            
            <div className="lg:col-span-3">
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
    </div>
  );
}
