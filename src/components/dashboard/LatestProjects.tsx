
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Edit, Share, MoreHorizontal, Clock, ArrowUpRight, Eye, Zap, TrendingUp } from "lucide-react";
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
    title: "Summer Product Launch Campaign",
    type: "Video",
    status: "Published",
    thumbnail: "/placeholder.svg",
    views: "12.5K",
    engagement: "+34%",
    updatedAt: "2 hours ago",
    statusColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    gradient: "from-emerald-900/30 to-green-900/20",
    performance: "high",
  },
  {
    id: 2,
    title: "Brand Awareness Social Series",
    type: "Content",
    status: "Draft",
    thumbnail: "/placeholder.svg",
    views: "—",
    engagement: "—",
    updatedAt: "1 day ago",
    statusColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    gradient: "from-amber-900/30 to-orange-900/20",
    performance: "pending",
  },
  {
    id: 3,
    title: "Instagram Stories Collection",
    type: "Image",
    status: "Scheduled",
    thumbnail: "/placeholder.svg",
    views: "—",
    engagement: "—",
    updatedAt: "3 days ago",
    statusColor: "bg-blue-500/20 text-blue-300 border-blue-500/40",
    gradient: "from-blue-900/30 to-indigo-900/20",
    performance: "scheduled",
  },
];

export const LatestProjects = () => {
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  return (
    <section className="mb-12 animate-fadeIn" style={{ animationDelay: "500ms" }}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-bold text-white leading-tight tracking-tight">Latest Projects</h2>
          <TrendingUp className="h-6 w-6 text-blue-400/80" />
        </div>
        <Button 
          variant="ghost" 
          className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-all duration-300 group font-semibold"
        >
          View All
          <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <Card 
            key={project.id} 
            className={`
              group relative overflow-hidden rounded-2xl cursor-pointer
              bg-gradient-to-br from-slate-900/50 to-slate-800/30 ${project.gradient}
              border border-white/[0.08] hover:border-white/[0.15]
              backdrop-blur-xl shadow-xl hover:shadow-2xl
              transform transition-all duration-500 ease-out
              hover:scale-[1.02] hover:-translate-y-1 animate-fadeIn
              hover:shadow-[0_12px_48px_rgba(0,0,0,0.3)]
            `}
            style={{ animationDelay: `${600 + index * 100}ms` }}
            onMouseEnter={() => setHoveredProject(project.id)}
            onMouseLeave={() => setHoveredProject(null)}
          >
            {/* Thumbnail Section */}
            <div className="relative aspect-video bg-gradient-to-br from-slate-800/80 to-slate-900/60 overflow-hidden">
              <img 
                src={project.thumbnail} 
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Premium overlay with actions */}
              <div className={`
                absolute inset-0 bg-gradient-to-br from-black/40 via-black/60 to-black/80 
                backdrop-blur-sm flex items-center justify-center gap-3 
                transition-all duration-500 
                ${hoveredProject === project.id ? 'opacity-100' : 'opacity-0'}
              `}>
                <Button size="sm" className="bg-white/15 hover:bg-white/25 text-white border-white/20 hover:border-white/40 backdrop-blur-md shadow-lg">
                  <Play className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button size="sm" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/40 backdrop-blur-md">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/40 backdrop-blur-md">
                  <Share className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Status badge */}
              <div className="absolute top-4 left-4">
                <Badge className={`${project.statusColor} font-bold shadow-lg backdrop-blur-sm border`}>
                  {project.status}
                </Badge>
              </div>
              
              {/* Type indicator */}
              <div className="absolute top-4 right-4">
                <Badge className="bg-slate-800/80 text-slate-200 border-slate-600/50 backdrop-blur-sm font-semibold">
                  {project.type}
                </Badge>
              </div>

              {/* Performance indicator */}
              {project.performance === 'high' && (
                <div className="absolute bottom-4 right-4">
                  <div className="flex items-center gap-1 bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-full border border-emerald-500/40 backdrop-blur-sm">
                    <Zap className="h-3 w-3" />
                    <span className="text-xs font-bold">High Performance</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Content Section */}
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-bold text-white group-hover:text-white/95 transition-colors duration-300 line-clamp-2 leading-tight">
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
                  <DropdownMenuContent align="end" className="bg-slate-800/95 border-slate-700/60 backdrop-blur-xl">
                    <DropdownMenuItem className="hover:bg-slate-700/50 text-slate-200">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Project
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-slate-700/50 text-slate-200">
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
              <div className="flex items-center justify-between text-sm mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Eye className="h-4 w-4 text-slate-400" />
                    <span className="font-semibold">{project.views}</span>
                  </div>
                  {project.engagement !== "—" && (
                    <div className="flex items-center gap-1 text-emerald-400">
                      <TrendingUp className="h-4 w-4" />
                      <span className="font-bold">{project.engagement}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Timestamp */}
              <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
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
