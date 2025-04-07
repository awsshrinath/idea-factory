
import { Button } from "@/components/ui/button";
import { Target, Star, Gift } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export const HeroBanner = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="w-full overflow-hidden rounded-xl bg-gradient-to-br from-[#1D2433]/50 to-[#283047]/50 border border-white/10 p-2 backdrop-blur-md mb-4 animate-fadeIn hover:border-white/20 transition-all duration-300">
      <div className={cn(
        "grid gap-2",
        isMobile ? "grid-cols-1" : "grid-cols-3"
      )}>
        <div className="flex items-center gap-3 p-2 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-[1.01]">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/80 to-primary/40 flex items-center justify-center shadow-[0_0_10px_rgba(233,30,99,0.2)]">
            <Target className="h-5 w-5 text-white animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-medium">Today's Goal</h3>
            <p className="text-xs text-muted-foreground">Publish 1 video and 2 posts</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-2 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-[1.01]">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-secondary/80 to-secondary/40 flex items-center justify-center shadow-[0_0_10px_rgba(0,198,255,0.2)]">
            <Star className="h-5 w-5 text-white animate-glow" />
          </div>
          <div>
            <h3 className="text-sm font-medium">Featured Tip</h3>
            <p className="text-xs text-muted-foreground">New: Convert blog to Instagram carousel</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-2 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-[1.01]">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-accent/80 to-accent/40 flex items-center justify-center shadow-[0_0_10px_rgba(66,230,149,0.2)]">
            <Gift className="h-5 w-5 text-white animate-float" />
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
