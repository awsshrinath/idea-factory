
import { Button } from "@/components/ui/button";
import { Edit, Copy, ImageIcon, Play, Star, Trash2, Share2, Clock, CheckCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useState } from "react";

export const LatestProjects = () => {
  const isMobile = useIsMobile();
  const [pinnedProjects, setPinnedProjects] = useState<string[]>([]);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  
  const projects = [
    {
      id: "proj1",
      type: "Content",
      title: "Weekly Newsletter Draft",
      description: "Email content for subscribers",
      date: "2 hours ago",
      icon: "text",
      preview: null,
      status: "draft",
    },
    {
      id: "proj2",
      type: "Image",
      title: "Product Showcase",
      description: "Promotional image for social media",
      date: "Yesterday",
      icon: "image",
      preview: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&q=80",
      status: "published",
    },
    {
      id: "proj3",
      type: "Video",
      title: "Feature Explanation",
      description: "30-second explainer video",
      date: "3 days ago",
      icon: "video",
      preview: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=500&q=80",
      status: "scheduled",
    },
    {
      id: "proj4",
      type: "Content",
      title: "Product Description",
      description: "Detailed feature list for landing page",
      date: "4 days ago",
      icon: "text",
      preview: null,
      status: "published",
    },
  ];

  const togglePin = (id: string) => {
    setPinnedProjects(prev => 
      prev.includes(id) 
        ? prev.filter(projId => projId !== id) 
        : [...prev, id]
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "published":
        return <CheckCircle className="h-3 w-3 text-emerald-400" />;
      case "scheduled":
        return <Clock className="h-3 w-3 text-blue-400" />;
      default:
        return <Edit className="h-3 w-3 text-amber-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-emerald-600/30 text-emerald-300 border-emerald-600/40";
      case "scheduled":
        return "bg-blue-600/30 text-blue-300 border-blue-600/40";
      default:
        return "bg-amber-600/30 text-amber-300 border-amber-600/40";
    }
  };

  return (
    <section className="mb-8 animate-fadeIn" style={{ animationDelay: "400ms" }}>
      <h2 className="text-3xl font-black mb-6 text-slate-100 leading-tight">Latest Projects</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {projects.map((project, index) => {
          const isPinned = pinnedProjects.includes(project.id);
          const isHovered = hoveredProject === project.id;
          return (
            <div 
              key={project.id} 
              className={cn(
                "bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800/60 rounded-2xl",
                "transition-all duration-300 shadow-lg hover:shadow-2xl group overflow-hidden",
                "hover:scale-105 hover:border-slate-600/60 transform hover:-translate-y-1 cursor-pointer animate-fadeIn"
              )}
              style={{ animationDelay: `${500 + index * 100}ms` }}
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
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
                        <div className="rounded-full bg-indigo-600/40 p-3 backdrop-blur-sm border border-slate-300/20 shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <Play className="h-7 w-7 text-white" />
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="h-full bg-gradient-to-br from-slate-700/50 via-slate-600/30 to-slate-800/50 flex items-center justify-center border-b border-slate-700/30">
                    {project.icon === "text" && (
                      <div className="text-4xl font-black text-slate-400 select-none group-hover:scale-110 transition-transform duration-300">Aa</div>
                    )}
                    {project.icon === "image" && (
                      <ImageIcon className="h-12 w-12 text-slate-400 group-hover:scale-110 transition-transform duration-300" />
                    )}
                    {project.icon === "video" && (
                      <div className="rounded-full bg-slate-600/40 p-4 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                        <div className="w-8 h-8 rounded-full bg-slate-500/60"></div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Overlay actions - appear on hover */}
                <div className={cn(
                  "absolute inset-0 bg-black/50 flex items-center justify-center gap-2 transition-all duration-300",
                  isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
                )}>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 bg-slate-800/60 backdrop-blur-sm hover:bg-slate-700/80 rounded-xl border border-slate-600/40 transform hover:scale-110 transition-all duration-200"
                  >
                    <Edit className="h-4 w-4 text-slate-200" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 bg-slate-800/60 backdrop-blur-sm hover:bg-slate-700/80 rounded-xl border border-slate-600/40 transform hover:scale-110 transition-all duration-200"
                  >
                    <Share2 className="h-4 w-4 text-slate-200" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 bg-slate-800/60 backdrop-blur-sm hover:bg-red-600/60 rounded-xl border border-slate-600/40 transform hover:scale-110 transition-all duration-200"
                  >
                    <Trash2 className="h-4 w-4 text-slate-200" />
                  </Button>
                </div>

                {/* Pin button */}
                <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 top-3 right-3 flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 bg-slate-800/60 backdrop-blur-sm hover:bg-slate-700/80 rounded-xl border border-slate-600/40"
                    onClick={() => togglePin(project.id)}
                  >
                    <Star className={cn(
                      "h-4 w-4", 
                      isPinned ? "fill-indigo-400 text-indigo-400" : "text-slate-200"
                    )} />
                  </Button>
                </div>

                {/* Project type and status */}
                <div className="absolute bottom-3 left-3 flex gap-2">
                  <div className="px-3 py-1.5 rounded-lg text-xs bg-slate-800/70 backdrop-blur-sm text-slate-200 font-semibold border border-slate-600/40">
                    {project.type}
                  </div>
                  <div className={`px-2 py-1 rounded-lg text-xs font-semibold border backdrop-blur-sm flex items-center gap-1 ${getStatusColor(project.status)}`}>
                    {getStatusIcon(project.status)}
                    {project.status}
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-base font-bold text-slate-100 truncate group-hover:text-white transition-colors duration-300 leading-tight">
                  {project.title}
                </h3>
                <p className="text-sm text-slate-300 truncate leading-relaxed mt-1">
                  {project.description}
                </p>
                <div className="flex items-center justify-between mt-2 mb-3">
                  <span className="text-xs text-slate-400 font-medium">{project.date}</span>
                  {isPinned && (
                    <span className="text-xs text-indigo-400 font-semibold flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      Pinned
                    </span>
                  )}
                </div>
                <div className="flex gap-1.5">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 h-8 text-xs hover:bg-slate-600/30 hover:text-slate-200 hover:border-slate-500/50 transition-all duration-300 font-medium transform hover:scale-105 border-slate-600/40 text-slate-300"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 h-8 text-xs hover:bg-indigo-600/30 hover:text-indigo-300 hover:border-indigo-500/50 transition-all duration-300 font-medium transform hover:scale-105 border-slate-600/40 text-slate-300"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 w-8 p-0 hover:bg-red-500/30 hover:text-red-300 hover:border-red-500/50 transition-all duration-300 transform hover:scale-105 border-slate-600/40 text-slate-300"
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
