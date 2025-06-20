import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { WorkflowSelection } from '../WorkflowSelection';
import { AspectRatioSelector } from '../AspectRatioSelector';
import { AdvancedOptions } from '../AdvancedOptions';
import { 
  Video, 
  Wand2, 
  Sparkles, 
  Settings, 
  Play,
  Download,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VideoFormData {
  prompt: string;
  style: string;
  duration: number;
  aspectRatio: string;
  workflow: string;
  advanced: {
    seed?: number;
    steps?: number;
    guidance?: number;
    temperature?: number;
  };
}

const styles = [
  "Cinematic",
  "Documentary", 
  "Animation",
  "Corporate",
  "Social Media",
  "Educational"
];

const durations = [
  { value: 5, label: "5 seconds" },
  { value: 10, label: "10 seconds" },
  { value: 15, label: "15 seconds" },
  { value: 30, label: "30 seconds" }
];

interface MainFormProps {
  initialData?: Partial<VideoFormData>;
  onSubmit?: (data: VideoFormData) => void;
}

export function MainForm({ initialData, onSubmit }: MainFormProps) {
  const [formData, setFormData] = useState<VideoFormData>({
    prompt: initialData?.prompt || "",
    style: initialData?.style || "Cinematic",
    duration: initialData?.duration || 10,
    aspectRatio: initialData?.aspectRatio || "16:9",
    workflow: initialData?.workflow || "standard",
    advanced: initialData?.advanced || {}
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.prompt.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a video description"
      });
      return;
    }

    setIsGenerating(true);
    onSubmit?.(formData);
    
    // Simulate generation time
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "Video Generated!",
        description: "Your video has been created successfully"
      });
    }, 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Label htmlFor="prompt" className="text-sm font-medium">
          Video Description
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
          <Label htmlFor="style" className="text-sm font-medium">Style</Label>
          <Select value={formData.style} onValueChange={(value) => setFormData({ ...formData, style: value })}>
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
          <Label htmlFor="duration" className="text-sm font-medium">Duration</Label>
          <Select value={String(formData.duration)} onValueChange={(value) => setFormData({ ...formData, duration: Number(value) })}>
            <SelectTrigger className="bg-background/50 border-white/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {durations.map((d) => (
                <SelectItem key={d.value} value={String(d.value)}>{d.label}</SelectItem>
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

      <WorkflowSelection 
        selectedWorkflow={formData.workflow}
        onWorkflowChange={(workflow) => setFormData({ ...formData, workflow: workflow })}
      />

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
            Generate Video
          </>
        )}
      </Button>
    </form>
  );
}
