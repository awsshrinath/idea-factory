import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heart, RefreshCcw, Download, Trash2, Edit2, Check, X, Calendar, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { GeneratedImage } from "./types";

interface ImageDetailModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedImage: GeneratedImage | null;
  editingId: string | null;
  editTitle: string;
  onEditChange: (value: string) => void;
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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>{selectedImage?.title || "Image Details"}</span>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className={cn(
                  "h-8 transition-all duration-300",
                  selectedImage?.is_favorite 
                    ? "bg-primary/20 text-white hover:bg-primary/30" 
                    : "hover:bg-accent/20"
                )}
                onClick={() => onToggleFavorite(selectedImage)}
              >
                <Heart 
                  className={cn(
                    "h-4 w-4 mr-1", 
                    selectedImage?.is_favorite ? "fill-primary text-primary" : ""
                  )} 
                />
                {selectedImage?.is_favorite ? "Favorited" : "Favorite"}
              </Button>
              <DialogClose asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8"
                >
                  Close
                </Button>
              </DialogClose>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative bg-black/30 rounded-lg overflow-hidden border border-white/10">
            <img 
              src={supabase.storage.from('ai_generated_images').getPublicUrl(selectedImage.image_path).data.publicUrl}
              alt={selectedImage.prompt}
              className="w-full object-contain max-h-[70vh]"
            />
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-1">Title</h3>
              {editingId === selectedImage.id ? (
                <div className="flex items-center gap-2">
                  <Input 
                    value={editTitle} 
                    onChange={(e) => onEditChange(e.target.value)}
                    className="bg-muted/30 border border-white/10"
                  />
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => onSaveTitle(selectedImage.id)}
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
                <div className="flex items-center justify-between mb-2">
                  <p className="text-lg font-medium">
                    {selectedImage.title || "Untitled Image"}
                  </p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => onStartEditing(selectedImage)}
                    className="h-8"
                  >
                    <Edit2 className="h-4 w-4 mr-1" />
                    Edit Title
                  </Button>
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-1">Prompt</h3>
              <p className="bg-muted/10 p-3 rounded-md border border-white/10">{selectedImage.prompt}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-1">Style</h3>
                <Badge className="bg-primary/20 hover:bg-primary/30 text-white">{selectedImage.style}</Badge>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">Aspect Ratio</h3>
                <Badge className="bg-secondary/20 hover:bg-secondary/30 text-white">{selectedImage.aspect_ratio}</Badge>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-1">Created</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(selectedImage.created_at).toLocaleString()}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2 pt-4">
              <Button 
                className="flex-1 bg-gradient-secondary hover:bg-gradient-primary transition-all duration-300"
                onClick={() => onRegenerate(selectedImage)}
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Regenerate
              </Button>
              <Button
                className="flex-1"
                onClick={() => onDownload(selectedImage)}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => {
                  onDelete(selectedImage.id);
                  onOpenChange(false);
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
