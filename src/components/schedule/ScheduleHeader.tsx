import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function ScheduleHeader() {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-4xl font-bold">Content Schedule</h1>
        <p className="text-muted-foreground mt-2">
          Plan and manage your content across platforms
        </p>
      </div>
      <Button className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Add Post
      </Button>
    </div>
  );
}