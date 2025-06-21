
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Download, Share, Loader, CheckCircle, AlertCircle } from 'lucide-react';

interface VideoPreviewProps {
  project: any;
  settings: any;
}

export function VideoPreview({ project, settings }: VideoPreviewProps) {
  if (!project) {
    return (
      <div className="space-y-4">
        <div className="aspect-video bg-muted/20 rounded-lg flex items-center justify-center">
          <div className="text-center space-y-2">
            <Play className="h-12 w-12 mx-auto text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Create a video project to see preview
            </p>
          </div>
        </div>
        
        <Card className="bg-muted/20">
          <CardContent className="p-4">
            <h4 className="font-medium mb-2">Preview Configuration</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              {settings.template && (
                <div className="flex justify-between">
                  <span>Template:</span>
                  <Badge variant="outline">{settings.template.name}</Badge>
                </div>
              )}
              {settings.effects?.length > 0 && (
                <div className="flex justify-between">
                  <span>Effects:</span>
                  <span>{settings.effects.length} selected</span>
                </div>
              )}
              {settings.audio && (
                <div className="flex justify-between">
                  <span>Audio:</span>
                  <Badge variant="outline">{settings.audio.name}</Badge>
                </div>
              )}
              {settings.captions && (
                <div className="flex justify-between">
                  <span>Captions:</span>
                  <Badge variant="outline">{settings.captions.name}</Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusIcon = () => {
    switch (project.status) {
      case 'processing':
        return <Loader className="h-4 w-4 animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Play className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusText = () => {
    switch (project.status) {
      case 'processing':
        return 'Generating your professional video...';
      case 'completed':
        return 'Your video is ready!';
      case 'failed':
        return 'Generation failed. Please try again.';
      default:
        return 'Draft';
    }
  };

  return (
    <div className="space-y-4">
      {/* Video Preview */}
      <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
        {project.status === 'completed' && project.video_url ? (
          <div className="w-full h-full flex items-center justify-center">
            <img
              src={project.thumbnail_url || '/placeholder.svg'}
              alt="Video thumbnail"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <Button size="lg" className="rounded-full">
                <Play className="h-6 w-6 ml-1" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              {getStatusIcon()}
              <div>
                <h4 className="text-white font-medium">{project.title}</h4>
                <p className="text-white/70 text-sm">{getStatusText()}</p>
              </div>
              {project.status === 'processing' && (
                <Progress value={65} className="w-48" />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Project Details */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              {getStatusIcon()}
              {project.title}
            </CardTitle>
            <Badge variant={
              project.status === 'completed' ? 'default' :
              project.status === 'processing' ? 'secondary' :
              project.status === 'failed' ? 'destructive' : 'outline'
            }>
              {project.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {getStatusText()}
          </p>

          {project.status === 'completed' && (
            <div className="flex gap-2">
              <Button size="sm" className="flex-1">
                <Play className="h-3 w-3 mr-1" />
                Play
              </Button>
              <Button size="sm" variant="outline">
                <Download className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="outline">
                <Share className="h-3 w-3" />
              </Button>
            </div>
          )}

          {/* Project Settings Summary */}
          <div className="pt-3 border-t space-y-2">
            <h5 className="text-sm font-medium">Configuration</h5>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">Niche:</span>
                <span className="ml-1 capitalize">{project.niche}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Duration:</span>
                <span className="ml-1">{project.duration || 30}s</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
