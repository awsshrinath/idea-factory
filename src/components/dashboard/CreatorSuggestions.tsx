
import { Button } from "@/components/ui/button";
import { Wand2, Sparkles, TrendingUp, FileImage } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export const CreatorSuggestions = () => {
  const isMobile = useIsMobile();
  
  const suggestions = [
    {
      title: "Add an image to your latest post",
      description: "Boost engagement with a visual element",
      benefit: "+35% more engagement",
      icon: FileImage,
      action: "Add Image",
      path: "/images",
      gradient: "from-blue-600 to-blue-700",
      iconBg: "bg-gradient-to-br from-blue-600 to-blue-700",
    },
    {
      title: "Convert post to video teaser",
      description: "Create a 15-second video from your content",
      benefit: "+57% more reach",
      icon: Wand2,
      action: "Create Video",
      path: "/videos",
      gradient: "from-indigo-600 to-indigo-700",
      iconBg: "bg-gradient-to-br from-indigo-600 to-indigo-700",
    },
    {
      title: "Add trending hashtags",
      description: "Boost your content's reach",
      benefit: "+20% wider audience",
      icon: TrendingUp,
      action: "Add Hashtags",
      path: "/content",
      gradient: "from-cyan-600 to-cyan-700",
      iconBg: "bg-gradient-to-br from-cyan-600 to-cyan-700",
    },
    {
      title: "Plan a content streak",
      description: "Schedule 7 days of consistent posts",
      benefit: "+73% follower growth",
      icon: Sparkles,
      action: "Schedule Now",
      path: "/schedule",
      gradient: "from-purple-600 to-purple-700",
      iconBg: "bg-gradient-to-br from-purple-600 to-purple-700",
    }
  ];

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-6 text-foreground leading-tight">Smart Suggestions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {suggestions.map((suggestion, index) => (
          <div 
            key={index} 
            className="bg-gradient-to-br from-card/80 to-muted/40 border border-white/20 rounded-2xl hover:border-white/30 transition-all duration-300 
                     shadow-lg hover:shadow-2xl group backdrop-blur-sm overflow-hidden hover:scale-105 relative"
          >
            <div className="p-6 flex flex-col h-full">
              <div className="flex justify-between items-center mb-4">
                <div className={`h-11 w-11 rounded-xl ${suggestion.iconBg} flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 shadow-lg group-hover:shadow-xl`}>
                  <suggestion.icon className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs px-3 py-1.5 rounded-full bg-white/15 text-white/90 backdrop-blur-sm font-semibold border border-white/20">
                  {suggestion.benefit}
                </span>
              </div>
              
              <h3 className="text-base font-bold group-hover:text-white transition-colors duration-300 leading-tight mb-2">
                {suggestion.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4 line-clamp-2 leading-relaxed font-medium">
                {suggestion.description}
              </p>
              
              <Button 
                size="sm"
                className={`mt-auto w-full bg-white/10 hover:bg-gradient-to-r ${suggestion.gradient} border border-white/20 hover:border-white/30 transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:scale-105`}
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
