
import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles } from "lucide-react";

interface LoadingStateProps {
  previewMode?: boolean;
}

export function LoadingState({ previewMode = false }: LoadingStateProps) {
  if (previewMode) {
    return (
      <div className="grid grid-cols-1 gap-4">
        <Card className="p-3 bg-muted/10 border border-white/10">
          <div className="aspect-square w-full bg-gradient-to-br from-muted/20 via-muted/30 to-muted/20 animate-shimmer bg-[length:200%_100%] rounded-md">
            <div className="h-full w-full flex items-center justify-center">
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2 mx-auto"></div>
                <p className="text-sm text-muted-foreground font-medium">Loading your creation...</p>
              </div>
            </div>
          </div>
          <div className="mt-2">
            <Skeleton className="h-6 w-3/4" />
            <div className="mt-2 flex gap-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-14" />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <Card className="text-center text-muted-foreground p-6 bg-gradient-card border border-white/10 shadow-card h-32 flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="rounded-full bg-muted/20 p-2">
          <Sparkles className="h-6 w-6" />
        </div>
        <span>Loading your creative gallery...</span>
      </div>
    </Card>
  );
}
