import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface VideoSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
}

export function VideoSuggestions({ onSuggestionClick }: VideoSuggestionsProps) {
  const suggestions = [
    {
      title: "Corporate Training Video",
      description: "Create a corporate training video about effective team collaboration"
    },
    {
      title: "Product Launch Video",
      description: "Design an engaging product launch video for a new tech gadget"
    },
    {
      title: "Educational Tutorial",
      description: "Generate an educational tutorial about sustainable living"
    }
  ];

  return (
    <Card className="w-full bg-gradient-card border border-white/10 shadow-card hover:shadow-card-hover transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-lg text-foreground">Suggestions</CardTitle>
        <CardDescription className="text-muted-foreground">Click to use these example prompts</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {suggestions.map((suggestion) => (
          <Button
            key={suggestion.title}
            variant="ghost"
            className="w-full justify-start h-auto whitespace-normal text-left p-4 hover:bg-muted/20 
                       transition-colors border border-white/5 rounded-lg"
            onClick={() => onSuggestionClick(suggestion.description)}
          >
            <div className="space-y-1">
              <h4 className="font-medium text-sm text-foreground">{suggestion.title}</h4>
              <p className="text-sm text-muted-foreground leading-snug">
                {suggestion.description}
              </p>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}