
import { Sidebar } from "@/components/Sidebar";
import { ImageGenerationForm } from "@/components/images/ImageGenerationForm";
import { ImageHistory } from "@/components/images/ImageHistory";
import { Card } from "@/components/ui/card";
import { Wand2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthStatus } from "@/components/AuthStatus";

export function Images() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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

  const handleImageGenerated = (imageUrl: string) => {
    setPreviewImage(imageUrl);
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
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="animate-fadeIn">
              <h1 className="text-4xl font-bold mb-2 text-foreground font-heading">
                AI Image Generation
              </h1>
              <p className="text-muted-foreground">
                Create unique images using AI. Describe what you want to see, choose a
                style, and let AI do the magic.
              </p>
            </div>
            <AuthStatus />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <Card className="p-6 bg-gradient-card border border-white/10 shadow-card hover:shadow-card-hover transition-all duration-300">
              <h2 className="text-2xl font-semibold mb-6 text-foreground font-heading flex items-center gap-2">
                <Wand2 className="h-6 w-6 text-primary" />
                Generate New Image
              </h2>
              <ImageGenerationForm onImageGenerated={handleImageGenerated} />
            </Card>

            <Card className="p-6 bg-gradient-card border border-white/10 shadow-card hover:shadow-card-hover transition-all duration-300">
              <h2 className="text-2xl font-semibold mb-6 text-foreground font-heading">Preview</h2>
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center border border-white/10 overflow-hidden">
                {previewImage ? (
                  <img 
                    src={previewImage} 
                    alt="Generated preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <p className="text-muted-foreground">
                    Generated image will appear here
                  </p>
                )}
              </div>
            </Card>
          </div>

          <div className="animate-fadeIn">
            <h2 className="text-2xl font-semibold mb-6 text-foreground font-heading">Generated Images</h2>
            <ImageHistory key={refreshTrigger} />
          </div>
        </div>
      </main>
    </div>
  );
}
