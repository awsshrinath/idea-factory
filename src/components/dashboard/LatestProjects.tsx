
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Edit, Share, MoreHorizontal, Clock, ArrowUpRight, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

const projects = [
  {
    id: 1,
    title: "Summer Product Launch",
    type: "Video",
    status: "Published",
    thumbnail: "/placeholder.svg",
    views: "12.5K",
    engagement: "+34%",
    updatedAt: "2 hours ago",
    statusColor: "bg-emerald-600",
  },
  {
    id: 2,
    title: "Brand Awareness Campaign",
    type: "Content",
    status: "Draft",
    thumbnail: "/placeholder.svg",
    views: "0",
    engagement: "0%",
    updatedAt: "1 day ago",
    statusColor: "bg-amber-600",
  },
  {
    id: 3,
    title: "Instagram Story Series",
    type: "Image",
    status: "Scheduled",
    thumbnail: "/placeholder.svg",
    views: "0",
    engagement: "0%",
    updatedAt: "3 days ago",
    statusColor: "bg-blue-600",
  },
];

export const LatestProjects = () => {
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  return (
    <section className="mb-8 animate-fadeIn" style={{ animationDelay: "500ms" }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-black text-slate-100 leading-tight">Latest Projects</h2>
        <Button 
          variant="ghost" 
          className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-600/10 transition-all duration-300 group"
        >
          View All
          <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <Card 
            key={project.id} 
            className="bg-slate-800/30 border border-slate-700/60 hover:border-slate-600/70 transition-all duration-300 
                     shadow-lg hover:shadow-2xl rounded-2xl backdrop-blur-sm overflow-hidden group transform hover:scale-105 
                     hover:-translate-y-1 animate-fadeIn cursor-pointer"
            style={{ animationDelay: `${600 + index * 100}ms` }}
            onMouseEnter={() => setHoveredProject(project.id)}
            onMouseLeave={() => setHoveredProject(null)}
          >
            <div className="relative aspect-video bg-slate-700/50 overflow-hidden">
              <img 
                src={project.thumbnail} 
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Overlay with action buttons - appears on hover */}
              <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center gap-2 transition-all duration-300 ${
                hoveredProject === project.id ? 'opacity-100' : 'opacity-0'
              }`}>
                <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50 backdrop-blur-sm">
                  <Play className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button size="sm" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30 hover:border-white/50 backdrop-blur-sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30 hover:border-white/50 backdrop-blur-sm">
                  <Share className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Status badge */}
              <div className="absolute top-3 left-3">
                <Badge className={`${project.statusColor} text-white border-0 font-semibold shadow-lg`}>
                  {project.status}
                </Badge>
              </div>
              
              {/* Type indicator */}
              <div className="absolute top-3 right-3">
                <Badge className="bg-slate-800/80 text-slate-200 border-slate-600/50 backdrop-blur-sm">
                  {project.type}
                </Badge>
              </div>
            </div>
            
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold text-slate-100 group-hover:text-white transition-colors duration-300 line-clamp-2 leading-tight">
                  {project.title}
                </h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 transition-all duration-300 opacity-0 group-hover:opacity-100"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-slate-800/95 border-slate-700/60 backdrop-blur-sm">
                    <DropdownMenuItem className="hover:bg-slate-700/50">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Project
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-slate-700/50">
                      <Share className="h-4 w-4 mr-2" />
                      Share Project
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-red-600/20 text-red-400">
                      Delete Project
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {/* Stats row */}
              <div className="flex items-center justify-between text-sm mb-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-slate-300">
                    <Eye className="h-4 w-4" />
                    <span className="font-medium">{project.views}</span>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-400">
                    <span className="font-semibold">{project.engagement}</span>
                  </div>
                </div>
              </div>
              
              {/* Timestamp */}
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Clock className="h-3 w-3" />
                <span>Updated {project.updatedAt}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
