import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Download, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

type Video = Tables<"videos">;

export function RecentVideos() {
  const [recentVideos, setRecentVideos] = useState<Video[]>([]);

  useEffect(() => {
    async function fetchRecentVideos() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (!error && data) {
        setRecentVideos(data);
      }
    }

    fetchRecentVideos();
  }, []);

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Videos</h3>
        <div className="grid gap-4">
          {recentVideos.map((video) => (
            <div key={video.id} className="flex items-center gap-4">
              <img 
                src={video.thumbnail_url || '/placeholder.svg'} 
                alt={video.title}
                className="w-24 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <h4 className="font-medium">{video.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {new Date(video.created_at || '').toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost">
                  <Play className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost">
                  <Download className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}