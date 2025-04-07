
import { Button } from "@/components/ui/button";
import { Target, Star, Gift } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export const HeroBanner = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="w-full overflow-hidden rounded-xl bg-gradient-to-br from-[#1D2433]/80 to-[#283047]/80 border border-white/10 p-4 backdrop-blur-md animate-fadeIn">
      <div className={cn(
        "grid gap-4",
        isMobile ? "grid-cols-1" : "grid-cols-3"
      )}>
        <div className="flex items-center gap-3 p-2 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300">
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Target className="h-5 w-5 text-primary animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-medium">Today's Goal</h3>
            <p className="text-xs text-muted-foreground">Publish 1 video and 2 posts</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-2 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300">
          <div className="h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center">
            <Star className="h-5 w-5 text-secondary animate-glow" />
          </div>
          <div>
            <h3 className="text-sm font-medium">Featured Tip</h3>
            <p className="text-xs text-muted-foreground">New: Convert blog to Instagram carousel</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-2 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300">
          <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
            <Gift className="h-5 w-5 text-accent animate-float" />
          </div>
          <div>
            <h3 className="text-sm font-medium">Special Perks</h3>
            <p className="text-xs text-muted-foreground">Double Tokens this week!</p>
          </div>
        </div>
      </div>
    </div>
  );
};
