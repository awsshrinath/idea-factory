import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export function RoadmapSection() {
  return (
    <Card className="bg-gradient-to-br from-[#1F1F33] to-[#2C2C4A] border border-white/10 shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader>
        <CardTitle className="text-foreground">Roadmap</CardTitle>
        <CardDescription>Upcoming features and improvements</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] w-full rounded-md border border-white/10 p-4 bg-background/50">
          <div className="space-y-6">
            <div>
              <h3 className="font-bold mb-2 text-foreground">Video Generation Features</h3>
              <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
                <li>Integrate Eleven Labs for text-to-speech conversion</li>
                <li>Implement Whisper for automatic caption generation</li>
                <li>Add support for custom video styles and transitions</li>
                <li>Enable direct social media sharing</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-2 text-foreground">Dashboard Improvements</h3>
              <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
                <li>Add legends and toggles for Performance Metrics graphs</li>
                <li>Implement trend indicators with percentage changes</li>
                <li>Enhanced hover animations for Quick Actions</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-2 text-foreground">Recent Activity Enhancements</h3>
              <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
                <li>Categorize activities by type</li>
                <li>Add detailed view for each activity</li>
                <li>Implement activity filtering</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-2 text-foreground">Content Management</h3>
              <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
                <li>Content generation workflow</li>
                <li>Image creation and management</li>
                <li>Video content tools</li>
                <li>Scheduling system</li>
              </ul>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
