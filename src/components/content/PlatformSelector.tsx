
import { Platform } from "@/types/content";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Linkedin, 
  Twitter, 
  Facebook, 
  Instagram, 
  Globe, 
  Sparkles 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";

interface PlatformSelectorProps {
  selectedPlatforms: Platform[];
  onPlatformToggle: (platform: Platform) => void;
}

const platforms: { 
  value: Platform; 
  icon: React.ReactNode; 
  label: string;
  color: string;
}[] = [
  { 
    value: "linkedin", 
    icon: <Linkedin className="w-4 h-4" />, 
    label: "LinkedIn",
    color: "from-blue-600 to-blue-800"
  },
  { 
    value: "twitter", 
    icon: <Twitter className="w-4 h-4" />, 
    label: "Twitter",
    color: "from-sky-400 to-sky-600"
  },
  { 
    value: "facebook", 
    icon: <Facebook className="w-4 h-4" />, 
    label: "Facebook",
    color: "from-blue-500 to-indigo-600"
  },
];

export function PlatformSelector({ selectedPlatforms, onPlatformToggle }: PlatformSelectorProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-[#E0E0E0] italic flex items-center gap-2 text-[14px] font-[500]">
          Platforms
          <Tooltip>
            <TooltipTrigger>
              <Sparkles className="w-4 h-4 text-primary/60" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Choose where to publish your content</p>
            </TooltipContent>
          </Tooltip>
        </label>
        {selectedPlatforms.length > 0 && (
          <Badge variant="outline" className="bg-muted/30 text-xs">
            {selectedPlatforms.length} selected
          </Badge>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {platforms.map(({ value, icon, label, color }) => {
          const isSelected = selectedPlatforms.includes(value);
          
          return (
            <Button
              key={value}
              type="button"
              variant={isSelected ? "default" : "outline"}
              onClick={() => onPlatformToggle(value)}
              className={cn(
                "gap-2 transition-all duration-300 hover:scale-105 rounded-full shadow-sm",
                isSelected
                  ? `bg-gradient-to-r ${color} text-white border-none`
                  : "bg-transparent border border-white/10 text-white hover:border-white/30"
              )}
            >
              {icon}
              {label}
            </Button>
          )}
        )}
      </div>
    </div>
  );
}
