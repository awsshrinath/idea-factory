
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GridView } from './gallery/GridView';
import { CarouselView } from './gallery/CarouselView';
import { EmptyGalleryState } from './gallery/EmptyGalleryState';
import { LoadingState } from './gallery/LoadingState';
import { ImageDetailModal } from './gallery/ImageDetailModal';
import { GeneratedImage, SortOption, ViewMode } from './gallery/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Grid, List, Filter, SortAsc, SortDesc, Heart, Calendar, Sparkles } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface ImageGalleryProps {
  previewMode?: boolean;
  viewMode?: ViewMode;
  filter?: "all" | "favorites" | "recent";
}

export function ImageGallery({ 
  previewMode = false, 
  viewMode: initialViewMode = "grid",
  filter: initialFilter = "all"
}: ImageGalleryProps) {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [filter, setFilter] = useState<"all" | "favorites" | "recent">(initialFilter);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const { user } = useAuth();

  // Fetch images from Supabase
  useEffect(() => {
    fetchImages();
  }, [user, sortBy, filter]);

  const fetchImages = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      let query = supabase
        .from('generated_images')
        .select('*')
        .eq('user_id', user.id);

      // Apply filters
      if (filter === 'favorites') {
        query = query.eq('is_favorite', true);
      } else if (filter === 'recent') {
        query = query.gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());
      }

      // Apply sorting
      if (sortBy === 'recent') {
        query = query.order('created_at', { ascending: false });
      } else if (sortBy === 'oldest') {
        query = query.order('created_at', { ascending: true });
      } else if (sortBy === 'favorites') {
        query = query.order('is_favorite', { ascending: false });
      }

      // Limit for preview mode
      if (previewMode) {
        query = query.limit(6);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching images:', error);
        toast.error('Failed to load images');
        return;
      }

      if (data) {
        const processedImages: GeneratedImage[] = data.map(img => ({
          ...img,
          created_at: img.created_at || new Date().toISOString(),
          updated_at: img.updated_at || undefined,
          title: img.title || undefined,
          is_favorite: img.is_favorite || false
        }));
        setImages(processedImages);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      toast.error('Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (image: GeneratedImage) => {
    setSelectedImage(image);
    setShowDetailModal(true);
  };

  const handleFavoriteToggle = async (image: GeneratedImage) => {
    try {
      const newFavoriteStatus = !image.is_favorite;
      
      const { error } = await supabase
        .from('generated_images')
        .update({ is_favorite: newFavoriteStatus })
        .eq('id', image.id);

      if (error) throw error;

      setImages(prev => prev.map(img => 
        img.id === image.id 
          ? { ...img, is_favorite: newFavoriteStatus }
          : img
      ));

      toast.success(newFavoriteStatus ? 'Added to favorites' : 'Removed from favorites');
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorite status');
    }
  };

  const handleDownload = async (image: GeneratedImage) => {
    try {
      const { data } = await supabase.storage
        .from('generated-images')
        .download(image.image_path);
      
      if (data) {
        const url = URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${image.title || 'generated-image'}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success('Image downloaded successfully');
      }
    } catch (error) {
      console.error('Error downloading image:', error);
      toast.error('Failed to download image');
    }
  };

  const handleRegenerate = async () => {
    toast.info('Regeneration feature coming soon');
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('generated_images')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setImages(prev => prev.filter(img => img.id !== id));
      toast.success('Image deleted successfully');
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    }
  };

  const handleSaveTitle = async (id: string, title: string) => {
    try {
      const { error } = await supabase
        .from('generated_images')
        .update({ title })
        .eq('id', id);

      if (error) throw error;

      setImages(prev => prev.map(img => 
        img.id === id ? { ...img, title } : img
      ));

      toast.success('Title updated successfully');
    } catch (error) {
      console.error('Error updating title:', error);
      toast.error('Failed to update title');
    }
  };

  const handleShare = async (image: GeneratedImage) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: image.title || 'Generated Image',
          text: image.prompt,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Failed to share image');
    }
  };

  const getFilteredAndSortedImages = () => {
    let filteredImages = [...images];

    // Apply sorting
    if (sortBy === 'recent') {
      filteredImages.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortBy === 'oldest') {
      filteredImages.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    } else if (sortBy === 'favorites') {
      filteredImages.sort((a, b) => (b.is_favorite ? 1 : 0) - (a.is_favorite ? 1 : 0));
    }

    return filteredImages;
  };

  const filteredImages = getFilteredAndSortedImages();

  if (loading) {
    return <LoadingState />;
  }

  if (images.length === 0) {
    return <EmptyGalleryState />;
  }

  const renderControls = () => {
    if (previewMode) return null;

    return (
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="flex items-center gap-2"
          >
            <Grid className="h-4 w-4" />
            Grid
          </Button>
          <Button
            variant={viewMode === 'carousel' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('carousel')}
            className="flex items-center gap-2"
          >
            <List className="h-4 w-4" />
            Carousel
          </Button>
        </div>

        <div className="flex gap-2 flex-1">
          <Select value={filter} onValueChange={(value: "all" | "favorites" | "recent") => setFilter(value)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  All
                </div>
              </SelectItem>
              <SelectItem value="favorites">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Favorites
                </div>
              </SelectItem>
              <SelectItem value="recent">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Recent
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">
                <div className="flex items-center gap-2">
                  <SortDesc className="h-4 w-4" />
                  Recent
                </div>
              </SelectItem>
              <SelectItem value="oldest">
                <div className="flex items-center gap-2">
                  <SortAsc className="h-4 w-4" />
                  Oldest
                </div>
              </SelectItem>
              <SelectItem value="favorites">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Favorites
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  };

  const renderGallery = () => {
    const commonProps = {
      images: filteredImages,
      onImageClick: handleImageClick,
      onToggleFavorite: handleFavoriteToggle,
      onDownload: handleDownload,
      onRegenerate: handleRegenerate,
      onDelete: handleDelete,
      onSaveTitle: handleSaveTitle,
      onShare: handleShare,
    };

    if (viewMode === 'carousel') {
      return <CarouselView {...commonProps} />;
    }

    return <GridView {...commonProps} />;
  };

  if (previewMode) {
    return (
      <div className="space-y-4">
        {renderGallery()}
        <ImageDetailModal
          image={selectedImage}
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          onFavoriteToggle={handleFavoriteToggle}
          onDownload={handleDownload}
          onRegenerate={handleRegenerate}
          onDelete={(image) => handleDelete(image.id)}
          onShare={handleShare}
        />
      </div>
    );
  }

  return (
    <Card className="premium-card border border-white/10 shadow-lg">
      <CardHeader>
        <CardTitle className="premium-heading flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-400" />
          Generated Images
          <Badge variant="secondary" className="ml-auto">
            {filteredImages.length} images
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {renderControls()}
        {renderGallery()}
        <ImageDetailModal
          image={selectedImage}
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          onFavoriteToggle={handleFavoriteToggle}
          onDownload={handleDownload}
          onRegenerate={handleRegenerate}
          onDelete={(image) => handleDelete(image.id)}
          onShare={handleShare}
        />
      </CardContent>
    </Card>
  );
}
