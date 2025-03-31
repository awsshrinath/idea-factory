
import { Platform } from "@/pages/Content";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Sparkles, Linkedin, Twitter, Facebook } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlatformSelectorProps {
  selectedPlatforms: Platform[];
  onPlatformToggle: (platform: Platform) => void;
}

const platforms: { value: Platform; icon: React.ReactNode; label: string }[] = [
  { value: "linkedin", icon: <Linkedin className="w-4 h-4" />, label: "LinkedIn" },
  { value: "twitter", icon: <Twitter className="w-4 h-4" />, label: "Twitter" },
  { value: "facebook", icon: <Facebook className="w-4 h-4" />, label: "Facebook" },
];

export function PlatformSelector({ selectedPlatforms, onPlatformToggle }: PlatformSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[#ccc] italic flex items-center gap-2 text-[14px] font-[500] mb-[16px]">
        Select Platforms
        <Tooltip>
          <TooltipTrigger>
            <Sparkles className="w-4 h-4 text-primary/60" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Choose where to publish your content</p>
          </TooltipContent>
        </Tooltip>
      </label>
      <div className="flex flex-wrap gap-2 mt-[12px]">
        {platforms.map(({ value, icon, label }) => (
          <Button
            key={value}
            type="button"
            variant={selectedPlatforms.includes(value) ? "default" : "outline"}
            onClick={() => onPlatformToggle(value)}
            className={cn(
              "gap-2 transition-all duration-300 hover:scale-105 rounded-lg shadow-lg hover:shadow-xl",
              selectedPlatforms.includes(value) &&
                "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground"
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
