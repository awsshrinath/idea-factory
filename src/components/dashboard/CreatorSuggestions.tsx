
import { Button } from "@/components/ui/button";
import { Wand2, Sparkles, TrendingUp, FileImage, ArrowUp, Zap } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useState } from "react";

export const CreatorSuggestions = () => {
  const isMobile = useIsMobile();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  
  const suggestions = [
    {
      title: "Add an image to your latest post",
      description: "Boost engagement with a visual element that captures attention and increases shareability",
      benefit: "+35% more engagement",
      icon: FileImage,
      action: "Add Image",
      path: "/images",
      gradient: "from-slate-600 to-slate-700",
      iconBg: "bg-gradient-to-br from-slate-600 to-slate-700",
      badge: "Recommended",
      badgeColor: "bg-emerald-600/30 text-emerald-300 border-emerald-600/40",
    },
    {
      title: "Convert post to video teaser",
      description: "Create a 15-second video from your content to maximize reach across platforms",
      benefit: "+57% more reach",
      icon: Wand2,
      action: "Create Video",
      path: "/videos",
      gradient: "from-indigo-600 to-purple-600",
      iconBg: "bg-gradient-to-br from-indigo-600 to-purple-600",
      badge: "Hot",
      badgeColor: "bg-orange-600/30 text-orange-300 border-orange-600/40",
    },
    {
      title: "Add trending hashtags",
      description: "Boost your content's reach with AI-suggested hashtags that are currently trending",
      benefit: "+20% wider audience",
      icon: TrendingUp,
      action: "Add Hashtags",
      path: "/content",
      gradient: "from-teal-600 to-cyan-600",
      iconBg: "bg-gradient-to-br from-teal-600 to-cyan-600",
      badge: "Trending",
      badgeColor: "bg-blue-600/30 text-blue-300 border-blue-600/40",
    },
    {
      title: "Plan a content streak",
      description: "Schedule 7 days of consistent posts to build momentum and follower loyalty",
      benefit: "+73% follower growth",
      icon: Sparkles,
      action: "Schedule Now",
      path: "/schedule",
      gradient: "from-violet-600 to-purple-600",
      iconBg: "bg-gradient-to-br from-violet-600 to-purple-600",
      badge: "New",
      badgeColor: "bg-purple-600/30 text-purple-300 border-purple-600/40",
    }
  ];

  return (
    <section className="mb-8 animate-fadeIn" style={{ animationDelay: "200ms" }}>
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-3xl font-black text-slate-100 leading-tight">Smart Suggestions</h2>
        <Zap className="h-6 w-6 text-indigo-400 animate-pulse" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {suggestions.map((suggestion, index) => (
          <div 
            key={index} 
            className="bg-slate-800/50 border border-slate-700/60 rounded-2xl hover:border-slate-600/70 transition-all duration-300 
                     shadow-lg hover:shadow-2xl group backdrop-blur-sm overflow-hidden hover:scale-105 relative cursor-pointer
                     transform hover:-translate-y-1 animate-fadeIn"
            style={{ animationDelay: `${300 + index * 100}ms` }}
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="p-6 flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div className={`h-11 w-11 rounded-xl ${suggestion.iconBg} flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg group-hover:shadow-xl`}>
                  <suggestion.icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <span className={`text-xs px-2 py-1 rounded-full ${suggestion.badgeColor} backdrop-blur-sm font-semibold border animate-pulse`}>
                    {suggestion.badge}
                  </span>
                  <div className="flex items-center gap-1">
                    <ArrowUp className="h-3 w-3 text-emerald-400" />
                    <span className="text-xs px-3 py-1.5 rounded-full bg-emerald-600/30 text-emerald-300 backdrop-blur-sm font-semibold border border-emerald-600/40">
                      {suggestion.benefit}
                    </span>
                  </div>
                </div>
              </div>
              
              <h3 className="text-base font-bold text-slate-100 group-hover:text-white transition-colors duration-300 leading-tight mb-2">
                {suggestion.title}
              </h3>
              <p className={cn(
                "text-sm text-slate-300 mt-1 mb-4 leading-relaxed font-medium transition-all duration-300",
                hoveredCard === index ? "line-clamp-none" : "line-clamp-2"
              )}>
                {suggestion.description}
              </p>
              
              <Button 
                size="sm"
                className={`mt-auto w-full bg-slate-700/50 hover:bg-gradient-to-r ${suggestion.gradient} border border-slate-600/40 hover:border-slate-500/50 transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:scale-105 group-hover:animate-pulse text-slate-200 hover:text-white`}
              >
                {suggestion.action}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
