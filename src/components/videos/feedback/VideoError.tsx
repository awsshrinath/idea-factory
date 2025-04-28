
import { Button } from "@/components/ui/button";
import { RefreshCw, Edit } from "lucide-react";

interface VideoErrorProps {
  onRetry: () => void;
  onEdit: () => void;
}

export function VideoError({ onRetry, onEdit }: VideoErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6 text-center">
      <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center animate-bounce-slow">
        <span className="text-4xl">🤔</span>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-white">Oops! Something went wrong.</h3>
        <p className="text-muted-foreground max-w-sm">
          Don't worry! These things happen. Let's try again or adjust your prompt for better results.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={onRetry}
          className="bg-primary/20 hover:bg-primary/30 hover:scale-105 transition-all duration-300"
        >
          <RefreshCw className="mr-2 h-4 w-4" /> Try Again
        </Button>
        
        <Button 
          onClick={onEdit}
          variant="outline"
          className="border-primary/20 hover:bg-primary/10 hover:scale-105 transition-all duration-300"
        >
          <Edit className="mr-2 h-4 w-4" /> Edit Prompt
        </Button>
      </div>
    </div>
  );
}
