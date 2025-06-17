
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Lightbulb, Star, Zap, ArrowRight, Clock, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

export const TipsCarousel = () => {
  const isMobile = useIsMobile();
  
  const tips = [
    {
      title: "Write Detailed Prompts",
      description: "The more specific your prompts, the better the AI can understand your needs.",
      icon: Lightbulb,
      gradient: "from-[#FF416C] to-[#FF4B2B]",
      iconBg: "bg-gradient-to-br from-[#FF416C] to-[#FF4B2B]",
    },
    {
      title: "Use Style Templates",
      description: "Save time by using pre-made style templates for your image generation.",
      icon: Star,
      gradient: "from-[#00C6FF] to-[#0072FF]",
      iconBg: "bg-gradient-to-br from-[#00C6FF] to-[#0072FF]",
    },
    {
      title: "Batch Schedule Content",
      description: "Create content in batches and schedule for consistent posting.",
      icon: Clock,
      gradient: "from-[#42E695] to-[#3BB2B8]",
      iconBg: "bg-gradient-to-br from-[#42E695] to-[#3BB2B8]",
    },
    {
      title: "Refine Image Generation",
      description: "Try different styles and prompts to get the perfect image.",
      icon: Pencil,
      gradient: "from-[#FFD54F] to-[#FFB74D]",
      iconBg: "bg-gradient-to-br from-[#FFD54F] to-[#FFB74D]",
    },
    {
      title: "Repurpose Your Content",
      description: "Turn blog posts into social media content and videos.",
      icon: Zap,
      gradient: "from-[#8A2BE2] to-[#6A5ACD]",
      iconBg: "bg-gradient-to-br from-[#8A2BE2] to-[#6A5ACD]",
    },
  ];

  return (
    <section className="mb-2">
      <h2 className="text-xl font-semibold mb-3">Tips & Discover</h2>
      <div className="relative">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {tips.map((tip, index) => (
              <CarouselItem 
                key={index} 
                className={cn(
                  isMobile ? "basis-full sm:basis-1/2" : "basis-1/5 md:basis-1/4 lg:basis-1/5"
                )}
              >
                <div className="bg-black/20 border border-white/10 rounded-xl h-full p-4 hover:border-white/20 
                                hover:shadow-lg transition-all duration-300 group backdrop-blur-sm hover:bg-black/30 
                                hover:scale-[1.02] flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`h-9 w-9 rounded-lg ${tip.iconBg} flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110 shadow-lg`}>
                      <tip.icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <h3 className="text-sm font-medium mb-1 group-hover:text-white transition-colors duration-300">{tip.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-grow">{tip.description}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`mt-auto text-xs bg-white/5 border-white/10 hover:bg-gradient-to-r ${tip.gradient}`}
                  >
                    Learn More
                    <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className={cn(
            "absolute -left-4 top-1/2 -translate-y-1/2 bg-background/80 border border-white/10 h-8 w-8 hover:bg-white/10",
            isMobile && "hidden"
          )} />
          <CarouselNext className={cn(
            "absolute -right-4 top-1/2 -translate-y-1/2 bg-background/80 border border-white/10 h-8 w-8 hover:bg-white/10",
            isMobile && "hidden"
          )} />
        </Carousel>
      </div>
    </section>
  );
};
