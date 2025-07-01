
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Clock, Users, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const trendingSuggestions = [
  {
    id: 1,
    topic: 'AI in Content Creation',
    category: 'Technology',
    engagement: '2.3K',
    timeframe: '24h',
    difficulty: 'Medium',
    description: 'How artificial intelligence is transforming the way we create and consume content',
    hashtags: ['#AI', '#ContentCreation', '#Technology']
  },
  {
    id: 2,
    topic: 'Remote Work Productivity',
    category: 'Business',
    engagement: '1.8K',
    timeframe: '12h',
    difficulty: 'Easy',
    description: 'Tips and strategies for maintaining productivity while working remotely',
    hashtags: ['#RemoteWork', '#Productivity', '#WorkFromHome']
  },
  {
    id: 3,
    topic: 'Sustainable Business Practices',
    category: 'Environment',
    engagement: '3.1K',
    timeframe: '6h',
    difficulty: 'Hard',
    description: 'How companies are adopting eco-friendly practices for long-term success',
    hashtags: ['#Sustainability', '#GreenBusiness', '#Environment']
  },
  {
    id: 4,
    topic: 'Digital Marketing Trends 2024',
    category: 'Marketing',
    engagement: '4.2K',
    timeframe: '8h',
    difficulty: 'Medium',
    description: 'Emerging trends and strategies shaping digital marketing this year',
    hashtags: ['#DigitalMarketing', '#Trends2024', '#Marketing']
  }
];

interface TrendingSuggestionsProps {
  onTopicSelect: (topic: string) => void;
}

export function TrendingSuggestions({ onTopicSelect }: TrendingSuggestionsProps) {
  return (
    <Card className="premium-card border border-gray-800">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/30">
            <TrendingUp className="h-5 w-5 text-green-400" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-white">Trending Topics</CardTitle>
            <CardDescription className="text-gray-400">
              Hot topics your audience is talking about
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {trendingSuggestions.map((suggestion) => (
          <Card
            key={suggestion.id}
            className="premium-card-hover cursor-pointer bg-gray-800/50 border border-gray-700 hover:border-gray-600 transition-all duration-300"
            onClick={() => onTopicSelect(suggestion.description)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">{suggestion.topic}</h3>
                  <p className="text-sm text-gray-400 mb-2">{suggestion.description}</p>
                </div>
                <Badge 
                  variant="secondary" 
                  className={cn(
                    "ml-2",
                    suggestion.difficulty === 'Easy' && "bg-green-600/10 text-green-400 border-green-500/20",
                    suggestion.difficulty === 'Medium' && "bg-yellow-600/10 text-yellow-400 border-yellow-500/20",
                    suggestion.difficulty === 'Hard' && "bg-red-600/10 text-red-400 border-red-500/20"
                  )}
                >
                  {suggestion.difficulty}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center space-x-1">
                    <Users className="h-3 w-3" />
                    <span>{suggestion.engagement}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{suggestion.timeframe}</span>
                  </span>
                  <Badge variant="outline" className="bg-gray-700 border-gray-600 text-gray-300">
                    {suggestion.category}
                  </Badge>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {suggestion.hashtags.map((hashtag) => (
                  <span key={hashtag} className="text-xs text-blue-400 bg-blue-600/10 px-2 py-1 rounded">
                    {hashtag}
                  </span>
                ))}
              </div>
              
              <Button 
                size="sm" 
                variant="ghost" 
                className="w-full text-purple-400 hover:text-white hover:bg-purple-600/20 transition-colors"
              >
                <Zap className="h-3 w-3 mr-1" />
                Use This Topic
              </Button>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
