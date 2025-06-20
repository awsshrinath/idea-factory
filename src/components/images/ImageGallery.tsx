
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { GridView } from './gallery/GridView';
import { CarouselView } from './gallery/CarouselView';
import { ImageDetailModal } from './gallery/ImageDetailModal';
import { EmptyGalleryState } from './gallery/EmptyGalleryState';
import { LoadingState } from './gallery/LoadingState';
import { GeneratedImage } from './gallery/types';
import { 
  Image, 
  Grid3X3, 
  LayoutGrid, 
  Search, 
  Filter, 
  SortDesc
} from 'lucide-react';

interface ImageGalleryProps {
  previewMode?: boolean;
  viewMode?: "grid" | "carousel";
  filter?: "all" | "favorites" | "recent";
}

export function ImageGallery({ previewMode = false, viewMode = "grid", filter = "all" }: ImageGalleryProps) {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [currentFilter, setCurrentFilter] = useState<"all" | "favorites" | "recent">(filter);
  const [sortBy, setSortBy] = useState<"recent" | "oldest" | "favorites">("recent");
  const [currentViewMode, setCurrentViewMode] = useState<"grid" | "carousel">(viewMode);
  const { toast } = useToast();
  const { session } = useSessionContext();

  useEffect(() => {
    if (session?.user?.id) {
      fetchImages();
    }
  }, [session?.user?.id, currentFilter, sortBy]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('generated_images')
        .select('*')
        .eq('user_id', session?.user?.id || '');

      if (currentFilter === 'favorites') {
        query = query.eq('is_favorite', true);
      }

      let orderColumn = 'created_at';
      let ascending = false;

      if (sortBy === 'oldest') {
        ascending = true;
      } else if (sortBy === 'favorites') {
        orderColumn = 'is_favorite';
        ascending = false;
      }

      const { data, error } = await query.order(orderColumn, { ascending });

      if (error) throw error;

      if (data) {
        const processedImages: GeneratedImage[] = data.map(img => ({
          ...img,
          created_at: img.created_at || new Date().toISOString()
        }));
        setImages(processedImages);
      }
    } catch (error: any) {
      console.error('Error fetching images:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load images"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (image: GeneratedImage) => {
    setSelectedImage(image);
  };

  const handleRegenerate = async (image: GeneratedImage) => {
    try {
      const { error } = await supabase.functions.invoke('generate-image', {
        body: {
          prompt: image.prompt,
          style: image.style,
          aspect_ratio: image.aspect_ratio,
          user_id: session?.user?.id || ''
        }
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "New image generated successfully"
      });
      
      fetchImages();
    } catch (error: any) {
      console.error('Error regenerating image:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to regenerate image"
      });
    }
  };

  const handleDownload = async (image: GeneratedImage) => {
    try {
      const imageUrl = supabase.storage.from('generated_images').getPublicUrl(image.image_path).data.publicUrl;
      
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${image.title || 'generated-image'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Success!",
        description: "Image downloaded successfully"
      });
    } catch (error: any) {
      console.error('Error downloading image:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to download image"
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('generated_images')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Image deleted successfully"
      });
      
      fetchImages();
    } catch (error: any) {
      console.error('Error deleting image:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete image"
      });
    }
  };

  const handleToggleFavorite = async (image: GeneratedImage) => {
    try {
      const { error } = await supabase
        .from('generated_images')
        .update({ is_favorite: !image.is_favorite })
        .eq('id', image.id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: image.is_favorite ? "Removed from favorites" : "Added to favorites"
      });
      
      fetchImages();
    } catch (error: any) {
      console.error('Error updating favorite:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update favorite"
      });
    }
  };

  const handleSaveTitle = async (id: string, title: string) => {
    try {
      const { error } = await supabase
        .from('generated_images')
        .update({ title })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Title updated successfully"
      });
      
      fetchImages();
    } catch (error: any) {
      console.error('Error updating title:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update title"
      });
    }
  };

  const filteredImages = images.filter(image =>
    image.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (image.title && image.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleFilterChange = (value: string) => {
    setCurrentFilter(value as "all" | "favorites" | "recent");
  };

  if (loading) {
    return <LoadingState />;
  }

  if (images.length === 0) {
    return <EmptyGalleryState />;
  }

  return (
    <div className="space-y-6">
      <Card className="premium-card border border-white/10 shadow-lg backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600/20 to-indigo-600/20 flex items-center justify-center border border-purple-500/20">
                <Image className="h-4 w-4 text-purple-400" />
              </div>
              <div>
                <CardTitle className="premium-heading text-xl">AI Image Gallery</CardTitle>
                <p className="premium-body text-sm text-muted-foreground">
                  {images.length} image{images.length !== 1 ? 's' : ''} generated
                </p>
              </div>
            </div>
            {!previewMode && (
              <div className="flex items-center gap-2">
                <Button
                  variant={currentViewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={currentViewMode === "carousel" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentViewMode("carousel")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>

        {!previewMode && (
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search images..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background/50 border-white/10"
                />
              </div>
              
              <Select value={currentFilter} onValueChange={handleFilterChange}>
                <SelectTrigger className="w-40 bg-background/50 border-white/10">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Images</SelectItem>
                  <SelectItem value="favorites">Favorites</SelectItem>
                  <SelectItem value="recent">Recent</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value: string) => setSortBy(value as any)}>
                <SelectTrigger className="w-40 bg-background/50 border-white/10">
                  <SortDesc className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="favorites">Favorites</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        )}
      </Card>

      {currentViewMode === "grid" ? (
        <GridView
          images={filteredImages}
          onImageClick={handleImageClick}
          onRegenerate={handleRegenerate}
          onDownload={handleDownload}
          onDelete={handleDelete}
          onToggleFavorite={handleToggleFavorite}
          onSaveTitle={handleSaveTitle}
        />
      ) : (
        <CarouselView
          images={filteredImages}
          onImageClick={handleImageClick}
          onRegenerate={handleRegenerate}
          onDownload={handleDownload}
          onDelete={handleDelete}
          onToggleFavorite={handleToggleFavorite}
          onSaveTitle={handleSaveTitle}
        />
      )}

      {selectedImage && (
        <ImageDetailModal
          image={selectedImage}
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          onRegenerate={handleRegenerate}
          onDownload={handleDownload}
          onDelete={handleDelete}
          onToggleFavorite={handleToggleFavorite}
          onSaveTitle={handleSaveTitle}
        />
      )}
    </div>
  );
}
