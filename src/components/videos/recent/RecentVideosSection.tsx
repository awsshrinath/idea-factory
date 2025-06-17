
import { Button } from "@/components/ui/button";
import { RecentVideosGrid } from "../RecentVideosGrid";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function RecentVideosSection() {
  const hasRecentVideos = false;

  return (
    <Card className="border border-white/10 bg-card/70 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-foreground">Your Recent Videos</CardTitle>
            <CardDescription>Previously created content</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="border-white/10 bg-background hover:bg-background/80 hover:scale-105 transition-transform">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <RecentVideosGrid
          videos={[]}
          onView={() => {}}
          onRegenerate={() => {}}
          onDelete={() => {}}
        />
      </CardContent>
    </Card>
  );
}
