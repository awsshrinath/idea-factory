
import { Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  className?: string;
}

export function HeroSection({ className }: HeroSectionProps) {
  return (
    <div className={cn("text-center mb-6", className)}>
      <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent animate-gradient">
        Create Your Video Story
      </h1>
      <p className="text-xl text-muted-foreground mt-2 font-sans">
        Transform your ideas into engaging videos with AI
      </p>
    </div>
  );
}
