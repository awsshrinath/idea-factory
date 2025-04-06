import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  Paintbrush, 
  ImageIcon, 
  Wand2, 
  RefreshCcw, 
  Info,
  Camera,
  Monitor,
  Smartphone,
  Sun,
  Lamp,
  Film,
  SquareIcon,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { StyleQuickSwitch } from "./StyleQuickSwitch";

const formSchema = z.object({
  prompt: z.string().min(1, "Please enter a prompt"),
  style: z.string().min(1, "Please select a style"),
  aspectRatio: z.string().min(1, "Please select an aspect ratio"),
  detailLevel: z.enum(["low", "medium", "high"]).default("medium"),
  seed: z.string().optional(),
  lighting: z.enum(["natural", "studio", "cinematic"]).default("natural"),
});

interface StyleOption {
  value: string;
  label: string;
  gradient: string;
  description: string;
  thumbnail: string;
  icon: React.ReactNode;
  tooltip: string;
}

const styles: StyleOption[] = [
  { 
    value: "realistic", 
    label: "Realistic", 
    gradient: "bg-gradient-primary",
    description: "Photo-realistic images with natural details",
    thumbnail: "https://images.unsplash.com/photo-1532767153582-b1a0e5145009?w=500&q=80",
    icon: <Camera className="h-5 w-5" />,
    tooltip: "Photo-realistic style with high fidelity to real-world images"
  },
  { 
    value: "cyberpunk", 
    label: "Cyberpunk", 
    gradient: "bg-gradient-creative",
    description: "Futuristic neon-lit urban aesthetics",
    thumbnail: "https://images.unsplash.com/photo-1558486012-817176f84c6d?w=500&q=80",
    icon: <Monitor className="h-5 w-5" />,
    tooltip: "Futuristic neon-lit urban aesthetic with high tech and low life" 
  },
  { 
    value: "watercolor", 
    label: "Watercolor", 
    gradient: "bg-gradient-casual",
    description: "Soft flowing artistic painting style",
    thumbnail: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=500&q=80",
    icon: <Paintbrush className="h-5 w-5" />,
    tooltip: "Gentle watercolor painting style with soft edges and color blends" 
  },
  { 
    value: "anime", 
    label: "Anime", 
    gradient: "bg-gradient-friendly",
    description: "Japanese animation inspired artwork",
    thumbnail: "https://images.unsplash.com/photo-1578331833071-ce81bd50d300?w=500&q=80",
    icon: <Wand2 className="h-5 w-5" />,
    tooltip: "Japanese animation inspired artwork with distinctive stylization" 
  },
  { 
    value: "3d", 
    label: "3D Render", 
    gradient: "bg-gradient-secondary",
    description: "Computer generated 3D graphics",
    thumbnail: "https://images.unsplash.com/photo-1534158914592-062992fbe900?w=500&q=80",
    icon: <ImageIcon className="h-5 w-5" />,
    tooltip: "Computer generated 3D rendered graphics with realistic lighting" 
  },
  { 
    value: "sketch", 
    label: "Sketch", 
    gradient: "bg-gradient-muted",
    description: "Hand-drawn pencil sketch style",
    thumbnail: "https://images.unsplash.com/photo-1618331833071-ce81bd50d300?w=500&q=80",
    icon: <Paintbrush className="h-5 w-5" />,
    tooltip: "Hand-drawn pencil sketch style with detailed linework" 
  },
];

const aspectRatios = [
  { 
    value: "1:1", 
    label: "Square", 
    description: "1:1", 
    icon: <SquareIcon className="h-4 w-4" />,
    tooltip: "Perfect square aspect ratio (1:1)" 
  },
  { 
    value: "16:9", 
    label: "Landscape", 
    description: "16:9", 
    icon: <Monitor className="h-4 w-4" />,
    tooltip: "Widescreen landscape format (16:9)" 
  },
  { 
    value: "9:16", 
    label: "Portrait", 
    description: "9:16", 
    icon: <Smartphone className="h-4 w-4" />,
    tooltip: "Vertical portrait format (9:16)" 
  },
  { 
    value: "4:5", 
    label: "Instagram", 
    description: "4:5", 
    icon: <ImageIcon className="h-4 w-4" />,
    tooltip: "Instagram optimal aspect ratio (4:5)" 
  },
];

