
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Video, Sparkles, BarChart3 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export const QuickLinkBar = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  if (isMobile) return null; // Don't show on mobile
  
  return (
    <div className="flex justify-end items-center gap-2 mb-2 animate-fadeIn">
      <Button 
        size="sm" 
        variant="outline" 
        className="bg-white/5 border-white/10 hover:bg-white/10 hover:border-primary/50 group"
        onClick={() => navigate("/content")}
      >
        <Plus className="h-4 w-4 mr-1 group-hover:text-primary transition-colors duration-300" />
        Create Post
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        className="bg-white/5 border-white/10 hover:bg-white/10 hover:border-primary/50 group"
        onClick={() => navigate("/videos")}
      >
        <Video className="h-4 w-4 mr-1 group-hover:text-primary transition-colors duration-300" />
        Add Video
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        className="bg-white/5 border-white/10 hover:bg-white/10 hover:border-primary/50 group"
        onClick={() => navigate("/content")}
      >
        <Sparkles className="h-4 w-4 mr-1 group-hover:text-primary transition-colors duration-300" />
        Smart Ideas
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        className="bg-white/5 border-white/10 hover:bg-white/10 hover:border-primary/50 group"
        onClick={() => navigate("/settings")}
      >
        <BarChart3 className="h-4 w-4 mr-1 group-hover:text-primary transition-colors duration-300" />
        Analytics
      </Button>
    </div>
  );
};
