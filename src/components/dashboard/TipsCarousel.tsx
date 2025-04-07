
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
    },
    {
      title: "Use Style Templates",
      description: "Save time by using pre-made style templates for your image generation.",
      icon: Star,
    },
    {
      title: "Batch Schedule Content",
      description: "Create content in batches and schedule for consistent posting.",
      icon: Zap,
    },
    {
      title: "Refine Image Generation",
      description: "Try different styles and prompts to get the perfect image.",
      icon: Lightbulb,
    },
    {
      title: "Repurpose Your Content",
      description: "Turn blog posts into social media content and videos.",
      icon: Star,
    },
  ];

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Tips & Discover</h2>
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
                <Card className="bg-gradient-to-br from-[#1D2433] to-[#283047] border border-white/10 hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <div className="bg-primary/20 p-2 rounded-full">
                        <tip.icon className="h-5 w-5 text-primary" />
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
            "absolute left-0 top-1/2 -translate-y-1/2 bg-background/80 border border-white/10",
            isMobile && "hidden"
          )} />
          <CarouselNext className={cn(
            "absolute right-0 top-1/2 -translate-y-1/2 bg-background/80 border border-white/10",
            isMobile && "hidden"
          )} />
        </Carousel>
      </div>
    </section>
  );
};
