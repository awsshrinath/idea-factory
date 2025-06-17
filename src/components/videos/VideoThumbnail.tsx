
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tables } from "@/integrations/supabase/types";
import { Eye, RefreshCw, Trash2 } from "lucide-react";

type Video = Tables<"videos">;

interface VideoThumbnailProps {
  video: Video;
  onView: () => void;
  onRegenerate: () => void;
  onDelete: () => void;
}

export function VideoThumbnail({ video, onView, onRegenerate, onDelete }: VideoThumbnailProps) {
  return (
    <Card className="group relative overflow-hidden border-white/10 transition-all duration-300">
      <div className="aspect-video relative">
        <img
          src={video.thumbnail_url || "/placeholder.svg"}
          alt={video.title || "Video thumbnail"}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity 
                    flex items-center justify-center gap-2">
          <Button size="icon" variant="ghost" onClick={onView} className="h-8 w-8">
            <Eye className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={onRegenerate} className="h-8 w-8">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={onDelete} className="h-8 w-8">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium truncate">{video.title || "Untitled Video"}</h3>
        <p className="text-xs text-muted-foreground">
          {new Date(video.created_at || "").toLocaleDateString()}
        </p>
      </div>
    </Card>
  );
}
