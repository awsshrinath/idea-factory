
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Copy } from "lucide-react";

interface ExampleVideo {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
}

export function VideoExampleCarousel() {
  const exampleVideos: ExampleVideo[] = [
    {
      id: "1",
      title: "Product Showcase",
      description: "Dynamic product presentation with engaging transitions",
      thumbnail_url: "https://images.unsplash.com/photo-1526406915894-7bcd65f60845?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "2",
      title: "Company Culture",
      description: "Team-focused video with modern corporate style",
      thumbnail_url: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "3",
      title: "Tutorial Style",
      description: "Step-by-step guide with clear explanations",
      thumbnail_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "4",
      title: "Social Media Ad",
      description: "Engaging short-form content for social platforms",
      thumbnail_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <Card className="border border-white/10 bg-gradient-card shadow-md hover:shadow-lg transition-all duration-300 mb-6">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-4 text-foreground">Example Videos</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {exampleVideos.map((video) => (
            <div key={video.id} className="group relative transform transition-all duration-300 hover:scale-[1.03]">
              <div className="aspect-video rounded-lg overflow-hidden">
                <img 
                  src={video.thumbnail_url} 
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 
                            flex items-center justify-center gap-2">
                  <Button 
                    size="sm" 
                    className="bg-gradient-secondary hover:bg-gradient-primary transition-all duration-300 hover:scale-105"
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Use
                  </Button>
                </div>
              </div>
              <h4 className="font-medium mt-2 text-sm">{video.title}</h4>
              <p className="text-xs text-muted-foreground">{video.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
