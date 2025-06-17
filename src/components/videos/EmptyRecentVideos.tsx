
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function EmptyRecentVideos() {
  return (
    <Card className="border-dashed border-white/10 bg-background/50 hover:bg-background/80 transition-all p-8">
      <CardContent className="flex flex-col items-center justify-center py-10 text-center space-y-6">
        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-4 animate-float group hover:scale-110 transition-transform duration-300">
          <Sparkles className="h-10 w-10 text-primary group-hover:text-white transition-colors" />
        </div>
        <div className="space-y-2 max-w-sm">
          <h3 className="text-xl font-semibold text-foreground">Ready to create magic? ✨</h3>
          <p className="text-muted-foreground">
            Your video journey starts here. Let's create something amazing together!
          </p>
        </div>
        <Button 
          size="lg"
          className="bg-gradient-to-r from-primary/80 to-primary hover:from-primary hover:to-primary/80 
                     transition-all duration-300 group hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
        >
          Create My First Video
          <Sparkles className="ml-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
}
