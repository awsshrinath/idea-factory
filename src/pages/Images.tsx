
import { Sidebar } from "@/components/Sidebar";
import { ImageGenerationForm } from "@/components/images/ImageGenerationForm";
import { ImageHistory } from "@/components/images/ImageHistory";
import { Card } from "@/components/ui/card";
import { Wand2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthStatus } from "@/components/AuthStatus";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export function Images() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

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
    // Increment the refresh trigger to cause ImageHistory to reload
    setRefreshTrigger(prev => prev + 1);
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
          <div className={cn(
            "flex justify-between items-center p-4",
            isMobile && "flex-col items-start gap-4"
          )}>
            <div className="animate-fadeIn">
              <h1 className={cn(
                "font-bold mb-1 text-foreground font-heading",
                isMobile ? "text-2xl" : "text-3xl"
              )}>
                AI Image Generation
              </h1>
              <p className="text-muted-foreground text-sm">
                Create unique images using AI. Describe what you want to see, choose a
                style, and let AI do the magic.
              </p>
            </div>
            <AuthStatus />
          </div>

          <div className={cn(
            "grid gap-4 p-2 sm:p-4",
            isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-12"
          )}>
            {/* Left Column - Main Controls - Takes ~65% of the space */}
            <Card className="p-4 bg-gradient-card border border-white/10 shadow-card hover:shadow-card-hover transition-all duration-300 lg:col-span-8 overflow-hidden">
              <h2 className="text-xl font-semibold mb-4 text-foreground font-heading flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-primary" />
                Create New Image
              </h2>
              <ImageGenerationForm onImageGenerated={handleImageGenerated} />
            </Card>

            {/* Right Column - Image History - Takes ~35% of the space */}
            <div className="space-y-3 lg:col-span-4">
              <h2 className="text-xl font-semibold text-foreground font-heading px-2">Your Images</h2>
              <ImageHistory key={refreshTrigger} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
