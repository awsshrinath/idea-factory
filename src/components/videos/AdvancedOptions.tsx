import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Settings, Sliders } from 'lucide-react';

interface AdvancedOptionsProps {
  options: {
    seed?: number;
    steps?: number;
    guidance?: number;
    temperature?: number;
  };
  onChange: (options: any) => void;
}

export function AdvancedOptions({ options, onChange }: AdvancedOptionsProps) {
  return (
    <Card className="premium-card border border-white/10 shadow-lg">
      <CardHeader className="space-y-2">
        <div className="flex items-center">
          <Settings className="h-4 w-4 mr-2 text-muted-foreground" />
          <CardTitle className="text-sm font-medium">Advanced Options</CardTitle>
        </div>
        <CardTitle className="text-xs text-muted-foreground">
          Fine-tune your video generation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="seed" className="text-xs">Seed (optional)</Label>
          <Input
            type="number"
            id="seed"
            placeholder="Random seed for reproducible results"
            value={options.seed || ""}
            onChange={(e) => onChange({ ...options, seed: Number(e.target.value) })}
            className="bg-white/5 border-white/10 text-xs"
          />
        </div>

        <Separator className="bg-white/10" />

        <div className="space-y-2">
          <Label htmlFor="steps" className="text-xs">Steps: {options.steps || 20}</Label>
          <Slider
            id="steps"
            defaultValue={[options.steps || 20]}
            min={10}
            max={50}
            step={1}
            onValueChange={(value) => onChange({ ...options, steps: value[0] })}
            className="bg-white/5 border-white/10"
          />
        </div>

        <Separator className="bg-white/10" />

        <div className="space-y-2">
          <Label htmlFor="guidance" className="text-xs">Guidance Scale: {options.guidance || 7.5}</Label>
          <Slider
            id="guidance"
            defaultValue={[options.guidance || 7.5]}
            min={1}
            max={20}
            step={0.5}
            onValueChange={(value) => onChange({ ...options, guidance: value[0] })}
            className="bg-white/5 border-white/10"
          />
        </div>

        <Separator className="bg-white/10" />

        <div className="space-y-2">
          <Label htmlFor="temperature" className="text-xs">Temperature: {options.temperature || 1.0}</Label>
          <Slider
            id="temperature"
            defaultValue={[options.temperature || 1.0]}
            min={0}
            max={2}
            step={0.1}
            onValueChange={(value) => onChange({ ...options, temperature: value[0] })}
            className="bg-white/5 border-white/10"
          />
        </div>
      </CardContent>
    </Card>
  );
}
