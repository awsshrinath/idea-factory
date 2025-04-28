
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AdvancedOptionsProps {
  onOptionsChange: (options: AdvancedVideoOptions) => void;
}

export interface AdvancedVideoOptions {
  voiceoverType: string;
  backgroundMusic: boolean;
  textOverlays: boolean;
}

export function AdvancedOptions({ onOptionsChange }: AdvancedOptionsProps) {
  const [options, setOptions] = useState<AdvancedVideoOptions>({
    voiceoverType: "female",
    backgroundMusic: true,
    textOverlays: true,
  });

  const updateOption = <K extends keyof AdvancedVideoOptions>(
    key: K,
    value: AdvancedVideoOptions[K]
  ) => {
    const newOptions = { ...options, [key]: value };
    setOptions(newOptions);
    onOptionsChange(newOptions);
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="advanced-options" className="border-white/10">
        <AccordionTrigger className="text-foreground hover:text-primary transition-colors">
          Advanced Options
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-6 p-2">
            <div className="space-y-2">
              <Label htmlFor="voiceover-type" className="text-foreground">Voiceover Type</Label>
              <Select
                value={options.voiceoverType}
                onValueChange={(value) => updateOption("voiceoverType", value)}
              >
                <SelectTrigger id="voiceover-type" className="bg-background border-accent/20">
                  <SelectValue placeholder="Select voiceover type" />
                </SelectTrigger>
                <SelectContent className="bg-background border-accent/20">
                  <SelectItem value="male">Male Voice</SelectItem>
                  <SelectItem value="female">Female Voice</SelectItem>
                  <SelectItem value="none">No Voiceover</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="background-music" className="text-foreground">
                Background Music
              </Label>
              <Switch
                id="background-music"
                checked={options.backgroundMusic}
                onCheckedChange={(checked) => updateOption("backgroundMusic", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="text-overlays" className="text-foreground">
                Text Overlays
              </Label>
              <Switch
                id="text-overlays"
                checked={options.textOverlays}
                onCheckedChange={(checked) => updateOption("textOverlays", checked)}
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
