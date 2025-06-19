
import { Button } from "@/components/ui/button";
import { Wand2, Sparkles, TrendingUp, FileImage, ArrowUp, Zap, Star } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useState } from "react";

export const CreatorSuggestions = () => {
  const isMobile = useIsMobile();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  
  const suggestions = [
    {
      title: "Add Visual Impact",
      description: "Transform your latest post with AI-generated imagery that captures attention and drives engagement across all platforms",
      benefit: "+35% engagement",
      icon: FileImage,
      action: "Generate Image",
      path: "/images",
      gradient: "from-slate-900/90 to-slate-800/70",
      iconBg: "bg-gradient-to-br from-slate-600/90 to-slate-700/70",
      badge: "Recommended",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      glowColor: "group-hover:shadow-[0_8px_32px_rgba(148,163,184,0.25)]",
    },
    {
      title: "Video Content Creation",
      description: "Convert your written content into compelling 15-second video teasers that maximize reach and viewer retention",
      benefit: "+57% reach",
      icon: Wand2,
      action: "Create Video",
      path: "/videos",
      gradient: "from-indigo-900/90 to-purple-900/70",
      iconBg: "bg-gradient-to-br from-indigo-600/90 to-purple-600/70",
      badge: "Trending",
      badgeColor: "bg-orange-500/20 text-orange-300 border-orange-500/30",
      glowColor: "group-hover:shadow-[0_8px_32px_rgba(99,102,241,0.3)]",
    },
    {
      title: "Hashtag Optimization",
      description: "Boost discoverability with AI-curated hashtags that are trending in your niche right now",
      benefit: "+28% wider reach",
      icon: TrendingUp,
      action: "Optimize Tags",
      path: "/content",
      gradient: "from-teal-900/90 to-cyan-900/70",
      iconBg: "bg-gradient-to-br from-teal-600/90 to-cyan-600/70",
      badge: "Hot",
      badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      glowColor: "group-hover:shadow-[0_8px_32px_rgba(20,184,166,0.25)]",
    },
    {
      title: "Content Calendar",
      description: "Build momentum with a strategically planned 7-day content streak designed for maximum follower growth",
      benefit: "+73% growth",
      icon: Sparkles,
      action: "Schedule Series",
      path: "/schedule",
      gradient: "from-violet-900/90 to-purple-900/70",
      iconBg: "bg-gradient-to-br from-violet-600/90 to-purple-600/70",
      badge: "Premium",
      badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      glowColor: "group-hover:shadow-[0_8px_32px_rgba(139,92,246,0.3)]",
    },
  ];

  return (
    <section className="mb-12 animate-fadeIn" style={{ animationDelay: "200ms" }}>
      <div className="flex items-center gap-3 mb-8">
        <h2 className="text-3xl font-bold text-white leading-tight tracking-tight">Smart Suggestions</h2>
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
          <Zap className="h-6 w-6 text-purple-400 animate-pulse" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {suggestions.map((suggestion, index) => (
          <div 
            key={index} 
            className={cn(
              "group relative overflow-hidden rounded-2xl cursor-pointer",
              "bg-gradient-to-br backdrop-blur-xl shadow-xl hover:shadow-2xl",
              "border border-white/[0.08] hover:border-white/[0.15]",
              "transform transition-all duration-500 ease-out",
              "hover:scale-[1.02] hover:-translate-y-2 animate-fadeIn",
              suggestion.gradient,
              suggestion.glowColor
            )}
            style={{ animationDelay: `${300 + index * 100}ms` }}
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            {/* Premium gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative p-6 flex flex-col h-full min-h-[280px]">
              {/* Header section */}
              <div className="flex justify-between items-start mb-6">
                <div className={cn(
                  "h-12 w-12 rounded-xl flex items-center justify-center",
                  "shadow-lg group-hover:shadow-xl border border-white/10 group-hover:border-white/20",
                  "transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3",
                  suggestion.iconBg
                )}>
                  <suggestion.icon className="h-6 w-6 text-white" />
                </div>
                
                <div className="flex flex-col gap-2 items-end">
                  <span className={cn(
                    "text-xs px-3 py-1.5 rounded-full font-bold border backdrop-blur-sm",
                    "animate-pulse shadow-sm",
                    suggestion.badgeColor
                  )}>
                    {suggestion.badge}
                  </span>
                </div>
              </div>
              
              {/* Content section */}
              <div className="flex-grow mb-6">
                <h3 className="text-lg font-bold text-white mb-3 leading-tight group-hover:text-white/95 transition-colors">
                  {suggestion.title}
                </h3>
                <p className={cn(
                  "text-sm text-white/70 leading-relaxed font-medium transition-all duration-300",
                  hoveredCard === index ? "line-clamp-none" : "line-clamp-3"
                )}>
                  {suggestion.description}
                </p>
              </div>
              
              {/* Stats and CTA section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <ArrowUp className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 backdrop-blur-sm">
                    {suggestion.benefit}
                  </span>
                </div>
                
                <Button 
                  className={cn(
                    "w-full h-11 font-semibold shadow-lg hover:shadow-xl",
                    "bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/25",
                    "text-white transition-all duration-300 backdrop-blur-sm",
                    "group-hover:bg-white/20 group-hover:border-white/30"
                  )}
                >
                  {suggestion.action}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
