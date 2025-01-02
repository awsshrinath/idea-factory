import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface VideoSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
}

export function VideoSuggestions({ onSuggestionClick }: VideoSuggestionsProps) {
  const suggestions = [
    "Create a corporate training video about effective team collaboration",
    "Design an engaging product launch video for a new tech gadget",
    "Generate an educational tutorial about sustainable living",
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Suggestions</CardTitle>
        <CardDescription>Click to use these example prompts</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2">
        {suggestions.map((suggestion) => (
          <Button
            key={suggestion}
            variant="ghost"
            className="w-full justify-start h-auto py-2 px-3 text-left text-sm"
            onClick={() => onSuggestionClick(suggestion)}
          >
            {suggestion}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}