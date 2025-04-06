
import { Sidebar } from "@/components/Sidebar";
import { ImageGenerationForm } from "@/components/images/ImageGenerationForm";
import { ImageGallery } from "@/components/images/ImageGallery";
import { StyleTemplates } from "@/components/images/StyleTemplates";
import { Card } from "@/components/ui/card";
import { Wand2, Sparkles, BookImage, Grid, LayoutGrid, Rows, Heart, Clock, Filter, Image as ImageIcon, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthStatus } from "@/components/AuthStatus";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

export function Images() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"create" | "gallery">("create");
  const [galleryView, setGalleryView] = useState<"grid" | "carousel">("grid");
  const [galleryFilter, setGalleryFilter] = useState<"all" | "favorites" | "recent">("all");
  const [notifyMeEnabled, setNotifyMeEnabled] = useState<boolean>(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      const authenticated = !!data.session;
      setIsAuthenticated(authenticated);
      setIsLoading(false);
      
      if (!authenticated) {
        navigate('/auth');
      }
    };
    
    checkAuth();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      const authenticated = !!session;
      setIsAuthenticated(authenticated);
      
      if (!authenticated) {
        navigate('/auth');
      }
    });
    
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [navigate]);

  const handleImageGenerated = () => {
    // Increment the refresh trigger to cause ImageGallery to reload
    setRefreshTrigger(prev => prev + 1);
    // On mobile, switch to gallery tab after generating
    if (isMobile) {
      setActiveTab("gallery");
    }
  };
  
  const toggleNotifyMe = () => {
    setNotifyMeEnabled(prev => !prev);
    toast({
      title: notifyMeEnabled ? "Notifications disabled" : "Notifications enabled",
      description: notifyMeEnabled 
        ? "You won't be notified about new features." 
        : "You'll be the first to know when Personal Style Training launches!",
      variant: "default"
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will be redirected by the useEffect
  }

  return (
    <div className="min-h-screen flex bg-background overflow-x-hidden w-full">
      <Sidebar />
      <main className={cn(
        "flex-1 p-0",
        isMobile ? "ml-0 pt-16" : "ml-64",
        "w-full max-w-full"
      )}>
        <div className="w-full px-2 sm:px-4">
          {isMobile ? (
            // Mobile View - Tabbed Interface
            <>
              <div className="flex justify-between items-center p-4">
                <div className="animate-fadeIn">
                  <h1 className="text-2xl font-bold mb-1 text-foreground font-heading">
                    AI Image Generation
                  </h1>
                </div>
                <AuthStatus />
              </div>
              
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "create" | "gallery")}>
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="create" className="flex items-center">
                    <Wand2 className="h-4 w-4 mr-2" />
                    Create
                  </TabsTrigger>
                  <TabsTrigger value="gallery" className="flex items-center">
                    <BookImage className="h-4 w-4 mr-2" />
                    Gallery
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="create" className="animate-fadeIn">
                  <StyleTemplates />
                  <Card className="p-4 mt-4 bg-gradient-card border border-white/10 shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden">
                    <h2 className="text-xl font-semibold mb-4 text-foreground font-heading flex items-center gap-2">
                      <Wand2 className="h-5 w-5 text-primary" />
                      Create New Image
                    </h2>
                    <ImageGenerationForm onImageGenerated={handleImageGenerated} />
                  </Card>
                </TabsContent>
                
                <TabsContent value="gallery" className="animate-fadeIn">
                  <div className="flex items-center justify-between mb-4 px-1">
                    <div className="flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-xs h-8"
                          >
                            <Filter className="h-3.5 w-3.5 mr-2" />
                            {galleryFilter === "all" ? "All Images" : 
                             galleryFilter === "favorites" ? "Favorites" : "Recent"}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuItem onClick={() => setGalleryFilter("all")}>
                            <ImageIcon className="h-3.5 w-3.5 mr-2" />
                            All Images
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setGalleryFilter("favorites")}>
                            <Heart className="h-3.5 w-3.5 mr-2" />
                            Favorites
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setGalleryFilter("recent")}>
                            <Clock className="h-3.5 w-3.5 mr-2" />
                            Recent
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <div className="flex items-center gap-1 border border-white/10 rounded-md bg-muted/10">
                      <Button
                        variant={galleryView === "grid" ? "secondary" : "ghost"}
                        size="sm"
                        className="h-8 rounded-none rounded-l-md"
                        onClick={() => setGalleryView("grid")}
                      >
                        <LayoutGrid className="h-3.5 w-3.5" />
                        <span className="sr-only">Grid View</span>
                      </Button>
                      <Separator orientation="vertical" className="h-5 bg-white/10" />
                      <Button 
                        variant={galleryView === "carousel" ? "secondary" : "ghost"}
                        size="sm"
                        className="h-8 rounded-none rounded-r-md"
                        onClick={() => setGalleryView("carousel")}
                      >
                        <Rows className="h-3.5 w-3.5" />
                        <span className="sr-only">Carousel View</span>
                      </Button>
                    </div>
                  </div>
                  
                  <ImageGallery 
                    key={`${galleryView}-${galleryFilter}-${refreshTrigger}`} 
                    viewMode={galleryView}
                    filter={galleryFilter}
                  />
                </TabsContent>
              </Tabs>
            </>
          ) : (
            // Desktop View - Side by Side Interface
            <>
              <div className="flex justify-between items-center p-4">
                <div className="animate-fadeIn">
                  <h1 className="text-3xl font-bold mb-1 text-foreground font-heading">
                    AI Image Generation
                  </h1>
                  <p className="text-muted-foreground text-sm">
                    Create unique images using AI. Describe what you want to see, choose a
                    style, and let AI do the magic.
                  </p>
                </div>
                <AuthStatus />
              </div>
              
              {/* Visual Templates Section */}
              <StyleTemplates />
              
              <div className="grid gap-4 p-2 sm:p-4 grid-cols-1 lg:grid-cols-12">
                {/* Left Column - Main Controls - Takes ~65% of the space */}
                <Card className="p-4 bg-gradient-card border border-white/10 shadow-card hover:shadow-card-hover transition-all duration-300 lg:col-span-8 overflow-hidden">
                  <h2 className="text-xl font-semibold mb-4 text-foreground font-heading flex items-center gap-2">
                    <Wand2 className="h-5 w-5 text-primary" />
                    Create New Image
                  </h2>
                  <ImageGenerationForm onImageGenerated={handleImageGenerated} />
                </Card>

                {/* Right Column - Image Preview - Takes ~35% of the space */}
                <div className="space-y-3 lg:col-span-4">
                  <h2 className="text-xl font-semibold text-foreground font-heading px-2 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Your Latest Creation
                  </h2>
                  <ScrollArea className="h-[600px]">
                    <ImageGallery key={`preview-${refreshTrigger}`} previewMode={true} />
                  </ScrollArea>
                </div>
              </div>
              
              {/* Full Gallery Section */}
              <div className="mt-8 px-2 sm:px-4 pb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-foreground font-heading flex items-center gap-2">
                    <BookImage className="h-5 w-5 text-primary" />
                    Your Image Gallery
                  </h2>
                  
                  <div className="flex items-center gap-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-sm"
                        >
                          <Filter className="h-4 w-4 mr-2" />
                          {galleryFilter === "all" ? "All Images" : 
                           galleryFilter === "favorites" ? "Favorites" : "Recent"}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setGalleryFilter("all")}>
                          <ImageIcon className="h-4 w-4 mr-2" />
                          All Images
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setGalleryFilter("favorites")}>
                          <Heart className="h-4 w-4 mr-2" />
                          Favorites
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setGalleryFilter("recent")}>
                          <Clock className="h-4 w-4 mr-2" />
                          Recent
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    <div className="flex items-center gap-1 border border-white/10 rounded-md bg-muted/10">
                      <Button
                        variant={galleryView === "grid" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setGalleryView("grid")}
                      >
                        <Grid className="h-4 w-4" />
                        <span className="sr-only">Grid View</span>
                      </Button>
                      <Separator orientation="vertical" className="h-6 bg-white/10" />
                      <Button 
                        variant={galleryView === "carousel" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setGalleryView("carousel")}
                      >
                        <Rows className="h-4 w-4" />
                        <span className="sr-only">Carousel View</span>
                      </Button>
                    </div>
                  </div>
                </div>
                <ImageGallery 
                  key={`full-${galleryView}-${galleryFilter}-${refreshTrigger}`} 
                  fullGallery={true}
                  viewMode={galleryView}
                  filter={galleryFilter}
                />
              </div>
            </>
          )}
          
          {/* Future Feature Placeholder with added notification CTA */}
          <div className="mt-8 px-4 pb-8 opacity-90">
            <Card className="p-4 bg-gradient-to-br from-background to-muted/30 border border-white/5 backdrop-blur-sm overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-foreground/90">Coming Soon: Personal Style Training</h3>
                <Button 
                  variant={notifyMeEnabled ? "secondary" : "outline"}
                  size="sm"
                  className="transition-all duration-300 hover:scale-[1.02]"
                  onClick={toggleNotifyMe}
                >
                  <Bell className={`h-4 w-4 mr-2 ${notifyMeEnabled ? "text-secondary-foreground" : ""}`} />
                  {notifyMeEnabled ? "Notifications On" : "Notify Me"}
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  {name: "Fashion", desc: "Train AI on your fashion preferences"}, 
                  {name: "Architecture", desc: "Create buildings in your unique style"}, 
                  {name: "Cinematic VFX", desc: "Generate movie-quality visuals"}
                ].map((style) => (
                  <div 
                    key={style.name} 
                    className="relative overflow-hidden rounded-lg aspect-square bg-muted/20 flex items-center justify-center border border-white/10 backdrop-blur-sm hover:shadow-[0_0_15px_rgba(66,230,149,0.15)] transition-all duration-300 group"
                  >
                    <div className="absolute inset-0 backdrop-blur-md flex items-center justify-center">
                      <div className="bg-background/60 px-3 py-1 rounded-full text-xs font-medium mb-8">Coming Soon</div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent flex flex-col items-center">
                      <p className="text-sm font-medium">{style.name}</p>
                      <p className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">{style.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {notifyMeEnabled && (
                <div className="mt-3 bg-accent/10 rounded-md p-2 text-xs text-accent-foreground flex items-center justify-center">
                  <Sparkles className="h-3 w-3 mr-2" />
                  You'll be the first to know when Personal Style Training launches!
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
