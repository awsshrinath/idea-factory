
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

// Updated gradients with more harmonious, slightly muted colors
const gradients = {
  professional: "bg-gradient-to-r from-[#FF416C] to-[#FF4B2B]", // Keep as is
  friendly: "bg-gradient-to-r from-[#90F5C3] to-[#48D9E4]", // Changed from neon green to soft teal
  casual: "bg-gradient-to-r from-[#1F1F1F] to-[#3D3D3D]", // Subtle warm gray gradient
  creative: "bg-gradient-to-r from-[#C084FC] to-[#FF6DCE]", // Soft purple-pink gradient
};

export function ToneSelector({ selectedTone, onToneSelect }: ToneSelectorProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[#ccc] italic flex items-center gap-2 text-[14px] font-[500] mb-[16px]">
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
        "flex flex-wrap justify-center gap-3 mt-[12px]",
        isMobile && "overflow-x-auto pb-2 snap-x snap-mandatory flex-nowrap justify-start"
      )}>
        {tones.map(({ value, icon, label }) => (
          <Button
            key={value}
            type="button"
            variant="outline"
            onClick={() => onToneSelect(value)}
            className={cn(
              "flex items-center justify-center gap-2 h-auto rounded-full text-base font-semibold transition-all duration-300",
              "hover:scale-105 hover:shadow-[0_4px_12px_rgba(0,0,0,0.25)]", // Enhanced hover effects
              "flex-shrink-0 min-w-auto width-auto",
              isMobile ? "px-4 py-2 snap-center" : "px-6 py-3",
              selectedTone === value
                ? cn(
                    gradients[value],
                    "text-primary-foreground shadow-[0_0_12px_rgba(255,255,255,0.25)]" // Enhanced glow
                  )
                : "bg-transparent border border-white/20 text-foreground"
            )}
          >
            {icon}
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}
