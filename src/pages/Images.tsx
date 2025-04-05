
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
        "flex-1 p-4 md:p-6 lg:p-8",
        isMobile ? "ml-0 pt-16" : "ml-64", // Add top padding on mobile for the menu button
        "w-full max-w-full"
      )}>
        <div className="max-w-6xl mx-auto">
          <div className={cn(
            "flex justify-between items-center mb-8",
            isMobile && "flex-col items-start gap-4"
          )}>
            <div className="animate-fadeIn">
              <h1 className={cn(
                "font-bold mb-2 text-foreground font-heading",
                isMobile ? "text-2xl" : "text-4xl"
              )}>
                AI Image Generation
              </h1>
              <p className="text-muted-foreground">
                Create unique images using AI. Describe what you want to see, choose a
                style, and let AI do the magic.
              </p>
            </div>
            <AuthStatus />
          </div>

          <div className={cn(
            "grid gap-6",
            isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"
          )}>
            {/* Left Column - Main Controls */}
            <Card className="p-6 bg-gradient-card border border-white/10 shadow-card hover:shadow-card-hover transition-all duration-300">
              <h2 className="text-2xl font-semibold mb-6 text-foreground font-heading flex items-center gap-2">
                <Wand2 className="h-6 w-6 text-primary" />
                Create New Image
              </h2>
              <ImageGenerationForm onImageGenerated={handleImageGenerated} />
            </Card>

            {/* Right Column - Image History */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-foreground font-heading">Your Images</h2>
              <ImageHistory key={refreshTrigger} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
