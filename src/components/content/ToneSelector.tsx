import { Tone } from "@/types/content";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface ToneSelectorProps {
  selectedTone: Tone;
  onToneSelect: (tone: Tone) => void;
}

const tones: { value: Tone; icon: React.ReactNode; label: string }[] = [
  {
    value: "professional",
    icon: <span className="text-xl">💼</span>,
    label: "Professional",
  },
  { 
    value: "friendly", 
    icon: <span className="text-xl">🤝</span>, 
    label: "Friendly" 
  },
  { 
    value: "casual", 
    icon: <span className="text-xl">😎</span>, 
    label: "Casual" 
  },
  {
    value: "creative",
    icon: <span className="text-xl">✨</span>,
    label: "Creative",
  },
];

export function ToneSelector({ selectedTone, onToneSelect }: ToneSelectorProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-2 mb-4">
      <label className="text-sm font-medium text-[#E0E0E0] italic flex items-center gap-2">
        Select Tone
        <Tooltip>
          <TooltipTrigger>
            <Sparkles className="w-4 h-4 text-primary/60" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Choose the writing style for your content</p>
          </TooltipContent>
        </Tooltip>
      </label>
      <div className={cn(
        "tone-button-group",
        "flex flex-wrap gap-2",
        isMobile ? "justify-center" : ""
      )}>
        {tones.map(({ value, icon, label }) => (
          <Button
            key={value}
            type="button"
            onClick={() => onToneSelect(value)}
            className={cn(
              "tone-button",
              "flex-none items-center justify-center gap-2 h-9",
              "rounded-full text-sm font-medium",
              "transition-all duration-200 ease-in-out",
              "hover:scale-[1.02] hover:shadow-[0_0_12px_rgba(255,255,255,0.15)]",
              "active:scale-[0.98]",
              isMobile ? "px-3 py-2 text-sm min-w-[45%]" : "px-4 py-2",
              selectedTone === value
                ? "bg-tone-button text-white shadow-[0_0_8px_rgba(255,255,255,0.1)]"
                : "bg-muted/20 text-white hover:bg-tone-button-hover"
            )}
          >
            {icon}
            <span>{label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
