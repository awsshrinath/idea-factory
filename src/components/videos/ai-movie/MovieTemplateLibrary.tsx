
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Star, Crown } from 'lucide-react';

interface MovieTemplateLibraryProps {
  onTemplateSelect: (template: any) => void;
}

const templates = [
  {
    id: 'product-launch',
    name: 'Product Launch Video',
    category: 'promotional',
    description: 'Professional product introduction with features showcase',
    preview: '/placeholder.svg',
    isPremium: false,
    genre: 'promotional',
    audience: 'professional',
    style: 'corporate',
    duration: 90
  },
  {
    id: 'company-story',
    name: 'Company Story',
    category: 'corporate',
    description: 'Tell your company\'s journey and mission',
    preview: '/placeholder.svg',
    isPremium: true,
    genre: 'documentary',
    audience: 'professional',
    style: 'cinematic',
    duration: 120
  },
  {
    id: 'social-story',
    name: 'Social Media Story',
    category: 'social',
    description: 'Engaging short-form content for social platforms',
    preview: '/placeholder.svg',
    isPremium: false,
    genre: 'explainer',
    audience: 'social',
    style: 'animated',
    duration: 30
  },
  {
    id: 'educational',
    name: 'Educational Content',
    category: 'education',
    description: 'Clear instructional content with visual aids',
    preview: '/placeholder.svg',
    isPremium: false,
    genre: 'educational',
    audience: 'educational',
    style: 'documentary',
    duration: 180
  }
];

export function MovieTemplateLibrary({ onTemplateSelect }: MovieTemplateLibraryProps) {
  const handleTemplateSelect = (template: any) => {
    onTemplateSelect({
      topic: `Create a ${template.name.toLowerCase()} about [your topic here]`,
      genre: template.genre,
      duration: template.duration,
      audience: template.audience,
      style: template.style,
      title: template.name
    });
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Star className="h-6 w-6 text-amber-500" />
          Movie Templates
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {templates.map((template) => (
            <Card key={template.id} className="bg-gray-900/50 border-gray-700 hover:border-amber-500/50 transition-colors cursor-pointer group">
              <CardContent className="p-4">
                <div className="relative mb-3">
                  <div className="aspect-video bg-gray-700 rounded-lg flex items-center justify-center relative overflow-hidden">
                    <img 
                      src={template.preview} 
                      alt={template.name}
                      className="w-full h-full object-cover opacity-50"
                    />
                    <Play className="absolute h-8 w-8 text-white group-hover:scale-110 transition-transform" />
                  </div>
                  {template.isPremium && (
                    <Badge className="absolute top-2 right-2 bg-amber-500/20 text-amber-400 border-amber-500/30">
                      <Crown className="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                </div>
                
                <h3 className="text-white font-semibold text-sm mb-2">{template.name}</h3>
                <p className="text-gray-400 text-xs mb-3 line-clamp-2">{template.description}</p>
                
                <div className="flex items-center justify-between">
                  <Badge className="bg-gray-700 text-gray-300 text-xs">
                    {Math.floor(template.duration / 60)}m {template.duration % 60}s
                  </Badge>
                  <Button
                    size="sm"
                    onClick={() => handleTemplateSelect(template)}
                    className="bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border-amber-500/30"
                    variant="outline"
                  >
                    Use Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
