
import React from "react";
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Download } from "lucide-react";
import { PlaceholderCards } from "./PlaceholderCards";

interface EmptyGalleryStateProps {
  previewMode?: boolean;
  fullGallery?: boolean;
}

export function EmptyGalleryState({ previewMode = false, fullGallery = false }: EmptyGalleryStateProps) {
  if (previewMode) {
    return (
      <Card className="p-3 bg-muted/10 border border-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all duration-300">
        <div className="aspect-square w-full overflow-hidden rounded-md relative bg-gradient-to-br from-muted/20 via-muted/30 to-muted/20 animate-shimmer bg-[length:200%_100%] flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center backdrop-blur-[2px]">
            <div className="p-4 text-center">
              <Sparkles className="h-8 w-8 mb-2 mx-auto text-primary/40" />
              <p className="text-sm text-foreground font-medium">Your next masterpiece</p>
              <p className="text-xs text-muted-foreground mt-1">Fill in the form and click Generate</p>
            </div>
          </div>
        </div>
        <div className="mt-2 space-y-2">
          <p className="text-sm text-foreground font-medium">Ready to create something amazing</p>
          <div className="flex gap-1">
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1 bg-gradient-secondary hover:bg-gradient-primary transition-all duration-300 shadow-sm hover:shadow-[0_0_8px_rgba(0,198,255,0.4)] hover:scale-[1.02] opacity-50"
              disabled
            >
              <RefreshCcw className="h-3 w-3 mr-1" />
              Regenerate
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1 hover:bg-gradient-primary transition-all duration-300 shadow-sm hover:shadow-[0_0_8px_rgba(255,65,108,0.4)] hover:scale-[1.02] opacity-50"
              disabled
            >
              <Download className="h-3 w-3 mr-1" />
              Download
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  if (fullGallery) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <PlaceholderCards />
      </div>
    );
  }

  return (
    <Card className="text-center text-muted-foreground p-6 bg-gradient-card border border-white/10 shadow-card h-32 flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="rounded-full bg-muted/20 p-2">
          <Sparkles className="h-6 w-6" />
        </div>
        <span>No images generated yet. Try creating your first masterpiece!</span>
      </div>
    </Card>
  );
}
