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
        className="cursor-pointer transition-all duration-300 bg-gradient-card hover:bg-gradient-card-hover border border-white/10
                   hover:shadow-card-hover"
        onClick={() => onSelect("direct")}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Video className="h-5 w-5" />
            Direct Video Generation
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Generate a video directly from your script with AI-powered visuals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Play className="h-4 w-4" /> Quick single-step video creation
            </div>
            <Button 
              className="w-full bg-gradient-primary hover:bg-gradient-secondary transition-all duration-300 
                         hover:shadow-glow"
            >
              Start Direct Video
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card 
        className="cursor-pointer transition-all duration-300 bg-gradient-card hover:bg-gradient-card-hover border border-white/10
                   hover:shadow-card-hover"
        onClick={() => onSelect("fine-tuned")}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <ImagePlus className="h-5 w-5" />
            Fine-Tuned Video Generation
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Generate and customize images first, then create your video with precise control
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Image className="h-4 w-4" /> Detailed image-first approach
            </div>
            <Button 
              className="w-full bg-gradient-primary hover:bg-gradient-secondary transition-all duration-300 
                         hover:shadow-glow"
            >
              Start Fine-Tuned Video
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}