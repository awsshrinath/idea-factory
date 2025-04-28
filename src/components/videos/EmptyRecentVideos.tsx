
import { Card, CardContent } from "@/components/ui/card";
import { Rocket } from "lucide-react";

export function EmptyRecentVideos() {
  return (
    <Card className="border-dashed border-white/10 bg-background/50 hover:bg-background/80 transition-all">
      <CardContent className="flex flex-col items-center justify-center py-10 text-center">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 animate-float">
          <Rocket className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">No content yet! 🚀</h3>
        <p className="text-sm text-muted-foreground">
          Create your first video and launch your journey!
        </p>
      </CardContent>
    </Card>
  );
}
