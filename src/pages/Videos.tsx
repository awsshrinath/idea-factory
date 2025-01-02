import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { VideoSuggestions } from "@/components/videos/VideoSuggestions";
import { 
  Video, 
  ImagePlus, 
  Wand2, 
  Mic, 
  Subtitles, 
  Download,
  HelpCircle,
  ChevronRight,
  Play,
  Image,
  ArrowLeft
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-8 bg-muted p-4 rounded-lg">
      {Object.entries(workflowSteps).map(([step, label], index) => (
        <div key={step} className="flex items-center">
          <div className={`flex flex-col items-center ${currentStep === step ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 
              ${currentStep === step ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/20'}`}>
              {index + 1}
            </div>
            <span className="text-sm font-medium">{label}</span>
          </div>
          {index < Object.keys(workflowSteps).length - 1 && (
            <ChevronRight className="mx-4 text-muted-foreground" />
          )}
        </div>
      ))}
    </div>
  );

  const renderWorkflowSelection = () => (
    <div className="grid md:grid-cols-2 gap-6">
      <Card 
        className="cursor-pointer hover:border-primary transition-colors"
        onClick={() => {
          setWorkflowType("direct");
          setCurrentStep("script");
        }}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Direct Video Generation
          </CardTitle>
          <CardDescription>
            Generate a video directly from your script with AI-powered visuals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Play className="h-4 w-4" /> Quick single-step video creation
            </div>
            <Button className="w-full">Start Direct Video</Button>
          </div>
        </CardContent>
      </Card>

      <Card 
        className="cursor-pointer hover:border-primary transition-colors"
        onClick={() => {
          setWorkflowType("fine-tuned");
          setCurrentStep("script");
        }}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImagePlus className="h-5 w-5" />
            Fine-Tuned Video Generation
          </CardTitle>
          <CardDescription>
            Generate and customize images first, then create your video with precise control
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Image className="h-4 w-4" /> Detailed image-first approach
            </div>
            <Button className="w-full">Start Fine-Tuned Video</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
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
                    <p>Example: "A motivational video about teamwork"</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-xl text-muted-foreground mt-2">
              Transform your ideas into engaging videos with AI
            </p>
          </div>

          {/* Main Content */}
          <div className="grid md:grid-cols-[1fr,300px] gap-6">
            <div className="space-y-6">
              {/* Workflow Selection or Current Workflow */}
              {!workflowType ? (
                renderWorkflowSelection()
              ) : (
                <>
                  {renderStepIndicator()}
                  <Card>
                    <CardHeader>
                      <Button 
                        variant="ghost" 
                        className="w-fit mb-4 flex items-center gap-2"
                        onClick={handleBack}
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Back to workflow selection
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
            </div>

            {/* Right Sidebar with Suggestions */}
            <div className="space-y-6">
              <VideoSuggestions onSuggestionClick={setVideoIdea} />
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tips & Examples</CardTitle>
                  <CardDescription>How to get the best results</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Writing Great Prompts</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Be specific about the style and tone</li>
                      <li>• Include your target audience</li>
                      <li>• Mention any specific visuals</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
