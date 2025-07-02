
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Download, Share2, Trash2, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface GeneratedImage {
  id: string;
  prompt: string;
  style: string;
  aspect_ratio: string;
  image_path: string;
  title?: string;
  is_favorite: boolean;
  created_at: string;
  user_id: string;
}

interface ImageGalleryProps {
  viewMode?: 'grid' | 'carousel';
  filter?: 'all' | 'favorites' | 'recent';
  previewMode?: boolean;
}

export function ImageGallery({ 
  viewMode = 'grid', 
  filter = 'all',
  previewMode = false 
}: ImageGalleryProps) {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchImages();
  }, [filter]);

  const fetchImages = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      let query = supabase
        .from('generated_images')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (filter === 'favorites') {
        query = query.eq('is_favorite', true);
      } else if (filter === 'recent') {
        query = query.limit(10);
      }

      if (previewMode) {
        query = query.limit(3);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching images:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load images"
        });
        return;
      }

      setImages(data || []);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (imageId: string, currentFavorite: boolean) => {
    try {
      const { error } = await supabase
        .from('generated_images')
        .update({ is_favorite: !currentFavorite })
        .eq('id', imageId);

      if (error) throw error;

      setImages(prev => prev.map(img => 
        img.id === imageId 
          ? { ...img, is_favorite: !currentFavorite }
          : img
      ));

      toast({
        title: !currentFavorite ? "Added to favorites" : "Removed from favorites",
        description: "Image updated successfully"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update favorite status"
      });
    }
  };

  const deleteImage = async (imageId: string) => {
    try {
      const { error } = await supabase
        .from('generated_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;

      setImages(prev => prev.filter(img => img.id !== imageId));
      toast({
        title: "Image deleted",
        description: "Image removed successfully"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete image"
      });
    }
  };

  const getImageUrl = (imagePath: string) => {
    const { data } = supabase.storage
      .from('ai_generated_images')
      .getPublicUrl(imagePath);
    return data.publicUrl;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="premium-card animate-pulse">
            <div className="aspect-square bg-white/5 rounded-t-lg" />
            <CardContent className="p-4">
              <div className="h-4 bg-white/5 rounded mb-2" />
              <div className="h-3 bg-white/5 rounded w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-white/60 text-lg mb-2">No images found</div>
        <div className="text-white/40 text-sm">
          {filter === 'favorites' 
            ? "You haven't favorited any images yet"
            : "Start generating images to see them here"
          }
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      viewMode === 'grid' 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        : "flex gap-4 overflow-x-auto pb-4"
    )}>
      {images.map((image) => (
        <Card key={image.id} className="premium-card premium-card-hover group">
          <div className="relative aspect-square overflow-hidden rounded-t-lg">
            <img
              src={getImageUrl(image.image_path)}
              alt={image.prompt}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300">
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70"
                  onClick={() => toggleFavorite(image.id, image.is_favorite)}
                >
                  <Heart className={cn(
                    "h-4 w-4",
                    image.is_favorite ? "fill-red-500 text-red-500" : "text-white"
                  )} />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70"
                  onClick={() => setSelectedImage(image)}
                >
                  <Eye className="h-4 w-4 text-white" />
                </Button>
              </div>
            </div>
          </div>
          <CardContent className="p-4">
            <p className="text-sm text-white/80 line-clamp-2 mb-2">
              {image.prompt}
            </p>
            <div className="flex items-center justify-between text-xs text-white/60">
              <Badge variant="outline" className="bg-white/5">
                {image.style}
              </Badge>
              <span>
                {new Date(image.created_at).toLocaleDateString()}
              </span>
            </div>
            {!previewMode && (
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" className="flex-1">
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
                <Button size="sm" variant="outline">
                  <Share2 className="h-3 w-3" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => deleteImage(image.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
