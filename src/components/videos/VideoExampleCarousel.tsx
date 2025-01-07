import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Copy } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

type SampleVideo = Tables<"sample_videos">;

export function VideoExampleCarousel() {
  const [sampleVideos, setSampleVideos] = useState<SampleVideo[]>([]);

  useEffect(() => {
    async function fetchSampleVideos() {
      const { data, error } = await supabase
        .from('sample_videos')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (!error && data) {
        setSampleVideos(data);
      }
    }

    fetchSampleVideos();
  }, []);

  return (
    <Card className="bg-gradient-card border border-white/10 shadow-card hover:shadow-card-hover transition-all duration-300">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Example Videos</h3>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {sampleVideos.map((video) => (
            <div key={video.id} className="flex-none w-72">
              <div className="relative group">
                <img 
                  src={video.thumbnail_url} 
                  alt={video.title}
                  className="w-full h-40 object-cover rounded-lg shadow-card"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity 
                              flex items-center justify-center gap-2 rounded-lg">
                  <Button 
                    size="sm" 
                    className="bg-gradient-secondary hover:bg-gradient-primary transition-all duration-300 
                              hover:shadow-glow flex items-center gap-2"
                  >
                    <Play className="h-4 w-4" />
                    Play
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-gradient-secondary hover:bg-gradient-primary transition-all duration-300 
                              hover:shadow-glow flex items-center gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Use Template
                  </Button>
                </div>
              </div>
              <h4 className="font-medium mt-2 text-foreground">{video.title}</h4>
              <p className="text-sm text-muted-foreground">{video.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}