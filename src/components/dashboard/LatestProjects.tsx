
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Copy, Image as ImageIcon, Play, Eye } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export const LatestProjects = () => {
  const isMobile = useIsMobile();
  
  const projects = [
    {
      type: "Content",
      title: "Weekly Newsletter Draft",
      description: "Email content for subscribers",
      date: "2 hours ago",
      icon: "text",
      preview: null, // Text doesn't have visual preview
    },
    {
      type: "Image",
      title: "Product Showcase",
      description: "Promotional image for social media",
      date: "Yesterday",
      icon: "image",
      preview: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&q=80",
    },
    {
      type: "Video",
      title: "Feature Explanation",
      description: "30-second explainer video",
      date: "3 days ago",
      icon: "video",
      preview: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=500&q=80",
    },
  ];

  return (
    <section className="mb-5">
      <h2 className="text-2xl font-semibold mb-3">Latest Projects</h2>
      <div className={cn(
        "grid gap-3",
        isMobile ? "grid-cols-1" : "grid-cols-3"
      )}>
        {projects.map((project, index) => (
          <Card 
            key={index} 
            className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 hover:shadow-lg group overflow-hidden"
          >
            <div className="h-36 relative overflow-hidden">
              {project.preview ? (
                <>
                  <img 
                    src={project.preview}
                    alt={project.title}
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-50"></div>
                  {project.icon === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="rounded-full bg-primary/20 p-3 backdrop-blur-sm">
                        <Play className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  )}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 bg-black/40 backdrop-blur-sm hover:bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <div className="h-full bg-gradient-to-br from-background via-muted to-background flex items-center justify-center">
                  {project.icon === "text" && (
                    <div className="text-4xl font-bold text-primary/30">Aa</div>
                  )}
                  {project.icon === "image" && (
                    <ImageIcon className="h-12 w-12 text-primary/30" />
                  )}
                  {project.icon === "video" && (
                    <div className="rounded-full bg-primary/20 p-4">
                      <div className="w-8 h-8 rounded-full bg-primary/40"></div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <CardHeader className="pb-2 pt-3">
              <CardTitle className="text-base group-hover:text-white transition-colors duration-300">
                {project.title}
              </CardTitle>
              <CardDescription className="flex justify-between items-center text-xs">
                <span>{project.description}</span>
                <span className="opacity-70">{project.date}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 pb-3">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 hover:bg-primary/20 hover:text-primary text-xs"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Continue
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 hover:bg-secondary/20 hover:text-secondary text-xs"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Duplicate
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
