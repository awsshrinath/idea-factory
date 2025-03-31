
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { AIModel } from "@/pages/Content";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface RegenerateOptionsProps {
  isRegenerating: boolean;
  selectedModel: AIModel;
  onModelChange: (model: AIModel) => void;
  onRegenerate: () => Promise<void>;
}

export function RegenerateOptions({
  isRegenerating,
  selectedModel,
  onModelChange,
  onRegenerate,
}: RegenerateOptionsProps) {
  return (
    <div className="space-y-4 p-6 bg-gradient-to-br from-[#121212] to-[#1a1a1a] rounded-xl shadow-[0_8px_12px_rgba(0,0,0,0.2)] border border-[rgba(255,255,255,0.05)]">
      <div className="flex flex-wrap gap-4 items-end justify-between">
        <div className="space-y-2 min-w-[150px]">
          <Label htmlFor="regeneration-model" className="text-sm text-muted-foreground">
            AI Model for Regeneration
          </Label>
          <Select
            value={selectedModel}
            onValueChange={(value) => onModelChange(value as AIModel)}
            disabled={isRegenerating}
          >
            <SelectTrigger id="regeneration-model" className="bg-background/50 border-accent/20 focus:border-primary">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="chatgpt">ChatGPT (Fast)</SelectItem>
              <SelectItem value="deepseek">DeepSeek (Advanced)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button
          onClick={onRegenerate}
          disabled={isRegenerating}
          className="group bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRegenerating ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
          {isRegenerating ? "Regenerating..." : "Regenerate Content"}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground italic">
        Regenerate your content using the same prompt but with potentially different results.
        Try different models for creative variations.
      </p>
    </div>
  );
}
