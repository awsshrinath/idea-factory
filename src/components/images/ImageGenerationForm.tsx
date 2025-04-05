
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
import { Paintbrush, ImageIcon, Wand2, RefreshCcw, Download, CircleArrowDown, CircleArrowUp } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

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
    description: "Photo-realistic images with natural details" 
  },
  { 
    value: "cyberpunk", 
    label: "Cyberpunk", 
    gradient: "bg-gradient-creative",
    description: "Futuristic neon-lit urban aesthetics" 
  },
  { 
    value: "watercolor", 
    label: "Watercolor", 
    gradient: "bg-gradient-casual",
    description: "Soft flowing artistic painting style" 
  },
  { 
    value: "anime", 
    label: "Anime", 
    gradient: "bg-gradient-friendly",
    description: "Japanese animation inspired artwork" 
  },
  { 
    value: "3d", 
    label: "3D Render", 
    gradient: "bg-gradient-secondary",
    description: "Computer generated 3D graphics" 
  },
  { 
    value: "sketch", 
    label: "Sketch", 
    gradient: "bg-gradient-muted",
    description: "Hand-drawn pencil sketch style" 
  },
];

const aspectRatios = [
  { value: "1:1", label: "Square (1:1)" },
  { value: "16:9", label: "Landscape (16:9)" },
  { value: "9:16", label: "Portrait (9:16)" },
  { value: "4:5", label: "Instagram (4:5)" },
];

// Example gallery items
const exampleGallery = [
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
];

export function ImageGenerationForm({ onImageGenerated }: { onImageGenerated: (imageUrl: string) => void }) {
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

  // Apply example gallery item
  const applyExampleTemplate = (example: typeof exampleGallery[0]) => {
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

      // Call the callback with the image URL
      onImageGenerated(data.imageUrl);
      
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground font-medium">Describe your image</FormLabel>
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

        {/* Example Gallery */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Example gallery - click to use</h3>
          <div className={cn(
            "grid grid-cols-2 md:grid-cols-4 gap-3",
            isMobile && "overflow-x-auto flex flex-nowrap snap-x snap-mandatory"
          )}>
            {exampleGallery.map((example, index) => (
              <Card 
                key={index} 
                className={cn(
                  "overflow-hidden border border-white/10 hover:border-white/20 cursor-pointer transition-all duration-300 bg-muted/20",
                  isMobile && "snap-center min-w-[150px] flex-shrink-0"
                )}
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
        </div>

        <FormField
          control={form.control}
          name="style"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground font-medium">Image Style</FormLabel>
              <div className={cn(
                "grid grid-cols-2 md:grid-cols-3 gap-3",
                isMobile && "overflow-x-auto flex flex-nowrap snap-x snap-mandatory"
              )}>
                {styles.map((style) => (
                  <div 
                    key={style.value} 
                    className={cn(
                      "relative rounded-lg overflow-hidden cursor-pointer transition-all duration-300",
                      "border-2",
                      field.value === style.value 
                        ? "border-primary shadow-[0_0_12px_rgba(255,65,108,0.3)]" 
                        : "border-white/10",
                      isMobile && "snap-center min-w-[150px] flex-shrink-0"
                    )}
                    onClick={() => field.onChange(style.value)}
                  >
                    <div className={cn(
                      "h-24 flex items-center justify-center",
                      style.gradient
                    )}>
                      <span className="text-2xl">
                        {style.value === "realistic" && "🌄"}
                        {style.value === "cyberpunk" && "🌃"}
                        {style.value === "watercolor" && "🎨"}
                        {style.value === "anime" && "✨"}
                        {style.value === "3d" && "💠"}
                        {style.value === "sketch" && "✏️"}
                      </span>
                    </div>
                    <div className="p-3 bg-muted/30 text-center">
                      <p className="font-medium">{style.label}</p>
                      <p className="text-xs text-muted-foreground">{style.description}</p>
                    </div>
                    {field.value === style.value && (
                      <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1 w-4 h-4 flex items-center justify-center">
                        <span className="text-[8px] font-bold">✓</span>
                      </div>
                    )}
                  </div>
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
              <FormLabel className="text-foreground font-medium">Aspect Ratio</FormLabel>
              <div className="flex flex-wrap gap-3">
                {aspectRatios.map((ratio) => (
                  <button
                    key={ratio.value}
                    type="button"
                    onClick={() => field.onChange(ratio.value)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium",
                      "transition-all duration-200 border-2",
                      field.value === ratio.value
                        ? "bg-primary/20 border-primary text-white shadow-[0_0_8px_rgba(255,65,108,0.3)]"
                        : "bg-transparent border-white/10 text-white hover:bg-accent/10"
                    )}
                  >
                    <ImageIcon className="h-4 w-4" />
                    {ratio.label}
                  </button>
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
            <h3 className="text-sm font-medium">Advanced Options</h3>
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
                  <FormLabel className="text-foreground font-medium">Detail Level</FormLabel>
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
                  <FormLabel className="text-foreground font-medium">Seed (optional)</FormLabel>
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
                  <FormLabel className="text-foreground font-medium">Lighting</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="natural" id="lighting-natural" />
                        <label htmlFor="lighting-natural">Natural</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="studio" id="lighting-studio" />
                        <label htmlFor="lighting-studio">Studio</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="cinematic" id="lighting-cinematic" />
                        <label htmlFor="lighting-cinematic">Cinematic</label>
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

        {/* Recently Generated Images */}
        {recentImages.length > 0 && (
          <div className="pt-4 border-t border-white/10 space-y-4">
            <h3 className="text-base font-medium">Recently Generated</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {recentImages.map((image) => (
                <Card key={image.id} className="bg-muted/20 border border-white/10 overflow-hidden">
                  <div className="aspect-square">
                    <img 
                      src={image.url} 
                      alt={image.prompt} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{image.prompt}</p>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 text-xs"
                        onClick={() => handleRegenerate(image)}
                      >
                        <RefreshCcw className="h-3 w-3 mr-1" />
                        Re-Generate
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="px-2"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = image.url;
                          link.download = `ai-image-${image.id}.png`;
                          link.click();
                        }}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </form>
    </Form>
  );
}
