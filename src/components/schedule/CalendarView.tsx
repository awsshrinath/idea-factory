import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useToast } from "@/hooks/use-toast";

// Sample events data - in a real app, this would come from your backend
const sampleEvents = [
  {
    id: '1',
    title: 'Product Demo Video',
    start: new Date(new Date().setHours(10, 0)),
    end: new Date(new Date().setHours(11, 0)),
    backgroundColor: '#FF69B4',
    extendedProps: {
      type: 'video',
      platform: 'linkedin'
    }
  },
  {
    id: '2',
    title: 'Team Photo Post',
    start: new Date(new Date().setHours(14, 0)),
    end: new Date(new Date().setHours(15, 0)),
    backgroundColor: '#4169E1',
    extendedProps: {
      type: 'image',
      platform: 'instagram'
    }
  },
  {
    id: '3',
    title: 'Weekly Update',
    start: new Date(new Date().setHours(16, 0)),
    end: new Date(new Date().setHours(17, 0)),
    backgroundColor: '#32CD32',
    extendedProps: {
      type: 'text',
      platform: 'twitter'
    }
  }
];

export function CalendarView() {
  const { toast } = useToast();
  const [view, setView] = useState("dayGridMonth");

  const handleEventDrop = (info: any) => {
    toast({
      title: "Event rescheduled",
      description: `${info.event.title} was moved to ${info.event.startStr}`,
    });
  };

  const handleEventClick = (info: any) => {
    toast({
      title: "Event details",
      description: `Type: ${info.event.extendedProps.type}, Platform: ${info.event.extendedProps.platform}`,
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4 flex justify-between items-center">
          <Select
            value={view}
            onValueChange={(value) => setView(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dayGridMonth">Month View</SelectItem>
              <SelectItem value="timeGridWeek">Week View</SelectItem>
              <SelectItem value="timeGridDay">Day View</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="calendar-container">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={view}
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            events={sampleEvents}
            eventDrop={handleEventDrop}
            eventClick={handleEventClick}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: ''
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}