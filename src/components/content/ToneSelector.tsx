
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

const gradients = {
  professional: "from-[#FF416C] to-[#FF4B2B]",
  friendly: "from-[#42E695] to-[#3BB2B8]",
  casual: "from-[#FFD54F] to-[#FFB74D]",
  creative: "from-[#6A5ACD] to-[#8A2BE2]",
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
        "gap-3 mt-[12px]",
        isMobile 
          ? "flex flex-col space-y-2" 
          : "grid grid-cols-4 overflow-x-auto"
      )}>
        {tones.map(({ value, icon, label }) => (
          <Button
            key={value}
            type="button"
            variant={selectedTone === value ? "default" : "outline"}
            onClick={() => onToneSelect(value)}
            className={cn(
              "flex items-center justify-center gap-2 px-6 py-3 h-auto rounded-full text-base font-semibold transition-all duration-300",
              "hover:scale-105 hover:shadow-[0_2px_10px_rgba(0,0,0,0.3)]",
              selectedTone === value
                ? `bg-gradient-to-r ${gradients[value]} text-primary-foreground shadow-[0_0_8px_rgba(255,255,255,0.2)]`
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
