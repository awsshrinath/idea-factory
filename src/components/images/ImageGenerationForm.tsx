
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
  Download, 
  CircleArrowDown, 
  CircleArrowUp,
  Info,
  Camera,
  Monitor,
  Smartphone,
  Sun,
  Lamp,
  Film
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
import { ScrollArea } from "@/components/ui/scroll-area";

const formSchema = z.object({
  prompt: z.string().min(1, "Please enter a prompt"),
  style: z.string().min(1, "Please select a style"),
  aspectRatio: z.string().min(1, "Please select an aspect ratio"),
  detailLevel: z.enum(["low", "medium", "high"]).default("medium"),
  seed: z.string().optional(),
  lighting: z.enum(["natural", "studio", "cinematic"]).default("natural"),
});

const styles = [
  { 
    value: "realistic", 
    label: "Realistic", 
    gradient: "bg-gradient-primary",
    description: "Photo-realistic images with natural details",
    icon: <Camera className="h-5 w-5" />,
    tooltip: "Photo-realistic style with high fidelity to real-world images"
  },
  { 
    value: "cyberpunk", 
    label: "Cyberpunk", 
    gradient: "bg-gradient-creative",
    description: "Futuristic neon-lit urban aesthetics",
    icon: <Monitor className="h-5 w-5" />,
    tooltip: "Futuristic neon-lit urban aesthetic with high tech and low life" 
  },
  { 
    value: "watercolor", 
    label: "Watercolor", 
    gradient: "bg-gradient-casual",
    description: "Soft flowing artistic painting style",
    icon: <Paintbrush className="h-5 w-5" />,
    tooltip: "Gentle watercolor painting style with soft edges and color blends" 
  },
  { 
    value: "anime", 
    label: "Anime", 
    gradient: "bg-gradient-friendly",
    description: "Japanese animation inspired artwork",
    icon: <Wand2 className="h-5 w-5" />,
    tooltip: "Japanese animation inspired artwork with distinctive stylization" 
  },
  { 
    value: "3d", 
    label: "3D Render", 
    gradient: "bg-gradient-secondary",
    description: "Computer generated 3D graphics",
    icon: <ImageIcon className="h-5 w-5" />,
    tooltip: "Computer generated 3D rendered graphics with realistic lighting" 
  },
  { 
    value: "sketch", 
    label: "Sketch", 
    gradient: "bg-gradient-muted",
    description: "Hand-drawn pencil sketch style",
    icon: <Paintbrush className="h-5 w-5" />,
    tooltip: "Hand-drawn pencil sketch style with detailed linework" 
  },
];

const aspectRatios = [
  { 
    value: "1:1", 
    label: "Square", 
    description: "1:1", 
    icon: <ImageIcon className="h-4 w-4" />,
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
    icon: <ImageIcon className="h-4 w-4 rotate-90" />,
    tooltip: "Instagram optimal aspect ratio (4:5)" 
  },
];

// Example templates
const exampleTemplates = [
  {
    thumbnail: "https://images.unsplash.com/photo-1502872364588-894d7d6ddfab?w=800&q=80",
    prompt: "Surreal floating islands with waterfalls in a sunset sky",
    style: "realistic"
  },
  {
    thumbnail: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=800&q=80",
    prompt: "Cyberpunk street scene with neon signs and rainy atmosphere",
    style: "cyberpunk"
  },
  {
    thumbnail: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&q=80",
    prompt: "Peaceful mountain lake with pine trees in watercolor style",
    style: "watercolor"
  },
  {
    thumbnail: "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=800&q=80",
    prompt: "Futuristic robot in a Japanese garden with cherry blossoms",
    style: "anime"
  },
  {
    thumbnail: "https://images.unsplash.com/photo-1534158914592-062992fbe900?w=800&q=80",
    prompt: "Abstract 3D geometric shapes with glossy surfaces and dramatic lighting",
    style: "3d"
  },
  {
    thumbnail: "https://images.unsplash.com/photo-1618331833071-ce81bd50d300?w=800&q=80",
    prompt: "Detailed pencil sketch of an old Victorian house with intricate architecture",
    style: "sketch"
  },
];

