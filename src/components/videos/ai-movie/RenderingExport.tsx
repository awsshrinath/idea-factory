
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Download, 
  Share, 
  CheckCircle, 
  Loader, 
  Settings, 
  Video,
  Monitor,
  Smartphone,
  Square
} from 'lucide-react';

interface RenderingExportProps {
  project: any;
  onComplete: () => void;
}

export function RenderingExport({ project, onComplete }: RenderingExportProps) {
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderComplete, setRenderComplete] = useState(false);
  const [exportSettings, setExportSettings] = useState({
    resolution: '1080p',
    format: 'mp4',
    platform: 'youtube',
    aspectRatio: '16:9'
  });

  const resolutions = [
    { id: '720p', name: '720p HD', description: '1280x720' },
    { id: '1080p', name: '1080p Full HD', description: '1920x1080' },
    { id: '4k', name: '4K Ultra HD', description: '3840x2160' }
  ];

  const formats = [
    { id: 'mp4', name: 'MP4', description: 'Universal compatibility' },
    { id: 'mov', name: 'MOV', description: 'Apple QuickTime' },
    { id: 'webm', name: 'WebM', description: 'Web optimized' }
  ];

  const platforms = [
    { id: 'youtube', name: 'YouTube', icon: Video, aspectRatio: '16:9' },
    { id: 'instagram', name: 'Instagram', icon: Square, aspectRatio: '1:1' },
    { id: 'linkedin', name: 'LinkedIn', icon: Monitor, aspectRatio: '16:9' },
    { id: 'tiktok', name: 'TikTok', icon: Smartphone, aspectRatio: '9:16' }
  ];

  const startRendering = async () => {
    setIsRendering(true);
    setRenderProgress(0);

    // Simulate rendering process
    const renderSteps = [
      'Preparing assets...',
      'Rendering scenes...',
      'Adding audio...',
      'Applying effects...',
      'Finalizing video...',
      'Optimizing for platform...'
    ];

    for (let i = 0; i < renderSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 3000));
      setRenderProgress(((i + 1) / renderSteps.length) * 100);
    }

    setIsRendering(false);
    setRenderComplete(true);
  };

  return (
    <div className="space-y-6">
      {!isRendering && !renderComplete && (
        <>
          {/* Export Settings */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Settings className="h-6 w-6 text-amber-500" />
                Export Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Platform Selection */}
                <div>
                  <label className="text-gray-300 text-sm mb-3 block">Platform Optimization</label>
                  <div className="grid grid-cols-2 gap-3">
                    {platforms.map((platform) => (
                      <div
                        key={platform.id}
                        onClick={() => setExportSettings(prev => ({
                          ...prev, 
                          platform: platform.id,
                          aspectRatio: platform.aspectRatio
                        }))}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          exportSettings.platform === platform.id
                            ? 'border-amber-500 bg-amber-500/10'
                            : 'border-gray-600 bg-gray-900/50 hover:border-gray-500'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <platform.icon className="h-4 w-4 text-gray-400" />
                          <span className="text-white text-sm font-medium">{platform.name}</span>
                        </div>
                        <span className="text-xs text-gray-400">{platform.aspectRatio}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quality Settings */}
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-300 text-sm mb-2 block">Resolution</label>
                    <Select value={exportSettings.resolution} onValueChange={(value) => setExportSettings(prev => ({...prev, resolution: value}))}>
                      <SelectTrigger className="bg-gray-900 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        {resolutions.map(res => (
                          <SelectItem key={res.id} value={res.id} className="text-white">
                            <div>
                              <div>{res.name}</div>
                              <div className="text-xs text-gray-400">{res.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-gray-300 text-sm mb-2 block">Format</label>
                    <Select value={exportSettings.format} onValueChange={(value) => setExportSettings(prev => ({...prev, format: value}))}>
                      <SelectTrigger className="bg-gray-900 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        {formats.map(format => (
                          <SelectItem key={format.id} value={format.id} className="text-white">
                            <div>
                              <div>{format.name}</div>
                              <div className="text-xs text-gray-400">{format.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Movie Summary */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Movie Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-400">
                    {project?.script?.scenes?.length || 0}
                  </div>
                  <div className="text-sm text-gray-400">Scenes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {project?.duration || 0}s
                  </div>
                  <div className="text-sm text-gray-400">Duration</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {exportSettings.resolution}
                  </div>
                  <div className="text-sm text-gray-400">Quality</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {exportSettings.aspectRatio}
                  </div>
                  <div className="text-sm text-gray-400">Aspect Ratio</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Start Rendering */}
          <div className="flex justify-center">
            <Button
              onClick={startRendering}
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-4 text-lg"
            >
              <Video className="h-6 w-6 mr-2" />
              Start Rendering Movie
            </Button>
          </div>
        </>
      )}

      {/* Rendering Progress */}
      {isRendering && (
        <Card className="bg-gradient-to-r from-amber-900/20 to-orange-900/20 border-amber-500/30">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3">
                <div className="relative">
                  <Loader className="h-12 w-12 text-amber-400 animate-spin" />
                  <div className="absolute -inset-2 bg-amber-400/20 rounded-full animate-ping" />
                </div>
                <h3 className="text-2xl font-semibold text-white">Rendering Your Movie</h3>
              </div>
              <p className="text-amber-200 text-lg">Creating your professional AI-generated movie...</p>
              <Progress value={renderProgress} className="w-full max-w-md mx-auto h-4 bg-gray-800" />
              <p className="text-lg text-gray-300">{Math.round(renderProgress)}% Complete</p>
              <p className="text-sm text-gray-400">
                Estimated time remaining: {Math.max(0, Math.round((100 - renderProgress) / 20))} minutes
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Render Complete */}
      {renderComplete && (
        <>
          <Card className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-green-500/30">
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <CheckCircle className="h-12 w-12 text-green-400" />
                  <h3 className="text-2xl font-semibold text-white">Movie Rendered Successfully!</h3>
                </div>
                <p className="text-green-200 text-lg">Your AI-generated movie is ready for download and sharing</p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Download Movie
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-blue-600 text-blue-400 hover:bg-blue-900/20"
                  >
                    <Share className="h-5 w-5 mr-2" />
                    Share Movie
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button
              onClick={onComplete}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Create Another Movie
            </Button>
          </div>
        </>
      )}

      {/* Render Queue Info */}
      {!renderComplete && (
        <Card className="bg-gray-800/30 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Render Queue Position:</span>
              <Badge className="bg-blue-600/20 text-blue-400">#1 in queue</Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
