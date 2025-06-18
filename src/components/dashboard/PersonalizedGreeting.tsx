
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sparkles, Target, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

export const PersonalizedGreeting = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const userName = "Creator";
  const tokenCount = 1250;
  const isTopCreator = true;
  
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  
  const dailyGoalProgress = 67;
  
  return (
    <div className="mb-8">
      <div className="premium-card premium-card-hover rounded-xl p-6 backdrop-blur-sm">
        <div className={cn(
          "grid gap-6",
          isMobile ? "grid-cols-1" : "grid-cols-3"
        )}>
          {/* Welcome message */}
          <div className="space-y-2">
            <h1 className={cn(
              "font-bold leading-tight bg-gradient-to-r from-primary to-accent-gold bg-clip-text text-transparent",
              isMobile ? "text-2xl" : "text-3xl"
            )}>
              Welcome back, {userName}!
            </h1>
            <p className="text-sm text-muted-foreground font-medium">
              {today}
            </p>
          </div>
          
          {/* Goal progress */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold text-foreground">Today's Goal</span>
              <span className="text-xs text-primary ml-auto font-medium">2/3 complete</span>
            </div>
            <Progress value={dailyGoalProgress} className="h-2 rounded-full" />
            <div className="grid grid-cols-3 gap-2 mt-3">
              <div className="glass-card rounded-lg p-3 text-center hover:bg-white/[0.04] transition-colors duration-200">
                <span className="text-xs text-muted-foreground font-medium">Posts</span>
                <p className="text-sm font-semibold mt-1">1/1</p>
              </div>
              <div className="glass-card rounded-lg p-3 text-center hover:bg-white/[0.04] transition-colors duration-200">
                <span className="text-xs text-muted-foreground font-medium">Videos</span>
                <p className="text-sm font-semibold mt-1">1/1</p>
              </div>
              <div className="glass-card rounded-lg p-3 text-center hover:bg-white/[0.04] transition-colors duration-200">
                <span className="text-xs text-muted-foreground font-medium">Images</span>
                <p className="text-sm font-semibold mt-1">0/1</p>
              </div>
            </div>
          </div>
          
          {/* Tokens */}
          <div>
            <div className={cn(
              "flex flex-col space-y-4",
              isMobile && "mt-4"
            )}>
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary animate-subtleGlow" />
                    <p className="text-xs text-muted-foreground font-medium">Available Credits</p>
                  </div>
                  <p className="text-xl font-bold bg-gradient-to-r from-primary to-accent-gold bg-clip-text text-transparent leading-tight">
                    {tokenCount} tokens
                  </p>
                </div>
                <Button 
                  size="sm" 
                  className="premium-button bg-gradient-accent hover:shadow-glow border border-white/10 hover:border-white/20 micro-bounce"
                  onClick={() => navigate("/content")}
                >
                  <Sparkles className="h-3 w-3 mr-2" />
                  Use Tokens
                </Button>
              </div>
              {isTopCreator && (
                <p className="text-xs text-primary flex items-center gap-2 animate-fadeIn font-medium leading-relaxed">
                  <TrendingUp className="h-3 w-3" />
                  You're in the top 10% of active creators this week! 🏆
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
