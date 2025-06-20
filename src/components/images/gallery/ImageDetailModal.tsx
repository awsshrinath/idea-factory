
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, Trash2, RefreshCcw, Heart, Edit2, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { GeneratedImage } from "./types";
import { format } from "date-fns";

interface ImageDetailModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedImage: GeneratedImage | null;
  editingId: string | null;
  editTitle: string;
  onEditChange: (title: string) => void;
  onStartEditing: (image: GeneratedImage) => void;
  onSaveTitle: (id: string) => void;
  onCancelEditing: () => void;
  onToggleFavorite: (image: GeneratedImage) => void;
  onRegenerate: (image: GeneratedImage) => void;
  onDownload: (image: GeneratedImage) => void;
  onDelete: (id: string) => void;
}

export function ImageDetailModal({
  isOpen,
  onOpenChange,
  selectedImage,
  editingId,
  editTitle,
  onEditChange,
  onStartEditing,
  onSaveTitle,
  onCancelEditing,
  onToggleFavorite,
  onRegenerate,
  onDownload,
  onDelete
}: ImageDetailModalProps) {
  if (!selectedImage) return null;

  const imageUrl = supabase.storage.from('ai_generated_images').getPublicUrl(selectedImage.image_path).data.publicUrl;

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(selectedImage.prompt);
    } catch (error) {
      console.error('Failed to copy prompt:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto premium-card border border-white/10">
        <DialogHeader>
          <DialogTitle className="premium-heading text-xl">
            {selectedImage.title || "Generated Image"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image Display */}
          <div className="space-y-4">
            <div className="aspect-square w-full overflow-hidden rounded-lg border border-white/10">
              <img
                src={imageUrl}
                alt={selectedImage.prompt}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
            </div>
            
            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                onClick={() => onRegenerate(selectedImage)}
                className="bg-gradient-secondary hover:bg-gradient-primary transition-all duration-300"
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Regenerate
              </Button>
              <Button 
                variant="outline" 
                onClick={() => onDownload(selectedImage)}
                className="hover:bg-gradient-primary transition-all duration-300"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button 
                variant="outline" 
                onClick={() => onToggleFavorite(selectedImage)}
                className={cn(
                  "transition-all duration-300",
                  selectedImage.is_favorite 
                    ? "bg-primary/20 text-white hover:bg-primary/30" 
                    : "hover:bg-accent/20"
                )}
              >
                <Heart 
                  className={cn(
                    "h-4 w-4 mr-2", 
                    selectedImage.is_favorite ? "fill-primary text-primary" : ""
                  )} 
                />
                Favorite
              </Button>
              <Button 
                variant="outline" 
                onClick={() => onDelete(selectedImage.id)}
                className="hover:bg-destructive/20 transition-all duration-300"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>

          {/* Image Details */}
          <div className="space-y-6">
            {/* Title Edit */}
            <div className="space-y-2">
              <label className="text-sm font-medium premium-subheading">Title</label>
              {editingId === selectedImage.id ? (
                <div className="flex gap-2">
                  <Input 
                    value={editTitle} 
                    onChange={(e) => onEditChange(e.target.value)}
                    className="bg-muted/30 border border-white/10"
                  />
                  <Button 
                    size="sm"
                    onClick={() => onSaveTitle(selectedImage.id)}
                    className="premium-button"
                  >
                    Save
                  </Button>
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={onCancelEditing}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="premium-body">
                    {selectedImage.title || selectedImage.prompt.substring(0, 50) + '...'}
                  </p>
                  <Button 
                    size="sm"
                    variant="ghost"
                    onClick={() => onStartEditing(selectedImage)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <Separator className="bg-white/10" />

            {/* Prompt */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium premium-subheading">Prompt</label>
                <Button 
                  size="sm"
                  variant="ghost"
                  onClick={handleCopyPrompt}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="premium-body text-sm bg-muted/20 p-3 rounded-md border border-white/10">
                {selectedImage.prompt}
              </p>
            </div>

            {/* Style & Settings */}
            <div className="space-y-3">
              <label className="text-sm font-medium premium-subheading">Settings</label>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">
                  Style: {selectedImage.style}
                </Badge>
                <Badge variant="secondary">
                  Ratio: {selectedImage.aspect_ratio}
                </Badge>
                {selectedImage.is_favorite && (
                  <Badge variant="outline" className="border-primary/30 text-primary">
                    ❤️ Favorite
                  </Badge>
                )}
              </div>
            </div>

            {/* Creation Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium premium-subheading">Created</label>
              <p className="premium-caption">
                {selectedImage.created_at ? format(new Date(selectedImage.created_at), 'PPP p') : 'Unknown'}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
