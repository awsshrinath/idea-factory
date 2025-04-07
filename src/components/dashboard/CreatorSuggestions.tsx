
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
      path: "/images"
    },
    {
      title: "Convert post to video teaser",
      description: "Create a 15-second video from your content",
      icon: Wand2,
      action: "Create Video",
      path: "/videos"
    },
    {
      title: "Add trending hashtags",
      description: "Boost your content's reach",
      icon: TrendingUp,
      action: "Add Hashtags",
      path: "/content"
    }
  ];

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">Smart Suggestions</h2>
      <div className={cn(
        "grid gap-4",
        isMobile ? "grid-cols-1" : "grid-cols-3"
      )}>
        {suggestions.map((suggestion, index) => (
          <Card 
            key={index} 
            className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 group"
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <suggestion.icon className="h-5 w-5 text-primary group-hover:text-secondary transition-colors duration-300" />
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
                className="w-full bg-gradient-to-r from-primary to-primary-hover hover:shadow-md hover:shadow-primary/30 transition-all duration-300"
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
