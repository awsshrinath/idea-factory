import { Card } from "@/components/ui/card";
import { Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ImageHistory() {
  // TODO: Implement image history fetching
  const images = [];

  if (images.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8 bg-gradient-card border border-white/10 rounded-lg shadow-card">
        No images generated yet. Try generating your first image!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((image) => (
        <Card key={image.id} className="p-4 bg-gradient-card border border-white/10 shadow-card hover:shadow-card-hover transition-all duration-300">
          <img
            src={image.url}
            alt={image.prompt}
            className="w-full h-48 object-cover rounded-md mb-4 border border-white/10"
          />
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {image.prompt}
          </p>
          <div className="flex justify-between gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1 bg-gradient-secondary hover:bg-gradient-primary transition-all duration-300"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1 hover:bg-gradient-primary transition-all duration-300"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}