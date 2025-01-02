import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, ImagePlus, Play, Image } from "lucide-react";

interface WorkflowSelectionProps {
  onSelect: (type: "direct" | "fine-tuned") => void;
}

export function WorkflowSelection({ onSelect }: WorkflowSelectionProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card 
        className="cursor-pointer hover:border-primary transition-colors"
        onClick={() => onSelect("direct")}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Direct Video Generation
          </CardTitle>
          <CardDescription>
            Generate a video directly from your script with AI-powered visuals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Play className="h-4 w-4" /> Quick single-step video creation
            </div>
            <Button className="w-full">Start Direct Video</Button>
          </div>
        </CardContent>
      </Card>

      <Card 
        className="cursor-pointer hover:border-primary transition-colors"
        onClick={() => onSelect("fine-tuned")}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImagePlus className="h-5 w-5" />
            Fine-Tuned Video Generation
          </CardTitle>
          <CardDescription>
            Generate and customize images first, then create your video with precise control
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Image className="h-4 w-4" /> Detailed image-first approach
            </div>
            <Button className="w-full">Start Fine-Tuned Video</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}