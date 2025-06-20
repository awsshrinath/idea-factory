import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Video, Play, Download, MoreHorizontal, Clock } from 'lucide-react';
import { EmptyRecentVideos } from '../EmptyRecentVideos';

const mockVideos = [
  {
    id: "1",
    title: "Product Launch Video",
    prompt: "A dynamic product showcase with modern transitions",
    duration: 15,
    createdAt: "2024-01-15",
    thumbnail: "/placeholder.svg",
    status: "completed"
  }
];

export function RecentVideosSection() {
  const videos = mockVideos;

  if (videos.length === 0) {
    return <EmptyRecentVideos />;
  }

  return (
    <Card className="premium-card border border-white/10 shadow-lg">
      <CardHeader>
        <CardTitle className="premium-heading text-xl">
          Recent Videos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {videos.map((video) => (
          <div key={video.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative w-20 h-12 rounded-md overflow-hidden">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="object-cover w-full h-full"
                />
                <Button size="icon" variant="ghost" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60">
                  <Play className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-1">
                <p className="premium-subheading text-sm">{video.title}</p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{video.duration}s</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {video.status}
              </Badge>
              <Button size="icon" variant="ghost">
                <Download className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
