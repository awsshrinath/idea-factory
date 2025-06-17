
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

interface PlaceholderCardsProps {
  count?: number;
}

export function PlaceholderCards({ count = 8 }: PlaceholderCardsProps) {
  return (
    <>
      {Array(count).fill(0).map((_, i) => (
        <Card 
          key={`placeholder-${i}`} 
          className="p-3 bg-muted/10 border border-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all duration-300 group overflow-hidden"
        >
          <div className="aspect-square w-full overflow-hidden rounded-md relative bg-gradient-to-br from-muted/20 via-muted/30 to-muted/20 animate-shimmer bg-[length:200%_100%] flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center backdrop-blur-[2px]">
              <div className="p-4 text-center">
                <Sparkles className="h-8 w-8 mb-2 mx-auto text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground font-medium">Generate images to unlock</p>
              </div>
            </div>
          </div>
          
          <div className="mt-2 space-y-2">
            <div className="h-5 rounded bg-muted/20 animate-shimmer bg-[length:200%_100%]"></div>
            <div className="flex gap-1">
              <Badge variant="shimmer" className="w-16">Style</Badge>
              <Badge variant="shimmer" className="w-12">Ratio</Badge>
            </div>
            <div className="flex gap-1 h-8">
              <div className="h-full flex-1 rounded bg-muted/20 animate-shimmer bg-[length:200%_100%]"></div>
              <div className="h-full w-9 rounded bg-muted/20 animate-shimmer bg-[length:200%_100%]"></div>
            </div>
          </div>
        </Card>
      ))}
    </>
  );
}
