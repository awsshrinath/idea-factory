
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sparkles, Calendar, Target, Gift, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

export const PersonalizedGreeting = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const userName = "Creator"; // This would come from user state in a real app
  const tokenCount = 1250;
  const isLowTokens = tokenCount < 500;
  const isTopCreator = true;
  
  // Format today's date
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  
  // Daily goal progress (2 of 3 posts completed)
  const dailyGoalProgress = 67; // 2/3 = ~67%
  
  return (
    <div className="mb-4">
      <div className="bg-gradient-to-r from-black/30 to-black/20 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
        <div className={cn(
          "grid gap-4",
          isMobile ? "grid-cols-1" : "grid-cols-3"
        )}>
          {/* Left: Welcome message */}
          <div className="space-y-1">
            <h1 className={cn(
              "font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent",
              isMobile ? "text-2xl" : "text-3xl"
            )}>
              Welcome back, {userName}!
            </h1>
            <p className="text-sm text-muted-foreground">
              {today}
            </p>
          </div>
          
          {/* Middle: Goal progress */}
          <div>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Today's Goal</span>
              <span className="text-xs text-primary ml-auto">2/3 complete</span>
            </div>
            <Progress value={dailyGoalProgress} className="h-2 mt-2" />
            <div className="grid grid-cols-3 gap-1 mt-3">
              <div className="bg-white/5 rounded-md p-1.5 text-center border border-white/5">
                <span className="text-xs text-white/70">Posts</span>
                <p className="text-sm font-medium">1/1</p>
              </div>
              <div className="bg-white/5 rounded-md p-1.5 text-center border border-white/5">
                <span className="text-xs text-white/70">Videos</span>
                <p className="text-sm font-medium">1/1</p>
              </div>
              <div className="bg-white/5 rounded-md p-1.5 text-center border border-white/5">
                <span className="text-xs text-white/70">Images</span>
                <p className="text-sm font-medium">0/1</p>
              </div>
            </div>
          </div>
          
          {/* Right: Tokens */}
          <div>
            <div className={cn(
              "flex flex-col",
              isMobile && "mt-2"
            )}>
              <div className="flex justify-between items-center mb-2">
                <div>
                  <div className="flex items-center gap-1">
                    <Sparkles className={cn(
                      "h-4 w-4",
                      isLowTokens ? "text-primary/70" : "text-accent/70"
                    )} />
                    <p className="text-sm text-muted-foreground">Available Credits</p>
                  </div>
                  <p className={cn(
                    "text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
                    isLowTokens ? "from-primary to-primary/70" : "from-accent to-accent/70"
                  )}>
                    {tokenCount} tokens
                  </p>
                </div>
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-accent to-secondary border border-white/20 hover:border-white/30 hover:shadow-[0_0_15px_rgba(66,230,149,0.2)]"
                  onClick={() => navigate("/content")}
                >
                  <Sparkles className="h-4 w-4 mr-1" />
                  Use Tokens
                </Button>
              </div>
              {isTopCreator && (
                <p className="text-xs text-accent flex items-center gap-1 animate-fadeIn">
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
