
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  className?: string;
}

export function HeroSection({ className }: HeroSectionProps) {
  return (
    <div className={cn("text-center mb-6", className)}>
      <h1 className="text-5xl md:text-6xl font-heading font-bold bg-gradient-to-r from-[#FF6B9C] via-[#E469F5] to-[#9181F3] bg-clip-text text-transparent pb-2">
        Create Your Video Story
      </h1>
      <p className="text-xl text-muted-foreground mt-2">
        Transform your ideas into engaging videos with AI
      </p>
    </div>
  );
}
