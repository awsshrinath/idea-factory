
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Star, Zap } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export const TipsCarousel = () => {
  const isMobile = useIsMobile();
  
  const tips = [
    {
      title: "Write Detailed Prompts",
      description: "The more specific your prompts, the better the AI can understand your needs.",
      icon: Lightbulb,
      gradient: "from-[#FF416C]/10 to-[#FF4B2B]/10",
      iconGradient: "from-[#FF416C] to-[#FF4B2B]",
    },
    {
      title: "Use Style Templates",
      description: "Save time by using pre-made style templates for your image generation.",
      icon: Star,
      gradient: "from-[#00C6FF]/10 to-[#0072FF]/10",
      iconGradient: "from-[#00C6FF] to-[#0072FF]",
    },
    {
      title: "Batch Schedule Content",
      description: "Create content in batches and schedule for consistent posting.",
      icon: Zap,
      gradient: "from-[#42E695]/10 to-[#3BB2B8]/10",
      iconGradient: "from-[#42E695] to-[#3BB2B8]",
    },
    {
      title: "Refine Image Generation",
      description: "Try different styles and prompts to get the perfect image.",
      icon: Lightbulb,
      gradient: "from-[#FFD54F]/10 to-[#FFB74D]/10",
      iconGradient: "from-[#FFD54F] to-[#FFB74D]",
    },
    {
      title: "Repurpose Your Content",
      description: "Turn blog posts into social media content and videos.",
      icon: Star,
      gradient: "from-[#8A2BE2]/10 to-[#6A5ACD]/10",
      iconGradient: "from-[#8A2BE2] to-[#6A5ACD]",
    },
  ];

  return (
    <section className="mb-5">
      <h2 className="text-2xl font-semibold mb-3">Tips & Discover</h2>
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
                  isMobile ? "basis-full" : "basis-1/3"
                )}
              >
                <Card className={`bg-gradient-to-br ${tip.gradient} border border-white/10 hover:shadow-lg transition-all duration-300 group backdrop-blur-sm hover:border-white/20 overflow-hidden`}>
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${tip.iconGradient} flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110`}>
                        <tip.icon className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle className="text-lg">{tip.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{tip.description}</CardDescription>
                  </CardContent>
                </Card>
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
