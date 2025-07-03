
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { GridView } from './gallery/GridView';
import { CarouselView } from './gallery/CarouselView';
import { ImageDetailModal } from './gallery/ImageDetailModal';
import { LoadingState } from './gallery/LoadingState';
import { EmptyGalleryState } from './gallery/EmptyGalleryState';
import { Button } from '@/components/ui/button';
import { Grid, Rows, Filter } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { GeneratedImage, ViewMode, ImageGalleryProps } from './gallery/types';

export function ImageGallery({ viewMode: initialViewMode = 'grid', filter: initialFilter = 'all', previewMode = false }: ImageGalleryProps = {}) {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);
  const [filterStyle, setFilterStyle] = useState<string>(initialFilter);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const { data: images = [], isLoading, error } = useQuery({
    queryKey: ['generated-images', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('generated_images')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our interface
      return data.map(item => ({
        ...item,
        title: item.title || null,
        is_favorite: item.is_favorite || false,
        created_at: item.created_at || new Date().toISOString(),
        updated_at: item.updated_at || null
      })) as GeneratedImage[];
    },
    enabled: !!user?.id,
  });

  const filteredImages = filterStyle === 'all' 
    ? images 
    : images.filter(img => img.style === filterStyle);

  const uniqueStyles = Array.from(new Set(images.map(img => img.style)));

  const handleImageClick = (image: GeneratedImage) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
    setEditingId(null);
    setEditTitle('');
  };

  const handleStartEditing = (image: GeneratedImage) => {
    setEditingId(image.id);
    setEditTitle(image.title || '');
  };

  const handleSaveTitle = async (id: string) => {
    try {
      await supabase
        .from('generated_images')
        .update({ title: editTitle })
        .eq('id', id);
      
      setEditingId(null);
      setEditTitle('');
    } catch (error) {
      console.error('Error updating title:', error);
    }
  };

  const handleCancelEditing = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const handleToggleFavorite = async (image: GeneratedImage) => {
    try {
      await supabase
        .from('generated_images')
        .update({ is_favorite: !image.is_favorite })
        .eq('id', image.id);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleRegenerate = (image: GeneratedImage) => {
    console.log('Regenerate image:', image.id);
    // TODO: Implement regeneration logic
  };

  const handleDownload = (image: GeneratedImage) => {
    const imageUrl = supabase.storage.from('ai_generated_images').getPublicUrl(image.image_path).data.publicUrl;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `generated-image-${image.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (id: string) => {
    try {
      await supabase
        .from('generated_images')
        .delete()
        .eq('id', id);
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  if (isLoading) return <LoadingState />;
  if (error) return <div className="text-red-500">Error loading images</div>;
  if (!images.length) return <EmptyGalleryState />;

  return (
    <div className="space-y-4">
      {!previewMode && (
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'carousel' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('carousel')}
            >
              <Rows className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <select
              value={filterStyle}
              onChange={(e) => setFilterStyle(e.target.value)}
              className="px-2 py-1 border rounded"
            >
              <option value="all">All Styles</option>
              {uniqueStyles.map(style => (
                <option key={style} value={style}>{style}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {viewMode === 'grid' ? (
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
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          selectedImage={selectedImage}
          editingId={editingId}
          editTitle={editTitle}
          onEditChange={setEditTitle}
          onStartEditing={handleStartEditing}
          onSaveTitle={handleSaveTitle}
          onCancelEditing={handleCancelEditing}
          onToggleFavorite={handleToggleFavorite}
          onRegenerate={handleRegenerate}
          onDownload={handleDownload}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
