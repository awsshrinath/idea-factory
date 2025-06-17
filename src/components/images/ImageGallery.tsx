
import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { Clock, Filter, Heart } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { GridView } from "./gallery/GridView";
import { CarouselView } from "./gallery/CarouselView";
import { ImageDetailModal } from "./gallery/ImageDetailModal";
import { LoadingState } from "./gallery/LoadingState";
import { EmptyGalleryState } from "./gallery/EmptyGalleryState";
import { ImageCard } from "./gallery/ImageCard";
import { PlaceholderCards } from "./gallery/PlaceholderCards";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { GeneratedImage, ImageGalleryProps, SortOption, ViewMode } from "./gallery/types";

export function ImageGallery({ 
  previewMode = false, 
  fullGallery = false, 
  viewMode: initialViewMode = "grid", 
  filter = "all" 
}: ImageGalleryProps) {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("recent");
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);
  const { toast } = useToast();
  const isMobile = useIsMobile();

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
  }, [filter]);

  useEffect(() => {
    sortImages(sortOption);
  }, [sortOption]);

  const fetchImages = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('generated_images')
        .select('*');
      
      if (filter === "favorites") {
        query = query.eq('is_favorite', true);
      } else if (filter === "recent") {
        query = query.order('created_at', { ascending: false }).limit(10);
      } else {
        query = query.order('created_at', { ascending: false });
      }
      
      const { data, error } = await query;

      if (error) throw error;

      console.log("Fetched images:", data);
      
      const filteredData = previewMode ? (data && data.length > 0 ? [data[0]] : []) : data || [];
      
      setImages(filteredData);
      sortImages(sortOption, filteredData);
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

  const sortImages = (option: SortOption, imagesToSort: GeneratedImage[] = images) => {
    let sortedImages = [...imagesToSort];
    
    switch (option) {
      case "recent":
        sortedImages.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case "oldest":
        sortedImages.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case "favorites":
        sortedImages.sort((a, b) => {
          if (a.is_favorite === b.is_favorite) {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          }
          return a.is_favorite ? -1 : 1;
        });
        break;
    }
    
    setImages(sortedImages);
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
      
      if (selectedImage?.id === id) {
        setIsDetailModalOpen(false);
      }
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
      a.download = `${image.title || 'generated-image'}-${image.id}.png`;
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

  const handleRegenerate = async (image: GeneratedImage) => {
    window.dispatchEvent(new CustomEvent('regenerate-image', { 
      detail: { 
        prompt: image.prompt,
        style: image.style,
        aspectRatio: image.aspect_ratio
      }
    }));
    
    toast({
      title: "Ready to Regenerate",
      description: "Settings applied. Click generate to create a new version.",
    });
  };

  const startEditing = (image: GeneratedImage) => {
    setEditingId(image.id);
    setEditTitle(image.title || image.prompt.substring(0, 20));
  };

  const saveTitle = async (id: string) => {
    try {
      const { error } = await supabase
        .from('generated_images')
        .update({ title: editTitle })
        .eq('id', id);

      if (error) throw error;

      setImages(images.map(img => 
        img.id === id ? { ...img, title: editTitle } : img
      ));
      
      if (selectedImage?.id === id) {
        setSelectedImage({...selectedImage, title: editTitle});
      }
      
      setEditingId(null);
      
      toast({
        title: "Success",
        description: "Image title updated",
      });
    } catch (error: any) {
      console.error('Error updating title:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update title. Please try again.",
      });
    }
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const toggleFavorite = async (image: GeneratedImage) => {
    try {
      const newFavoriteStatus = !image.is_favorite;
      
      const { error } = await supabase
        .from('generated_images')
        .update({ is_favorite: newFavoriteStatus })
        .eq('id', image.id);

      if (error) throw error;

      const updatedImages = images.map(img => 
        img.id === image.id ? { ...img, is_favorite: newFavoriteStatus } : img
      );
      
      setImages(updatedImages);
      
      if (selectedImage?.id === image.id) {
        setSelectedImage({...selectedImage, is_favorite: newFavoriteStatus});
      }
      
      if (sortOption === "favorites") {
        sortImages(sortOption, updatedImages);
      }
      
      toast({
        title: newFavoriteStatus ? "Added to favorites" : "Removed from favorites",
        description: newFavoriteStatus ? 
          "Image added to your favorites" : 
          "Image removed from your favorites",
      });
    } catch (error: any) {
      console.error('Error updating favorite status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update favorite status. Please try again.",
      });
    }
  };

  const showImageDetails = (image: GeneratedImage) => {
    setSelectedImage(image);
    setIsDetailModalOpen(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center text-muted-foreground p-6 bg-gradient-card border border-white/10 shadow-card h-32 flex items-center justify-center">
        Please log in to view your generated images.
      </div>
    );
  }

  if (isLoading) {
    return <LoadingState previewMode={previewMode} />;
  }

  if (images.length === 0) {
    return <EmptyGalleryState previewMode={previewMode} fullGallery={fullGallery} />;
  }

  // Preview mode - show latest creation
  if (previewMode) {
    const image = images[0];
    
    return (
      <div>
        <ImageCard
          image={image}
          onImageClick={showImageDetails}
          onRegenerate={handleRegenerate}
          onDownload={handleDownload}
          onDelete={handleDelete}
          onToggleFavorite={toggleFavorite}
          onSaveTitle={saveTitle}
          isCompact
        />
        
        <ImageDetailModal
          isOpen={isDetailModalOpen}
          onOpenChange={setIsDetailModalOpen}
          selectedImage={selectedImage}
          editingId={editingId}
          editTitle={editTitle}
          onEditChange={setEditTitle}
          onStartEditing={startEditing}
          onSaveTitle={saveTitle}
          onCancelEditing={cancelEditing}
          onToggleFavorite={toggleFavorite}
          onRegenerate={handleRegenerate}
          onDownload={handleDownload}
          onDelete={handleDelete}
        />
      </div>
    );
  }
  
  // Full gallery mode with filtering and view options
  if (fullGallery) {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3 justify-between items-center">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-accent/10">
              {images.length} Images
            </Badge>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  <Filter className="h-3.5 w-3.5 mr-1.5" />
                  <span>Sort: </span>
                  <span className="ml-1 text-primary">
                    {sortOption === "recent" ? "Recent" : 
                    sortOption === "oldest" ? "Oldest" : "Favorites"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuRadioGroup value={sortOption} onValueChange={(val) => setSortOption(val as SortOption)}>
                  <DropdownMenuRadioItem value="recent">
                    <Clock className="h-4 w-4 mr-2" />
                    Most Recent
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="oldest">
                    <Clock className="h-4 w-4 mr-2" />
                    Oldest First
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="favorites">
                    <Heart className="h-4 w-4 mr-2" />
                    Favorites
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant={viewMode === "grid" ? "secondary" : "outline"} 
              size="sm"
              className="h-8"
              onClick={() => setViewMode("grid")}
            >
              <div className="grid grid-cols-2 gap-0.5 h-3.5 w-3.5 mr-1.5">
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
              </div>
              Grid
            </Button>
            <Button 
              variant={viewMode === "carousel" ? "secondary" : "outline"}
              size="sm"
              className="h-8"
              onClick={() => setViewMode("carousel")}
            >
              <div className="flex space-x-0.5 h-3.5 w-3.5 mr-1.5">
                <div className="bg-current w-2 rounded-sm"></div>
                <div className="bg-current w-1 rounded-sm"></div>
              </div>
              Carousel
            </Button>
          </div>
        </div>
        
        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <GridView 
              images={images}
              onImageClick={showImageDetails}
              onRegenerate={handleRegenerate}
              onDownload={handleDownload}
              onDelete={handleDelete}
              onToggleFavorite={toggleFavorite}
              onSaveTitle={(id, title) => {
                setEditTitle(title);
                saveTitle(id);
              }}
            />
            
            {images.length < 5 && fullGallery && <PlaceholderCards count={5 - images.length} />}
          </div>
        ) : (
          <CarouselView
            images={images}
            editingId={editingId}
            editTitle={editTitle}
            onEditTitle={setEditTitle}
            onImageClick={showImageDetails}
            onStartEditing={startEditing}
            onSaveTitle={saveTitle}
            onCancelEditing={cancelEditing}
            onToggleFavorite={toggleFavorite}
            onRegenerate={handleRegenerate}
            onDownload={handleDownload}
            onDelete={handleDelete}
          />
        )}
        
        <ImageDetailModal
          isOpen={isDetailModalOpen}
          onOpenChange={setIsDetailModalOpen}
          selectedImage={selectedImage}
          editingId={editingId}
          editTitle={editTitle}
          onEditChange={setEditTitle}
          onStartEditing={startEditing}
          onSaveTitle={saveTitle}
          onCancelEditing={cancelEditing}
          onToggleFavorite={toggleFavorite}
          onRegenerate={handleRegenerate}
          onDownload={handleDownload}
          onDelete={handleDelete}
        />
      </div>
    );
  }
  
  // Simple gallery mode (not preview or full gallery)
  return (
    <>
      <ScrollArea className={cn(
        "rounded-lg border border-white/10 bg-gradient-card shadow-card",
        "max-h-[calc(100vh-170px)]"
      )}>
        <div className="p-2 space-y-3">
          {images.map((image) => {
            const imageUrl = supabase.storage.from('ai_generated_images').getPublicUrl(image.image_path).data.publicUrl;
            return (
              <div key={image.id} onClick={() => showImageDetails(image)}>
                <ImageCard
                  image={image}
                  onImageClick={showImageDetails}
                  onRegenerate={handleRegenerate}
                  onDownload={handleDownload}
                  onDelete={handleDelete}
                  onToggleFavorite={toggleFavorite}
                  onSaveTitle={(id, title) => {
                    setEditTitle(title);
                    saveTitle(id);
                  }}
                />
              </div>
            );
          })}
        </div>
      </ScrollArea>
      
      <ImageDetailModal
        isOpen={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        selectedImage={selectedImage}
        editingId={editingId}
        editTitle={editTitle}
        onEditChange={setEditTitle}
        onStartEditing={startEditing}
        onSaveTitle={saveTitle}
        onCancelEditing={cancelEditing}
        onToggleFavorite={toggleFavorite}
        onRegenerate={handleRegenerate}
        onDownload={handleDownload}
        onDelete={handleDelete}
      />
    </>
  );
}
