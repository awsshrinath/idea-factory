
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
    <div className="mb-8">
      <div className="bg-gradient-to-br from-card/80 via-card/60 to-muted/40 border border-white/20 rounded-2xl p-6 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-300">
        <div className={cn(
          "grid gap-6",
          isMobile ? "grid-cols-1" : "grid-cols-3"
        )}>
          {/* Left: Welcome message */}
          <div className="space-y-2">
            <h1 className={cn(
              "font-black leading-tight bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 bg-clip-text text-transparent",
              isMobile ? "text-3xl" : "text-4xl"
            )}>
              Welcome back, {userName}!
            </h1>
            <p className="text-base text-muted-foreground font-medium">
              {today}
            </p>
          </div>
          
          {/* Middle: Goal progress */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Target className="h-6 w-6 text-blue-600" />
              <span className="text-base font-bold text-foreground">Today's Goal</span>
              <span className="text-sm text-blue-600 ml-auto font-semibold">2/3 complete</span>
            </div>
            <Progress value={dailyGoalProgress} className="h-3 rounded-full" />
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="bg-white/10 rounded-xl p-3 text-center border border-white/10 hover:bg-white/15 transition-colors duration-200">
                <span className="text-xs text-white/80 font-medium">Posts</span>
                <p className="text-base font-bold mt-1">1/1</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3 text-center border border-white/10 hover:bg-white/15 transition-colors duration-200">
                <span className="text-xs text-white/80 font-medium">Videos</span>
                <p className="text-base font-bold mt-1">1/1</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3 text-center border border-white/10 hover:bg-white/15 transition-colors duration-200">
                <span className="text-xs text-white/80 font-medium">Images</span>
                <p className="text-base font-bold mt-1">0/1</p>
              </div>
            </div>
          </div>
          
          {/* Right: Tokens */}
          <div>
            <div className={cn(
              "flex flex-col space-y-4",
              isMobile && "mt-4"
            )}>
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className={cn(
                      "h-5 w-5",
                      isLowTokens ? "text-blue-500" : "text-blue-600"
                    )} />
                    <p className="text-sm text-muted-foreground font-medium">Available Credits</p>
                  </div>
                  <p className={cn(
                    "text-2xl font-black bg-gradient-to-r bg-clip-text text-transparent leading-tight",
                    isLowTokens ? "from-blue-500 to-blue-600" : "from-blue-600 to-blue-700"
                  )}>
                    {tokenCount} tokens
                  </p>
                </div>
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border border-white/20 hover:border-white/30 hover:shadow-lg shadow-md transition-all duration-300 transform hover:scale-105"
                  onClick={() => navigate("/content")}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Use Tokens
                </Button>
              </div>
              {isTopCreator && (
                <p className="text-sm text-blue-400 flex items-center gap-2 animate-fadeIn font-medium leading-relaxed">
                  <TrendingUp className="h-4 w-4" />
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
