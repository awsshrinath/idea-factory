
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Rocket, Lightbulb, Heart, Newspaper, TrendingUp, Users } from 'lucide-react';

interface Template {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  gradient: string;
  category: string;
  prompt: string;
}

const templates: Template[] = [
  {
    id: 'product-launch',
    title: 'Product Launch',
    description: 'Announce new products with excitement and key benefits',
    icon: Rocket,
    gradient: 'from-purple-600 to-purple-500',
    category: 'Marketing',
    prompt: 'Create an exciting product launch announcement that highlights key features and benefits'
  },
  {
    id: 'thought-leadership',
    title: 'Thought Leadership',
    description: 'Share industry insights and expert perspectives',
    icon: Lightbulb,
    gradient: 'from-blue-600 to-blue-500',
    category: 'Professional',
    prompt: 'Write a thought-provoking piece about industry trends and insights'
  },
  {
    id: 'engagement',
    title: 'Engagement Post',
    description: 'Interactive content to boost audience participation',
    icon: Heart,
    gradient: 'from-green-600 to-green-500',
    category: 'Social',
    prompt: 'Create engaging content that encourages audience interaction and participation'
  },
  {
    id: 'industry-news',
    title: 'Industry News',
    description: 'Commentary on latest industry developments',
    icon: Newspaper,
    gradient: 'from-orange-600 to-orange-500',
    category: 'News',
    prompt: 'Provide commentary and analysis on recent industry news and developments'
  },
  {
    id: 'growth-tips',
    title: 'Growth Tips',
    description: 'Actionable advice for business growth',
    icon: TrendingUp,
    gradient: 'from-teal-600 to-teal-500',
    category: 'Education',
    prompt: 'Share practical tips and strategies for business growth and success'
  },
  {
    id: 'community',
    title: 'Community Building',
    description: 'Content that builds and nurtures community',
    icon: Users,
    gradient: 'from-pink-600 to-pink-500',
    category: 'Community',
    prompt: 'Create content that builds community and fosters meaningful connections'
  }
];

interface QuickTemplatesProps {
  onTemplateSelect: (template: Template) => void;
}

export function QuickTemplates({ onTemplateSelect }: QuickTemplatesProps) {
  return (
    <Card className="premium-card border border-gray-800 mb-8">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white">Quick Templates</CardTitle>
        <CardDescription className="text-gray-400">
          Jump-start your content creation with proven templates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => {
            const IconComponent = template.icon;
            return (
              <Card
                key={template.id}
                className="premium-card-hover cursor-pointer border border-gray-700 bg-gray-800/50 transition-all duration-300 hover:border-gray-600 hover:shadow-lg group"
                onClick={() => onTemplateSelect(template)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className={cn(
                      "p-2 rounded-lg bg-gradient-to-br",
                      `bg-gradient-to-br ${template.gradient}`,
                      "group-hover:scale-110 transition-transform duration-300"
                    )}>
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-white text-sm group-hover:text-purple-300 transition-colors">
                          {template.title}
                        </h3>
                        <Badge variant="secondary" className="bg-gray-700 text-gray-300 text-xs">
                          {template.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-2">
                        {template.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
