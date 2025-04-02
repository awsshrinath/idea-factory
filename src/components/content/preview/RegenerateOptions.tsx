
import { Button } from "@/components/ui/button";
import { RefreshCw, CheckCircle } from "lucide-react";
import { AIModel } from "@/pages/Content";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

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
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-4 p-4 md:p-6 bg-gradient-to-br from-[#121212] to-[#1a1a1a] rounded-xl shadow-[0_8px_12px_rgba(0,0,0,0.2)] border border-[rgba(255,255,255,0.05)]">
      <div className={cn(
        "gap-4 items-end",
        isMobile ? "flex flex-col" : "flex flex-wrap justify-between"
      )}>
        <div className={cn(
          "space-y-2",
          isMobile ? "w-full" : "min-w-[150px]"
        )}>
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
          isLoading={isRegenerating}
          disabled={isRegenerating}
          className={cn(
            "group bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-[0_0_15px_rgba(79,70,229,0.6)] hover:scale-[1.03]",
            isMobile && "w-full h-12"
          )}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${!isRegenerating ? 'group-hover:rotate-180 transition-transform duration-500' : ''}`} />
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
