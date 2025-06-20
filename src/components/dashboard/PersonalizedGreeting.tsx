
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
      <div className="premium-card premium-card-hover rounded-2xl p-8 backdrop-blur-sm border border-white/10">
        <div className={cn(
          "grid gap-8",
          isMobile ? "grid-cols-1" : "grid-cols-3"
        )}>
          {/* Welcome message */}
          <div className="space-y-3">
            <h1 className={cn(
              "enterprise-heading mb-2",
              isMobile ? "text-3xl" : "text-4xl"
            )}>
              Welcome back, {userName}!
            </h1>
            <p className="premium-caption">
              {today}
            </p>
          </div>
          
          {/* Goal progress */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-600/20 to-indigo-600/20 flex items-center justify-center border border-purple-500/20">
                  <Target className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <span className="premium-subheading text-lg">Today's Goal</span>
                  <p className="text-xs text-purple-400 font-bold tracking-wide mt-1">2/3 COMPLETE</p>
                </div>
              </div>
            </div>
            <Progress value={dailyGoalProgress} className="h-3 rounded-full bg-slate-800/50 shadow-inner" />
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="glass-card rounded-xl p-4 text-center hover:bg-white/[0.06] transition-all duration-300 border border-white/5">
                <span className="premium-caption block mb-2">Posts</span>
                <p className="premium-stats text-lg">1/1</p>
              </div>
              <div className="glass-card rounded-xl p-4 text-center hover:bg-white/[0.06] transition-all duration-300 border border-white/5">
                <span className="premium-caption block mb-2">Videos</span>
                <p className="premium-stats text-lg">1/1</p>
              </div>
              <div className="glass-card rounded-xl p-4 text-center hover:bg-white/[0.06] transition-all duration-300 border border-white/5">
                <span className="premium-caption block mb-2">Images</span>
                <p className="text-lg font-bold text-white/60">0/1</p>
              </div>
            </div>
          </div>
          
          {/* Tokens */}
          <div>
            <div className={cn(
              "flex flex-col space-y-6",
              isMobile && "mt-6"
            )}>
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center border border-amber-500/20">
                      <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
                    </div>
                    <p className="premium-caption">Available Credits</p>
                  </div>
                  <p className="premium-stats text-3xl leading-tight">
                    {tokenCount.toLocaleString()} tokens
                  </p>
                </div>
                <Button 
                  size="sm" 
                  className="premium-button bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-xl hover:shadow-purple-500/25 border border-purple-500/20 hover:border-purple-400/40 micro-bounce text-sm font-semibold px-6 py-3 h-auto"
                  onClick={() => navigate("/content")}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Use Tokens
                </Button>
              </div>
              {isTopCreator && (
                <div className="premium-card rounded-xl p-4 border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 to-green-500/5">
                  <p className="premium-body text-sm flex items-center gap-3 text-emerald-300">
                    <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <TrendingUp className="h-3 w-3 text-emerald-400" />
                    </div>
                    You're in the top 10% of active creators this week! 🏆
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
