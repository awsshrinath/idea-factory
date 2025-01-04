import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Calendar,
  Video,
  Image as ImageIcon,
  FileText,
  Instagram,
  Twitter,
  Linkedin,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample events data - in a real app, this would come from your backend
const sampleEvents = [
  {
    id: '1',
    title: 'Product Demo Video',
    start: new Date(new Date().setHours(10, 0)),
    end: new Date(new Date().setHours(11, 0)),
    backgroundColor: '#FF69B4', // Pink for videos
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
    backgroundColor: '#4169E1', // Blue for images
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
    backgroundColor: '#32CD32', // Green for text posts
    extendedProps: {
      type: 'text',
      platform: 'twitter'
    }
  }
];

export function Schedule() {
  const [view, setView] = useState("dayGridMonth");
  const { toast } = useToast();

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

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'image':
        return <ImageIcon className="h-4 w-4" />;
      case 'text':
        return <FileText className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      case 'twitter':
        return <Twitter className="h-4 w-4" />;
      case 'linkedin':
        return <Linkedin className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold">Content Schedule</h1>
              <p className="text-muted-foreground mt-2">
                Plan and manage your content across platforms
              </p>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Post
            </Button>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[300px,1fr] gap-8">
            {/* Left Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Scheduled Posts</p>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">This Week</p>
                    <p className="text-2xl font-bold">5</p>
                  </div>
                </CardContent>
              </Card>

              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Filters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Content Type</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="video">Videos</SelectItem>
                        <SelectItem value="image">Images</SelectItem>
                        <SelectItem value="text">Text Posts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Platform</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="All Platforms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Platforms</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="twitter">Twitter</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Calendar Section */}
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
          </div>
        </div>
      </main>
    </div>
  );
}