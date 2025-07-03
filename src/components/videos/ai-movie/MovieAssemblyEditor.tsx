
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Video, 
  Music, 
  Mic, 
  Type, 
  Palette, 
  Settings,
  Play,
  CheckCircle
} from 'lucide-react';

interface MovieAssemblyEditorProps {
  project: any;
  onComplete: (data: any) => void;
}

export function MovieAssemblyEditor({ project, onComplete }: MovieAssemblyEditorProps) {
  const [settings, setSettings] = useState({
    voiceId: 'alloy',
    musicStyle: 'cinematic',
    transitions: 'fade',
    volume: [75],
    captions: true,
    branding: true
  });

  const voices = [
    { id: 'alloy', name: 'Alloy (Neutral)' },
    { id: 'echo', name: 'Echo (Male)' },
    { id: 'fable', name: 'Fable (British)' },
    { id: 'onyx', name: 'Onyx (Deep)' },
    { id: 'nova', name: 'Nova (Female)' },
    { id: 'shimmer', name: 'Shimmer (Soft)' }
  ];

  const musicStyles = [
    { id: 'cinematic', name: 'Cinematic Orchestra' },
    { id: 'corporate', name: 'Corporate Background' },
    { id: 'upbeat', name: 'Upbeat Energy' },
    { id: 'ambient', name: 'Ambient Atmosphere' },
    { id: 'dramatic', name: 'Dramatic Tension' }
  ];

  const transitions = [
    { id: 'fade', name: 'Fade In/Out' },
    { id: 'slide', name: 'Slide Transition' },
    { id: 'zoom', name: 'Zoom Effect' },
    { id: 'wipe', name: 'Cinematic Wipe' },
    { id: 'dissolve', name: 'Dissolve' }
  ];

  const handleComplete = () => {
    onComplete({
      ...settings,
      volume: settings.volume[0],
      assemblyComplete: true
    });
  };

  return (
    <div className="space-y-6">
      {/* Timeline Preview */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Video className="h-6 w-6 text-green-500" />
            Movie Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-32 bg-gray-900/50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-600">
              <div className="text-center">
                <Play className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-400">Timeline Editor Preview</p>
                <p className="text-sm text-gray-500">Drag and drop scenes to reorder</p>
              </div>
            </div>
            
            {project?.script?.scenes && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {project.script.scenes.map((scene: any, index: number) => (
                  <div key={scene.id} className="flex-shrink-0 w-24 h-16 bg-gray-700 rounded border-2 border-amber-500/30 flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">{index + 1}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Customization Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Voice Settings */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Mic className="h-5 w-5 text-purple-400" />
              Voiceover Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-gray-300 text-sm mb-2 block">AI Voice</label>
              <Select value={settings.voiceId} onValueChange={(value) => setSettings(prev => ({...prev, voiceId: value}))}>
                <SelectTrigger className="bg-gray-900 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {voices.map(voice => (
                    <SelectItem key={voice.id} value={voice.id} className="text-white">
                      {voice.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-gray-300 text-sm mb-2 block">Volume Level</label>
              <Slider
                value={settings.volume}
                onValueChange={(value) => setSettings(prev => ({...prev, volume: value}))}
                max={100}
                min={0}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0%</span>
                <span>{settings.volume[0]}%</span>
                <span>100%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Music Settings */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Music className="h-5 w-5 text-orange-400" />
              Background Music
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-gray-300 text-sm mb-2 block">Music Style</label>
              <Select value={settings.musicStyle} onValueChange={(value) => setSettings(prev => ({...prev, musicStyle: value}))}>
                <SelectTrigger className="bg-gray-900 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {musicStyles.map(style => (
                    <SelectItem key={style.id} value={style.id} className="text-white">
                      {style.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Transitions */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Palette className="h-5 w-5 text-blue-400" />
              Transitions & Effects
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-gray-300 text-sm mb-2 block">Scene Transitions</label>
              <Select value={settings.transitions} onValueChange={(value) => setSettings(prev => ({...prev, transitions: value}))}>
                <SelectTrigger className="bg-gray-900 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {transitions.map(transition => (
                    <SelectItem key={transition.id} value={transition.id} className="text-white">
                      {transition.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Additional Options */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Settings className="h-5 w-5 text-gray-400" />
              Additional Options
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Type className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300">Auto Captions</span>
              </div>
              <Badge className={settings.captions ? "bg-green-600/20 text-green-400" : "bg-gray-600/20 text-gray-400"}>
                {settings.captions ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-gray-300">Brand Integration</span>
              </div>
              <Badge className={settings.branding ? "bg-green-600/20 text-green-400" : "bg-gray-600/20 text-gray-400"}>
                {settings.branding ? "Enabled" : "Disabled"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview and Actions */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Movie Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center mb-6">
            <div className="text-center">
              <Play className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">Movie Preview</p>
              <p className="text-sm text-gray-500">Click to preview with current settings</p>
            </div>
          </div>
          
          <div className="flex justify-center gap-4">
            <Button variant="outline" className="border-gray-600 text-gray-300">
              Preview Movie
            </Button>
            <Button
              onClick={handleComplete}
              size="lg"
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8"
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Finalize & Render Movie
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
