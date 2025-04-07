
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Video, Sparkles, BarChart3 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export const QuickLinkBar = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  if (isMobile) return null; // Don't show on mobile
  
  return (
    <div className="flex justify-end items-center gap-1.5 mb-1 mt-1 animate-fadeIn">
      <Button 
        size="sm" 
        variant="default"
        className="bg-gradient-to-r from-primary to-primary/80 hover:shadow-[0_0_15px_rgba(233,30,99,0.2)] rounded-full h-8 px-4"
        onClick={() => navigate("/content")}
      >
        <Plus className="h-3.5 w-3.5 mr-1" />
        Create Post
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        className="bg-white/5 border-white/10 hover:bg-white/10 hover:border-primary/50 group rounded-full h-8 px-4"
        onClick={() => navigate("/videos")}
      >
        <Video className="h-3.5 w-3.5 mr-1 group-hover:text-primary transition-colors duration-300" />
        Add Video
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        className="bg-white/5 border-white/10 hover:bg-white/10 hover:border-primary/50 group rounded-full h-8 px-4"
        onClick={() => navigate("/content")}
      >
        <Sparkles className="h-3.5 w-3.5 mr-1 group-hover:text-primary transition-colors duration-300" />
        Smart Ideas
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        className="bg-white/5 border-white/10 hover:bg-white/10 hover:border-primary/50 group rounded-full h-8 px-4"
        onClick={() => navigate("/settings")}
      >
        <BarChart3 className="h-3.5 w-3.5 mr-1 group-hover:text-primary transition-colors duration-300" />
        Analytics
      </Button>
    </div>
  );
};
