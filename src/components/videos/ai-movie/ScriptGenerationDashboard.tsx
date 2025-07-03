
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Brain, 
  Clock, 
  Eye, 
  Mic, 
  Music, 
  Edit, 
  RefreshCw, 
  CheckCircle,
  Play,
  Loader
} from 'lucide-react';

interface ScriptGenerationDashboardProps {
  project: any;
  onComplete: (data: any) => void;
}

interface Scene {
  id: string;
  duration: number;
  narrative: string;
  visualDescription: string;
  voiceover: string;
  musicMood: string;
}

export function ScriptGenerationDashboard({ project, onComplete }: ScriptGenerationDashboardProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [editingScene, setEditingScene] = useState<string | null>(null);
  const [generatedScript, setGeneratedScript] = useState('');

  useEffect(() => {
    if (project && !isGenerating && scenes.length === 0) {
      generateScript();
    }
  }, [project]);

  const generateScript = async () => {
    if (!project) return;

    setIsGenerating(true);
    setProgress(0);
    setCurrentStep('Analyzing your topic...');

    // Simulate AI script generation process
    const steps = [
      'Analyzing your topic...',
      'Creating story structure...',
      'Writing scene narratives...',
      'Generating visual descriptions...',
      'Creating voiceover scripts...',
      'Adding music recommendations...',
      'Finalizing script...'
    ];

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(steps[i]);
      setProgress(((i + 1) / steps.length) * 100);
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    // Generate mock script based on project
    const mockScenes: Scene[] = [];
    const totalDuration = project.duration;
    const numScenes = Math.max(3, Math.floor(totalDuration / 20));
    const sceneDuration = Math.floor(totalDuration / numScenes);

    for (let i = 0; i < numScenes; i++) {
      mockScenes.push({
        id: `scene-${i + 1}`,
        duration: i === numScenes - 1 ? totalDuration - (sceneDuration * i) : sceneDuration,
        narrative: `Scene ${i + 1}: ${generateSceneNarrative(project.topic, project.genre, i + 1, numScenes)}`,
        visualDescription: generateVisualDescription(project.style, project.genre, i + 1),
        voiceover: generateVoiceover(project.topic, project.audience, i + 1, numScenes),
        musicMood: generateMusicMood(project.genre, i + 1, numScenes)
      });
    }

    setScenes(mockScenes);
    setGeneratedScript(mockScenes.map(scene => scene.narrative).join('\n\n'));
    setIsGenerating(false);
    setCurrentStep('Script generation complete!');
  };

  const generateSceneNarrative = (topic: string, genre: string, sceneNum: number, totalScenes: number) => {
    const narratives = {
      drama: [
        `Opening scene introduces the central conflict around ${topic}`,
        `Character development and emotional tension builds`,
        `Climactic moment where the main challenge is confronted`,
        `Resolution and emotional conclusion`
      ],
      comedy: [
        `Humorous introduction to the ${topic} situation`,
        `Comedy escalates with misunderstandings`,
        `Peak comedic moment with unexpected twist`,
        `Light-hearted resolution with satisfied ending`
      ],
      documentary: [
        `Factual introduction to ${topic} with context`,
        `Expert interviews and evidence presentation`,
        `Analysis of key data and findings`,
        `Conclusion with actionable insights`
      ],
      promotional: [
        `Attention-grabbing opening about ${topic}`,
        `Problem identification and solution preview`,
        `Demonstration of benefits and value`,
        `Strong call-to-action conclusion`
      ],
      educational: [
        `Introduction to the ${topic} concept`,
        `Step-by-step explanation with examples`,
        `Practical applications and use cases`,
        `Summary and key takeaways`
      ],
      explainer: [
        `Simple introduction to ${topic}`,
        `Breaking down complex concepts`,
        `Visual examples and analogies`,
        `Clear conclusion with understanding check`
      ]
    };

    const genreNarratives = narratives[genre as keyof typeof narratives] || narratives.explainer;
    return genreNarratives[Math.min(sceneNum - 1, genreNarratives.length - 1)];
  };

  const generateVisualDescription = (style: string, genre: string, sceneNum: number) => {
    const styles = {
      cinematic: `Cinematic ${sceneNum === 1 ? 'wide establishing shot' : sceneNum % 2 === 0 ? 'close-up with dramatic lighting' : 'medium shot with depth of field'}`,
      corporate: `Professional ${sceneNum === 1 ? 'office environment' : 'clean presentation style with modern graphics'}`,
      animated: `${sceneNum === 1 ? 'Animated intro sequence' : 'Dynamic motion graphics with smooth transitions'}`,
      documentary: `${sceneNum === 1 ? 'Real-world location shot' : 'Interview setup with natural lighting'}`
    };

    return styles[style as keyof typeof styles] || 'Clean, professional visual presentation';
  };

  const generateVoiceover = (topic: string, audience: string, sceneNum: number, totalScenes: number) => {
    if (sceneNum === 1) {
      return `Welcome to our exploration of ${topic}. Today, we'll discover why this matters to you.`;
    } else if (sceneNum === totalScenes) {
      return `Thank you for joining us on this journey through ${topic}. We hope you found this valuable.`;
    } else {
      return `Let's dive deeper into this aspect of ${topic} and see how it applies to your situation.`;
    }
  };

  const generateMusicMood = (genre: string, sceneNum: number, totalScenes: number) => {
    const moods = {
      drama: ['Emotional', 'Tense', 'Uplifting', 'Resolving'],
      comedy: ['Playful', 'Upbeat', 'Whimsical', 'Cheerful'],
      documentary: ['Neutral', 'Thoughtful', 'Investigative', 'Conclusive'],
      promotional: ['Energetic', 'Exciting', 'Confident', 'Triumphant'],
      educational: ['Calm', 'Focused', 'Encouraging', 'Satisfying'],
      explainer: ['Friendly', 'Clear', 'Engaging', 'Complete']
    };

    const genreMoods = moods[genre as keyof typeof moods] || moods.explainer;
    return genreMoods[Math.min(sceneNum - 1, genreMoods.length - 1)];
  };

  const handleSceneEdit = (sceneId: string, field: string, value: string) => {
    setScenes(prev => prev.map(scene => 
      scene.id === sceneId ? { ...scene, [field]: value } : scene
    ));
  };

  const regenerateScene = async (sceneId: string) => {
    const sceneIndex = scenes.findIndex(s => s.id === sceneId);
    if (sceneIndex === -1) return;

    // Simulate regeneration
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newScene = {
      ...scenes[sceneIndex],
      narrative: generateSceneNarrative(project.topic, project.genre, sceneIndex + 1, scenes.length),
      visualDescription: generateVisualDescription(project.style, project.genre, sceneIndex + 1),
      voiceover: generateVoiceover(project.topic, project.audience, sceneIndex + 1, scenes.length),
      musicMood: generateMusicMood(project.genre, sceneIndex + 1, scenes.length)
    };

    setScenes(prev => prev.map((scene, idx) => idx === sceneIndex ? newScene : scene));
  };

  const handleApprove = () => {
    onComplete({
      scenes,
      fullScript: generatedScript,
      totalDuration: scenes.reduce((sum, scene) => sum + scene.duration, 0)
    });
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${remainingSeconds}s`;
  };

  return (
    <div className="space-y-6">
      {/* Generation Progress */}
      {isGenerating && (
        <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/30">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3">
                <div className="relative">
                  <Brain className="h-8 w-8 text-purple-400 animate-pulse" />
                  <div className="absolute -inset-2 bg-purple-400/20 rounded-full animate-ping" />
                </div>
                <h3 className="text-xl font-semibold text-white">AI Generating Your Script</h3>
              </div>
              <p className="text-purple-200">{currentStep}</p>
              <Progress value={progress} className="w-full max-w-md mx-auto h-3 bg-gray-800" />
              <p className="text-sm text-gray-400">{Math.round(progress)}% Complete</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Script Overview */}
      {!isGenerating && scenes.length > 0 && (
        <>
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  Script Generated Successfully
                </CardTitle>
                <Badge className="bg-green-600/20 text-green-400">
                  {scenes.length} Scenes • {formatDuration(scenes.reduce((sum, scene) => sum + scene.duration, 0))}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-900/50 rounded-lg">
                  <h3 className="text-white font-semibold mb-2">Full Script Preview</h3>
                  <Textarea
                    value={generatedScript}
                    onChange={(e) => setGeneratedScript(e.target.value)}
                    className="bg-gray-800 border-gray-600 text-gray-300 min-h-[120px]"
                    placeholder="Your full script appears here..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scene Timeline */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Scene-by-Scene Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scenes.map((scene, index) => (
                  <div key={scene.id} className="border border-gray-700 rounded-lg p-4 bg-gray-900/30">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-amber-500/20 text-amber-400 rounded-full font-semibold">
                          {index + 1}
                        </div>
                        <h3 className="text-white font-semibold">Scene {index + 1}</h3>
                        <Badge className="bg-gray-700 text-gray-300">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDuration(scene.duration)}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingScene(editingScene === scene.id ? null : scene.id)}
                          className="border-gray-600 text-gray-300"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          {editingScene === scene.id ? 'Save' : 'Edit'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => regenerateScene(scene.id)}
                          className="border-purple-600 text-purple-400"
                        >
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Regenerate
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Narrative */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Play className="h-4 w-4 text-blue-400" />
                          <label className="text-sm font-medium text-gray-300">Narrative</label>
                        </div>
                        {editingScene === scene.id ? (
                          <Textarea
                            value={scene.narrative}
                            onChange={(e) => handleSceneEdit(scene.id, 'narrative', e.target.value)}
                            className="bg-gray-800 border-gray-600 text-gray-300 text-sm"
                          />
                        ) : (
                          <p className="text-gray-400 text-sm bg-gray-800/50 p-3 rounded">{scene.narrative}</p>
                        )}
                      </div>

                      {/* Visual Description */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4 text-green-400" />
                          <label className="text-sm font-medium text-gray-300">Visual</label>
                        </div>
                        {editingScene === scene.id ? (
                          <Textarea
                            value={scene.visualDescription}
                            onChange={(e) => handleSceneEdit(scene.id, 'visualDescription', e.target.value)}
                            className="bg-gray-800 border-gray-600 text-gray-300 text-sm"
                          />
                        ) : (
                          <p className="text-gray-400 text-sm bg-gray-800/50 p-3 rounded">{scene.visualDescription}</p>
                        )}
                      </div>

                      {/* Voiceover */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Mic className="h-4 w-4 text-purple-400" />
                          <label className="text-sm font-medium text-gray-300">Voiceover</label>
                        </div>
                        {editingScene === scene.id ? (
                          <Textarea
                            value={scene.voiceover}
                            onChange={(e) => handleSceneEdit(scene.id, 'voiceover', e.target.value)}
                            className="bg-gray-800 border-gray-600 text-gray-300 text-sm"
                          />
                        ) : (
                          <p className="text-gray-400 text-sm bg-gray-800/50 p-3 rounded">{scene.voiceover}</p>
                        )}
                      </div>

                      {/* Music Mood */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Music className="h-4 w-4 text-orange-400" />
                          <label className="text-sm font-medium text-gray-300">Music</label>
                        </div>
                        <Badge className="bg-orange-500/20 text-orange-400 w-fit">
                          {scene.musicMood}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={generateScript}
              className="border-purple-600 text-purple-400 hover:bg-purple-900/20"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Regenerate Entire Script
            </Button>
            <Button
              onClick={handleApprove}
              size="lg"
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8"
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Approve Script & Generate Visuals
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
