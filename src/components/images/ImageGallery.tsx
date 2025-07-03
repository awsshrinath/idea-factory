
import { useState, useEffect } from 'react';
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

interface GeneratedImage {
  id: string;
  user_id: string;
  prompt: string;
  style: string;
  aspect_ratio: string;
  image_path: string;
  title?: string;
  is_favorite?: boolean;
  created_at?: string;
  updated_at?: string;
}

export function ImageGallery() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'grid' | 'carousel'>('grid');
  const [filterStyle, setFilterStyle] = useState<string>('all');
  const [detailImageId, setDetailImageId] = useState<string | null>(null);

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
        title: item.title || undefined,
        is_favorite: item.is_favorite || false,
        created_at: item.created_at || undefined,
        updated_at: item.updated_at || undefined
      }));
    },
    enabled: !!user?.id,
  });

  const filteredImages = filterStyle === 'all' 
    ? images 
    : images.filter(img => img.style === filterStyle);

  const uniqueStyles = Array.from(new Set(images.map(img => img.style)));

  if (isLoading) return <LoadingState />;
  if (error) return <div className="text-red-500">Error loading images</div>;
  if (!images.length) return <EmptyGalleryState />;

  return (
    <div className="space-y-4">
      {/* Header Controls */}
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

      {/* Image Display */}
      {viewMode === 'grid' ? (
        <GridView 
          images={filteredImages} 
          onImageClick={(id) => setDetailImageId(id)}
        />
      ) : (
        <CarouselView 
          images={filteredImages}
          onImageClick={(id) => setDetailImageId(id)}
        />
      )}

      {/* Detail Modal */}
      {detailImageId && (
        <ImageDetailModal
          imageId={detailImageId}
          isOpen={true}
          onClose={() => setDetailImageId(null)}
        />
      )}
    </div>
  );
}
