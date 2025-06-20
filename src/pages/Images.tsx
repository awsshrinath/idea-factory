
import { Sidebar } from "@/components/Sidebar";
import { ImageGenerationForm } from "@/components/images/ImageGenerationForm";
import { ImageGallery } from "@/components/images/ImageGallery";
import { StyleTemplates } from "@/components/images/StyleTemplates";
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
    
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
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
        <p className="premium-body">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-background overflow-x-hidden w-full relative">
      <Sidebar />
      <main className={cn(
        "flex-1 p-0 relative z-10",
        isMobile ? "ml-0 pt-16" : "ml-64",
        "w-full max-w-full"
      )}>
        <div className="w-full px-6 md:px-8 lg:px-10">
          {isMobile ? (
            // Mobile View - Enhanced
            <>
              <div className="flex justify-between items-center p-6 mb-6">
                <div className="animate-fadeIn space-y-2">
                  <h1 className="enterprise-heading text-3xl">
                    AI Image Generation
                  </h1>
                  <p className="premium-body">Create stunning visuals with AI</p>
                </div>
                <AuthStatus />
              </div>
              
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "create" | "gallery")}>
                <TabsList className="grid grid-cols-2 mb-6 premium-card border border-white/10 bg-gradient-to-r from-slate-900/80 to-slate-800/60">
                  <TabsTrigger value="create" className="premium-subheading data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/20 data-[state=active]:to-indigo-600/20 data-[state=active]:border data-[state=active]:border-purple-500/30">
                    <Wand2 className="h-4 w-4 mr-2" />
                    Create
                  </TabsTrigger>
                  <TabsTrigger value="gallery" className="premium-subheading data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/20 data-[state=active]:to-indigo-600/20 data-[state=active]:border data-[state=active]:border-purple-500/30">
                    <BookImage className="h-4 w-4 mr-2" />
                    Gallery
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="create" className="animate-fadeIn space-y-6">
                  <StyleTemplates />
                  <div className="premium-card premium-card-hover rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                    <h2 className="premium-heading text-xl mb-6 flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600/20 to-indigo-600/20 flex items-center justify-center border border-purple-500/20">
                        <Wand2 className="h-4 w-4 text-purple-400" />
                      </div>
                      Create New Image
                    </h2>
                    <ImageGenerationForm />
                  </div>
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
                    key={`${galleryView}-${galleryFilter}`} 
                    viewMode={galleryView}
                    filter={galleryFilter}
                  />
                </TabsContent>
              </Tabs>
            </>
          ) : (
            // Desktop View - Enhanced
            <>
              <div className="flex justify-between items-center p-6 mb-8">
                <div className="animate-fadeIn space-y-3">
                  <h1 className="enterprise-heading text-4xl">
                    AI Image Generation
                  </h1>
                  <p className="premium-body text-lg max-w-2xl">
                    Create unique images using AI. Describe what you want to see, choose a
                    style, and let AI do the magic.
                  </p>
                </div>
                <AuthStatus />
              </div>
              
              {/* Enhanced Visual Templates Section */}
              <section className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="premium-heading text-2xl">Style Templates</h2>
                  <Sparkles className="h-5 w-5 text-purple-400 animate-pulse" />
                </div>
                <StyleTemplates />
              </section>
              
              <div className="grid gap-8 grid-cols-1 lg:grid-cols-12 mb-12">
                {/* Left Column - Enhanced */}
                <div className="premium-card premium-card-hover rounded-2xl p-8 backdrop-blur-sm border border-white/10 lg:col-span-8">
                  <h2 className="premium-heading text-xl mb-6 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600/20 to-indigo-600/20 flex items-center justify-center border border-purple-500/20">
                      <Wand2 className="h-4 w-4 text-purple-400" />
                    </div>
                    Create New Image
                  </h2>
                  <ImageGenerationForm />
                </div>

                {/* Right Column - Enhanced */}
                <div className="space-y-6 lg:col-span-4">
                  <div className="premium-card premium-card-hover rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                    <h2 className="premium-heading text-lg mb-4 flex items-center gap-2">
                      <div className="h-6 w-6 rounded-md bg-gradient-to-br from-emerald-600/20 to-green-600/20 flex items-center justify-center border border-emerald-500/20">
                        <Sparkles className="h-3 w-3 text-emerald-400" />
                      </div>
                      Your Latest Creation
                    </h2>
                    <ScrollArea className="h-[600px]">
                      <ImageGallery key="preview" previewMode={true} />
                    </ScrollArea>
                  </div>
                </div>
              </div>
              
              {/* Enhanced Full Gallery Section */}
              <section className="pb-12">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <h2 className="premium-heading text-3xl">Your Image Gallery</h2>
                    <BookImage className="h-6 w-6 text-purple-400 animate-pulse" />
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="premium-button bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                        >
                          <Filter className="h-4 w-4 mr-2" />
                          {galleryFilter === "all" ? "All Images" : 
                           galleryFilter === "favorites" ? "Favorites" : "Recent"}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="premium-card border border-white/10 bg-slate-900/95 backdrop-blur-xl">
                        <DropdownMenuItem onClick={() => setGalleryFilter("all")} className="premium-caption hover:bg-white/10">
                          <ImageIcon className="h-4 w-4 mr-2" />
                          All Images
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setGalleryFilter("favorites")} className="premium-caption hover:bg-white/10">
                          <Heart className="h-4 w-4 mr-2" />
                          Favorites
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setGalleryFilter("recent")} className="premium-caption hover:bg-white/10">
                          <Clock className="h-4 w-4 mr-2" />
                          Recent
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    <div className="flex items-center gap-1 border border-white/10 rounded-lg bg-muted/10 premium-card">
                      <Button
                        variant={galleryView === "grid" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setGalleryView("grid")}
                        className="premium-caption"
                      >
                        <Grid className="h-4 w-4" />
                      </Button>
                      <Separator orientation="vertical" className="h-6 bg-white/10" />
                      <Button 
                        variant={galleryView === "carousel" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setGalleryView("carousel")}
                        className="premium-caption"
                      >
                        <Rows className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <ImageGallery 
                  key={`full-${galleryView}-${galleryFilter}`} 
                  viewMode={galleryView}
                  filter={galleryFilter}
                />
              </section>
            </>
          )}
          
          {/* Enhanced Future Feature Placeholder */}
          <div className="pb-12">
            <div className="premium-card premium-card-hover rounded-2xl p-8 backdrop-blur-sm border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <div className="space-y-2">
                  <h3 className="premium-heading text-xl">Coming Soon: Personal Style Training</h3>
                  <p className="premium-body">Train AI models on your unique creative style</p>
                </div>
                <Button 
                  variant={notifyMeEnabled ? "secondary" : "outline"}
                  className="premium-button transition-all duration-300 hover:scale-[1.02]"
                  onClick={toggleNotifyMe}
                >
                  <Bell className={`h-4 w-4 mr-2 ${notifyMeEnabled ? "text-secondary-foreground" : ""}`} />
                  {notifyMeEnabled ? "Notifications On" : "Notify Me"}
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-6">
                {[
                  {name: "Fashion", desc: "Train AI on your fashion preferences"}, 
                  {name: "Architecture", desc: "Create buildings in your unique style"}, 
                  {name: "Cinematic VFX", desc: "Generate movie-quality visuals"}
                ].map((style) => (
                  <div 
                    key={style.name} 
                    className="relative overflow-hidden rounded-xl aspect-square premium-card border border-white/10 flex items-center justify-center backdrop-blur-sm hover:shadow-[0_0_30px_rgba(147,51,234,0.15)] transition-all duration-500 group"
                  >
                    <div className="absolute inset-0 backdrop-blur-md flex items-center justify-center">
                      <Badge className="badge-premium mb-8">Coming Soon</Badge>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                      <p className="premium-subheading text-sm mb-1">{style.name}</p>
                      <p className="premium-caption text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">{style.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {notifyMeEnabled && (
                <div className="mt-6 premium-card rounded-xl p-4 bg-gradient-to-r from-emerald-500/10 to-green-500/5 border border-emerald-500/20">
                  <p className="premium-body text-sm flex items-center text-emerald-300">
                    <Sparkles className="h-4 w-4 mr-2" />
                    You'll be the first to know when Personal Style Training launches!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
