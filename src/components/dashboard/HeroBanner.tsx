
import { Button } from "@/components/ui/button";
import { Target, Star, Gift } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export const HeroBanner = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="w-full overflow-hidden rounded-2xl bg-gradient-to-br from-card/70 via-card/50 to-muted/30 border border-white/20 p-3 backdrop-blur-md mb-8 animate-fadeIn hover:border-white/30 transition-all duration-300 shadow-lg hover:shadow-xl">
      <div className={cn(
        "grid gap-3",
        isMobile ? "grid-cols-1" : "grid-cols-3"
      )}>
        <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl border border-white/15 hover:bg-white/15 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-600/80 to-blue-700/60 flex items-center justify-center shadow-lg">
            <Target className="h-6 w-6 text-white animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold leading-tight">Today's Goal</h3>
            <p className="text-sm text-muted-foreground font-medium">Publish 1 video and 2 posts</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl border border-white/15 hover:bg-white/15 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-600/80 to-indigo-700/60 flex items-center justify-center shadow-lg">
            <Star className="h-6 w-6 text-white animate-glow" />
          </div>
          <div>
            <h3 className="text-base font-bold leading-tight">Featured Tip</h3>
            <p className="text-sm text-muted-foreground font-medium">New: Convert blog to Instagram carousel</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl border border-white/15 hover:bg-white/15 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-600/80 to-purple-700/60 flex items-center justify-center shadow-lg">
            <Gift className="h-6 w-6 text-white animate-float" />
          </div>
          <div>
            <h3 className="text-base font-bold leading-tight">Special Perks</h3>
            <p className="text-sm text-muted-foreground font-medium">Double Tokens this week!</p>
          </div>
        </div>
      </div>
    </div>
  );
};
