import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Video, 
  LayoutDashboard, 
  Activity,
  FileText,
  Settings2,
  ArrowUp,
  Check,
  MessageSquare,
  Hash,
  Globe,
  History,
  Sparkles,
  Bot
} from "lucide-react";

export function RoadmapSection() {
  return (
    <Card className="bg-gradient-to-br from-[#1F1F33] to-[#2C2C4A] border border-white/10 shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <Settings2 className="w-5 h-5 text-primary" />
          Roadmap
        </CardTitle>
        <CardDescription>Upcoming features and improvements</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] w-full rounded-md border border-white/10 p-4 bg-background/50">
          <div className="space-y-6">
            {/* Content Generation Features */}
            <div className="group hover:bg-accent/5 p-4 rounded-lg transition-all duration-300">
              <div className="flex items-start gap-2">
                <MessageSquare className="w-5 h-5 text-primary mt-1 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-foreground">AI Content Generation</h3>
                    <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <ArrowUp className="w-3 h-3" />
                      Priority
                    </span>
                  </div>
                  <ul className="list-none space-y-3 text-muted-foreground">
                    {[
                      "Integrate ChatGPT and DeepSeek AI models",
                      "Platform-specific content generation (LinkedIn, Twitter, Facebook)",
                      "Multiple tone options (Professional, Friendly, Casual, Creative)",
                      "Multi-language support",
                      "Real-time content preview with platform styling"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-accent mt-1 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Advanced Content Features */}
            <div className="group hover:bg-accent/5 p-4 rounded-lg transition-all duration-300">
              <div className="flex items-start gap-2">
                <Sparkles className="w-5 h-5 text-secondary mt-1 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-foreground">Advanced Content Features</h3>
                  </div>
                  <ul className="list-none space-y-3 text-muted-foreground">
                    {[
                      "Smart hashtag suggestions based on content",
                      "SEO optimization and scoring",
                      "Content refinement suggestions",
                      "Platform-specific content adjustments",
                      "Direct content editing in preview"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-accent mt-1 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* AI Model Integration */}
            <div className="group hover:bg-accent/5 p-4 rounded-lg transition-all duration-300">
              <div className="flex items-start gap-2">
                <Bot className="w-5 h-5 text-accent mt-1 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-foreground">AI Model Integration</h3>
                  </div>
                  <ul className="list-none space-y-3 text-muted-foreground">
                    {[
                      "ChatGPT integration for conversational content",
                      "DeepSeek integration for SEO-focused content",
                      "AI model selection interface",
                      "Custom prompt templates",
                      "Performance analytics for AI models"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-accent mt-1 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Content Management */}
            <div className="group hover:bg-accent/5 p-4 rounded-lg transition-all duration-300">
              <div className="flex items-start gap-2">
                <History className="w-5 h-5 text-primary mt-1 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-foreground">Content Management</h3>
                  </div>
                  <ul className="list-none space-y-3 text-muted-foreground">
                    {[
                      "Version history tracking",
                      "Content organization by platform",
                      "Batch content generation",
                      "Content performance tracking",
                      "Export and sharing options"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-accent mt-1 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Keep existing sections */}
            <div className="group hover:bg-accent/5 p-4 rounded-lg transition-all duration-300">
              <div className="flex items-start gap-2">
                <Video className="w-5 h-5 text-primary mt-1 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-foreground">Video Generation Features</h3>
                    <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <ArrowUp className="w-3 h-3" />
                      Priority
                    </span>
                  </div>
                  <ul className="list-none space-y-3 text-muted-foreground">
                    {[
                      "Integrate Eleven Labs for text-to-speech conversion",
                      "Implement Whisper for automatic caption generation",
                      "Add support for custom video styles and transitions",
                      "Enable direct social media sharing"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-accent mt-1 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="group hover:bg-accent/5 p-4 rounded-lg transition-all duration-300">
              <div className="flex items-start gap-2">
                <LayoutDashboard className="w-5 h-5 text-secondary mt-1 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-foreground">Dashboard Improvements</h3>
                  </div>
                  <ul className="list-none space-y-3 text-muted-foreground">
                    {[
                      "Add legends and toggles for Performance Metrics graphs",
                      "Implement trend indicators with percentage changes",
                      "Enhanced hover animations for Quick Actions"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-accent mt-1 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="group hover:bg-accent/5 p-4 rounded-lg transition-all duration-300">
              <div className="flex items-start gap-2">
                <Activity className="w-5 h-5 text-accent mt-1 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-foreground">Recent Activity Enhancements</h3>
                  </div>
                  <ul className="list-none space-y-3 text-muted-foreground">
                    {[
                      "Categorize activities by type",
                      "Add detailed view for each activity",
                      "Implement activity filtering"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-accent mt-1 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="group hover:bg-accent/5 p-4 rounded-lg transition-all duration-300">
              <div className="flex items-start gap-2">
                <FileText className="w-5 h-5 text-primary mt-1 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-foreground">Content Management</h3>
                  </div>
                  <ul className="list-none space-y-3 text-muted-foreground">
                    {[
                      "Content generation workflow",
                      "Image creation and management",
                      "Video content tools",
                      "Scheduling system"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-accent mt-1 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
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
