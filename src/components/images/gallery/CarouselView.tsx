
import React from "react";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Heart, RefreshCcw, Download, Trash2, Edit2, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface GeneratedImage {
  id: string;
  user_id: string;
  prompt: string;
  style: string;
  aspect_ratio: string;
  image_path: string;
  created_at: string;
  updated_at?: string;
  title?: string | null;
  is_favorite?: boolean | null;
}

interface CarouselViewProps {
  images: GeneratedImage[];
  editingId: string | null;
  editTitle: string;
  onEditTitle: (value: string) => void;
  onImageClick: (image: GeneratedImage) => void;
  onStartEditing: (image: GeneratedImage) => void;
  onSaveTitle: (id: string) => void;
  onCancelEditing: () => void;
  onToggleFavorite: (image: GeneratedImage) => void;
  onRegenerate: (image: GeneratedImage) => void;
  onDownload: (image: GeneratedImage) => void;
  onDelete: (id: string) => void;
}

export function CarouselView({
  images,
  editingId,
  editTitle,
  onEditTitle,
  onImageClick,
  onStartEditing,
  onSaveTitle,
  onCancelEditing,
  onToggleFavorite,
  onRegenerate,
  onDownload,
  onDelete
}: CarouselViewProps) {
  return (
    <Carousel 
      className="w-full"
      opts={{
        align: "start",
        loop: true,
      }}
    >
      <CarouselContent>
        {images.map((image) => {
          const imageUrl = supabase.storage.from('ai_generated_images').getPublicUrl(image.image_path).data.publicUrl;
          return (
            <CarouselItem key={image.id} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
              <Card 
                className={cn(
                  "p-3 bg-muted/10 border border-white/10 transition-all duration-300 h-full overflow-hidden",
                  "hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:border-white/20",
                  image.is_favorite && "border-primary/30"
                )}
                onClick={() => onImageClick(image)}
              >
                <div className="aspect-square w-full overflow-hidden rounded-md">
                  <img
                    src={imageUrl}
                    alt={image.prompt}
                    className="w-full h-full object-cover cursor-pointer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                </div>
                <div className="flex flex-col space-y-2 mt-2">
                  {editingId === image.id ? (
                    <div className="flex items-center gap-2">
                      <Input 
                        value={editTitle} 
                        onChange={(e) => onEditTitle(e.target.value)}
                        className="text-sm bg-muted/30 border border-white/10"
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={(e) => {
                          e.stopPropagation();
                          onSaveTitle(image.id);
                        }}
                        className="hover:bg-primary/20"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={(e) => {
                          e.stopPropagation();
                          onCancelEditing();
                        }}
                        className="hover:bg-destructive/20"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-foreground line-clamp-2 flex-1">
                        {image.title || image.prompt.substring(0, 30) + (image.prompt.length > 30 ? '...' : '')}
                      </p>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={(e) => {
                          e.stopPropagation();
                          onStartEditing(image);
                        }}
                        className="h-7 w-7 hover:bg-accent/10"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="style" className="bg-primary/10">
                      {image.style}
                    </Badge>
                    <Badge variant="dimension" className="bg-secondary/10">
                      {image.aspect_ratio}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1 pt-1">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1 bg-gradient-secondary hover:bg-gradient-primary transition-all duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRegenerate(image);
                      }}
                    >
                      <RefreshCcw className="h-3 w-3 mr-1" />
                      Regenerate
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1 hover:bg-gradient-primary transition-all duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDownload(image);
                      }}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={cn(
                        "transition-all duration-300",
                        image.is_favorite 
                          ? "bg-primary/20 text-white hover:bg-primary/30" 
                          : "hover:bg-accent/20"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(image);
                      }}
                    >
                      <Heart 
                        className={cn(
                          "h-3 w-3", 
                          image.is_favorite ? "fill-primary text-primary" : ""
                        )} 
                      />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="hover:bg-destructive/20 transition-all duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(image.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious className="left-0" />
      <CarouselNext className="right-0" />
    </Carousel>
  );
}
