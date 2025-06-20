
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { Heart, RefreshCcw, Download, Trash2, Edit2, Check, X } from "lucide-react";
import { GeneratedImage } from "./types";

interface ImageCardProps {
  image: GeneratedImage;
  onImageClick: (image: GeneratedImage) => void;
  onRegenerate: (image: GeneratedImage) => void;
  onDownload: (image: GeneratedImage) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (image: GeneratedImage) => void;
  onSaveTitle: (id: string, title: string) => void;
  isCompact?: boolean;
}

export function ImageCard({
  image,
  onImageClick,
  onRegenerate,
  onDownload,
  onDelete,
  onToggleFavorite,
  onSaveTitle,
  isCompact = false,
}: ImageCardProps) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(image.title || image.prompt.substring(0, 20));

  const imageUrl = supabase.storage.from('ai_generated_images').getPublicUrl(image.image_path).data.publicUrl;

  const startEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTitle(true);
    setEditTitle(image.title || image.prompt.substring(0, 20));
  };

  const saveTitle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSaveTitle(image.id, editTitle);
    setEditingTitle(false);
  };

  const cancelEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTitle(false);
  };

  if (isCompact) {
    return (
      <Card 
        className="p-3 bg-muted/10 border-2 border-primary/30 hover:shadow-[0_0_20px_rgba(255,65,108,0.2)] transition-all duration-300 group overflow-hidden"
        onClick={() => onImageClick(image)}
      >
        <div className="aspect-square w-full overflow-hidden rounded-md relative">
          <img
            src={imageUrl}
            alt={image.prompt}
            className="w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-[1.03]"
            onError={(e) => {
              console.error('Error loading image:', e);
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
          {image.is_favorite && (
            <div className="absolute top-2 right-2 bg-primary/80 text-white rounded-full p-1">
              <Heart className="h-4 w-4 fill-white" />
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <p className="text-white text-sm line-clamp-2">{image.prompt}</p>
          </div>
        </div>
        <div className="flex flex-col mt-2">
          <p className="text-sm text-foreground font-medium line-clamp-1 mb-2">
            {image.title || image.prompt.substring(0, 30) + (image.prompt.length > 30 ? '...' : '')}
          </p>
          <div className="flex flex-wrap gap-1">
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1 bg-gradient-secondary hover:bg-gradient-primary transition-all duration-300 shadow-sm hover:shadow-[0_0_8px_rgba(0,198,255,0.4)] hover:scale-[1.02]"
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
              className="flex-1 hover:bg-gradient-primary transition-all duration-300 shadow-sm hover:shadow-[0_0_8px_rgba(255,65,108,0.4)] hover:scale-[1.02]"
              onClick={(e) => {
                e.stopPropagation();
                onDownload(image);
              }}
            >
              <Download className="h-3 w-3 mr-1" />
              Download
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      key={image.id} 
      className={cn(
        "p-3 bg-muted/10 border border-white/10 transition-all duration-300 group overflow-hidden",
        "hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:border-white/20 hover:scale-[1.02]",
        image.is_favorite && "border-primary/30"
      )}
      onClick={() => onImageClick(image)}
    >
      <div className="aspect-square w-full overflow-hidden rounded-md relative">
        <img
          src={imageUrl}
          alt={image.prompt}
          className="w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-[1.03]"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.svg';
          }}
        />
        {image.is_favorite && (
          <div className="absolute top-2 right-2 bg-primary/80 text-white rounded-full p-1">
            <Heart className="h-4 w-4 fill-white" />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="sm"
              className="h-7 w-7 p-0 bg-black/20 backdrop-blur-sm hover:bg-black/40"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(image);
              }}
            >
              <Heart 
                className={cn(
                  "h-3.5 w-3.5", 
                  image.is_favorite ? "fill-primary text-primary" : "text-white"
                )} 
              />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="h-7 w-7 p-0 bg-black/20 backdrop-blur-sm hover:bg-black/40"
              onClick={(e) => {
                e.stopPropagation();
                onRegenerate(image);
              }}
            >
              <RefreshCcw className="h-3.5 w-3.5 text-white" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="h-7 w-7 p-0 bg-black/20 backdrop-blur-sm hover:bg-black/40"
              onClick={(e) => {
                e.stopPropagation();
                onDownload(image);
              }}
            >
              <Download className="h-3.5 w-3.5 text-white" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0 bg-black/20 backdrop-blur-sm hover:bg-black/40"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(image.id);
              }}
            >
              <Trash2 className="h-3.5 w-3.5 text-white" />
            </Button>
          </div>
        </div>
      </div>
      {editingTitle ? (
        <div className="flex items-center gap-1 mt-2">
          <Input 
            value={editTitle} 
            onChange={(e) => setEditTitle(e.target.value)}
            className="text-xs h-7 bg-muted/30 border border-white/10 py-0"
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-7 w-7 hover:bg-primary/20"
            onClick={saveTitle}
          >
            <Check className="h-3.5 w-3.5" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-7 w-7 hover:bg-destructive/20"
            onClick={cancelEditing}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-foreground line-clamp-1 flex-1">
            {image.title || image.prompt.substring(0, 20) + '...'}
          </p>
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={startEditing}
            className="h-6 w-6 hover:bg-accent/10"
          >
            <Edit2 className="h-3 w-3" />
          </Button>
        </div>
      )}
      <div className="flex gap-1 mt-1">
        <Badge variant="style" className="text-[10px] py-0 h-4">
          {image.style}
        </Badge>
        <Badge variant="dimension" className="text-[10px] py-0 h-4">
          {image.aspect_ratio}
        </Badge>
      </div>
    </Card>
  );
}
