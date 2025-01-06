import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export function ChangelogSection() {
  return (
    <Card className="bg-gradient-to-br from-[#1F1F33] to-[#2C2C4A] border border-white/10 shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader>
        <CardTitle className="text-foreground">Changelog</CardTitle>
        <CardDescription>Track all updates and changes to the application</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] w-full rounded-md border border-white/10 p-4 bg-background/50">
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-foreground">Version 1.1.0 (Current)</h3>
              <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
                <li>Added Videos page with AI-powered video generation capabilities</li>
                <li>Implemented workflow selection for direct and fine-tuned video creation</li>
                <li>Added script generation and management interface</li>
                <li>Integrated audio and caption generation UI components</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-foreground">Version 1.0.0</h3>
              <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
                <li>Initial dashboard implementation with performance metrics</li>
                <li>Added Quick Actions with improved visual design and 2x2 grid layout</li>
                <li>Implemented Recent Activity section with action buttons</li>
                <li>Created basic page structure and navigation</li>
              </ul>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}