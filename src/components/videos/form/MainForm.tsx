
import { useState } from "react";
import { VideoTemplates } from "../VideoTemplates";
import { VideoStyleCard } from "../VideoStyleCard";
import { AspectRatioSelector } from "../AspectRatioSelector";
import { AdvancedOptions, type AdvancedVideoOptions } from "../AdvancedOptions";
import { VideoError } from "../feedback/VideoError";
import { VideoSuccess } from "../feedback/VideoSuccess";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CircleX, Loader2, Wand2, Film, Sparkles, PenLine, ChalkboardUser, Presentation, TextQuote } from "lucide-react";

// Define the video styles that were missing
const videoStyles = [
  {
    id: "cinematic",
    title: "Cinematic",
    description: "Professional, movie-like videos with high production value",
    icon: Film,
    imageUrl: "https://images.unsplash.com/photo-1585951237318-9ea5e175b891?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: "animated",
    title: "Animated",
    description: "Engaging cartoon and motion graphics style videos",
    icon: Sparkles,
    imageUrl: "https://images.unsplash.com/photo-1632776350300-894bbdcf0e12?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: "socialReel",
    title: "Social Reel",
    description: "Trendy, attention-grabbing videos for social media",
    icon: PenLine,
    imageUrl: "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: "explainer",
    title: "Explainer",
    description: "Clear, educational videos that break down complex topics",
    icon: ChalkboardUser,
    imageUrl: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: "whiteboard",
    title: "Whiteboard",
    description: "Hand-drawn style visuals with step-by-step explanations",
    icon: Presentation,
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: "typography",
    title: "Typography",
    description: "Text-focused videos with dynamic typography animations",
    icon: TextQuote,
    imageUrl: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  }
];

type VideoStyle = "cinematic" | "animated" | "socialReel" | "explainer" | "whiteboard" | "typography";

interface MainFormProps {
  onGenerateVideo: () => void;
}

export function MainForm({ onGenerateVideo }: MainFormProps) {
  const [videoIdea, setVideoIdea] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<VideoStyle | null>(null);
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [duration, setDuration] = useState("30");
  const [language, setLanguage] = useState("en");
  const [advancedOptions, setAdvancedOptions] = useState<AdvancedVideoOptions>({
    voiceoverType: "female",
    backgroundMusic: "none",
    playbackSpeed: "normal",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationState, setGenerationState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Add the missing resetForm function
  const resetForm = () => {
    setVideoIdea("");
    setSelectedStyle(null);
    setAspectRatio("16:9");
    setDuration("30");
    setLanguage("en");
    setAdvancedOptions({
      voiceoverType: "female",
      backgroundMusic: "none",
      playbackSpeed: "normal",
    });
    setGenerationState('idle');
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setGenerationState('loading');

    // Simulate random success/error (90% success rate)
    const willSucceed = Math.random() > 0.1;

    setTimeout(() => {
      setIsGenerating(false);
      setGenerationState(willSucceed ? 'success' : 'error');
    }, 3000);
  };

  const handleRetry = () => {
    setGenerationState('idle');
    setIsGenerating(false);
  };

  const handleWatch = () => {
    window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank'); // Placeholder video
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = 'https://www.w3schools.com/html/mov_bbb.mp4'; // Placeholder video
    link.download = 'your-video.mp4';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSchedule = () => {
    // We'll implement this in the next iteration
    console.log('Schedule clicked');
  };

  if (generationState === 'loading') {
    return (
      <Card className="border border-white/10 bg-card/70 backdrop-blur-sm shadow-md">
        <CardContent className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-white">✨ Generating your video magic...</h3>
          <p className="text-muted-foreground">Please wait while we craft something special.</p>
        </CardContent>
      </Card>
    );
  }

  if (generationState === 'error') {
    return (
      <Card className="border border-white/10 bg-card/70 backdrop-blur-sm shadow-md">
        <CardContent className="p-0">
          <VideoError onRetry={handleRetry} onEdit={() => setGenerationState('idle')} />
        </CardContent>
      </Card>
    );
  }

  if (generationState === 'success') {
    return (
      <Card className="border border-white/10 bg-card/70 backdrop-blur-sm shadow-md">
        <CardContent className="p-0">
          <VideoSuccess 
            onWatch={handleWatch}
            onDownload={handleDownload}
            onSchedule={handleSchedule}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-white/10 bg-card/70 backdrop-blur-sm shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl">Tell Us Your Vision</CardTitle>
        <CardDescription className="text-base">
          Describe what you'd like to create and we'll bring it to life
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <VideoTemplates onSelect={setVideoIdea} />
        
        <div className="space-y-2">
          <Label htmlFor="video-idea" className="text-foreground">
            Describe Your Video
          </Label>
          <Textarea
            id="video-idea"
            placeholder="Write about teamwork and collaboration in the workplace..."
            value={videoIdea}
            onChange={(e) => setVideoIdea(e.target.value)}
            className="min-h-[120px] bg-background border-accent/20 focus:border-primary transition-colors"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-foreground">Select Video Style</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {videoStyles.map((style) => (
              <VideoStyleCard 
                key={style.id}
                title={style.title}
                icon={style.icon}
                description={style.description}
                imageUrl={style.imageUrl}
                isSelected={selectedStyle === style.id}
                onClick={() => setSelectedStyle(style.id as VideoStyle)}
              />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Separator className="border-white/10" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-foreground">Aspect Ratio</Label>
              <AspectRatioSelector 
                value={aspectRatio} 
                onChange={setAspectRatio} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-foreground">
                Video Duration
              </Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger id="duration" className="bg-background border-accent/20">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent className="bg-background border-accent/20">
                  <SelectItem value="15">15 seconds</SelectItem>
                  <SelectItem value="30">30 seconds</SelectItem>
                  <SelectItem value="60">60 seconds</SelectItem>
                  <SelectItem value="120">2 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language" className="text-foreground">
                Language
              </Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="language" className="bg-background border-accent/20">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent className="bg-background border-accent/20">
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="ja">Japanese</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <AdvancedOptions onOptionsChange={setAdvancedOptions} />

        <div className="flex items-center justify-center gap-4 pt-4">
          <Button
            onClick={resetForm}
            variant="outline"
            className="border-white/10 bg-background hover:bg-background/80"
          >
            <CircleX className="w-4 h-4 mr-2" />
            Reset
          </Button>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !videoIdea || !selectedStyle}
            className={`min-w-[180px] bg-gradient-primary hover:bg-primary/90 text-white group relative ${
              isGenerating ? 'animate-pulse' : ''
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                  <div className="absolute inset-0 translate-x-[-100%] animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                </div>
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                Generate Video
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

