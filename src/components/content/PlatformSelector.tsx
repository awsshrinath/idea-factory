
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Platform } from '@/types/content';
import {
  Twitter,
  Facebook,
  Linkedin,
  Youtube,
  MessageSquare
} from 'lucide-react';

interface PlatformSelectorProps {
  selectedPlatforms: Platform[];
  onPlatformChange: (platforms: Platform[]) => void;
}

const platforms = [
  { id: 'twitter' as Platform, name: 'Twitter', icon: Twitter, color: 'from-blue-500/20 to-cyan-500/10' },
  { id: 'facebook' as Platform, name: 'Facebook', icon: Facebook, color: 'from-blue-600/20 to-indigo-500/10' },
  { id: 'instagram' as Platform, name: 'Instagram', icon: MessageSquare, color: 'from-pink-500/20 to-purple-500/10' },
  { id: 'linkedin' as Platform, name: 'LinkedIn', icon: Linkedin, color: 'from-blue-700/20 to-blue-500/10' },
  { id: 'youtube' as Platform, name: 'YouTube', icon: Youtube, color: 'from-red-500/20 to-pink-500/10' },
];

export function PlatformSelector({ selectedPlatforms, onPlatformChange }: PlatformSelectorProps) {
  const togglePlatform = (platform: Platform) => {
    const isSelected = selectedPlatforms.includes(platform);
    if (isSelected) {
      onPlatformChange(selectedPlatforms.filter(p => p !== platform));
    } else {
      onPlatformChange([...selectedPlatforms, platform]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="premium-subheading text-sm">Select Platforms</label>
        <Badge variant="outline" className="bg-white/5">
          {selectedPlatforms.length} selected
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {platforms.map((platform) => {
          const Icon = platform.icon;
          const isSelected = selectedPlatforms.includes(platform.id);
          
          return (
            <Button
              key={platform.id}
              variant="outline"
              onClick={() => togglePlatform(platform.id)}
              className={cn(
                "h-auto p-4 flex flex-col items-center gap-2 premium-card border border-white/10 hover:border-white/20 transition-all duration-300",
                isSelected && "bg-gradient-to-br border-purple-500/30 shadow-[0_0_15px_rgba(147,51,234,0.15)]",
                !isSelected && `bg-gradient-to-br ${platform.color}`
              )}
            >
              <Icon className={cn(
                "h-5 w-5",
                isSelected ? "text-purple-400" : "text-foreground/60"
              )} />
              <span className={cn(
                "text-xs font-medium",
                isSelected ? "text-purple-300" : "text-foreground/80"
              )}>
                {platform.name}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
