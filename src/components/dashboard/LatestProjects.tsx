
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
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-6 text-foreground leading-tight">Latest Projects</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {projects.map((project) => {
          const isPinned = pinnedProjects.includes(project.id);
          return (
            <div 
              key={project.id} 
              className={cn(
                "bg-gradient-to-br from-card/80 to-muted/40 border border-white/20 hover:bg-card/90 rounded-2xl",
                "transition-all duration-300 shadow-lg hover:shadow-2xl group overflow-hidden",
                "hover:scale-105 hover:border-white/30"
              )}
            >
              <div className="h-36 relative overflow-hidden">
                {project.preview ? (
                  <>
                    <img 
                      src={project.preview}
                      alt={project.title}
                      className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    {project.icon === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="rounded-full bg-blue-600/30 p-3 backdrop-blur-sm border border-white/20 shadow-lg">
                          <Play className="h-7 w-7 text-white" />
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="h-full bg-gradient-to-br from-blue-600/20 via-indigo-600/15 to-purple-600/20 flex items-center justify-center border-b border-white/10">
                    {project.icon === "text" && (
                      <div className="text-4xl font-black text-blue-600/60 select-none">Aa</div>
                    )}
                    {project.icon === "image" && (
                      <ImageIcon className="h-12 w-12 text-blue-600/60" />
                    )}
                    {project.icon === "video" && (
                      <div className="rounded-full bg-blue-600/30 p-4 backdrop-blur-sm">
                        <div className="w-8 h-8 rounded-full bg-blue-600/60"></div>
                      </div>
                    )}
                  </div>
                )}
                <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 top-3 right-3 flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 bg-black/40 backdrop-blur-sm hover:bg-black/60 rounded-xl border border-white/20"
                    onClick={() => togglePin(project.id)}
                  >
                    <Star className={cn(
                      "h-4 w-4", 
                      isPinned ? "fill-yellow-400 text-yellow-400" : "text-white"
                    )} />
                  </Button>
                </div>
                <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg text-xs bg-black/50 backdrop-blur-sm text-white/90 font-semibold border border-white/20">
                  {project.type}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-base font-bold truncate group-hover:text-white transition-colors duration-300 leading-tight">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground truncate leading-relaxed mt-1">
                  {project.description}
                </p>
                <div className="flex items-center justify-between mt-2 mb-3">
                  <span className="text-xs text-muted-foreground/80 font-medium">{project.date}</span>
                  {isPinned && <span className="text-xs text-yellow-400 font-semibold">Pinned</span>}
                </div>
                <div className="flex gap-1.5">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 h-8 text-xs hover:bg-blue-600/20 hover:text-blue-400 hover:border-blue-400/50 transition-all duration-300 font-medium"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 h-8 text-xs hover:bg-indigo-600/20 hover:text-indigo-400 hover:border-indigo-400/50 transition-all duration-300 font-medium"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 w-8 p-0 hover:bg-red-500/20 hover:text-red-400 hover:border-red-400/50 transition-all duration-300"
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
