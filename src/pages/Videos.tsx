import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { VideoSuggestions } from "@/components/videos/VideoSuggestions";
import { WorkflowSteps } from "@/components/videos/WorkflowSteps";
import { WorkflowSelection } from "@/components/videos/WorkflowSelection";
import { TipsSection } from "@/components/videos/TipsSection";
import { VideoExampleCarousel } from "@/components/videos/VideoExampleCarousel";
import { RecentVideos } from "@/components/videos/RecentVideos";
import { 
  Wand2, 
  Mic, 
  Subtitles, 
  Download,
  HelpCircle,
  ArrowLeft
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

type WorkflowStep = "script" | "visuals" | "audio" | "preview";
type WorkflowType = "direct" | "fine-tuned" | null;

export function Videos() {
  const [workflowType, setWorkflowType] = useState<WorkflowType>(null);
  const [currentStep, setCurrentStep] = useState<WorkflowStep>("script");
  const [videoIdea, setVideoIdea] = useState("");

  const workflowSteps: { [key in WorkflowStep]: string } = {
    script: "Script Generation",
    visuals: "Visual Selection",
    audio: "Audio Integration",
    preview: "Preview & Export"
  };

  const handleBack = () => {
    setWorkflowType(null);
    setCurrentStep("script");
    setVideoIdea("");
  };

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header Section */}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-4xl font-heading font-bold text-foreground">Create Stunning AI-Generated Videos</h1>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-6 w-6 text-muted-foreground hover:text-secondary transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Example: "A motivational video about teamwork"</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-xl text-muted-foreground mt-2 font-sans">
              Transform your ideas into engaging videos with AI
            </p>
          </div>

          {/* Example Videos Carousel */}
          <VideoExampleCarousel />

          {/* Main Content */}
          <div className="grid md:grid-cols-[1fr,300px] gap-6">
            <div className="space-y-6">
              {!workflowType ? (
                <WorkflowSelection onSelect={setWorkflowType} />
              ) : (
                <>
                  <WorkflowSteps currentStep={currentStep} steps={workflowSteps} />
                  <Card className="bg-card border-accent/20">
                    <CardHeader>
                      <Button 
                        variant="ghost" 
                        className="w-fit mb-4 flex items-center gap-2 text-foreground hover:text-primary transition-colors"
                        onClick={handleBack}
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Back to workflow selection
                      </Button>
                      <CardTitle className="text-foreground font-heading">
                        {workflowType === "direct" ? "Direct Video Generation" : "Fine-Tuned Video Generation"}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground font-sans">
                        {workflowType === "direct" 
                          ? "Create your video directly from a script" 
                          : "Create precise visuals before generating your video"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="script" className="w-full">
                        <TabsList className="grid w-full grid-cols-4 bg-background border border-accent/20">
                          <TabsTrigger value="script" className="data-[state=active]:bg-primary">Script</TabsTrigger>
                          <TabsTrigger value="generation" className="data-[state=active]:bg-primary">Generation</TabsTrigger>
                          <TabsTrigger value="audio" className="data-[state=active]:bg-primary">Audio</TabsTrigger>
                          <TabsTrigger value="preview" className="data-[state=active]:bg-primary">Preview</TabsTrigger>
                        </TabsList>

                        <TabsContent value="script">
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium text-foreground font-sans">Your Video Idea</label>
                              <Textarea
                                placeholder="Write about teamwork and collaboration in the workplace..."
                                value={videoIdea}
                                onChange={(e) => setVideoIdea(e.target.value)}
                                className="mt-1.5 bg-background text-foreground border-accent/20 focus:border-primary transition-colors"
                                rows={4}
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button className="bg-primary text-foreground hover:bg-primary/90 transition-colors">
                                <Wand2 className="h-4 w-4 mr-2" />
                                Generate Script
                              </Button>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="generation">
                          <div className="space-y-4">
                            {workflowType === "direct" ? (
                              <div className="text-center py-8">
                                <p className="text-muted-foreground">
                                  Visual generation options will appear here after script creation...
                                </p>
                              </div>
                            ) : (
                              <div className="text-center py-8">
                                <p className="text-muted-foreground">
                                  Image generation interface will appear here for fine-tuned control...
                                </p>
                              </div>
                            )}
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
                </>
              )}
              
              {/* Recent Videos Section */}
              <RecentVideos />
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              <VideoSuggestions onSuggestionClick={setVideoIdea} />
              <TipsSection />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}