import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ContentFormData, Platform, Tone } from "@/pages/Content";
import {
  Linkedin,
  Twitter,
  Facebook,
  BookOpen,
  Users,
  Coffee,
  Sparkles,
  Wand2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ContentFormProps {
  formData: ContentFormData;
  onChange: (data: ContentFormData) => void;
}

const platforms: { value: Platform; icon: React.ReactNode; label: string }[] = [
  { value: "linkedin", icon: <Linkedin className="w-4 h-4" />, label: "LinkedIn" },
  { value: "twitter", icon: <Twitter className="w-4 h-4" />, label: "Twitter" },
  { value: "facebook", icon: <Facebook className="w-4 h-4" />, label: "Facebook" },
];

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

export function ContentForm({ formData, onChange }: ContentFormProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePlatformToggle = (platform: Platform) => {
    onChange({
      ...formData,
      platforms: formData.platforms.includes(platform)
        ? formData.platforms.filter((p) => p !== platform)
        : [...formData.platforms, platform],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    // TODO: Implement content generation
    setTimeout(() => setIsGenerating(false), 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4 bg-gradient-to-br from-card/80 to-card p-6 rounded-xl shadow-lg border border-accent/20 backdrop-blur-sm transform transition-all duration-300 hover:shadow-xl hover:scale-[1.01] animate-fade-in">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/80 italic flex items-center gap-2">
            Content Description
            <Tooltip>
              <TooltipTrigger>
                <Sparkles className="w-4 h-4 text-primary/60" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Describe your content idea in detail</p>
              </TooltipContent>
            </Tooltip>
          </label>
          <Textarea
            placeholder="Describe your idea… e.g., 'Write about the top 5 benefits of using AI in business.'"
            value={formData.description}
            onChange={(e) =>
              onChange({ ...formData, description: e.target.value })
            }
            className="h-32 bg-background/50 text-foreground border-accent/20 focus:border-primary transition-all duration-300 rounded-lg resize-none hover:border-primary/50 placeholder:text-muted-foreground/50"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/80 italic flex items-center gap-2">
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
          <div className="flex flex-wrap gap-2">
            {platforms.map(({ value, icon, label }) => (
              <Button
                key={value}
                type="button"
                variant={formData.platforms.includes(value) ? "default" : "outline"}
                onClick={() => handlePlatformToggle(value)}
                className={cn(
                  "gap-2 transition-all duration-300 hover:scale-105 rounded-lg shadow-lg",
                  formData.platforms.includes(value) &&
                    "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground"
                )}
              >
                {icon}
                {label}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/80 italic flex items-center gap-2">
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {tones.map(({ value, icon, label }) => (
              <Button
                key={value}
                type="button"
                variant={formData.tone === value ? "default" : "outline"}
                onClick={() => onChange({ ...formData, tone: value })}
                className={cn(
                  "flex-col h-auto py-4 gap-2 transition-all duration-300 hover:scale-105 rounded-lg shadow-lg",
                  formData.tone === value &&
                    "bg-gradient-to-r from-primary via-primary/80 to-secondary text-primary-foreground"
                )}
              >
                {icon}
                {label}
              </Button>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className={cn(
            "w-full transition-all duration-300 hover:scale-[1.02] bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg shadow-lg group",
            isGenerating && "animate-pulse"
          )}
          disabled={
            !formData.description ||
            formData.platforms.length === 0 ||
            isGenerating
          }
        >
          <Wand2 className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
          {isGenerating ? "Generating..." : "Generate Content"}
        </Button>
      </div>
    </form>
  );
}