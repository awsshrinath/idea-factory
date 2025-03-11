
import { Card } from "@/components/ui/card";
import { Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface GeneratedImage {
  id: string;
  prompt: string;
  image_path: string;
  created_at: string;
}

export function ImageHistory() {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

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

  if (!isAuthenticated) {
    return (
      <div className="text-center text-muted-foreground py-8 bg-gradient-card border border-white/10 rounded-lg shadow-card">
        Please log in to view your generated images.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center text-muted-foreground py-8">
        Loading images...
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8 bg-gradient-card border border-white/10 rounded-lg shadow-card">
        No images generated yet. Try generating your first image!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((image) => {
        const imageUrl = supabase.storage.from('ai_generated_images').getPublicUrl(image.image_path).data.publicUrl;
        return (
          <Card key={image.id} className="p-4 bg-gradient-card border border-white/10 shadow-card hover:shadow-card-hover transition-all duration-300">
            <img
              src={imageUrl}
              alt={image.prompt}
              className="w-full h-48 object-cover rounded-md mb-4 border border-white/10"
              onError={(e) => {
                console.error('Error loading image:', e);
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {image.prompt}
            </p>
            <div className="flex justify-between gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="flex-1 bg-gradient-secondary hover:bg-gradient-primary transition-all duration-300"
                onClick={() => handleDownload(image)}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="flex-1 hover:bg-gradient-primary transition-all duration-300"
                onClick={() => handleDelete(image.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
