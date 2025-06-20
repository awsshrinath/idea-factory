import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Lightbulb, 
  TrendingUp, 
  Users, 
  Zap,
  ArrowRight
} from 'lucide-react';

const suggestions = [
  {
    title: "Engage Your Audience",
    description: "Create content that sparks conversations and builds community",
    icon: Users,
    action: "Explore Engagement Tips"
  },
  {
    title: "Go Viral",
    description: "Discover trending topics and create content that resonates",
    icon: TrendingUp,
    action: "See Trending Topics"
  },
  {
    title: "Boost Creativity",
    description: "Get inspired with AI-powered content ideas",
    icon: Lightbulb,
    action: "Generate Ideas"
  },
  {
    title: "Automate Tasks",
    description: "Streamline your workflow with AI automation",
    icon: Zap,
    action: "Explore Automation"
  }
];

export function CreatorSuggestions() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="premium-heading text-2xl">
          Creator Suggestions
        </h2>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {suggestions.map((suggestion) => (
          <Card 
            key={suggestion.title}
            className="premium-card premium-card-hover cursor-pointer transition-all duration-300 group hover:scale-[1.02] border border-white/10 bg-gradient-to-br from-slate-900/60 to-slate-800/40 backdrop-blur-sm"
          >
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-600/20 to-lime-600/20 flex items-center justify-center border border-green-500/20">
                  <suggestion.icon className="h-4 w-4 text-white" />
                </div>
                <CardTitle className="premium-subheading text-lg">
                  {suggestion.title}
                </CardTitle>
              </div>
              <CardDescription className="premium-body text-sm line-clamp-2">
                {suggestion.description}
              </CardDescription>
              <Button variant="secondary" className="w-full justify-between">
                {suggestion.action}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
