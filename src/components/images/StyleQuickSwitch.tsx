
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
  Buildings, 
  Palette, 
  Camera, 
  Brush, 
  Lightbulb, 
  Mountain, 
  HandIcon, 
  LucideIcon 
} from "lucide-react";

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
    icon: Buildings,
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

export function StyleQuickSwitch({ onMoodSelect }: StyleQuickSwitchProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const handleMoodSelect = (mood: MoodOption) => {
    // Toggle mood selection
    const newSelected = selectedMood === mood.id ? null : mood.id;
    setSelectedMood(newSelected);
    
    // Call parent handler with selected mood's keywords or empty array if deselected
    onMoodSelect(newSelected ? mood.keywords : []);
  };

  return (
    <TooltipProvider>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">Quick Mood Switch</h3>
          <p className="text-xs text-muted-foreground">Apply a mood to your prompt</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {moodOptions.map((mood) => (
            <Tooltip key={mood.id}>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-9 transition-all duration-300 group",
                    selectedMood === mood.id
                      ? "bg-primary/20 border-primary text-primary shadow-[0_0_8px_rgba(255,65,108,0.3)]"
                      : "hover:bg-accent/10"
                  )}
                  onClick={() => handleMoodSelect(mood)}
                >
                  <mood.icon className={cn(
                    "h-4 w-4 mr-1 transition-transform duration-300 group-hover:rotate-12",
                    selectedMood === mood.id ? "text-primary" : "text-muted-foreground"
                  )} />
                  <span>{mood.label}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{mood.description}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}
