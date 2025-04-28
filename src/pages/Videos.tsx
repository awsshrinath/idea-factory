
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { VideoSuggestions } from "@/components/videos/VideoSuggestions";
import { VideoTemplates } from "@/components/videos/VideoTemplates";
import { TipsSection } from "@/components/videos/TipsSection";
import { VideoExampleCarousel } from "@/components/videos/VideoExampleCarousel";
import { RecentVideos } from "@/components/videos/RecentVideos";
import { VideoStyleCard } from "@/components/videos/VideoStyleCard";
import { AspectRatioSelector } from "@/components/videos/AspectRatioSelector";
import { AdvancedOptions, AdvancedVideoOptions } from "@/components/videos/AdvancedOptions";
import { EmptyRecentVideos } from "@/components/videos/EmptyRecentVideos";
import { 
  Wand2, 
  Film,
  Play,
  ArrowRight,
  PencilRuler,
  VideoIcon,
  BarChart3,
  Type,
  SquarePen,
  CircleX,
  Loader2
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

type VideoStyle = "cinematic" | "animated" | "socialReel" | "explainer" | "whiteboard" | "typography";

export function Videos() {
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

  const handleGenerateVideo = () => {
    setIsGenerating(true);
    // Simulate generation process
    setTimeout(() => {
      setIsGenerating(false);
    }, 3000);
  };

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
  };

  const videoStyles = [
    { 
      id: "cinematic" as VideoStyle, 
      title: "Cinematic", 
      icon: Film,
      description: "Professional quality with cinematic transitions and effects",
      imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=300&q=80" 
    },
    { 
      id: "animated" as VideoStyle, 
      title: "Animated", 
      icon: Play,
      description: "Engaging animated graphics and dynamic movement",
      imageUrl: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?auto=format&fit=crop&w=300&q=80"  
    },
    { 
      id: "socialReel" as VideoStyle, 
      title: "Social Reel", 
      icon: ArrowRight,
      description: "Vertical format optimized for social media engagement",
      imageUrl: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=300&q=80"  
    },
    { 
      id: "explainer" as VideoStyle, 
      title: "Explainer", 
      icon: BarChart3,
      description: "Clear and educational with helpful visuals",
      imageUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=300&q=80"  
    },
    { 
      id: "whiteboard" as VideoStyle, 
      title: "Whiteboard Sketch", 
      icon: SquarePen,
      description: "Hand-drawn illustration style with sketching animations",
      imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=300&q=80"  
    },
    { 
      id: "typography" as VideoStyle, 
      title: "Kinetic Typography", 
      icon: Type,
      description: "Dynamic animated text with motion graphics",
      imageUrl: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=300&q=80" 
    }
  ];

  const hasRecentVideos = false; // This would be determined by checking actual videos

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-background via-background/95 to-background/90">
      <Sidebar />
      <main className="flex-1 ml-64">
        <div className="max-w-[1200px] mx-auto px-6 py-8 space-y-8">
          {/* Header Section */}
          <div>
            <h1 className="text-4xl font-heading font-bold text-foreground bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent animate-gradient">
              Create Your Video Story
            </h1>
            <p className="text-xl text-muted-foreground mt-2 font-sans">
              Transform your ideas into engaging videos with AI
            </p>
          </div>

          {/* Example Videos Carousel */}
          <VideoExampleCarousel />

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Creative Input */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border border-white/10 bg-card/70 backdrop-blur-sm shadow-md">
                <CardHeader>
                  <CardTitle className="text-2xl">Tell Us Your Vision</CardTitle>
                  <CardDescription className="text-base">
                    Describe what you'd like to create and we'll bring it to life
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Templates */}
                  <VideoTemplates onSelect={setVideoIdea} />
                  
                  {/* Input Area */}
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

                  {/* Video Styles */}
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
                          onClick={() => setSelectedStyle(style.id)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Video Settings */}
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

                  {/* Advanced Options */}
                  <AdvancedOptions onOptionsChange={setAdvancedOptions} />

                  {/* Action Buttons */}
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
                      onClick={handleGenerateVideo}
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

              {/* Recent Videos Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground">Your Recent Videos</h2>
                  <Button variant="outline" size="sm" className="border-white/10 bg-background hover:bg-background/80">
                    View All
                  </Button>
                </div>
                
                {hasRecentVideos ? (
                  <RecentVideos />
                ) : (
                  <EmptyRecentVideos />
                )}
              </div>
            </div>

            {/* Right Column - Suggestions & Tips */}
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
