
import { VideoThumbnail } from "./VideoThumbnail";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";
import { EmptyRecentVideos } from "./EmptyRecentVideos";

type Video = Tables<"videos">;

interface RecentVideosGridProps {
  videos: Video[];
  onView: (video: Video) => void;
  onRegenerate: (video: Video) => void;
  onDelete: (video: Video) => void;
}

export function RecentVideosGrid({ videos, onView, onRegenerate, onDelete }: RecentVideosGridProps) {
  if (!videos.length) {
    return <EmptyRecentVideos />;
  }

  return (
    <Card className="border border-white/10 bg-card/70 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {videos.map((video) => (
            <VideoThumbnail
              key={video.id}
              video={video}
              onView={() => onView(video)}
              onRegenerate={() => onRegenerate(video)}
              onDelete={() => onDelete(video)}
            />
          ))}
        </div>
        <div className="mt-6 text-center">
          <Button variant="outline" className="border-white/10 bg-background hover:bg-background/80">
            View All Videos
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
