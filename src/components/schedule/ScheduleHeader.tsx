import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function ScheduleHeader() {
  return (
    <div className="flex justify-between items-center mb-8 animate-fadeIn">
      <div>
        <h1 className="text-4xl font-bold text-foreground font-heading">Content Schedule</h1>
        <p className="text-muted-foreground mt-2 font-sans">
          Plan and manage your content across platforms
        </p>
      </div>
      <Button 
        className="bg-gradient-primary hover:bg-gradient-secondary transition-all duration-300 
                   hover:shadow-glow hover:scale-105 flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Add Post
      </Button>
    </div>
  );
}