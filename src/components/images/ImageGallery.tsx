
import { useState, useEffect } from 'react';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { GridView } from './gallery/GridView';
import { CarouselView } from './gallery/CarouselView';
import { LoadingState } from './gallery/LoadingState';
import { EmptyGalleryState } from './gallery/EmptyGalleryState';
import { ImageDetailModal } from './gallery/ImageDetailModal';
import { GeneratedImage, SortOption, ViewMode, ImageGalleryProps } from './gallery/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Grid,
  List,
  Search,
  SortAsc,
  Heart,
  Download,
  Trash2,
  RefreshCw,
  Filter
} from 'lucide-react';

export function ImageGallery({ 
  previewMode = false, 
  fullGallery = false,
  viewMode: initialViewMode = "grid",
  filter: initialFilter = "all"
}: ImageGalleryProps) {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState(initialFilter);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const { session } = useSessionContext();
  const { toast } = useToast();

  // Load images from Supabase
  useEffect(() => {
    if (session?.user?.id) {
      loadImages();
    }
  }, [session]);

  const loadImages = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('generated_images')
        .select('*')
        .eq('user_id', session?.user?.id)
        .order('created_at', { ascending: false });

      if (previewMode) {
        query = query.limit(6);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error loading images:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load images"
        });
        return;
      }

      setImages(data || []);
    } catch (error) {
      console.error('Error loading images:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load images"
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort images
  const filteredAndSortedImages = images
    .filter(image => {
      // Apply search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          image.prompt.toLowerCase().includes(searchLower) ||
          image.style.toLowerCase().includes(searchLower) ||
          (image.title && image.title.toLowerCase().includes(searchLower))
        );
      }
      return true;
    })
    .filter(image => {
      // Apply category filter
      if (filterBy === "favorites") {
        return image.is_favorite;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime();
        case "favorites":
          if (a.is_favorite && !b.is_favorite) return -1;
          if (!a.is_favorite && b.is_favorite) return 1;
          return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
        case "recent":
        default:
          return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
      }
    });

  const handleImageClick = (image: GeneratedImage) => {
    setSelectedImage(image);
  };

  const handleRegenerate = (image: GeneratedImage) => {
    // Dispatch custom event for regeneration
    const event = new CustomEvent('regenerate-image', {
      detail: {
        prompt: image.prompt,
        style: image.style,
        aspectRatio: image.aspect_ratio
      }
    });
    window.dispatchEvent(event);
    
    toast({
      title: "Settings Applied",
      description: "Ready to regenerate with previous settings",
    });
  };

  const handleDownload = async (image: GeneratedImage) => {
    try {
      const response = await fetch(image.image_path);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${image.title || 'generated-image'}-${image.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Download Started",
        description: "Your image is being downloaded",
      });
    } catch (error) {
      console.error('Error downloading image:', error);
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: "Failed to download image",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('generated_images')
        .delete()
        .eq('id', id)
        .eq('user_id', session?.user?.id);

      if (error) throw error;

      setImages(images.filter(img => img.id !== id));
      
      toast({
        title: "Image Deleted",
        description: "The image has been deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        variant: "destructive",
        title: "Delete Failed",
        description: "Failed to delete image",
      });
    }
  };

  const handleToggleFavorite = async (image: GeneratedImage) => {
    try {
      const newFavoriteStatus = !image.is_favorite;
      
      const { error } = await supabase
        .from('generated_images')
        .update({ is_favorite: newFavoriteStatus })
        .eq('id', image.id)
        .eq('user_id', session?.user?.id);

      if (error) throw error;

      setImages(images.map(img => 
        img.id === image.id 
          ? { ...img, is_favorite: newFavoriteStatus }
          : img
      ));
      
      toast({
        title: newFavoriteStatus ? "Added to Favorites" : "Removed from Favorites",
        description: newFavoriteStatus 
          ? "Image has been added to your favorites" 
          : "Image has been removed from your favorites",
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Failed to update favorite status",
      });
    }
  };

  const handleSaveTitle = async (id: string, title: string) => {
    try {
      const { error } = await supabase
        .from('generated_images')
        .update({ title })
        .eq('id', id)
        .eq('user_id', session?.user?.id);

      if (error) throw error;

      setImages(images.map(img => 
        img.id === id ? { ...img, title } : img
      ));
      
      toast({
        title: "Title Updated",
        description: "Image title has been saved",
      });
    } catch (error) {
      console.error('Error saving title:', error);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "Failed to save image title",
      });
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (images.length === 0) {
    return <EmptyGalleryState />;
  }

  return (
    <div className="space-y-6">
      {!previewMode && (
        <Card className="premium-card border border-white/10 shadow-lg backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="premium-heading text-xl">
                Image Gallery
              </CardTitle>
              <Badge variant="secondary">
                {filteredAndSortedImages.length} images
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by prompt, style, or title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-background/50 border-white/10"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex gap-2">
                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger className="w-32 bg-background/50 border-white/10">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="favorites">Favorites</SelectItem>
                    <SelectItem value="recent">Recent</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                  <SelectTrigger className="w-32 bg-background/50 border-white/10">
                    <SortAsc className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Recent</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                    <SelectItem value="favorites">Favorites</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex rounded-lg border border-white/10 bg-background/50">
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "carousel" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("carousel")}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Image Grid or Carousel */}
      {viewMode === "grid" ? (
        <GridView
          images={filteredAndSortedImages}
          onImageClick={handleImageClick}
          onRegenerate={handleRegenerate}
          onDownload={handleDownload}
          onDelete={handleDelete}
          onToggleFavorite={handleToggleFavorite}
          onSaveTitle={handleSaveTitle}
        />
      ) : (
        <CarouselView
          images={filteredAndSortedImages}
          onImageClick={handleImageClick}
          onRegenerate={handleRegenerate}
          onDownload={handleDownload}
          onDelete={handleDelete}
          onToggleFavorite={handleToggleFavorite}
          onSaveTitle={handleSaveTitle}
        />
      )}

      {/* Image Detail Modal */}
      {selectedImage && (
        <ImageDetailModal
          image={selectedImage}
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
