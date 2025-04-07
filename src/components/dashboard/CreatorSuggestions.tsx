
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
      gradient: "from-[#FF416C] to-[#FF4B2B]",
      iconBg: "bg-gradient-to-br from-[#FF416C] to-[#FF4B2B]",
    },
    {
      title: "Convert post to video teaser",
      description: "Create a 15-second video from your content",
      benefit: "+57% more reach",
      icon: Wand2,
      action: "Create Video",
      path: "/videos",
      gradient: "from-[#00C6FF] to-[#0072FF]",
      iconBg: "bg-gradient-to-br from-[#00C6FF] to-[#0072FF]",
    },
    {
      title: "Add trending hashtags",
      description: "Boost your content's reach",
      benefit: "+20% wider audience",
      icon: TrendingUp,
      action: "Add Hashtags",
      path: "/content",
      gradient: "from-[#42E695] to-[#3BB2B8]",
      iconBg: "bg-gradient-to-br from-[#42E695] to-[#3BB2B8]",
    },
    {
      title: "Plan a content streak",
      description: "Schedule 7 days of consistent posts",
      benefit: "+73% follower growth",
      icon: Sparkles,
      action: "Schedule Now",
      path: "/schedule",
      gradient: "from-[#FFD54F] to-[#FFB74D]",
      iconBg: "bg-gradient-to-br from-[#FFD54F] to-[#FFB74D]",
    }
  ];

  return (
    <section className="mb-4">
      <h2 className="text-xl font-semibold mb-3">Smart Suggestions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {suggestions.map((suggestion, index) => (
          <div 
            key={index} 
            className="bg-black/30 border border-white/10 rounded-xl hover:border-white/20 transition-all duration-300 
                     hover:shadow-lg group backdrop-blur-sm overflow-hidden hover:scale-[1.02] relative"
            style={{
              backgroundImage: `linear-gradient(130deg, rgba(${index % 2 === 0 ? '233, 30, 99, 0.07' : '0, 198, 255, 0.07'}) 0%, rgba(${index % 2 === 0 ? '255, 211, 79, 0.05' : '66, 230, 149, 0.05'}) 100%)`,
            }}
          >
            <div className="p-4 flex flex-col h-full">
              <div className="flex justify-between items-center mb-3">
                <div className={`h-9 w-9 rounded-lg ${suggestion.iconBg} flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110 shadow-lg`}>
                  <suggestion.icon className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/70 backdrop-blur-sm">
                  {suggestion.benefit}
                </span>
              </div>
              
              <h3 className="text-base font-medium group-hover:text-white transition-colors duration-300">
                {suggestion.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 mb-3 line-clamp-2">
                {suggestion.description}
              </p>
              
              <Button 
                size="sm"
                className={`mt-auto w-full bg-white/10 hover:bg-gradient-to-r ${suggestion.gradient} border border-white/20 hover:border-white/30 transition-all duration-300`}
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
