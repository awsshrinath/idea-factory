
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StyleTemplates } from "./StyleTemplates";
import { StyleQuickSwitch } from "./StyleQuickSwitch";
import { Loader, Download, Sparkles, ImageIcon, Palette, Sliders, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ImageGenerationFormProps {
  onImageGenerated?: (imageUrl: string) => void;
}

const styles = [
  "Realistic", "Cartoon", "Anime", "Oil Painting", "Watercolor", 
  "Digital Art", "3D Render", "Sketch", "Pop Art", "Abstract"
];

const aspectRatios = [
  { value: "1:1", label: "Square (1:1)" },
  { value: "16:9", label: "Landscape (16:9)" },
  { value: "9:16", label: "Portrait (9:16)" },
  { value: "4:3", label: "Classic (4:3)" },
  { value: "3:4", label: "Portrait (3:4)" }
];

export function ImageGenerationForm({ onImageGenerated }: ImageGenerationFormProps) {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("Realistic");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [seed, setSeed] = useState("");
  const [steps, setSteps] = useState(20);
  const [guidanceScale, setGuidanceScale] = useState(7.5);
  const { toast } = useToast();
  const imageRef = useRef<HTMLImageElement>(null);

  // Listen for regeneration events
  React.useEffect(() => {
    const handleRegenerate = (event: CustomEvent) => {
      const { prompt: newPrompt, style: newStyle, aspectRatio: newAspectRatio } = event.detail;
      setPrompt(newPrompt);
      setStyle(newStyle);
      setAspectRatio(newAspectRatio);
      
      toast({
        title: "Settings Applied",
        description: "Ready to regenerate with previous settings",
      });
    };

    window.addEventListener('regenerate-image', handleRegenerate as EventListener);
    return () => window.removeEventListener('regenerate-image', handleRegenerate as EventListener);
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a prompt for your image",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: {
          prompt: prompt.trim(),
          style,
          aspect_ratio: aspectRatio,
          seed: seed || undefined,
          steps,
          guidance_scale: guidanceScale
        }
      });

      if (error) throw error;
      
      if (data?.image_url) {
        setGeneratedImage(data.image_url);
        onImageGenerated?.(data.image_url);
        
        toast({
          title: "Success!",
          description: "Your image has been generated successfully",
        });
      }
    } catch (error: any) {
      console.error('Error generating image:', error);
      const errorMessage = error.message || 'Failed to generate image. Please try again.';
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: errorMessage,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage && imageRef.current) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleStyleSelect = (selectedStyle: string) => {
    setStyle(selectedStyle);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center border border-purple-500/20">
            <ImageIcon className="h-4 w-4 text-purple-400" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            AI Image Generator
          </h1>
        </div>
        <p className="text-muted-foreground">
          Create stunning images with AI. Describe what you want to see and watch it come to life.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Input Section */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Controls */}
          <div className="space-y-6">
            {/* Prompt Input */}
            <div className="space-y-2">
              <Label htmlFor="prompt" className="text-sm font-medium flex items-center gap-2">
                <Wand2 className="h-4 w-4" />
                Describe Your Image
              </Label>
              <Textarea
                id="prompt"
                placeholder="A majestic mountain landscape at sunset with golden light reflecting on a crystal clear lake..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[100px] resize-none bg-background/50 border-white/10 focus:border-purple-400 transition-colors"
              />
              <div className="text-xs text-muted-foreground">
                {prompt.length}/500 characters
              </div>
            </div>

            {/* Style Templates */}
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Style Templates
              </Label>
              <StyleTemplates />
            </div>

            {/* Quick Controls */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="style" className="text-sm font-medium">Style</Label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger className="bg-background/50 border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {styles.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="aspectRatio" className="text-sm font-medium">Aspect Ratio</Label>
                <Select value={aspectRatio} onValueChange={setAspectRatio}>
                  <SelectTrigger className="bg-background/50 border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {aspectRatios.map((ratio) => (
                      <SelectItem key={ratio.value} value={ratio.value}>
                        {ratio.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Advanced Options Toggle */}
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full justify-center"
            >
              <Sliders className="h-4 w-4 mr-2" />
              {showAdvanced ? "Hide" : "Show"} Advanced Options
            </Button>

            {showAdvanced && (
              <div className="space-y-4 p-4 bg-muted/20 rounded-lg border border-white/10">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="seed" className="text-sm">Seed (optional)</Label>
                    <Input
                      id="seed"
                      type="number"
                      placeholder="Random seed for reproducible results"
                      value={seed}
                      onChange={(e) => setSeed(e.target.value)}
                      className="bg-background/50 border-white/10"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="steps" className="text-sm">Steps: {steps}</Label>
                    <input
                      id="steps"
                      type="range"
                      min={10}
                      max={50}
                      value={steps}
                      onChange={(e) => setSteps(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="guidance" className="text-sm">Guidance Scale: {guidanceScale}</Label>
                    <input
                      id="guidance"
                      type="range"
                      min={1}
                      max={20}
                      step={0.5}
                      value={guidanceScale}
                      onChange={(e) => setGuidanceScale(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Generate Button */}
            <Button 
              type="submit" 
              disabled={isGenerating || !prompt.trim()}
              className="w-full h-12 text-base font-medium bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
            >
              {isGenerating ? (
                <>
                  <Loader className="h-5 w-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Generate Image
                </>
              )}
            </Button>
          </div>

          {/* Right Column - Preview */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted/20 rounded-lg border-2 border-dashed border-white/20 flex items-center justify-center relative overflow-hidden">
              {generatedImage ? (
                <div className="relative w-full h-full">
                  <img
                    ref={imageRef}
                    src={generatedImage}
                    alt="Generated"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute top-2 right-2">
                    <Button
                      onClick={handleDownload}
                      size="sm"
                      variant="secondary"
                      className="bg-black/50 hover:bg-black/70 backdrop-blur-sm"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : isGenerating ? (
                <div className="text-center space-y-3">
                  <Loader className="h-8 w-8 animate-spin mx-auto text-purple-400" />
                  <p className="text-sm text-muted-foreground">Creating your image...</p>
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <ImageIcon className="h-12 w-12 text-muted-foreground/50 mx-auto" />
                  <p className="text-sm text-muted-foreground">Your generated image will appear here</p>
                </div>
              )}
            </div>

            {/* Style Quick Switch */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Quick Style Switch</Label>
              <StyleQuickSwitch onMoodSelect={handleStyleSelect} />
            </div>

            {/* Selected Settings Display */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Current Settings</Label>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs">
                  {style}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {aspectRatio}
                </Badge>
                {seed && (
                  <Badge variant="outline" className="text-xs">
                    Seed: {seed}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>

      <Separator className="bg-white/10" />
    </div>
  );
}
