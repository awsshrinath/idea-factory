import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Lightbulb, TrendingUp, Users } from 'lucide-react';

const suggestions = [
  {
    title: "Trending AI Art Styles",
    description: "Create content using popular visual trends",
    type: "trend",
    icon: TrendingUp,
    color: "text-green-400",
    bgColor: "bg-green-400/10"
  },
  {
    title: "Creative Prompts",
    description: "Get inspired with unique prompt ideas",
    type: "idea",
    icon: Lightbulb,
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/10"
  },
  {
    title: "Community Favorites",
    description: "Explore styles loved by other creators",
    type: "community",
    icon: Users,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10"
  },
  {
    title: "Exclusive Tips",
    description: "Learn advanced techniques for better results",
    type: "tip",
    icon: Sparkles,
    color: "text-pink-400",
    bgColor: "bg-pink-400/10"
  }
];

export function CreatorSuggestions() {
  return (
    <Card className="premium-card premium-card-hover border border-white/10 shadow-lg backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Creator Suggestions</CardTitle>
        <CardDescription>Boost your creativity with these ideas</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.map((suggestion) => {
          const Icon = suggestion.icon;
          return (
            <div
              key={suggestion.title}
              className={`flex items-center gap-4 p-4 rounded-lg ${suggestion.bgColor} border border-white/10`}
            >
              <div className={`p-2 rounded-md ${suggestion.bgColor} flex items-center justify-center`}>
                <Icon className={`${suggestion.color} h-6 w-6`} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold">{suggestion.title}</h3>
                <p className="text-xs text-muted-foreground">{suggestion.description}</p>
              </div>
              <Button size="sm" variant="outline" className="whitespace-nowrap">
                Explore
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
