import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Gamepad2, 
  Sparkles, 
  Brain, 
  Building, 
  Palette, 
  Camera, 
  Brush, 
  Lightbulb, 
  Mountain, 
  Hand as HandIcon, 
  X,
  Info,
  LucideIcon 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MoodOption {
  id: string;
  label: string;
  icon: LucideIcon;
  keywords: string[];
  description: string;
}

const moodOptions: MoodOption[] = [
  { 
    id: "vibrant", 
    label: "Vibrant", 
    icon: Sparkles,
    keywords: ["colorful", "vivid", "bright", "energetic"],
    description: "Bold, energetic colors and high contrast"
  },
  { 
    id: "game", 
    label: "Game Art", 
    icon: Gamepad2,
    keywords: ["stylized", "game assets", "low poly", "pixelated"],
    description: "Stylized aesthetics inspired by video games"
  },
  { 
    id: "calm", 
    label: "Calm", 
    icon: Mountain,
    keywords: ["serene", "peaceful", "natural", "soft"],
    description: "Gentle, soothing aesthetics with soft colors"
  },
  { 
    id: "abstract", 
    label: "Abstract", 
    icon: Brain,
    keywords: ["non-figurative", "experimental", "shapes", "conceptual"],
    description: "Non-representational designs using shapes and patterns"
  },
  { 
    id: "urban", 
    label: "Urban", 
    icon: Building,
    keywords: ["city", "street", "metropolitan", "graffiti"],
    description: "City aesthetics with urban elements and energy"
  },
  { 
    id: "artistic", 
    label: "Artistic", 
    icon: Palette,
    keywords: ["painterly", "expressive", "textured", "brushstrokes"],
    description: "Expressive, painterly style with visible technique"
  },
  { 
    id: "realistic", 
    label: "Realistic", 
    icon: Camera,
    keywords: ["photorealistic", "detailed", "lifelike", "high-fidelity"],
    description: "Photorealistic rendering with high detail"
  },
  { 
    id: "hand-drawn", 
    label: "Hand-Drawn", 
    icon: Brush,
    keywords: ["sketch", "doodle", "illustrated", "hand-crafted"],
    description: "Illustrations with a hand-crafted appearance"
  },
  { 
    id: "creative", 
    label: "Creative", 
    icon: Lightbulb,
    keywords: ["innovative", "imaginative", "unique", "unexpected"],
    description: "Unconventional and imaginative concepts"
  },
  { 
    id: "minimal", 
    label: "Minimal", 
    icon: HandIcon,
    keywords: ["simple", "clean", "uncluttered", "elegant"],
    description: "Clean, simple designs with restrained elements"
  },
];

interface StyleQuickSwitchProps {
  onMoodSelect: (keywords: string[]) => void;
}

const MAX_SELECTIONS = 3;

export function StyleQuickSwitch({ onMoodSelect }: StyleQuickSwitchProps) {
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);

  const handleMoodSelect = (mood: MoodOption) => {
    let newSelected = [...selectedMoods];
    
    if (newSelected.includes(mood.id)) {
      newSelected = newSelected.filter(id => id !== mood.id);
    } 
    else if (newSelected.length < MAX_SELECTIONS) {
      newSelected = [...newSelected, mood.id];
    } 
    setSelectedMoods(newSelected);
    
    const allKeywords = newSelected.flatMap(id => 
      moodOptions.find(option => option.id === id)?.keywords || []
    );
    
    onMoodSelect(allKeywords);
  };

  const handleClearAll = () => {
    setSelectedMoods([]);
    onMoodSelect([]);
  };

  return (
    <TooltipProvider>
      <div className="space-y-3 glass p-4 rounded-lg border border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-foreground">Quick Mood Switch</h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Apply up to {MAX_SELECTIONS} moods to enhance your prompt</p>
              </TooltipContent>
            </Tooltip>
          </div>
          
          <div className="flex items-center gap-2">
            {selectedMoods.length > 0 && (
              <Badge variant="outline" className="bg-muted/30 text-xs">
                {selectedMoods.length}/{MAX_SELECTIONS}
              </Badge>
            )}
            {selectedMoods.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2 text-xs"
                onClick={handleClearAll}
              >
                <X className="h-3.5 w-3.5 mr-1" />
                Clear All
              </Button>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {moodOptions.map((mood) => {
            const isSelected = selectedMoods.includes(mood.id);
            const isMaxed = selectedMoods.length >= MAX_SELECTIONS && !isSelected;
            
            return (
              <Tooltip key={mood.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-9 transition-all duration-300 group",
                      isSelected 
                        ? "bg-primary/20 border-primary text-primary shadow-[0_0_12px_rgba(255,65,108,0.4)]" 
                        : isMaxed
                          ? "opacity-50 cursor-not-allowed hover:bg-transparent"
                          : "hover:bg-accent/10 hover:scale-[1.03]"
                    )}
                    onClick={() => !isMaxed && handleMoodSelect(mood)}
                    disabled={isMaxed}
                  >
                    <mood.icon className={cn(
                      "h-4 w-4 mr-1 transition-transform duration-300",
                      isSelected 
                        ? "text-primary animate-pulse" 
                        : "text-muted-foreground",
                      !isMaxed && "group-hover:rotate-12"
                    )} />
                    <span>{mood.label}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{mood.description}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
}
