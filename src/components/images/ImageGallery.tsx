import { Card } from "@/components/ui/card";
import { Download, Trash2, RefreshCcw, Heart, Edit2, Check, X, Search, Clock, Sparkles, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Input } from "@/components/ui/input";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface GeneratedImage {
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

type SortOption = "recent" | "oldest" | "favorites";
type ViewMode = "grid" | "carousel";

interface ImageGalleryProps {
  previewMode?: boolean;
  fullGallery?: boolean;
  viewMode?: "grid" | "carousel";
  filter?: "all" | "favorites" | "recent";
}

export function ImageGallery({ previewMode = false, fullGallery = false, viewMode: initialViewMode = "grid", filter = "all" }: ImageGalleryProps) {
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

  const renderPlaceholderCards = () => {
    const count = previewMode ? 1 : 8;
    
    return Array(count).fill(0).map((_, i) => (
      <Card 
        key={`placeholder-${i}`} 
        className="p-3 bg-muted/10 border border-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all duration-300 group overflow-hidden"
      >
        <div className="aspect-square w-full overflow-hidden rounded-md relative bg-gradient-to-br from-muted/20 via-muted/30 to-muted/20 animate-shimmer bg-[length:200%_100%] flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center backdrop-blur-[2px]">
            <div className="p-4 text-center">
              <Sparkles className="h-8 w-8 mb-2 mx-auto text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground font-medium">Generate images to unlock</p>
            </div>
          </div>
        </div>
        
        <div className="mt-2 space-y-2">
          <div className="h-5 rounded bg-muted/20 animate-shimmer bg-[length:200%_100%]"></div>
          <div className="flex gap-1">
            <Badge variant="shimmer" className="w-16">Style</Badge>
            <Badge variant="shimmer" className="w-12">Ratio</Badge>
          </div>
          <div className="flex gap-1 h-8">
            <div className="h-full flex-1 rounded bg-muted/20 animate-shimmer bg-[length:200%_100%]"></div>
            <div className="h-full w-9 rounded bg-muted/20 animate-shimmer bg-[length:200%_100%]"></div>
          </div>
        </div>
      </Card>
    ));
  };

  if (!isAuthenticated) {
    return (
      <Card className="text-center text-muted-foreground p-6 bg-gradient-card border border-white/10 shadow-card h-32 flex items-center justify-center">
        Please log in to view your generated images.
      </Card>
    );
  }

  if (isLoading) {
    return previewMode ? (
      <div className="grid grid-cols-1 gap-4">
        <Card className="p-3 bg-muted/10 border border-white/10">
          <div className="aspect-square w-full bg-gradient-to-br from-muted/20 via-muted/30 to-muted/20 animate-shimmer bg-[length:200%_100%] rounded-md">
            <div className="h-full w-full flex items-center justify-center">
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2 mx-auto"></div>
                <p className="text-sm text-muted-foreground font-medium">Loading your creation...</p>
              </div>
            </div>
          </div>
          <div className="mt-2">
            <Skeleton className="h-6 w-3/4" />
            <div className="mt-2 flex gap-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-14" />
            </div>
          </div>
        </Card>
      </div>
    ) : (
      <Card className="text-center text-muted-foreground p-6 bg-gradient-card border border-white/10 shadow-card h-32 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="rounded-full bg-muted/20 p-2">
            <Sparkles className="h-6 w-6" />
          </div>
          <span>Loading your creative gallery...</span>
        </div>
      </Card>
    );
  }

  if (images.length === 0) {
    return (
      <div>
        {previewMode ? (
          <Card className="p-3 bg-muted/10 border border-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all duration-300">
            <div className="aspect-square w-full overflow-hidden rounded-md relative bg-gradient-to-br from-muted/20 via-muted/30 to-muted/20 animate-shimmer bg-[length:200%_100%] flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center backdrop-blur-[2px]">
                <div className="p-4 text-center">
                  <Sparkles className="h-8 w-8 mb-2 mx-auto text-primary/40" />
                  <p className="text-sm text-foreground font-medium">Your next masterpiece</p>
                  <p className="text-xs text-muted-foreground mt-1">Fill in the form and click Generate</p>
                </div>
              </div>
            </div>
            <div className="mt-2 space-y-2">
              <p className="text-sm text-foreground font-medium">Ready to create something amazing</p>
              <div className="flex gap-1">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1 bg-gradient-secondary hover:bg-gradient-primary transition-all duration-300 shadow-sm hover:shadow-[0_0_8px_rgba(0,198,255,0.4)] hover:scale-[1.02] opacity-50"
                  disabled
                >
                  <RefreshCcw className="h-3 w-3 mr-1" />
                  Regenerate
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1 hover:bg-gradient-primary transition-all duration-300 shadow-sm hover:shadow-[0_0_8px_rgba(255,65,108,0.4)] hover:scale-[1.02] opacity-50"
                  disabled
                >
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          </Card>
        ) : fullGallery ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {renderPlaceholderCards()}
          </div>
        ) : (
          <Card className="text-center text-muted-foreground p-6 bg-gradient-card border border-white/10 shadow-card h-32 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="rounded-full bg-muted/20 p-2">
                <Sparkles className="h-6 w-6" />
              </div>
              <span>No images generated yet. Try creating your first masterpiece!</span>
            </div>
          </Card>
        )}
      </div>
    );
  }

  const renderGalleryContent = () => {
    if (previewMode) {
      const image = images[0];
      const imageUrl = supabase.storage.from('ai_generated_images').getPublicUrl(image.image_path).data.publicUrl;
      
      return (
        <div>
          <Card className="p-3 bg-muted/10 border-2 border-primary/30 hover:shadow-[0_0_20px_rgba(255,65,108,0.2)] transition-all duration-300 group overflow-hidden">
            <div className="aspect-square w-full overflow-hidden rounded-md relative">
              <img
                src={imageUrl}
                alt={image.prompt}
                className="w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-[1.03]"
                onClick={() => showImageDetails(image)}
                onError={(e) => {
                  console.error('Error loading image:', e);
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
              {image.is_favorite && (
                <div className="absolute top-2 right-2 bg-primary/80 text-white rounded-full p-1">
                  <Heart className="h-4 w-4 fill-white" />
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white text-sm line-clamp-2">{image.prompt}</p>
              </div>
            </div>
            <div className="flex flex-col mt-2">
              <p className="text-sm text-foreground font-medium line-clamp-1 mb-2">
                {image.title || image.prompt.substring(0, 30) + (image.prompt.length > 30 ? '...' : '')}
              </p>
              <div className="flex flex-wrap gap-1">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1 bg-gradient-secondary hover:bg-gradient-primary transition-all duration-300 shadow-sm hover:shadow-[0_0_8px_rgba(0,198,255,0.4)] hover:scale-[1.02]"
                  onClick={() => handleRegenerate(image)}
                >
                  <RefreshCcw className="h-3 w-3 mr-1" />
                  Regenerate
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1 hover:bg-gradient-primary transition-all duration-300 shadow-sm hover:shadow-[0_0_8px_rgba(255,65,108,0.4)] hover:scale-[1.02]"
                  onClick={() => handleDownload(image)}
                >
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          </Card>
        </div>
      );
    }
    
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
              {images.map((image) => {
                const imageUrl = supabase.storage.from('ai_generated_images').getPublicUrl(image.image_path).data.publicUrl;
                return (
                  <Card 
                    key={image.id} 
                    className={cn(
                      "p-3 bg-muted/10 border border-white/10 transition-all duration-300 group overflow-hidden",
                      "hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:border-white/20 hover:scale-[1.02]",
                      image.is_favorite && "border-primary/30"
                    )}
                  >
                    <div className="aspect-square w-full overflow-hidden rounded-md relative">
                      <img
                        src={imageUrl}
                        alt={image.prompt}
                        className="w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-[1.03]"
                        onClick={() => showImageDetails(image)}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                      {image.is_favorite && (
                        <div className="absolute top-2 right-2 bg-primary/80 text-white rounded-full p-1">
                          <Heart className="h-4 w-4 fill-white" />
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-7 w-7 p-0 bg-black/20 backdrop-blur-sm hover:bg-black/40"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(image);
                            }}
                          >
                            <Heart 
                              className={cn(
                                "h-3.5 w-3.5", 
                                image.is_favorite ? "fill-primary text-primary" : "text-white"
                              )} 
                            />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-7 w-7 p-0 bg-black/20 backdrop-blur-sm hover:bg-black/40"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRegenerate(image);
                            }}
                          >
                            <RefreshCcw className="h-3.5 w-3.5 text-white" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-7 w-7 p-0 bg-black/20 backdrop-blur-sm hover:bg-black/40"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(image);
                            }}
                          >
                            <Download className="h-3.5 w-3.5 text-white" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 w-7 p-0 bg-black/20 backdrop-blur-sm hover:bg-black/40"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(image.id);
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5 text-white" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    {editingId === image.id ? (
                      <div className="flex items-center gap-1 mt-2">
                        <Input 
                          value={editTitle} 
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="text-xs h-7 bg-muted/30 border border-white/10 py-0"
                          autoFocus
                        />
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-7 w-7 hover:bg-primary/20"
                          onClick={() => saveTitle(image.id)}
                        >
                          <Check className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-7 w-7 hover:bg-destructive/20"
                          onClick={cancelEditing}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-foreground line-clamp-1 flex-1">
                          {image.title || image.prompt.substring(0, 20) + '...'}
                        </p>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={() => startEditing(image)}
                          className="h-6 w-6 hover:bg-accent/10"
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                    <div className="flex gap-1 mt-1">
                      <Badge variant="style" className="text-[10px] py-0 h-4">
                        {image.style}
                      </Badge>
                      <Badge variant="dimension" className="text-[10px] py-0 h-4">
                        {image.aspect_ratio}
                      </Badge>
                    </div>
                  </Card>
                );
              })}
              
              {images.length < 5 && fullGallery && renderPlaceholderCards().slice(0, 5 - images.length)}
            </div>
          ) : (
            <Carousel 
              className="w-full"
              opts={{
                align: "start",
                loop: true,
              }}
            >
              <CarouselContent>
                {images.map((image) => {
                  const imageUrl = supabase.storage.from('ai_generated_images').getPublicUrl(image.image_path).data.publicUrl;
                  return (
                    <CarouselItem key={image.id} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                      <Card 
                        className={cn(
                          "p-3 bg-muted/10 border border-white/10 transition-all duration-300 h-full overflow-hidden",
                          "hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:border-white/20",
                          image.is_favorite && "border-primary/30"
                        )}
                      >
                        <div className="aspect-square w-full overflow-hidden rounded-md">
                          <img
                            src={imageUrl}
                            alt={image.prompt}
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => showImageDetails(image)}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder.svg';
                            }}
                          />
                        </div>
                        <div className="flex flex-col space-y-2 mt-2">
                          {editingId === image.id ? (
                            <div className="flex items-center gap-2">
                              <Input 
                                value={editTitle} 
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="text-sm bg-muted/30 border border-white/10"
                                autoFocus
                              />
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                onClick={() => saveTitle(image.id)}
                                className="hover:bg-primary/20"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                onClick={cancelEditing}
                                className="hover:bg-destructive/20"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-foreground line-clamp-2 flex-1">
                                {image.title || image.prompt.substring(0, 30) + (image.prompt.length > 30 ? '...' : '')}
                              </p>
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  startEditing(image);
                                }}
                                className="h-7 w-7 hover:bg-accent/10"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          )}
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="style" className="bg-primary/10">
                              {image.style}
                            </Badge>
                            <Badge variant="dimension" className="bg-secondary/10">
                              {image.aspect_ratio}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-1 pt-1">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="flex-1 bg-gradient-secondary hover:bg-gradient-primary transition-all duration-300"
                              onClick={() => handleRegenerate(image)}
                            >
                              <RefreshCcw className="h-3 w-3 mr-1" />
                              Regenerate
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="flex-1 hover:bg-gradient-primary transition-all duration-300"
                              onClick={() => handleDownload(image)}
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Download
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className={cn(
                                "transition-all duration-300",
                                image.is_favorite 
                                  ? "bg-primary/20 text-white hover:bg-primary/30" 
                                  : "hover:bg-accent/20"
                              )}
                              onClick={() => toggleFavorite(image)}
                            >
                              <Heart 
                                className={cn(
                                  "h-3 w-3", 
                                  image.is_favorite ? "fill-primary text-primary" : ""
                                )} 
                              />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="hover:bg-destructive/20 transition-all duration-300"
                              onClick={() => handleDelete(image.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <CarouselPrevious className="left-0" />
              <CarouselNext className="right-0" />
            </Carousel>
          )}
        </div>
      );
    }
    
    return (
      <ScrollArea className={cn(
        "rounded-lg border border-white/10 bg-gradient-card shadow-card",
        "max-h-[calc(100vh-170px)]"
      )}>
        <div className="p-2 space-y-3">
          {images.map((image) => {
            const imageUrl = supabase.storage.from('ai_generated_images').getPublicUrl(image.image_path).data.publicUrl;
            return (
              <Card 
                key={image.id} 
                className="p-3 bg-muted/10 border border-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:border-white/20 transition-all duration-300 group"
                onClick={() => showImageDetails(image)}
              >
                <div className="flex flex-col gap-3">
                  <div className="aspect-square w-full overflow-hidden rounded-md">
                    <img
                      src={imageUrl}
                      alt={image.prompt}
                      className="w-full h-full object-cover border border-white/10 rounded-md transition-transform duration-300 group-hover:scale-[1.02] cursor-pointer"
                      onError={(e) => {
                        console.error('Error loading image:', e);
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  <div className="flex flex-col">
                    {editingId === image.id ? (
                      <div className="flex items-center gap-2 mb-2">
                        <Input 
                          value={editTitle} 
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="text-sm bg-muted/30 border border-white/10"
                          autoFocus
                        />
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={() => saveTitle(image.id)}
                          className="hover:bg-primary/20"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={cancelEditing}
                          className="hover:bg-destructive/20"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-foreground line-clamp-2 flex-1">
                          {image.title || image.prompt.substring(0, 30) + (image.prompt.length > 30 ? '...' : '')}
                        </p>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditing(image);
                          }}
                          className="h-7 w-7 hover:bg-accent/10"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="text-xs bg-primary/20 text-white px-2 py-1 rounded-full">
                        {image.style || "Default"}
                      </span>
                      <span className="text-xs bg-secondary/20 text-white px-2 py-1 rounded-full">
                        {image.aspect_ratio || "1:1"}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1 bg-gradient-secondary hover:bg-gradient-primary transition-all duration-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRegenerate(image);
                        }}
                      >
                        <RefreshCcw className="h-3 w-3 mr-1" />
                        Regenerate
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1 hover:bg-gradient-primary transition-all duration-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(image);
                        }}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className={cn(
                          "transition-all duration-300 hover:scale-[1.02]",
                          image.is_favorite 
                            ? "bg-primary/20 text-white hover:bg-primary/30" 
                            : "hover:bg-accent/20"
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(image);
                        }}
                      >
                        <Heart 
                          className={cn(
                            "h-3 w-3", 
                            image.is_favorite ? "fill-primary text-primary" : ""
                          )} 
                        />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="hover:bg-destructive/20 transition-all duration-300 hover:scale-[1.02]"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(image.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    );
  };

  return (
    <>
      {renderGalleryContent()}
      
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] max-h-[90vh] overflow-y-auto">
          <DialogTitle className="flex justify-between items-center">
            <span>{selectedImage?.title || "Image Details"}</span>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className={cn(
                  "h-8 transition-all duration-300",
                  selectedImage?.is_favorite 
                    ? "bg-primary/20 text-white hover:bg-primary/30" 
                    : "hover:bg-accent/20"
                )}
                onClick={() => selectedImage && toggleFavorite(selectedImage)}
              >
                <Heart 
                  className={cn(
                    "h-4 w-4 mr-1", 
                    selectedImage?.is_favorite ? "fill-primary text-primary" : ""
                  )} 
                />
                {selectedImage?.is_favorite ? "Favorited" : "Favorite"}
              </Button>
              <DialogClose asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8"
                >
                  Close
                </Button>
              </DialogClose>
            </div>
          </DialogTitle>
          
          {selectedImage && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative bg-black/30 rounded-lg overflow-hidden border border-white/10">
                <img 
                  src={supabase.storage.from('ai_generated_images').getPublicUrl(selectedImage.image_path).data.publicUrl}
                  alt={selectedImage.prompt}
                  className="w-full object-contain max-h-[70vh]"
                />
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">Title</h3>
                  {editingId === selectedImage.id ? (
                    <div className="flex items-center gap-2">
                      <Input 
                        value={editTitle} 
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="bg-muted/30 border border-white/10"
                      />
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => saveTitle(selectedImage.id)}
                      >
                        Save
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={cancelEditing}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-lg font-medium">
                        {selectedImage.title || "Untitled Image"}
                      </p>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => startEditing(selectedImage)}
                        className="h-8"
                      >
                        <Edit2 className="h-4 w-4 mr-1" />
                        Edit Title
                      </Button>
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-1">Prompt</h3>
                  <p className="bg-muted/10 p-3 rounded-md border border-white/10">{selectedImage.prompt}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-1">Style</h3>
                    <Badge className="bg-primary/20 hover:bg-primary/30 text-white">{selectedImage.style}</Badge>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1">Aspect Ratio</h3>
                    <Badge className="bg-secondary/20 hover:bg-secondary/30 text-white">{selectedImage.aspect_ratio}</Badge>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-1">Created</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedImage.created_at).toLocaleString()}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2 pt-4">
                  <Button 
                    className="flex-1 bg-gradient-secondary hover:bg-gradient-primary transition-all duration-300"
                    onClick={() => handleRegenerate(selectedImage)}
                  >
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Regenerate
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => handleDownload(selectedImage)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => {
                      handleDelete(selectedImage.id);
                      setIsDetailModalOpen(false);
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
