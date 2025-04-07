
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export const PersonalizedGreeting = () => {
  const isMobile = useIsMobile();
  const userName = "Creator"; // This would come from user state in a real app
  
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
      <div className="space-y-2">
        <h1 className={cn(
          "font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent",
          isMobile ? "text-2xl" : "text-4xl"
        )}>
          Welcome back, {userName}!
        </h1>
        <p className="text-muted-foreground">
          {today}
        </p>
        <p className="text-lg font-medium mt-2 animate-fadeIn">
          Let's create something powerful today
        </p>
      </div>
      <div className={cn(
        "flex justify-end items-center",
        isMobile && "justify-start"
      )}>
        <div className="glass p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <p className="text-sm text-muted-foreground">Available Credits</p>
          <p className="text-2xl font-bold bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">
            1,250 tokens
          </p>
        </div>
      </div>
    </div>
  );
};
