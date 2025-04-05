
import { Card } from "@/components/ui/card";
import { Download, Trash2, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface GeneratedImage {
  id: string;
  prompt: string;
  image_path: string;
  created_at: string;
  style: string;
  aspect_ratio: string;
}

export function ImageHistory() {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
      if (data.session) {
        fetchImages();
      } else {
        setIsLoading(false);
      }
    };

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
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
      setImages(data || []);
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
      a.download = `generated-image-${image.id}.png`;
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

  const handleRegenerate = async (image: GeneratedImage) => {
    // This functionality is handled in the parent component
    toast({
      title: "Regenerate Image",
      description: "Please use the settings in the form to regenerate this image.",
    });
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
            <Card key={image.id} className="p-3 bg-muted/10 border border-white/10 hover:shadow-card-hover transition-all duration-300">
              <div className="flex flex-col gap-3">
                <div className="aspect-square w-full">
                  <img
                    src={imageUrl}
                    alt={image.prompt}
                    className="w-full h-full object-cover rounded-md border border-white/10"
                    onError={(e) => {
                      console.error('Error loading image:', e);
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                </div>
                <div className="flex flex-col">
                  <p className="text-sm text-foreground mb-2 line-clamp-2 min-h-[2.5rem]">
                    {image.prompt}
                  </p>
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
                      className="flex-1 bg-gradient-secondary hover:bg-gradient-primary transition-all duration-300"
                      onClick={() => handleRegenerate(image)}
                    >
                      <RefreshCcw className="h-3 w-3 mr-1" />
                      Regenerate
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1 hover:bg-gradient-primary transition-all duration-300"
                      onClick={() => handleDownload(image)}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="hover:bg-destructive/20 transition-all duration-300"
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
