
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface Template {
  id: string;
  title: string;
  description: string;
  prompt: string;
  category: string;
  platforms: string[];
}

const templates: Template[] = [
  {
    id: '1',
    title: 'Product Launch',
    description: 'Announce a new product with excitement',
    prompt: 'Create an exciting announcement for our new product launch, highlighting key features and benefits',
    category: 'Marketing',
    platforms: ['Twitter', 'LinkedIn', 'Facebook']
  },
  {
    id: '2', 
    title: 'Behind the Scenes',
    description: 'Share company culture and team insights',
    prompt: 'Share behind-the-scenes content showing our team culture and work environment',
    category: 'Culture',
    platforms: ['Instagram', 'LinkedIn']
  },
  {
    id: '3',
    title: 'Industry Insight',
    description: 'Share expertise and thought leadership',
    prompt: 'Share valuable insights about industry trends and our expert perspective',
    category: 'Thought Leadership',
    platforms: ['LinkedIn', 'Twitter']
  },
  {
    id: '4',
    title: 'Customer Success',
    description: 'Highlight customer achievements',
    prompt: 'Celebrate a customer success story and how our solution helped them achieve their goals',
    category: 'Social Proof',
    platforms: ['LinkedIn', 'Twitter', 'Facebook']
  },
  {
    id: '5',
    title: 'Educational Content',
    description: 'Share knowledge and tutorials',
    prompt: 'Create educational content that teaches our audience something valuable in our field',
    category: 'Education',
    platforms: ['YouTube', 'LinkedIn']
  },
  {
    id: '6',
    title: 'Community Engagement',
    description: 'Start conversations with your audience',
    prompt: 'Create engaging content that encourages community discussion and interaction',
    category: 'Engagement',
    platforms: ['Twitter', 'Facebook', 'Instagram']
  }
];

interface PromptTemplatesProps {
  onSelectTemplate: (prompt: string) => void;
}

export function PromptTemplates({ onSelectTemplate }: PromptTemplatesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(templates.map(t => t.category)))];
  
  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="premium-subheading text-lg">Content Templates</h3>
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={cn(
                "cursor-pointer transition-all duration-200 hover:scale-105",
                selectedCategory === category 
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 border-purple-500/20" 
                  : "bg-white/5 hover:bg-white/10 border-white/10"
              )}
              onClick={() => setSelectedCategory(category)}
            >
              {category === 'all' ? 'All' : category}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
          <Card 
            key={template.id}
            className="premium-card premium-card-hover border border-white/10 p-4 cursor-pointer transition-all duration-300 hover:shadow-[0_0_20px_rgba(147,51,234,0.15)] hover:border-purple-500/30 group"
            onClick={() => onSelectTemplate(template.prompt)}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="premium-subheading text-sm font-semibold group-hover:text-purple-300 transition-colors">
                    {template.title}
                  </h4>
                  <p className="premium-caption text-xs mt-1 text-muted-foreground">
                    {template.description}
                  </p>
                </div>
                <Badge variant="outline" className="bg-white/5 text-xs">
                  {template.category}
                </Badge>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {template.platforms.map((platform) => (
                  <Badge 
                    key={platform} 
                    variant="secondary" 
                    className="text-[10px] px-2 py-0.5 bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    {platform}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
