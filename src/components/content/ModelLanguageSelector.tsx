
import { AIModel, Language } from "@/types/content";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Bot, Globe, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface ModelLanguageSelectorProps {
  selectedModel: AIModel;
  selectedLanguage: Language;
  onModelSelect: (model: AIModel) => void;
  onLanguageSelect: (language: Language) => void;
}

const aiModels: { value: AIModel; label: string; description: string }[] = [
  { 
    value: "chatgpt", 
    label: "ChatGPT", 
    description: "Best for conversational and engaging content with natural language flow"
  },
  { 
    value: "deepseek", 
    label: "DeepSeek", 
    description: "Optimized for SEO-friendly content with targeted keywords and structure"
  },
];

const languages: { value: Language; label: string }[] = [
  { value: "English", label: "English" },
  { value: "Spanish", label: "Spanish" },
  { value: "French", label: "French" },
  { value: "German", label: "German" },
  { value: "Chinese", label: "Chinese" },
];

export function ModelLanguageSelector({
  selectedModel,
  selectedLanguage,
  onModelSelect,
  onLanguageSelect,
}: ModelLanguageSelectorProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[#E0E0E0] italic flex items-center gap-2 text-[14px] font-[500]">
        Settings
        <Tooltip>
          <TooltipTrigger>
            <HelpCircle className="w-4 h-4 text-primary/60" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Configure language and AI model settings</p>
          </TooltipContent>
        </Tooltip>
      </label>
      
      <div className={cn(
        "grid gap-2",
        isMobile ? "grid-cols-1" : "grid-cols-2"
      )}>
        <div className="flex items-center gap-2 bg-background/30 p-2 rounded-lg border border-white/5">
          <Bot className="w-4 h-4 text-primary/70" />
          <Select value={selectedModel} onValueChange={onModelSelect}>
            <SelectTrigger 
              className={cn(
                "bg-transparent border-0 hover:bg-background/20 transition-colors duration-300 text-white",
                "focus:ring-0 focus:border-0 w-full h-8"
              )}
            >
              <SelectValue placeholder="Select AI Model" />
            </SelectTrigger>
            <SelectContent className="z-50 bg-background/95 backdrop-blur-sm text-white">
              {aiModels.map((model) => (
                <SelectItem 
                  key={model.value} 
                  value={model.value} 
                  className="cursor-pointer flex items-center justify-between group text-white"
                >
                  <div className="flex items-center justify-between w-full">
                    <span>{model.label}</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-3.5 h-3.5 text-[#B0B0B0] opacity-70 group-hover:opacity-100 transition-opacity" />
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p className="max-w-[200px] text-xs">{model.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 bg-background/30 p-2 rounded-lg border border-white/5">
          <Globe className="w-4 h-4 text-primary/70" />
          <Select value={selectedLanguage} onValueChange={onLanguageSelect}>
            <SelectTrigger 
              className={cn(
                "bg-transparent border-0 hover:bg-background/20 transition-colors duration-300 text-white",
                "focus:ring-0 focus:border-0 w-full h-8"
              )}
            >
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent className="z-50 bg-background/95 backdrop-blur-sm text-white">
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value} className="cursor-pointer text-white">
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
