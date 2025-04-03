
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

// Updated gradients with more harmonious colors including new casual blue gradient
const gradients = {
  professional: "bg-gradient-to-r from-[#FF416C] to-[#FF4B2B]", // Keep as is
  friendly: "bg-gradient-to-r from-[#90F5C3] to-[#48D9E4]", // Soft teal
  casual: "bg-gradient-to-r from-[#4facfe] to-[#00f2fe]", // Light blue gradient
  creative: "bg-gradient-to-r from-[#C084FC] to-[#FF6DCE]", // Soft purple-pink gradient
};

// Shadows for selected states
const selectedShadows = {
  professional: "shadow-[0_0_12px_rgba(255,75,43,0.5)]",
  friendly: "shadow-[0_0_12px_rgba(72,217,228,0.5)]",
  casual: "shadow-[0_0_8px_rgba(0,242,254,0.5)]", // Subtle inner glow for casual
  creative: "shadow-[0_0_12px_rgba(192,132,252,0.5)]",
};

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
        isMobile 
          ? "flex overflow-x-auto pb-2 space-x-3 no-scrollbar" 
          : "flex flex-wrap gap-3"
      )}>
        {tones.map(({ value, icon, label }) => (
          <Button
            key={value}
            type="button"
            variant="outline"
            onClick={() => onToneSelect(value)}
            className={cn(
              "flex-none items-center justify-center gap-2 h-auto rounded-full text-base font-semibold",
              "transition-all duration-200 ease-in-out",
              "hover:scale-105 hover:shadow-[0_4px_12px_rgba(0,0,0,0.25)]",
              "min-w-0 border-2",
              isMobile ? "px-4 py-2 text-sm" : "px-6 py-3",
              selectedTone === value
                ? cn(
                    gradients[value],
                    "text-white scale-105",
                    selectedShadows[value],
                    "border-white/60"
                  )
                : "bg-transparent border-white/20 text-white"
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
