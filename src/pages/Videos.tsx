import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Video, 
  ImagePlus, 
  Wand2, 
  Mic, 
  Subtitles, 
  Download,
  HelpCircle
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Videos() {
  const [workflowType, setWorkflowType] = useState<"direct" | "fine-tuned" | null>(null);
  const [videoIdea, setVideoIdea] = useState("");

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2">
              <h1 className="text-4xl font-bold">Create Stunning AI-Generated Videos</h1>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-6 w-6 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Example prompt: "A motivational video about teamwork"</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-xl text-muted-foreground mt-2">
              Transform your ideas into engaging videos with AI
            </p>
          </div>

          {/* Workflow Selection */}
          {!workflowType && (
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => setWorkflowType("direct")}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Direct Video Generation
                  </CardTitle>
                  <CardDescription>
                    Generate a video directly from your script
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Start Direct Video</Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => setWorkflowType("fine-tuned")}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImagePlus className="h-5 w-5" />
                    Fine-Tuned Video Generation
                  </CardTitle>
                  <CardDescription>
                    Generate images first, then stitch them into a video for precise visuals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Start Fine-Tuned Video</Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Video Creation Workflow */}
          {workflowType && (
            <Card>
              <CardHeader>
                <Button 
                  variant="ghost" 
                  className="w-fit mb-4"
                  onClick={() => setWorkflowType(null)}
                >
                  ← Back to workflow selection
                </Button>
                <CardTitle>
                  {workflowType === "direct" ? "Direct Video Generation" : "Fine-Tuned Video Generation"}
                </CardTitle>
                <CardDescription>
                  {workflowType === "direct" 
                    ? "Create your video directly from a script" 
                    : "Create precise visuals before generating your video"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="script" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="script">Script</TabsTrigger>
                    <TabsTrigger value="generation">Generation</TabsTrigger>
                    <TabsTrigger value="audio">Audio</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                  </TabsList>

                  <TabsContent value="script">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Your Video Idea</label>
                        <Textarea
                          placeholder="Write about teamwork and collaboration in the workplace..."
                          value={videoIdea}
                          onChange={(e) => setVideoIdea(e.target.value)}
                          className="mt-1.5"
                          rows={4}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button className="flex items-center gap-2">
                          <Wand2 className="h-4 w-4" />
                          Generate Script
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="generation">
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Generation options will appear here based on your script...
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="audio">
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <Button className="flex items-center gap-2">
                          <Mic className="h-4 w-4" />
                          Generate Voice
                        </Button>
                        <Button className="flex items-center gap-2">
                          <Subtitles className="h-4 w-4" />
                          Generate Captions
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="preview">
                    <div className="space-y-4">
                      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                        <p className="text-muted-foreground">Video preview will appear here...</p>
                      </div>
                      <Button className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Export Video
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}