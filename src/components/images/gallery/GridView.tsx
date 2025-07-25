
import { ImageCard } from "./ImageCard";
import { GeneratedImage } from "./types";

interface GridViewProps {
  images: GeneratedImage[];
  onImageClick: (image: GeneratedImage) => void;
  onRegenerate: (image: GeneratedImage) => void;
  onDownload: (image: GeneratedImage) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (image: GeneratedImage) => void;
  onSaveTitle: (id: string, title: string) => void;
}

export function GridView({
  images,
  onImageClick,
  onRegenerate,
  onDownload,
  onDelete,
  onToggleFavorite,
  onSaveTitle
}: GridViewProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {images.map((image) => (
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
  );
}
