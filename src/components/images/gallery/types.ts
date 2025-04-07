
export interface GeneratedImage {
  id: string;
  user_id: string;
  prompt: string;
  style: string;
  aspect_ratio: string;
  image_path: string;
  created_at: string;
  updated_at?: string;
  title?: string | null;
  is_favorite?: boolean | null;
}

export type SortOption = "recent" | "oldest" | "favorites";
export type ViewMode = "grid" | "carousel";

export interface ImageGalleryProps {
  previewMode?: boolean;
  fullGallery?: boolean;
  viewMode?: ViewMode;
  filter?: "all" | "favorites" | "recent";
}
