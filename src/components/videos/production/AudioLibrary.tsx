
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Pause, Volume2, Star, CheckCircle } from 'lucide-react';

interface AudioLibraryProps {
  audioTracks: any[];
  selectedAudio: any;
  onSelect: (audio: any) => void;
}

export function AudioLibrary({ audioTracks, selectedAudio, onSelect }: AudioLibraryProps) {
  const [playingTrack, setPlayingTrack] = useState(null);

  const groupedAudio = audioTracks.reduce((acc, track) => {
    if (!acc[track.category]) {
      acc[track.category] = [];
    }
    acc[track.category].push(track);
    return acc;
  }, {} as Record<string, any[]>);

  const togglePlay = (track: any) => {
    if (playingTrack?.id === track.id) {
      setPlayingTrack(null);
    } else {
      setPlayingTrack(track);
      // In a real implementation, you would actually play the audio
      setTimeout(() => setPlayingTrack(null), 3000); // Simulate playing
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Professional Audio Library</h3>
        <p className="text-muted-foreground">
          High-quality background music, sound effects, and ambient audio for any mood
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Audio</TabsTrigger>
          <TabsTrigger value="background_music">Music</TabsTrigger>
          <TabsTrigger value="sound_effects">Effects</TabsTrigger>
          <TabsTrigger value="ambient">Ambient</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {Object.entries(groupedAudio).map(([category, tracks]) => (
            <div key={category} className="space-y-3">
              <h4 className="font-medium capitalize text-primary">
                {category.replace('_', ' ')}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tracks.map((track) => (
                  <AudioTrackCard
                    key={track.id}
                    track={track}
                    isSelected={selectedAudio?.id === track.id}
                    isPlaying={playingTrack?.id === track.id}
                    onSelect={() => onSelect(track)}
                    onTogglePlay={() => togglePlay(track)}
                    formatDuration={formatDuration}
                  />
                ))}
              </div>
            </div>
          ))}
        </TabsContent>

        {Object.entries(groupedAudio).map(([category, tracks]) => (
          <TabsContent key={category} value={category} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tracks.map((track) => (
                <AudioTrackCard
                  key={track.id}
                  track={track}
                  isSelected={selectedAudio?.id === track.id}
                  isPlaying={playingTrack?.id === track.id}
                  onSelect={() => onSelect(track)}
                  onTogglePlay={() => togglePlay(track)}
                  formatDuration={formatDuration}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {selectedAudio && (
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Selected Audio Track
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Volume2 className="h-4 w-4" />
              <span className="font-medium">{selectedAudio.name}</span>
              <Badge variant="secondary">{selectedAudio.mood}</Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function AudioTrackCard({ track, isSelected, isPlaying, onSelect, onTogglePlay, formatDuration }: any) {
  return (
    <Card
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
        isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'
      }`}
      onClick={onSelect}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            {track.name}
            {isSelected && <CheckCircle className="h-4 w-4 text-primary" />}
          </CardTitle>
          {track.is_premium && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              <Star className="h-3 w-3 mr-1" />
              Pro
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          {track.mood && (
            <Badge variant="outline" className="text-xs">
              {track.mood}
            </Badge>
          )}
          <span className="text-xs text-muted-foreground">
            {formatDuration(track.duration)}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onTogglePlay();
            }}
          >
            {isPlaying ? (
              <>
                <Pause className="h-3 w-3 mr-1" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-3 w-3 mr-1" />
                Play
              </>
            )}
          </Button>
          <Button
            size="sm"
            variant={isSelected ? "default" : "outline"}
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
          >
            {isSelected ? 'Selected' : 'Select'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
