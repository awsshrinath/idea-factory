
import { Button } from "@/components/ui/button";
import { Edit, Copy, ImageIcon, Play, Star, Trash2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useState } from "react";

export const LatestProjects = () => {
  const isMobile = useIsMobile();
  const [pinnedProjects, setPinnedProjects] = useState<string[]>([]);
  
  const projects = [
    {
      id: "proj1",
      type: "Content",
      title: "Weekly Newsletter Draft",
      description: "Email content for subscribers",
      date: "2 hours ago",
      icon: "text",
      preview: null, // Text doesn't have visual preview
    },
    {
      id: "proj2",
      type: "Image",
      title: "Product Showcase",
      description: "Promotional image for social media",
      date: "Yesterday",
      icon: "image",
      preview: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&q=80",
    },
    {
      id: "proj3",
      type: "Video",
      title: "Feature Explanation",
      description: "30-second explainer video",
      date: "3 days ago",
      icon: "video",
      preview: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=500&q=80",
    },
    {
      id: "proj4",
      type: "Content",
      title: "Product Description",
      description: "Detailed feature list for landing page",
      date: "4 days ago",
      icon: "text",
      preview: null,
    },
  ];

  const togglePin = (id: string) => {
    setPinnedProjects(prev => 
      prev.includes(id) 
        ? prev.filter(projId => projId !== id) 
        : [...prev, id]
    );
  };

  return (
    <section className="mb-4">
      <h2 className="text-xl font-semibold mb-3">Latest Projects</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {projects.map((project) => {
          const isPinned = pinnedProjects.includes(project.id);
          return (
            <div 
              key={project.id} 
              className={cn(
                "bg-black/20 border border-white/10 hover:bg-black/30 rounded-xl",
                "transition-all duration-300 hover:shadow-lg group overflow-hidden",
                "hover:scale-[1.02] hover:border-white/20"
              )}
            >
              <div className="h-32 relative overflow-hidden">
                {project.preview ? (
                  <>
                    <img 
                      src={project.preview}
                      alt={project.title}
                      className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    {project.icon === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="rounded-full bg-primary/20 p-2 backdrop-blur-sm">
                          <Play className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="h-full bg-gradient-to-br from-background/80 via-muted/50 to-background/80 flex items-center justify-center">
                    {project.icon === "text" && (
                      <div className="text-3xl font-bold text-primary/30 select-none">Aa</div>
                    )}
                    {project.icon === "image" && (
                      <ImageIcon className="h-10 w-10 text-primary/30" />
                    )}
                    {project.icon === "video" && (
                      <div className="rounded-full bg-primary/20 p-3">
                        <div className="w-6 h-6 rounded-full bg-primary/40"></div>
                      </div>
                    )}
                  </div>
                )}
                <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 top-2 right-2 flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 bg-black/40 backdrop-blur-sm hover:bg-black/60"
                    onClick={() => togglePin(project.id)}
                  >
                    <Star className={cn(
                      "h-4 w-4", 
                      isPinned ? "fill-yellow-400 text-yellow-400" : "text-white"
                    )} />
                  </Button>
                </div>
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md text-xs bg-black/40 backdrop-blur-sm text-white/80">
                  {project.type}
                </div>
              </div>
              <div className="p-2">
                <h3 className="text-sm font-medium truncate group-hover:text-white transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="text-xs text-muted-foreground truncate">
                  {project.description}
                </p>
                <div className="flex items-center justify-between mt-1 mb-2">
                  <span className="text-xs text-muted-foreground/70">{project.date}</span>
                  {isPinned && <span className="text-xs text-yellow-400">Pinned</span>}
                </div>
                <div className="flex gap-1">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 h-7 text-xs hover:bg-primary/20 hover:text-primary"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 h-7 text-xs hover:bg-secondary/20 hover:text-secondary"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 w-7 p-0 hover:bg-red-500/10 hover:text-red-500"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
