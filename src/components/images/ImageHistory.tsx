import { Card } from "@/components/ui/card";
import { Download, Trash2, RefreshCcw, Heart, Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { GeneratedImage } from "./gallery/types";

export function ImageHistory() {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const session = await supabase.auth.getSession();
      const authenticated = !!session.data.session;
      setIsAuthenticated(authenticated);
      if (authenticated) {
        fetchImages();
      } else {
        setIsLoading(false);
      }
    };

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setIsAuthenticated(!!session);
      if (session) {
        fetchImages();
      } else {
        setImages([]);
        setIsLoading(false);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('generated_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log("Fetched images:", data);
      
      // Process the data to ensure it matches our GeneratedImage type
      const processedImages: GeneratedImage[] = (data || []).map(img => ({
        ...img,
        created_at: img.created_at || new Date().toISOString(),
        updated_at: img.updated_at || undefined,
        title: img.title || undefined,
        is_favorite: img.is_favorite || false
      }));
      
      setImages(processedImages);
    } catch (error: any) {
      console.error('Error fetching images:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load images. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const imageToDelete = images.find(img => img.id === id);
      if (!imageToDelete) return;

      const { error: storageError } = await supabase
        .storage
        .from('ai_generated_images')
        .remove([imageToDelete.image_path]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from('generated_images')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      setImages(images.filter(img => img.id !== id));
      toast({
        title: "Success",
        description: "Image deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting image:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete image. Please try again.",
      });
    }
  };

  const handleDownload = async (image: GeneratedImage) => {
    try {
      const { data, error } = await supabase
        .storage
        .from('ai_generated_images')
        .download(image.image_path);

      if (error) throw error;

      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${image.title || 'generated-image'}-${image.id}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      console.error('Error downloading image:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to download image. Please try again.",
      });
    }
  };

  const handleRegenerate = async () => {
    toast({
      title: "Regenerate Image",
      description: "Please use the settings in the form to regenerate this image.",
    });
  };

  const startEditing = (image: GeneratedImage) => {
    setEditingId(image.id);
    setEditTitle(image.title || image.prompt.substring(0, 20));
  };

  const saveTitle = async (id: string) => {
    try {
      const { error } = await supabase
        .from('generated_images')
        .update({ title: editTitle })
        .eq('id', id);

      if (error) throw error;

      setImages(images.map(img => 
        img.id === id ? { ...img, title: editTitle } : img
      ));
      setEditingId(null);
      
      toast({
        title: "Success",
        description: "Image title updated",
      });
    } catch (error: any) {
      console.error('Error updating title:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update title. Please try again.",
      });
    }
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const toggleFavorite = async (image: GeneratedImage) => {
    try {
      const newFavoriteStatus = !image.is_favorite;
      
      const { error } = await supabase
        .from('generated_images')
        .update({ is_favorite: newFavoriteStatus })
        .eq('id', image.id);

      if (error) throw error;

      setImages(images.map(img => 
        img.id === image.id ? { ...img, is_favorite: newFavoriteStatus } : img
      ));
      
      toast({
        title: newFavoriteStatus ? "Added to favorites" : "Removed from favorites",
        description: newFavoriteStatus ? 
          "Image added to your favorites" : 
          "Image removed from your favorites",
      });
    } catch (error: any) {
      console.error('Error updating favorite status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update favorite status. Please try again.",
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <Card className="text-center text-muted-foreground p-6 bg-gradient-card border border-white/10 shadow-card h-32 flex items-center justify-center">
        Please log in to view your generated images.
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="text-center text-muted-foreground p-6 bg-gradient-card border border-white/10 shadow-card h-32 flex items-center justify-center">
        Loading images...
      </Card>
    );
  }

  if (images.length === 0) {
    return (
      <Card className="text-center text-muted-foreground p-6 bg-gradient-card border border-white/10 shadow-card h-32 flex items-center justify-center">
        No images generated yet. Try generating your first image!
      </Card>
    );
  }

  return (
    <ScrollArea className={cn(
      "rounded-lg border border-white/10 bg-gradient-card shadow-card",
      "max-h-[calc(100vh-170px)]"
    )}>
      <div className="p-2 space-y-3">
        {images.map((image) => {
          const imageUrl = supabase.storage.from('ai_generated_images').getPublicUrl(image.image_path).data.publicUrl;
          return (
            <Card key={image.id} className="p-3 bg-muted/10 border border-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:border-white/20 transition-all duration-300 group">
              <div className="flex flex-col gap-3">
                <div className="aspect-square w-full overflow-hidden rounded-md">
                  <img
                    src={imageUrl}
                    alt={image.prompt}
                    className="w-full h-full object-cover border border-white/10 rounded-md transition-transform duration-300 group-hover:scale-[1.02]"
                    onError={(e) => {
                      console.error('Error loading image:', e);
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                </div>
                <div className="flex flex-col">
                  {editingId === image.id ? (
                    <div className="flex items-center gap-2 mb-2">
                      <Input 
                        value={editTitle} 
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="text-sm bg-muted/30 border border-white/10"
                        autoFocus
                      />
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => saveTitle(image.id)}
                        className="hover:bg-primary/20"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={cancelEditing}
                        className="hover:bg-destructive/20"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-foreground line-clamp-2 flex-1">
                        {image.title || image.prompt.substring(0, 30) + (image.prompt.length > 30 ? '...' : '')}
                      </p>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => startEditing(image)}
                        className="h-7 w-7 hover:bg-accent/10"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="text-xs bg-primary/20 text-white px-2 py-1 rounded-full">
                      {image.style || "Default"}
                    </span>
                    <span className="text-xs bg-secondary/20 text-white px-2 py-1 rounded-full">
                      {image.aspect_ratio || "1:1"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1 bg-gradient-secondary hover:bg-gradient-primary transition-all duration-300 shadow-sm hover:shadow-[0_0_8px_rgba(0,198,255,0.4)] hover:scale-[1.02]"
                      onClick={handleRegenerate}
                    >
                      <RefreshCcw className="h-3 w-3 mr-1" />
                      Regenerate
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1 hover:bg-gradient-primary transition-all duration-300 shadow-sm hover:shadow-[0_0_8px_rgba(255,65,108,0.4)] hover:scale-[1.02]"
                      onClick={() => handleDownload(image)}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={cn(
                        "transition-all duration-300 hover:scale-[1.02]",
                        image.is_favorite 
                          ? "bg-primary/20 text-white hover:bg-primary/30" 
                          : "hover:bg-accent/20"
                      )}
                      onClick={() => toggleFavorite(image)}
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
                      className="hover:bg-destructive/20 transition-all duration-300 hover:scale-[1.02]"
                      onClick={() => handleDelete(image.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </ScrollArea>
  );
}
