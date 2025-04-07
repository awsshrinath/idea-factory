
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
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
  
  return (
    <div className={cn(
      "grid gap-4",
      isMobile ? "grid-cols-1" : "grid-cols-2"
    )}>
      <div className="space-y-1">
        <h1 className={cn(
          "font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent",
          isMobile ? "text-2xl" : "text-4xl"
        )}>
          Welcome back, {userName}!
        </h1>
        <p className="text-muted-foreground">
          {today}
        </p>
        <p className="text-lg font-medium mt-1 animate-fadeIn">
          Let's create something powerful today
        </p>
      </div>
      <div className={cn(
        "flex justify-end items-center",
        isMobile && "justify-start"
      )}>
        <div className={cn(
          "glass p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm w-full max-w-xs relative overflow-hidden group hover:bg-white/10 transition-all duration-300",
          isLowTokens && "border-primary/50"
        )}>
          <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Available Credits</p>
                <p className={cn(
                  "text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
                  isLowTokens ? "from-primary to-primary/70 animate-pulse" : "from-accent to-accent/70"
                )}>
                  {tokenCount} tokens
                </p>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                className="bg-white/10 border border-white/20 hover:bg-white/20"
                onClick={() => navigate("/content")}
              >
                <Sparkles className="h-4 w-4 mr-1" />
                Use Tokens
              </Button>
            </div>
            {isTopCreator && (
              <p className="text-xs text-accent mt-2 animate-fadeIn">
                You're in the top 10% of active creators this week! 🏆
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
