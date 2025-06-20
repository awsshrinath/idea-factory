import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Card } from '@/components/ui/card';

interface CalendarViewProps {
  events: any[];
  onDateSelect: (selectInfo: any) => void;
  onEventClick: (clickInfo: any) => void;
}

export function CalendarView({ events, onDateSelect, onEventClick }: CalendarViewProps) {
  const [currentView, setCurrentView] = useState('dayGridMonth');

  return (
    <Card className="p-6 premium-card border border-white/10 shadow-lg backdrop-blur-sm">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={currentView}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        events={events}
        dateClick={onDateSelect}
        eventClick={onEventClick}
        height={650}
        nowIndicator={true}
        editable={true}
        selectable={true}
        selectMirror={true}
        eventContent={renderEventContent}
        weekends={true}
        select={onDateSelect}
        eventDrop={onEventClick}
        eventResize={onEventClick}
        eventAdd={onEventClick}
        eventChange={onEventClick}
        eventRemove={onEventClick}
      />
    </Card>
  );
}

function renderEventContent(eventInfo: any) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <span>{eventInfo.event.title}</span>
    </>
  );
}
