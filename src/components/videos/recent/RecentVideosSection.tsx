
import { Button } from "@/components/ui/button";
import { RecentVideosGrid } from "../RecentVideosGrid";

export function RecentVideosSection() {
  const hasRecentVideos = false;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Your Recent Videos</h2>
        <Button variant="outline" size="sm" className="border-white/10 bg-background hover:bg-background/80">
          View All
        </Button>
      </div>
      <RecentVideosGrid
        videos={[]}
        onView={() => {}}
        onRegenerate={() => {}}
        onDelete={() => {}}
      />
    </div>
  );
}
