import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  LayoutDashboard, 
  FileText, 
  Image, 
  Video, 
  Calendar,
  Sparkles
} from "lucide-react";

export function WorkflowsSection() {
  return (
    <Card className="bg-gradient-to-br from-[#1F1F33] to-[#2C2C4A] border border-white/10 shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Page Workflows
        </CardTitle>
        <CardDescription>Detailed documentation for each page</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] w-full rounded-md border border-white/10 p-4 bg-background/50">
          <div className="space-y-6">
            <div className="group hover:bg-accent/5 p-4 rounded-lg transition-colors">
              <h3 className="font-bold mb-2 text-foreground flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4 text-primary" />
                Dashboard
                <span className="bg-emerald-500/10 text-emerald-500 text-xs px-2 py-1 rounded-full">Updated</span>
              </h3>
              <p className="mb-2 text-muted-foreground">Main features:</p>
              <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
                <li>Performance Metrics: View content analytics and engagement</li>
                <li>Quick Actions: Fast access to key features</li>
                <li>Recent Activity: Track content and changes</li>
              </ul>
            </div>
            <div className="group hover:bg-accent/5 p-4 rounded-lg transition-colors">
              <h3 className="font-bold mb-2 text-foreground flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                Content Page
                <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  New
                </span>
              </h3>
              <p className="mb-2 text-muted-foreground">Planned features:</p>
              <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
                <li>Content creation and editing</li>
                <li>Content templates</li>
                <li>Content analytics</li>
              </ul>
            </div>
            <div className="group hover:bg-accent/5 p-4 rounded-lg transition-colors">
              <h3 className="font-bold mb-2 text-foreground flex items-center gap-2">
                <Image className="w-4 h-4 text-primary" />
                Images Page
              </h3>
              <p className="mb-2 text-muted-foreground">Planned features:</p>
              <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
                <li>Image generation</li>
                <li>Image library management</li>
                <li>Image editing tools</li>
              </ul>
            </div>
            <div className="group hover:bg-accent/5 p-4 rounded-lg transition-colors">
              <h3 className="font-bold mb-2 text-foreground flex items-center gap-2">
                <Video className="w-4 h-4 text-primary" />
                Videos Page
              </h3>
              <p className="mb-2 text-muted-foreground">Planned features:</p>
              <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
                <li>Video creation tools</li>
                <li>Video library management</li>
                <li>Video analytics</li>
              </ul>
            </div>
            <div className="group hover:bg-accent/5 p-4 rounded-lg transition-colors">
              <h3 className="font-bold mb-2 text-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Schedule Page
              </h3>
              <p className="mb-2 text-muted-foreground">Planned features:</p>
              <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
                <li>Content calendar</li>
                <li>Automated scheduling</li>
                <li>Publishing queue</li>
              </ul>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}