
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
      gradient: "from-blue-600 to-blue-700",
      iconBg: "bg-gradient-to-br from-blue-600 to-blue-700",
      badge: "Recommended",
      badgeColor: "bg-emerald-500/20 text-emerald-400",
    },
    {
      title: "Convert post to video teaser",
      description: "Create a 15-second video from your content to maximize reach across platforms",
      benefit: "+57% more reach",
      icon: Wand2,
      action: "Create Video",
      path: "/videos",
      gradient: "from-indigo-600 to-indigo-700",
      iconBg: "bg-gradient-to-br from-indigo-600 to-indigo-700",
      badge: "Hot",
      badgeColor: "bg-orange-500/20 text-orange-400",
    },
    {
      title: "Add trending hashtags",
      description: "Boost your content's reach with AI-suggested hashtags that are currently trending",
      benefit: "+20% wider audience",
      icon: TrendingUp,
      action: "Add Hashtags",
      path: "/content",
      gradient: "from-cyan-600 to-cyan-700",
      iconBg: "bg-gradient-to-br from-cyan-600 to-cyan-700",
      badge: "Trending",
      badgeColor: "bg-blue-500/20 text-blue-400",
    },
    {
      title: "Plan a content streak",
      description: "Schedule 7 days of consistent posts to build momentum and follower loyalty",
      benefit: "+73% follower growth",
      icon: Sparkles,
      action: "Schedule Now",
      path: "/schedule",
      gradient: "from-purple-600 to-purple-700",
      iconBg: "bg-gradient-to-br from-purple-600 to-purple-700",
      badge: "New",
      badgeColor: "bg-purple-500/20 text-purple-400",
    }
  ];

  return (
    <section className="mb-8 animate-fadeIn" style={{ animationDelay: "200ms" }}>
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-3xl font-black text-foreground leading-tight">Smart Suggestions</h2>
        <Zap className="h-6 w-6 text-yellow-400 animate-pulse" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {suggestions.map((suggestion, index) => (
          <div 
            key={index} 
            className="bg-gradient-to-br from-card/80 to-muted/40 border border-white/20 rounded-2xl hover:border-white/30 transition-all duration-300 
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
                  <span className={`text-xs px-2 py-1 rounded-full ${suggestion.badgeColor} backdrop-blur-sm font-semibold border border-white/10 animate-pulse`}>
                    {suggestion.badge}
                  </span>
                  <div className="flex items-center gap-1">
                    <ArrowUp className="h-3 w-3 text-green-400" />
                    <span className="text-xs px-3 py-1.5 rounded-full bg-green-500/20 text-green-400 backdrop-blur-sm font-semibold border border-green-500/30">
                      {suggestion.benefit}
                    </span>
                  </div>
                </div>
              </div>
              
              <h3 className="text-base font-bold group-hover:text-white transition-colors duration-300 leading-tight mb-2">
                {suggestion.title}
              </h3>
              <p className={cn(
                "text-sm text-muted-foreground mt-1 mb-4 leading-relaxed font-medium transition-all duration-300",
                hoveredCard === index ? "line-clamp-none" : "line-clamp-2"
              )}>
                {suggestion.description}
              </p>
              
              <Button 
                size="sm"
                className={`mt-auto w-full bg-white/10 hover:bg-gradient-to-r ${suggestion.gradient} border border-white/20 hover:border-white/30 transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:scale-105 group-hover:animate-pulse`}
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
