import { Sidebar } from "@/components/Sidebar";
import { ImageGenerationForm } from "@/components/images/ImageGenerationForm";
import { ImageHistory } from "@/components/images/ImageHistory";
import { Card } from "@/components/ui/card";

export function Images() {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">AI Image Generation</h1>
          <p className="text-muted-foreground mb-8">
            Create unique images using AI. Describe what you want to see, choose a
            style, and let AI do the magic.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Generate New Image</h2>
              <ImageGenerationForm />
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Preview</h2>
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">
                  Generated image will appear here
                </p>
              </div>
            </Card>
          </div>

          <h2 className="text-2xl font-semibold mb-6">Generated Images</h2>
          <ImageHistory />
        </div>
      </main>
    </div>
  );
}