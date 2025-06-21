
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Loader, Sparkles } from 'lucide-react';

interface ProductionFormProps {
  onSubmit: (data: any) => void;
  isLoading: boolean;
  selectedTemplate: any;
  selectedEffects: any[];
  selectedAudio: any;
  selectedCaptions: any;
}

export function ProductionForm({
  onSubmit,
  isLoading,
  selectedTemplate,
  selectedEffects,
  selectedAudio,
  selectedCaptions
}: ProductionFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    prompt: '',
    duration: 30,
    resolution: '1080p',
    aspectRatio: '16:9',
    voice: '',
    language: 'en'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Video Title</Label>
          <Input
            id="title"
            placeholder="Enter your video title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (seconds)</Label>
          <Select value={String(formData.duration)} onValueChange={(value) => handleChange('duration', Number(value))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15 seconds</SelectItem>
              <SelectItem value="30">30 seconds</SelectItem>
              <SelectItem value="60">1 minute</SelectItem>
              <SelectItem value="120">2 minutes</SelectItem>
              <SelectItem value="300">5 minutes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="prompt">Video Description</Label>
        <Textarea
          id="prompt"
          placeholder="Describe your video content in detail. Be specific about the style, mood, and key points you want to include..."
          value={formData.prompt}
          onChange={(e) => handleChange('prompt', e.target.value)}
          className="min-h-[120px]"
          required
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Resolution</Label>
          <Select value={formData.resolution} onValueChange={(value) => handleChange('resolution', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="720p">HD (720p)</SelectItem>
              <SelectItem value="1080p">Full HD (1080p)</SelectItem>
              <SelectItem value="4k">4K Ultra HD</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Aspect Ratio</Label>
          <Select value={formData.aspectRatio} onValueChange={(value) => handleChange('aspectRatio', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="16:9">16:9 (Landscape)</SelectItem>
              <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
              <SelectItem value="1:1">1:1 (Square)</SelectItem>
              <SelectItem value="4:3">4:3 (Traditional)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Language</Label>
          <Select value={formData.language} onValueChange={(value) => handleChange('language', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
              <SelectItem value="de">German</SelectItem>
              <SelectItem value="it">Italian</SelectItem>
              <SelectItem value="pt">Portuguese</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Selection Summary */}
      <Card className="bg-muted/20">
        <CardContent className="p-4">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Production Configuration
          </h4>
          <div className="space-y-2">
            {selectedTemplate && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{selectedTemplate.name}</Badge>
                <span className="text-sm text-muted-foreground">Template</span>
              </div>
            )}
            {selectedEffects.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                {selectedEffects.map((effect) => (
                  <Badge key={effect.id} variant="outline">{effect.name}</Badge>
                ))}
                <span className="text-sm text-muted-foreground">Effects</span>
              </div>
            )}
            {selectedAudio && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{selectedAudio.name}</Badge>
                <span className="text-sm text-muted-foreground">Audio</span>
              </div>
            )}
            {selectedCaptions && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{selectedCaptions.name}</Badge>
                <span className="text-sm text-muted-foreground">Captions</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Button
        type="submit"
        disabled={isLoading || !formData.title || !formData.prompt}
        className="w-full h-12 text-base font-medium bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
      >
        {isLoading ? (
          <>
            <Loader className="h-5 w-5 mr-2 animate-spin" />
            Generating Professional Video...
          </>
        ) : (
          <>
            <Play className="h-5 w-5 mr-2" />
            Create Professional Video
          </>
        )}
      </Button>
    </form>
  );
}
