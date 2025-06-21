import { Card } from "@/components/ui/card";
import { ImageIcon, Plus } from "lucide-react";

interface PlaceholderCardsProps {
  count: number;
}

export function PlaceholderCards({ count }: PlaceholderCardsProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={`placeholder-${index}`} className="p-3 bg-muted/10 border border-white/10 transition-all duration-300 group">
          <div className="aspect-square w-full overflow-hidden rounded-md relative bg-muted/30 flex items-center justify-center">
            <ImageIcon className="h-6 w-6 text-muted-foreground/50" />
            <div className="absolute top-2 right-2 bg-black/20 text-white rounded-full p-1">
              <Plus className="h-4 w-4" />
            </div>
          </div>
        </Card>
      ))}
    </>
  );
}
