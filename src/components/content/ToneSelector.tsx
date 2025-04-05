
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

// Unified gradient for selected tone buttons
const selectedGradient = "bg-gradient-to-r from-[#2b5876] to-[#4e4376]";
const selectedShadow = "shadow-[0_0_8px_rgba(255,255,255,0.2)]";

export function ToneSelector({ selectedTone, onToneSelect }: ToneSelectorProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-3 mb-6">
      <label className="text-sm font-medium text-[#E0E0E0] italic flex items-center gap-2 text-[14px] font-[500]">
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
        "tone-button-group", // Class for mobile targeting
        "flex flex-wrap gap-3",
        isMobile ? "justify-center" : ""
      )}>
        {tones.map(({ value, icon, label }) => (
          <Button
            key={value}
            type="button"
            variant="outline"
            onClick={() => onToneSelect(value)}
            className={cn(
              "tone-button", // Class for mobile targeting
              "flex-none items-center justify-center gap-2 h-auto",
              "rounded-full text-base font-semibold",
              "transition-all duration-200 ease-in-out",
              "border-2",
              "hover:scale-[1.03] hover:shadow-[0_4px_12px_rgba(255,255,255,0.1)] hover:brightness-95",
              "active:scale-[0.98]", // Scale effect on click
              isMobile ? "px-4 py-3 text-sm min-w-[48%]" : "px-6 py-3",
              selectedTone === value
                ? cn(
                    selectedGradient,
                    "text-white",
                    selectedShadow,
                    "border-white/20"
                  )
                : "bg-transparent border-white/10 text-white hover:bg-transparent"
            )}
          >
            {icon}
            <span className={cn(isMobile && "text-sm")}>
              {label}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}
