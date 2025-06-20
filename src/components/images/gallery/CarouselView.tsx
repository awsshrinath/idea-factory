
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImageCard } from './ImageCard';
import { GeneratedImage } from './types';

interface CarouselViewProps {
  images: GeneratedImage[];
  onImageClick: (image: GeneratedImage) => void;
  onRegenerate: (image: GeneratedImage) => void;
  onDownload: (image: GeneratedImage) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (image: GeneratedImage) => void;
  onSaveTitle: (id: string, title: string) => void;
}

export function CarouselView({
  images,
  onImageClick,
  onRegenerate,
  onDownload,
  onDelete,
  onToggleFavorite,
  onSaveTitle
}: CarouselViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev + itemsPerPage >= images.length ? 0 : prev + itemsPerPage
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev - itemsPerPage < 0 ? 
        Math.max(0, images.length - itemsPerPage) : 
        prev - itemsPerPage
    );
  };

  const visibleImages = images.slice(currentIndex, currentIndex + itemsPerPage);

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={prevSlide}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <span className="text-sm text-muted-foreground">
          {currentIndex + 1}-{Math.min(currentIndex + itemsPerPage, images.length)} of {images.length}
        </span>
        
        <Button
          variant="outline"
          size="icon"
          onClick={nextSlide}
          disabled={currentIndex + itemsPerPage >= images.length}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleImages.map((image) => (
          <ImageCard
            key={image.id}
            image={{
              ...image,
              created_at: image.created_at || new Date().toISOString(),
              updated_at: image.updated_at || undefined
            }}
            onImageClick={onImageClick}
            onRegenerate={onRegenerate}
            onDownload={onDownload}
            onDelete={onDelete}
            onToggleFavorite={onToggleFavorite}
            onSaveTitle={onSaveTitle}
          />
        ))}
      </div>
    </div>
  );
}
