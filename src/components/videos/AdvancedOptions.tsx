
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
import { Button } from "@/components/ui/button";
import { Mic, Music, Speed } from "lucide-react";

interface AdvancedOptionsProps {
  onOptionsChange: (options: AdvancedVideoOptions) => void;
}

export interface AdvancedVideoOptions {
  voiceoverType: string;
  voiceFile?: File;
  backgroundMusic: string;
  playbackSpeed: string;
}

export function AdvancedOptions({ onOptionsChange }: AdvancedOptionsProps) {
  const [options, setOptions] = useState<AdvancedVideoOptions>({
    voiceoverType: "female",
    backgroundMusic: "none",
    playbackSpeed: "normal",
  });
  const [voiceFile, setVoiceFile] = useState<File | null>(null);

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
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Mic className="h-4 w-4 text-muted-foreground" />
                <Label className="text-foreground">Voice Over</Label>
              </div>
              <Select
                value={options.voiceoverType}
                onValueChange={(value) => updateOption("voiceoverType", value)}
              >
                <SelectTrigger className="bg-background border-accent/20">
                  <SelectValue placeholder="Select voice type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="female">AI Female Voice</SelectItem>
                  <SelectItem value="male">AI Male Voice</SelectItem>
                  <SelectItem value="upload">Upload Voice</SelectItem>
                  <SelectItem value="none">No Voice Over</SelectItem>
                </SelectContent>
              </Select>
              {options.voiceoverType === "upload" && (
                <div className="mt-2">
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById("voice-file")?.click()}
                    className="w-full border-accent/20"
                  >
                    {voiceFile ? voiceFile.name : "Upload Voice File"}
                  </Button>
                  <input
                    id="voice-file"
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setVoiceFile(file);
                        updateOption("voiceFile", file);
                      }
                    }}
                  />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Music className="h-4 w-4 text-muted-foreground" />
                <Label className="text-foreground">Background Music</Label>
              </div>
              <Select
                value={options.backgroundMusic}
                onValueChange={(value) => updateOption("backgroundMusic", value)}
              >
                <SelectTrigger className="bg-background border-accent/20">
                  <SelectValue placeholder="Select music style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="happy">Happy & Upbeat</SelectItem>
                  <SelectItem value="corporate">Corporate & Professional</SelectItem>
                  <SelectItem value="dramatic">Dramatic & Intense</SelectItem>
                  <SelectItem value="epic">Epic & Inspiring</SelectItem>
                  <SelectItem value="none">No Background Music</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Speed className="h-4 w-4 text-muted-foreground" />
                <Label className="text-foreground">Playback Speed</Label>
              </div>
              <Select
                value={options.playbackSpeed}
                onValueChange={(value) => updateOption("playbackSpeed", value)}
              >
                <SelectTrigger className="bg-background border-accent/20">
                  <SelectValue placeholder="Select playback speed" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="slow">Slow</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="fast">Fast</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
