
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { AIModel } from "@/types/content";

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
  onRegenerate 
}: RegenerateOptionsProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className={cn(
      "flex gap-3 items-center",
      isMobile ? "flex-col" : "flex-row"
    )}>
      <div className="flex-1 text-sm text-muted-foreground">
        <span>Need a better result? Regenerate with:</span>
      </div>
      
      <div className={cn(
        "flex gap-2 items-center",
        isMobile ? "w-full" : ""
      )}>
        <Select
          value={selectedModel}
          onValueChange={(value) => onModelChange(value as AIModel)}
        >
          <SelectTrigger className={cn(
            "min-w-[120px] bg-muted/20 border-white/10",
            isMobile ? "flex-1" : ""
          )}>
            <SelectValue placeholder="Select Model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="chatgpt">ChatGPT</SelectItem>
            <SelectItem value="deepseek">DeepSeek</SelectItem>
          </SelectContent>
        </Select>
        
        <Button
          variant="outline"
          className="transition-all duration-300 hover:shadow-[0_0_12px_rgba(0,198,255,0.4)] bg-muted/20 border-white/10"
          onClick={onRegenerate}
          isLoading={isRegenerating}
          disabled={isRegenerating}
          size={isMobile ? "sm" : "default"}
        >
          <RefreshCw className={cn(
            "h-4 w-4 mr-2",
            isRegenerating ? "animate-spin" : ""
          )} />
          {isRegenerating ? "Regenerating..." : "Regenerate"}
        </Button>
      </div>
    </div>
  );
}
