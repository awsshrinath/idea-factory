
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { AspectRatioSelector } from '../videos/AspectRatioSelector';
import { StyleTemplates } from './StyleTemplates';
import { 
  Play,
  Loader
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useImageGeneration } from '@/hooks/api/useImageGeneration';

interface ImageFormData {
  prompt: string;
  style: string;
  aspectRatio: string;
  detailLevel: string;
  lighting: string;
  seed: string;
}

const detailLevelOptions = [
  { value: "low", label: "Low - Simple" },
  { value: "medium", label: "Medium - Default" },
  { value: "high", label: "High - Detailed" }
];

const lightingOptions = [
  { value: "natural", label: "Natural Lighting" },
  { value: "studio", label: "Studio Lighting" },
  { value: "cinematic", label: "Cinematic Lighting" }
];

interface ImageGenerationFormProps {
  initialData?: Partial<ImageFormData>;
  onImageGenerated?: (imageUrl: string) => void;
}

export function ImageGenerationForm({ initialData, onImageGenerated }: ImageGenerationFormProps) {
  const [formData, setFormData] = useState<ImageFormData>({
    prompt: initialData?.prompt || "",
    style: initialData?.style || "realistic",
    aspectRatio: initialData?.aspectRatio || "16:9",
    detailLevel: initialData?.detailLevel || "medium",
    lighting: initialData?.lighting || "natural",
    seed: initialData?.seed || ""
  });
  
  const { mutate: generateImage, isPending } = useImageGeneration();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.prompt.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a description"
      });
      return;
    }

    generateImage(formData, {
      onSuccess: (data) => {
        toast({
          title: "Image Generated!",
          description: "Your image has been created successfully"
        });
        onImageGenerated?.(data.imageUrl);
      },
      onError: (error) => {
        console.error('Error generating image:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to generate image"
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Label htmlFor="prompt" className="text-sm font-medium">
          Image Description
        </Label>
        <Textarea
          id="prompt"
          placeholder="A futuristic city skyline at night with neon lights..."
          value={formData.prompt}
          onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
          className="min-h-[100px] resize-none bg-background/50 border-white/10 focus:border-purple-400 transition-colors"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="detailLevel" className="text-sm font-medium">Detail Level</Label>
          <Select value={formData.detailLevel} onValueChange={(value) => setFormData({ ...formData, detailLevel: value })}>
            <SelectTrigger className="bg-background/50 border-white/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {detailLevelOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="lighting" className="text-sm font-medium">Lighting</Label>
          <Select value={formData.lighting} onValueChange={(value) => setFormData({ ...formData, lighting: value })}>
            <SelectTrigger className="bg-background/50 border-white/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {lightingOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator className="bg-white/10" />

      <AspectRatioSelector 
        selectedRatio={formData.aspectRatio}
        onRatioChange={(ratio) => setFormData({ ...formData, aspectRatio: ratio })}
      />

      <Separator className="bg-white/10" />

      <StyleTemplates />

      <Separator className="bg-white/10" />

      <Button 
        type="submit" 
        disabled={isPending || !formData.prompt.trim()}
        className="w-full h-12 text-base font-medium bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
      >
        {isPending ? (
          <>
            <Loader className="h-5 w-5 mr-2 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Play className="h-5 w-5 mr-2" />
            Generate Image
          </>
        )}
      </Button>
    </form>
  );
}
