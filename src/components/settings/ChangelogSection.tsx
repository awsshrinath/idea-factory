import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Clock, 
  Sparkles,
  CheckCircle2,
  ArrowUpCircle
} from "lucide-react";

export function ChangelogSection() {
  return (
    <Card className="bg-gradient-to-br from-[#1F1F33] to-[#2C2C4A] border border-white/10 shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Changelog
        </CardTitle>
        <CardDescription>Track all updates and changes to the application</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] w-full rounded-md border border-white/10 p-4 bg-background/50">
          <div className="space-y-8">
            <div className="group hover:bg-accent/5 p-4 rounded-lg transition-colors">
              <div className="flex items-start gap-2">
                <Sparkles className="w-5 h-5 text-primary mt-1 shrink-0" />
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-foreground">Version 1.1.0</h3>
                    <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">Current</span>
                  </div>
                  <ul className="list-none space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-accent mt-1 shrink-0" />
                      <span>Added Videos page with AI-powered video generation capabilities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-accent mt-1 shrink-0" />
                      <span>Implemented workflow selection for direct and fine-tuned video creation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-accent mt-1 shrink-0" />
                      <span>Added script generation and management interface</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-accent mt-1 shrink-0" />
                      <span>Integrated audio and caption generation UI components</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="group hover:bg-accent/5 p-4 rounded-lg transition-colors opacity-80">
              <div className="flex items-start gap-2">
                <ArrowUpCircle className="w-5 h-5 text-secondary mt-1 shrink-0" />
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-foreground">Version 1.0.0</h3>
                    <span className="bg-secondary/10 text-secondary text-xs px-2 py-1 rounded-full">Stable</span>
                  </div>
                  <ul className="list-none space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-accent mt-1 shrink-0" />
                      <span>Initial dashboard implementation with performance metrics</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-accent mt-1 shrink-0" />
                      <span>Added Quick Actions with improved visual design and 2x2 grid layout</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-accent mt-1 shrink-0" />
                      <span>Implemented Recent Activity section with action buttons</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-accent mt-1 shrink-0" />
                      <span>Created basic page structure and navigation</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}