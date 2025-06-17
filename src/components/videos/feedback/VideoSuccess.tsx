
import { Button } from "@/components/ui/button";
import { Play, Download, Calendar } from "lucide-react";

interface VideoSuccessProps {
  onWatch: () => void;
  onDownload: () => void;
  onSchedule: () => void;
}

export function VideoSuccess({ onWatch, onDownload, onSchedule }: VideoSuccessProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6 text-center">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full animate-pulse" />
        <div className="relative z-10 h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="text-4xl">🎉</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-2xl font-semibold text-white">Your video is ready!</h3>
        <p className="text-muted-foreground">
          Great job! Let's preview it or schedule it for your audience.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
        <Button 
          onClick={onWatch}
          className="flex-1 h-12 bg-primary/20 hover:bg-primary/30 hover:scale-105 transition-all duration-300"
        >
          <Play className="mr-2 h-4 w-4" /> Watch Preview
        </Button>
        
        <Button 
          onClick={onDownload}
          className="flex-1 h-12 bg-primary/20 hover:bg-primary/30 hover:scale-105 transition-all duration-300"
        >
          <Download className="mr-2 h-4 w-4" /> Download
        </Button>
        
        <Button 
          onClick={onSchedule}
          className="flex-1 h-12 bg-primary/20 hover:bg-primary/30 hover:scale-105 transition-all duration-300"
        >
          <Calendar className="mr-2 h-4 w-4" /> Schedule
        </Button>
      </div>
    </div>
  );
}
