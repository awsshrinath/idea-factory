
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Star, CheckCircle } from 'lucide-react';

interface TemplateSelectorProps {
  templates: any[];
  selectedTemplate: any;
  onSelect: (template: any) => void;
}

export function TemplateSelector({ templates, selectedTemplate, onSelect }: TemplateSelectorProps) {
  const groupedTemplates = templates.reduce((acc, template) => {
    if (!acc[template.niche]) {
      acc[template.niche] = [];
    }
    acc[template.niche].push(template);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Professional Video Templates</h3>
        <p className="text-muted-foreground">
          Choose from industry-specific templates optimized for different content types
        </p>
      </div>

      {Object.entries(groupedTemplates).map(([niche, nicheTemplates]) => (
        <div key={niche} className="space-y-3">
          <h4 className="font-medium capitalize text-primary">{niche} Templates</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(nicheTemplates as any[]).map((template: any) => (
              <Card
                key={template.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedTemplate?.id === template.id
                    ? 'ring-2 ring-primary bg-primary/5'
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => onSelect(template)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      {template.name}
                      {selectedTemplate?.id === template.id && (
                        <CheckCircle className="h-4 w-4 text-primary" />
                      )}
                    </CardTitle>
                    {template.is_premium && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        <Star className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Play className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Used {template.usage_count || 0} times
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant={selectedTemplate?.id === template.id ? "default" : "outline"}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(template);
                      }}
                    >
                      {selectedTemplate?.id === template.id ? 'Selected' : 'Select'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