export function ImageGenerationForm({ onImageGenerated }: { onImageGenerated: () => void }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [moodKeywords, setMoodKeywords] = useState<string[]>([]);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      style: "realistic",
      aspectRatio: "1:1",
      detailLevel: "medium",
      seed: "",
      lighting: "natural",
    },
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
    };

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleTemplateSelected = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail) {
        const { prompt, style } = customEvent.detail;
        form.setValue("prompt", prompt);
        form.setValue("style", style);
      }
    };
    
    const handleRegenerateImage = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail) {
        const { prompt, style, aspectRatio } = customEvent.detail;
        form.setValue("prompt", prompt);
        form.setValue("style", style);
        form.setValue("aspectRatio", aspectRatio);
        
        const formElement = document.getElementById("image-generation-form");
        if (formElement) {
          formElement.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    window.addEventListener('template-selected', handleTemplateSelected);
    window.addEventListener('regenerate-image', handleRegenerateImage);
    
    return () => {
      window.removeEventListener('template-selected', handleTemplateSelected);
      window.removeEventListener('regenerate-image', handleRegenerateImage);
    };
  }, [form]);

  const handleReset = () => {
    form.reset({
      prompt: "",
      style: "realistic",
      aspectRatio: "1:1",
      detailLevel: "medium",
      seed: "",
      lighting: "natural",
    });
    setMoodKeywords([]);
    toast({
      title: "Form Reset",
      description: "All settings have been reset to defaults.",
    });
  };

  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setGenerationProgress((prev) => {
          const increment = Math.random() * 15;
          const newValue = prev + increment;
          return newValue >= 100 ? 100 : newValue;
        });
      }, 500);

      return () => clearInterval(interval);
    } else {
      setGenerationProgress(0);
    }
  }, [isGenerating]);

  const enhancePromptWithMood = (originalPrompt: string) => {
    if (moodKeywords.length === 0) return originalPrompt;
    
    const selectedKeywords = moodKeywords.filter(() => Math.random() > 0.3).slice(0, 2);
    
    if (selectedKeywords.length === 0) return originalPrompt;
    
    return `${originalPrompt}, ${selectedKeywords.join(', ')} mood`;
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true);
    setGenerationProgress(0);
    try {
      if (!isAuthenticated) {
        toast({
          variant: "destructive",
          title: "Authentication Required",
          description: "Please log in to generate images.",
        });
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          variant: "destructive",
          title: "Authentication Required",
          description: "Please log in to generate images.",
        });
        return;
      }

      toast({
        title: "Starting image generation",
        description: "This may take a minute...",
      });

      const enhancedPrompt = enhancePromptWithMood(values.prompt);
      const enhancedValues = { ...values, prompt: enhancedPrompt };

      console.log("Sending request to edge function with values:", enhancedValues);
      
      const { data, error } = await supabase.functions.invoke("generate-image", {
        body: enhancedValues,
      });
      
      if (error) {
        console.error("Error from edge function:", error);
        throw new Error(error.message || "Failed to invoke function");
      }
      
      console.log("Response from edge function:", data);

      if (!data || !data.imageUrl) {
        throw new Error("Invalid response from server");
      }

      toast({
        title: "Success",
        description: "Image generated successfully!",
      });

      onImageGenerated();
    } catch (error: any) {
      console.error('Error generating image:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to generate image. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  const handleApplyMood = (keywords: string[]) => {
    setMoodKeywords(keywords);
    
    if (keywords.length > 0) {
      toast({
        title: "Mood Applied",
        description: `Mood keywords will enhance your prompt: ${keywords.join(', ')}`,
      });
    }
  };

  return (
    <TooltipProvider>
      <Form {...form}>
        <form id="image-generation-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground font-medium flex items-center gap-1">
                  Describe your image
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Be descriptive about what you want to see in your image</p>
                    </TooltipContent>
                  </Tooltip>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. A futuristic cityscape with flying cars at sunset"
                    className="bg-background border-white/10 focus:border-primary transition-colors"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <StyleQuickSwitch onMoodSelect={handleApplyMood} />

          <FormField
            control={form.control}
            name="style"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground font-medium flex items-center gap-1">
                  Image Style
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Choose a visual style for your generated image</p>
                    </TooltipContent>
                  </Tooltip>
                </FormLabel>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {styles.map((style) => (
                    <Tooltip key={style.value}>
                      <TooltipTrigger asChild>
                        <div 
                          className={cn(
                            "relative rounded-lg overflow-hidden cursor-pointer transition-all duration-300",
                            "border-2",
                            field.value === style.value 
                              ? "border-primary shadow-[0_0_12px_rgba(255,65,108,0.5)]" 
                              : "border-white/10",
                            "hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] hover:border-white/20"
                          )}
                          onClick={() => field.onChange(style.value)}
                        >
                          <div className={cn(
                            "h-24 overflow-hidden",
                          )}>
                            <img 
                              src={style.thumbnail} 
                              alt={style.label} 
                              className="w-full h-full object-cover" 
                            />
                            <div className={cn(
                              "absolute inset-0 opacity-40",
                              style.gradient
                            )} />
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <div className="bg-black/40 p-1 rounded-full">
                                {style.icon}
                              </div>
                              <span className="text-sm font-medium mt-1 text-white shadow-sm">{style.label}</span>
                            </div>
                          </div>
                          <div className="p-2 bg-muted/30">
                            <p className="text-xs text-muted-foreground">{style.description}</p>
                          </div>
                          {field.value === style.value && (
                            <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1 w-4 h-4 flex items-center justify-center">
                              <span className="text-[8px] font-bold">✓</span>
                            </div>
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{style.tooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="aspectRatio"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-foreground font-medium flex items-center gap-1">
                  Aspect Ratio
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Select the dimensions for your generated image</p>
                    </TooltipContent>
                  </Tooltip>
                </FormLabel>
                <div className="flex flex-wrap gap-3">
                  {aspectRatios.map((ratio) => (
                    <Tooltip key={ratio.value}>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={() => field.onChange(ratio.value)}
                          className={cn(
                            "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium",
                            "transition-all duration-200 border-2",
                            field.value === ratio.value
                              ? "bg-primary/20 border-primary text-white shadow-[0_0_8px_rgba(255,65,108,0.5)]"
                              : "bg-transparent border-white/10 text-white hover:bg-accent/10"
                          )}
                        >
                          {ratio.icon}
                          {ratio.label} ({ratio.description})
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{ratio.tooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Collapsible
            open={isAdvancedOpen}
            onOpenChange={setIsAdvancedOpen}
            className="border border-white/10 rounded-lg p-4 bg-muted/20"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium flex items-center gap-1">
                Advanced Options
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Fine-tune your image with additional settings</p>
                  </TooltipContent>
                </Tooltip>
              </h3>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  <span className="sr-only">Toggle advanced options</span>
                  <div className={cn(
                    "h-5 w-5 rounded-full border border-white/20 flex items-center justify-center",
                    "transition-transform duration-300",
                    isAdvancedOpen ? "rotate-180" : ""
                  )}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path 
                        d="M3.5 5.5L7 9L10.5 5.5" 
                        stroke="currentColor" 
                        strokeWidth="1.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </Button>
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent className="space-y-4 mt-4">
              <FormField
                control={form.control}
                name="detailLevel"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-foreground font-medium flex items-center gap-1">
                      Detail Level
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Controls the level of detail in the generated image</p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="low" id="detail-low" />
                          <label htmlFor="detail-low">Low</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="medium" id="detail-medium" />
                          <label htmlFor="detail-medium">Medium</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="high" id="detail-high" />
                          <label htmlFor="detail-high">High</label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="seed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium flex items-center gap-1">
                      Seed (optional)
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Fixed seed enables reproducible results</p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Random seed value"
                        className="bg-background border-white/10"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lighting"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-foreground font-medium flex items-center gap-1">
                      Lighting
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Define the lighting style for your image</p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="natural" id="lighting-natural" />
                          <label htmlFor="lighting-natural" className="flex items-center gap-1">
                            <Sun className="h-3.5 w-3.5" />
                            Natural
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="studio" id="lighting-studio" />
                          <label htmlFor="lighting-studio" className="flex items-center gap-1">
                            <Lamp className="h-3.5 w-3.5" />
                            Studio
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="cinematic" id="lighting-cinematic" />
                          <label htmlFor="lighting-cinematic" className="flex items-center gap-1">
                            <Film className="h-3.5 w-3.5" />
                            Cinematic
                          </label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CollapsibleContent>
          </Collapsible>

          {isGenerating && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Generating Magic...</span>
                <span>{Math.round(generationProgress)}%</span>
              </div>
              <Progress value={generationProgress} className="h-2" />
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            <Button
              type="submit"
              className={cn(
                "w-full bg-gradient-secondary shadow-glow transition-all duration-300 group",
                "hover:shadow-[0_0_25px_rgba(0,198,255,0.4)] hover:bg-gradient-primary",
                isGenerating && "animate-pulse"
              )}
              disabled={isGenerating || !isAuthenticated}
              isLoading={isGenerating}
            >
              <Wand2 className={cn(
                "h-4 w-4 mr-2",
                "transition-transform group-hover:rotate-12"
              )} />
              {isGenerating ? "Generating..." : isAuthenticated ? "Generate Image" : "Login Required"}
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              onClick={handleReset}
              className="sm:w-auto"
              disabled={isGenerating}
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </form>
      </Form>
    </TooltipProvider>
  );
}
