
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Film, 
  Brain, 
  Image, 
  Video, 
  Download,
  Sparkles,
  Play,
  Edit,
  RefreshCw,
  Settings
} from 'lucide-react';
import { MovieProjectSetup } from './MovieProjectSetup';
import { ScriptGenerationDashboard } from './ScriptGenerationDashboard';
import { VisualGenerationStoryboard } from './VisualGenerationStoryboard';
import { MovieAssemblyEditor } from './MovieAssemblyEditor';
import { RenderingExport } from './RenderingExport';
import { MovieTemplateLibrary } from './MovieTemplateLibrary';

interface MovieProject {
  id: string;
  title: string;
  topic: string;
  genre: string;
  duration: number;
  audience: string;
  style: string;
  status: 'setup' | 'script-generation' | 'visual-generation' | 'assembly' | 'rendering' | 'complete';
  script?: {
    scenes: Array<{
      id: string;
      duration: number;
      narrative: string;
      visualDescription: string;
      voiceover: string;
      musicMood: string;
    }>;
  };
  visuals?: {
    storyboard: Array<{
      sceneId: string;
      imageUrl: string;
      prompt: string;
    }>;
  };
  settings?: {
    voiceId: string;
    musicStyle: string;
    transitions: string[];
  };
}

export function AIMovieStudio() {
  const [currentProject, setCurrentProject] = useState<MovieProject | null>(null);
  const [activeStep, setActiveStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const steps = [
    { id: 1, title: 'Project Setup', icon: Settings, description: 'Define your movie concept and parameters' },
    { id: 2, title: 'Script Generation', icon: Brain, description: 'AI creates your movie script and scene breakdown' },
    { id: 3, title: 'Visual Generation', icon: Image, description: 'Generate visuals and create storyboard' },
    { id: 4, title: 'Movie Assembly', icon: Video, description: 'Customize and assemble your movie' },
    { id: 5, title: 'Render & Export', icon: Download, description: 'Final rendering and export options' },
  ];

  const handleStepComplete = (step: number, data: any) => {
    if (step === 1) {
      // Project setup complete
      setCurrentProject({
        id: `movie-${Date.now()}`,
        title: data.title || `${data.genre} Movie`,
        topic: data.topic,
        genre: data.genre,
        duration: data.duration,
        audience: data.audience,
        style: data.style,
        status: 'script-generation'
      });
      setActiveStep(2);
    } else if (step === 2) {
      // Script generation complete
      setCurrentProject(prev => prev ? {
        ...prev,
        script: data,
        status: 'visual-generation'
      } : null);
      setActiveStep(3);
    } else if (step === 3) {
      // Visual generation complete
      setCurrentProject(prev => prev ? {
        ...prev,
        visuals: data,
        status: 'assembly'
      } : null);
      setActiveStep(4);
    } else if (step === 4) {
      // Assembly complete
      setCurrentProject(prev => prev ? {
        ...prev,
        settings: data,
        status: 'rendering'
      } : null);
      setActiveStep(5);
    }
  };

  const resetProject = () => {
    setCurrentProject(null);
    setActiveStep(1);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-600">
              <Film className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">AI Movie Studio</h1>
            <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <Sparkles className="h-4 w-4 mr-1" />
              Beta
            </Badge>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Transform any topic into a complete movie with AI-generated script, visuals, voiceover, and music
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-4xl mx-auto mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                  activeStep >= step.id 
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 border-amber-500 text-white' 
                    : 'border-gray-600 text-gray-400'
                }`}>
                  <step.icon className="h-6 w-6" />
                </div>
                <div className="mt-2 text-center">
                  <div className={`text-sm font-medium ${activeStep >= step.id ? 'text-white' : 'text-gray-400'}`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500 max-w-24">
                    {step.description}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`absolute w-24 h-0.5 mt-6 ml-12 ${
                    activeStep > step.id ? 'bg-amber-500' : 'bg-gray-600'
                  }`} style={{ transform: 'translateY(-24px) translateX(24px)' }} />
                )}
              </div>
            ))}
          </div>
          <Progress 
            value={(activeStep / steps.length) * 100} 
            className="max-w-4xl mx-auto h-2 bg-gray-800"
          />
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <Tabs value={`step-${activeStep}`} className="w-full">
            <TabsList className="hidden">
              {steps.map(step => (
                <TabsTrigger key={step.id} value={`step-${step.id}`}>
                  Step {step.id}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="step-1" className="space-y-6">
              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Settings className="h-6 w-6 text-amber-500" />
                    Project Setup & Topic Input
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MovieProjectSetup onComplete={(data) => handleStepComplete(1, data)} />
                </CardContent>
              </Card>
              
              <MovieTemplateLibrary onTemplateSelect={(template) => {
                handleStepComplete(1, template);
              }} />
            </TabsContent>

            <TabsContent value="step-2" className="space-y-6">
              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Brain className="h-6 w-6 text-purple-500" />
                    AI Script Generation Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScriptGenerationDashboard 
                    project={currentProject}
                    onComplete={(data) => handleStepComplete(2, data)}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="step-3" className="space-y-6">
              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Image className="h-6 w-6 text-blue-500" />
                    Visual Generation & Storyboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <VisualGenerationStoryboard 
                    project={currentProject}
                    onComplete={(data) => handleStepComplete(3, data)}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="step-4" className="space-y-6">
              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Video className="h-6 w-6 text-green-500" />
                    Movie Assembly & Customization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MovieAssemblyEditor 
                    project={currentProject}
                    onComplete={(data) => handleStepComplete(4, data)}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="step-5" className="space-y-6">
              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Download className="h-6 w-6 text-amber-500" />
                    Rendering & Export
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RenderingExport 
                    project={currentProject}
                    onComplete={resetProject}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex justify-center gap-4">
          {activeStep > 1 && (
            <Button 
              variant="outline" 
              onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Previous Step
            </Button>
          )}
          
          <Button 
            variant="outline" 
            onClick={resetProject}
            className="border-red-600 text-red-400 hover:bg-red-900/20"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Start New Project
          </Button>
        </div>
      </div>
    </div>
  );
}
