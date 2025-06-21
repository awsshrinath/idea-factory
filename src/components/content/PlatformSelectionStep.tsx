
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { Platform } from '@/types/content';
import { cn } from '@/lib/utils';

const platformData = [
  {
    id: 'instagram' as Platform,
    name: 'Instagram',
    description: 'Visual storytelling with photos and videos',
    color: 'from-purple-600 to-pink-600',
    icon: '📸',
    features: ['Stories', 'Reels', 'Posts', 'IGTV'],
    audience: '1B+ users',
    bestFor: 'Visual content, lifestyle, fashion'
  },
  {
    id: 'linkedin' as Platform,
    name: 'LinkedIn',
    description: 'Professional networking and B2B content',
    color: 'from-blue-600 to-blue-500',
    icon: '💼',
    features: ['Articles', 'Posts', 'Stories', 'Events'],
    audience: '900M+ professionals',
    bestFor: 'B2B, thought leadership, careers'
  },
  {
    id: 'twitter' as Platform,
    name: 'Twitter',
    description: 'Real-time conversations and trending topics',
    color: 'from-sky-500 to-sky-400',
    icon: '🐦',
    features: ['Tweets', 'Threads', 'Spaces', 'Lists'],
    audience: '450M+ users',
    bestFor: 'News, opinions, real-time updates'
  },
  {
    id: 'facebook' as Platform,
    name: 'Facebook',
    description: 'Community building and broad reach',
    color: 'from-blue-700 to-blue-600',
    icon: '👥',
    features: ['Posts', 'Stories', 'Groups', 'Events'],
    audience: '2.9B+ users',
    bestFor: 'Community, events, broad audience'
  },
  {
    id: 'tiktok' as Platform,
    name: 'TikTok',
    description: 'Short-form video content for Gen Z',
    color: 'from-gray-900 to-gray-800',
    icon: '🎵',
    features: ['Videos', 'Lives', 'Duets', 'Sounds'],
    audience: '1B+ users',
    bestFor: 'Viral content, entertainment, trends'
  },
  {
    id: 'youtube' as Platform,
    name: 'YouTube',
    description: 'Long-form video content and tutorials',
    color: 'from-red-600 to-red-500',
    icon: '📺',
    features: ['Videos', 'Shorts', 'Lives', 'Community'],
    audience: '2.7B+ users',
    bestFor: 'Education, entertainment, tutorials'
  }
];

interface PlatformSelectionStepProps {
  selectedPlatforms: Platform[];
  onPlatformToggle: (platform: Platform) => void;
}

export function PlatformSelectionStep({ selectedPlatforms, onPlatformToggle }: PlatformSelectionStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Choose Your Platforms</h2>
        <p className="text-gray-400">Select the platforms where you'll publish this content</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {platformData.map((platform) => {
          const isSelected = selectedPlatforms.includes(platform.id);
          return (
            <Card
              key={platform.id}
              className={cn(
                "premium-card-hover cursor-pointer transition-all duration-300 border-2",
                isSelected 
                  ? "border-purple-500 bg-purple-600/10 shadow-lg shadow-purple-500/25" 
                  : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
              )}
              onClick={() => onPlatformToggle(platform.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={cn(
                    "p-3 rounded-xl bg-gradient-to-br text-2xl",
                    platform.color
                  )}>
                    {platform.icon}
                  </div>
                  {isSelected && (
                    <div className="p-1 rounded-full bg-purple-600">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
                
                <h3 className="font-bold text-white mb-2">{platform.name}</h3>
                <p className="text-sm text-gray-400 mb-3">{platform.description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Audience:</span>
                    <span className="text-gray-300">{platform.audience}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Best for: {platform.bestFor}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {platform.features.map((feature) => (
                      <Badge key={feature} variant="secondary" className="bg-gray-700 text-gray-300 text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
