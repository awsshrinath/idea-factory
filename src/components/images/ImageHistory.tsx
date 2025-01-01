import { Card } from "@/components/ui/card";
import { Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ImageHistory() {
  // TODO: Implement image history fetching
  const images = [];

  if (images.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No images generated yet. Try generating your first image!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((image) => (
        <Card key={image.id} className="p-4">
          <img
            src={image.url}
            alt={image.prompt}
            className="w-full h-48 object-cover rounded-md mb-4"
          />
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {image.prompt}
          </p>
          <div className="flex justify-between">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}