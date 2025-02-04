import { Sidebar } from "@/components/Sidebar";
import { ImageGenerationForm } from "@/components/images/ImageGenerationForm";
import { ImageHistory } from "@/components/images/ImageHistory";
import { Card } from "@/components/ui/card";
import { Wand2 } from "lucide-react";
import { useState } from "react";

export function Images() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleImageGenerated = () => {
    // Increment the refresh trigger to cause ImageHistory to reload
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="animate-fadeIn">
            <h1 className="text-4xl font-bold mb-2 text-foreground font-heading">
              AI Image Generation
            </h1>
            <p className="text-muted-foreground mb-8">
              Create unique images using AI. Describe what you want to see, choose a
              style, and let AI do the magic.
            </p>
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
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center border border-white/10">
                <p className="text-muted-foreground">
                  Generated image will appear here
                </p>
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