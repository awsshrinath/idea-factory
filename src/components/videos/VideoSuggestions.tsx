import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VideoIcon, BookOpen, PresentationIcon } from "lucide-react";

interface VideoSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
}

export function VideoSuggestions({ onSuggestionClick }: VideoSuggestionsProps) {
  const suggestions = [
    {
      title: "Corporate Training Video",
      description: "Create a corporate training video about effective team collaboration",
      icon: VideoIcon,
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=300&q=80"
    },
    {
      title: "Product Launch Video",
      description: "Design an engaging product launch video for a new tech gadget",
      icon: PresentationIcon,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=300&q=80"
    },
    {
      title: "Writing Better Prompts",
      description: "Learn how to write effective prompts for better video results",
      icon: BookOpen,
      image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=300&q=80"
    }
  ];

  return (
    <Card className="border border-white/10 bg-[#1F1F33]/50 backdrop-blur-sm shadow-lg transition-all duration-300">
      <CardHeader className="p-8 pb-0">
        <CardTitle className="text-xl font-semibold text-white">Suggestions</CardTitle>
        <CardDescription className="text-muted-foreground">Click to use these example prompts</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 p-8 pt-6">
        {suggestions.map((suggestion) => (
          <Button
            key={suggestion.title}
            variant="ghost"
            className="w-full justify-start h-auto whitespace-normal text-left p-6 hover:bg-muted/20 
                     transition-all duration-300 border border-white/5 rounded-lg group hover:scale-[1.02] hover:shadow-lg"
            onClick={() => onSuggestionClick(suggestion.description)}
          >
            <div className="relative w-16 h-12 rounded overflow-hidden mr-4 group-hover:ring-2 ring-primary/30 transition-all">
              <img 
                src={suggestion.image} 
                alt={suggestion.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <suggestion.icon className="w-4 h-4 text-primary" />
                <h4 className="font-semibold text-sm text-white">{suggestion.title}</h4>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                {suggestion.description}
              </p>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
