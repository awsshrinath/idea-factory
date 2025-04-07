
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wand2, Sparkles, TrendingUp } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export const CreatorSuggestions = () => {
  const isMobile = useIsMobile();
  
  const suggestions = [
    {
      title: "Add an image to your latest post",
      description: "Boost engagement with a visual element",
      icon: Sparkles,
      action: "Add Image",
      path: "/images",
      gradient: "from-[#FF416C]/5 to-[#FF4B2B]/5",
      iconGradient: "from-[#FF416C] to-[#FF4B2B]",
    },
    {
      title: "Convert post to video teaser",
      description: "Create a 15-second video from your content",
      icon: Wand2,
      action: "Create Video",
      path: "/videos",
      gradient: "from-[#00C6FF]/5 to-[#0072FF]/5",
      iconGradient: "from-[#00C6FF] to-[#0072FF]",
    },
    {
      title: "Add trending hashtags",
      description: "Boost your content's reach",
      icon: TrendingUp,
      action: "Add Hashtags",
      path: "/content",
      gradient: "from-[#42E695]/5 to-[#3BB2B8]/5", 
      iconGradient: "from-[#42E695] to-[#3BB2B8]",
    }
  ];

  return (
    <section className="mb-5">
      <h2 className="text-2xl font-semibold mb-3">Smart Suggestions</h2>
      <div className={cn(
        "grid gap-3",
        isMobile ? "grid-cols-1" : "grid-cols-3"
      )}>
        {suggestions.map((suggestion, index) => (
          <Card 
            key={index} 
            className={`bg-gradient-to-br ${suggestion.gradient} border-white/10 hover:bg-white/10 transition-all duration-300 hover:shadow-lg group backdrop-blur-sm hover:border-white/20`}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center bg-gradient-to-br ${suggestion.iconGradient} transform transition-transform duration-300 group-hover:scale-110`}>
                    <suggestion.icon className="h-4 w-4 text-white" />
                  </div>
                  <span className="group-hover:text-white transition-colors duration-300">
                    {suggestion.title}
                  </span>
                </CardTitle>
              </div>
              <CardDescription>{suggestion.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                size="sm"
                className="w-full bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 transition-all duration-300"
              >
                {suggestion.action}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
