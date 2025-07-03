
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Image, RefreshCw, CheckCircle, Edit, Loader } from 'lucide-react';

interface VisualGenerationStoryboardProps {
  project: any;
  onComplete: (data: any) => void;
}

export function VisualGenerationStoryboard({ project, onComplete }: VisualGenerationStoryboardProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [storyboard, setStoryboard] = useState<any[]>([]);

  const generateVisuals = async () => {
    if (!project?.script?.scenes) return;

    setIsGenerating(true);
    setProgress(0);

    const scenes = project.script.scenes;
    const generatedStoryboard = [];

    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      setProgress(((i + 1) / scenes.length) * 100);
      
      // Simulate image generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      generatedStoryboard.push({
        sceneId: scene.id,
        imageUrl: '/placeholder.svg', // In real implementation, this would be generated
        prompt: scene.visualDescription,
        generatedAt: new Date().toISOString()
      });
    }

    setStoryboard(generatedStoryboard);
    setIsGenerating(false);
  };

  const handleComplete = () => {
    onComplete({
      storyboard,
      visualsReady: true
    });
  };

  return (
    <div className="space-y-6">
      {!isGenerating && storyboard.length === 0 && (
        <div className="text-center py-8">
          <div className="p-4 rounded-full bg-blue-500/20 w-fit mx-auto mb-4">
            <Image className="h-8 w-8 text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Ready to Generate Visuals</h3>
          <p className="text-gray-400 mb-6">
            Create AI-generated images for each scene in your script
          </p>
          <Button
            onClick={generateVisuals}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Image className="h-5 w-5 mr-2" />
            Generate Storyboard Images
          </Button>
        </div>
      )}

      {isGenerating && (
        <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-500/30">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3">
                <Loader className="h-8 w-8 text-blue-400 animate-spin" />
                <h3 className="text-xl font-semibold text-white">Generating Visual Storyboard</h3>
              </div>
              <p className="text-blue-200">Creating AI-generated images for your scenes...</p>
              <Progress value={progress} className="w-full max-w-md mx-auto h-3 bg-gray-800" />
              <p className="text-sm text-gray-400">{Math.round(progress)}% Complete</p>
            </div>
          </CardContent>
        </Card>
      )}

      {storyboard.length > 0 && (
        <>
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  Storyboard Generated
                </CardTitle>
                <Badge className="bg-green-600/20 text-green-400">
                  {storyboard.length} Images Created
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {storyboard.map((item, index) => (
                  <Card key={item.sceneId} className="bg-gray-900/50 border-gray-700">
                    <CardContent className="p-4">
                      <div className="aspect-video bg-gray-700 rounded-lg mb-3 overflow-hidden">
                        <img 
                          src={item.imageUrl} 
                          alt={`Scene ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="text-white font-semibold mb-2">Scene {index + 1}</h3>
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">{item.prompt}</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 flex-1">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="border-purple-600 text-purple-400">
                          <RefreshCw className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button
              onClick={handleComplete}
              size="lg"
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8"
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Approve Visuals & Assemble Movie
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