export function ImageGenerationForm({ onImageGenerated }: { onImageGenerated: () => void }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [recentImages, setRecentImages] = useState<any[]>([]);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
      
      if (data.session) {
        fetchRecentImages();
      }
    };

    checkAuth();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      if (session) {
        fetchRecentImages();
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Fetch recent images
  const fetchRecentImages = async () => {
    try {
      const { data, error } = await supabase
        .from('generated_images')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      
      // Get public URLs for images
      const imagesWithUrls = data?.map(image => {
        const url = supabase.storage
          .from('ai_generated_images')
          .getPublicUrl(image.image_path).data.publicUrl;
        
        return { ...image, url };
      });
      
      setRecentImages(imagesWithUrls || []);
    } catch (error) {
      console.error('Error fetching recent images:', error);
    }
  };

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

  // Reset form function
  const handleReset = () => {
    form.reset({
      prompt: "",
      style: "realistic",
      aspectRatio: "1:1",
      detailLevel: "medium",
      seed: "",
      lighting: "natural",
    });
    toast({
      title: "Form Reset",
      description: "All settings have been reset to defaults.",
    });
  };

  // Apply example template
  const applyExampleTemplate = (example: typeof exampleTemplates[0]) => {
    form.setValue("prompt", example.prompt);
    form.setValue("style", example.style);
    
    toast({
      title: "Example Applied",
      description: "Prompt and style have been updated.",
    });
  };

  // Handle regenerating an image with the same prompt
  const handleRegenerate = async (image: any) => {
    form.setValue("prompt", image.prompt);
    form.setValue("style", image.style);
    form.setValue("aspectRatio", image.aspect_ratio);
    
    await form.handleSubmit(onSubmit)();
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true);
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

      console.log("Sending request to edge function with values:", values);
      
      // Use supabase's function invocation
      const { data, error } = await supabase.functions.invoke("generate-image", {
        body: values,
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

      // Call the callback
      onImageGenerated();
      
      // Refresh recent images
      fetchRecentImages();
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

  return (
    <TooltipProvider>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

          {/* Example Templates - Horizontal Scrollable Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">Example templates - click to use</h3>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Click any template to use its prompt and style</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex gap-3 pb-2 overflow-x-auto">
                {exampleTemplates.map((example, index) => (
                  <Card 
                    key={index} 
                    className="overflow-hidden border border-white/10 hover:border-white/20 cursor-pointer transition-all duration-300 bg-muted/20 flex-shrink-0 w-[150px]"
                    onClick={() => applyExampleTemplate(example)}
                  >
                    <div className="aspect-square overflow-hidden">
                      <img 
                        src={example.thumbnail} 
                        alt={example.prompt} 
                        className="object-cover w-full h-full transition-transform hover:scale-105" 
                      />
                    </div>
                    <div className="p-2 bg-black/30">
                      <p className="text-xs font-medium truncate">{example.prompt}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>

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
                          )}
                          onClick={() => field.onChange(style.value)}
                        >
                          <div className={cn(
                            "h-20 flex items-center justify-center",
                            style.gradient
                          )}>
                            <div className="flex flex-col items-center gap-1">
                              {style.icon}
                              <span className="text-sm font-medium">{style.label}</span>
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

          {/* Advanced Options Collapsible */}
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
                  {isAdvancedOpen ? <CircleArrowUp className="h-4 w-4" /> : <CircleArrowDown className="h-4 w-4" />}
                  <span className="sr-only">Toggle advanced options</span>
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

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            <Button
              type="submit"
              className="w-full bg-gradient-secondary hover:bg-gradient-primary shadow-glow hover:shadow-card-hover transition-all duration-300 group"
              disabled={isGenerating || !isAuthenticated}
              isLoading={isGenerating}
            >
              <Wand2 className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
              {isGenerating ? "Generating..." : isAuthenticated ? "Generate Image" : "Login Required"}
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              onClick={handleReset}
              className="sm:w-auto"
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>

          {/* Quick Style Switcher (Optional) */}
          {!isMobile && (
            <div className="pt-4 border-t border-white/10">
              <h3 className="text-sm font-medium mb-2">Quick Style Switch</h3>
              <div className="flex flex-wrap gap-2">
                {styles.map((style) => (
                  <button
                    key={style.value}
                    type="button"
                    onClick={() => form.setValue("style", style.value)}
                    className={cn(
                      "rounded-full p-1.5 transition-all",
                      form.watch("style") === style.value 
                        ? `${style.gradient} shadow-[0_0_8px_rgba(255,65,108,0.3)]` 
                        : "bg-muted/20"
                    )}
                    title={style.label}
                  >
                    {style.icon}
                  </button>
                ))}
              </div>
            </div>
          )}
        </form>
      </Form>
    </TooltipProvider>
  );
}
