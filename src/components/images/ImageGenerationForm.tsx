
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
import { useSessionContext } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';

interface ImageFormData {
  prompt: string;
  style: string;
  aspectRatio: string;
  numImages: number;
  guidanceScale: number;
  numInferenceSteps: number;
}

const numImagesOptions = [
  { value: 1, label: "1 Image" },
  { value: 2, label: "2 Images" },
  { value: 3, label: "3 Images" },
  { value: 4, label: "4 Images" }
];

const guidanceScaleOptions = [
  { value: 7, label: "7 - Default" },
  { value: 5, label: "5 - Less Strict" },
  { value: 9, label: "9 - More Strict" },
  { value: 12, label: "12 - Very Strict" }
];

const numInferenceStepsOptions = [
  { value: 30, label: "30 Steps - Fast" },
  { value: 50, label: "50 Steps - Default" },
  { value: 75, label: "75 Steps - High Quality" },
  { value: 100, label: "100 Steps - Max Quality" }
];

interface ImageGenerationFormProps {
  initialData?: Partial<ImageFormData>;
}

export function ImageGenerationForm({ initialData }: ImageGenerationFormProps) {
  const [formData, setFormData] = useState<ImageFormData>({
    prompt: initialData?.prompt || "",
    style: initialData?.style || "Cinematic",
    aspectRatio: initialData?.aspectRatio || "16:9",
    numImages: initialData?.numImages || 1,
    guidanceScale: initialData?.guidanceScale || 7,
    numInferenceSteps: initialData?.numInferenceSteps || 50
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { session } = useSessionContext();

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

    setIsGenerating(true);

    try {
      const { error } = await supabase.functions.invoke('generate-image', {
        body: {
          ...formData,
          user_id: session?.user?.id || ''
        }
      });

      if (error) throw error;

      toast({
        title: "Image Generated!",
        description: "Your image has been created successfully"
      });
    } catch (error: any) {
      console.error('Error generating image:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to generate image"
      });
    } finally {
      setIsGenerating(false);
    }
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
          <Label htmlFor="numImages" className="text-sm font-medium">Number of Images</Label>
          <Select value={String(formData.numImages)} onValueChange={(value) => setFormData({ ...formData, numImages: Number(value) })}>
            <SelectTrigger className="bg-background/50 border-white/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {numImagesOptions.map((option) => (
                <SelectItem key={option.value} value={String(option.value)}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="guidanceScale" className="text-sm font-medium">Guidance Scale</Label>
          <Select value={String(formData.guidanceScale)} onValueChange={(value) => setFormData({ ...formData, guidanceScale: Number(value) })}>
            <SelectTrigger className="bg-background/50 border-white/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {guidanceScaleOptions.map((option) => (
                <SelectItem key={option.value} value={String(option.value)}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="numInferenceSteps" className="text-sm font-medium">Inference Steps</Label>
        <Select value={String(formData.numInferenceSteps)} onValueChange={(value) => setFormData({ ...formData, numInferenceSteps: Number(value) })}>
          <SelectTrigger className="bg-background/50 border-white/10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {numInferenceStepsOptions.map((option) => (
              <SelectItem key={option.value} value={String(option.value)}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
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
        disabled={isGenerating || !formData.prompt.trim()}
        className="w-full h-12 text-base font-medium bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
      >
        {isGenerating ? (
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
