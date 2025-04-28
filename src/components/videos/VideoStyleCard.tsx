
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface VideoStyleCardProps {
  title: string;
  icon: LucideIcon;
  description?: string;
  imageUrl?: string;
  isSelected?: boolean;
  onClick: () => void;
}

export function VideoStyleCard({
  title,
  icon: Icon,
  description,
  imageUrl,
  isSelected,
  onClick,
}: VideoStyleCardProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden border transition-all duration-300 transform hover:scale-[1.03] cursor-pointer group",
        isSelected 
          ? "border-primary/50 shadow-[0_0_15px_rgba(255,65,108,0.3)]" 
          : "border-white/10 hover:border-primary/30 hover:shadow-[0_0_10px_rgba(255,65,108,0.2)]"
      )}
      onClick={onClick}
    >
      {imageUrl && (
        <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <CardContent className="p-4 relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <Icon className={cn(
            "w-5 h-5 transition-colors",
            isSelected ? "text-primary" : "text-muted-foreground"
          )} />
          <h3 className={cn(
            "font-medium text-base",
            isSelected ? "text-primary" : "text-foreground"
          )}>
            {title}
          </h3>
        </div>
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
