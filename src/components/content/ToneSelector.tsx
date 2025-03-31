
import { Tone } from "@/pages/Content";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Sparkles, BookOpen, Users, Coffee } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToneSelectorProps {
  selectedTone: Tone;
  onToneSelect: (tone: Tone) => void;
}

const tones: { value: Tone; icon: React.ReactNode; label: string }[] = [
  {
    value: "professional",
    icon: <BookOpen className="w-4 h-4" />,
    label: "Professional",
  },
  { value: "friendly", icon: <Users className="w-4 h-4" />, label: "Friendly" },
  { value: "casual", icon: <Coffee className="w-4 h-4" />, label: "Casual" },
  {
    value: "creative",
    icon: <Sparkles className="w-4 h-4" />,
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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-[12px]">
        {tones.map(({ value, icon, label }) => (
          <Button
            key={value}
            type="button"
            variant={selectedTone === value ? "default" : "outline"}
            onClick={() => onToneSelect(value)}
            className={cn(
              "flex-col h-auto py-4 gap-2 transition-all duration-300 hover:scale-105 rounded-lg shadow-lg hover:shadow-xl",
              selectedTone === value &&
                `bg-gradient-to-r ${gradients[value]} text-primary-foreground`
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
