import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Monitor, Smartphone, Square, Film } from 'lucide-react';

const aspectRatios = [
  {
    ratio: "16:9",
    label: "Landscape",
    icon: Monitor,
    description: "Perfect for YouTube, presentations"
  },
  {
    ratio: "9:16",
    label: "Portrait",
    icon: Smartphone,
    description: "Ideal for TikTok, Instagram Stories"
  },
  {
    ratio: "1:1",
    label: "Square",
    icon: Square,
    description: "Great for Instagram posts"
  },
  {
    ratio: "4:3",
    label: "Classic",
    icon: Film,
    description: "Traditional film and video format"
  }
];

interface AspectRatioSelectorProps {
  selectedRatio: string;
  onRatioChange: (ratio: string) => void;
}

export function AspectRatioSelector({ selectedRatio, onRatioChange }: AspectRatioSelectorProps) {
  return (
    <Card className="premium-card border border-white/10 shadow-lg">
      <CardHeader>
        <CardTitle className="premium-heading text-xl">Aspect Ratio</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {aspectRatios.map((ratio) => (
            <Button
              key={ratio.ratio}
              variant={selectedRatio === ratio.ratio ? "secondary" : "outline"}
              className="premium-button justify-start text-sm"
              onClick={() => onRatioChange(ratio.ratio)}
            >
              <ratio.icon className="h-4 w-4 mr-2" />
              {ratio.label}
            </Button>
          ))}
        </div>
        <Badge variant="outline">
          Selected: {selectedRatio}
        </Badge>
      </CardContent>
    </Card>
  );
}
