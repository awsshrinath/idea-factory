import { AIModel, Language } from "@/pages/Content";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Bot, Globe, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

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
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground/80 italic flex items-center gap-2">
          AI Model
          <Tooltip>
            <TooltipTrigger>
              <Bot className="w-4 h-4 text-primary/60" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Choose your preferred AI model</p>
            </TooltipContent>
          </Tooltip>
        </label>
        <div className="relative">
          <Select value={selectedModel} onValueChange={onModelSelect}>
            <SelectTrigger 
              className={cn(
                "bg-background/50 border-accent/20 hover:border-primary/50 transition-all duration-300",
                "focus:ring-primary/20 focus:border-primary"
              )}
            >
              <SelectValue placeholder="Select AI Model" />
            </SelectTrigger>
            <SelectContent>
              {aiModels.map((model) => (
                <SelectItem 
                  key={model.value} 
                  value={model.value} 
                  className="cursor-pointer flex items-center justify-between group"
                >
                  <span>{model.label}</span>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p className="max-w-[200px]">{model.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground/80 italic flex items-center gap-2">
          Language
          <Tooltip>
            <TooltipTrigger>
              <Globe className="w-4 h-4 text-primary/60" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Choose content language</p>
            </TooltipContent>
          </Tooltip>
        </label>
        <Select value={selectedLanguage} onValueChange={onLanguageSelect}>
          <SelectTrigger 
            className={cn(
              "bg-background/50 border-accent/20 hover:border-primary/50 transition-all duration-300",
              "focus:ring-primary/20 focus:border-primary"
            )}
          >
            <SelectValue placeholder="Select Language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.value} value={lang.value} className="cursor-pointer">
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}