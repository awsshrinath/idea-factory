
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmptyRecentVideos } from '../EmptyRecentVideos';
import { RecentVideosGrid } from '../RecentVideosGrid';
import { History, Plus } from 'lucide-react';

export function RecentVideosSection() {
  const hasRecentVideos = false;

  return (
    <Card className="premium-card border border-white/10 shadow-lg backdrop-blur-sm">
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <History className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="premium-heading text-xl">Recent Videos</CardTitle>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Create New
        </Button>
      </CardHeader>
      <CardContent>
        {hasRecentVideos ? (
          <RecentVideosGrid 
            videos={[]}
            onView={() => {}}
            onRegenerate={() => {}}
            onDelete={() => {}}
          />
        ) : (
          <EmptyRecentVideos />
        )}
      </CardContent>
    </Card>
  );
}
