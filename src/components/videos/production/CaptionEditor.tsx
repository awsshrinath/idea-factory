
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Type, Star, CheckCircle, Eye } from 'lucide-react';
import { useState } from 'react';

interface CaptionEditorProps {
  captionStyles: any[];
  selectedStyle: any;
  onSelect: (style: any) => void;
}

export function CaptionEditor({ captionStyles, selectedStyle, onSelect }: CaptionEditorProps) {
  const [captionSettings, setCaptionSettings] = useState({
    enabled: true,
    autoGenerate: true,
    multiLanguage: false,
    accessibility: true,
    keywordOptimization: true
  });

  const handleSettingChange = (key: string, value: boolean) => {
    setCaptionSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Smart Caption & Text System</h3>
        <p className="text-muted-foreground">
          Auto-generate professional captions with SEO optimization and accessibility features
        </p>
      </div>

      {/* Caption Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Type className="h-4 w-4" />
            Caption Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enabled">Enable Captions</Label>
              <p className="text-sm text-muted-foreground">Add professional captions to your video</p>
            </div>
            <Switch
              id="enabled"
              checked={captionSettings.enabled}
              onCheckedChange={(checked) => handleSettingChange('enabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="autoGenerate">Auto-Generate Captions</Label>
              <p className="text-sm text-muted-foreground">Automatically create captions from audio</p>
            </div>
            <Switch
              id="autoGenerate"
              checked={captionSettings.autoGenerate}
              onCheckedChange={(checked) => handleSettingChange('autoGenerate', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="multiLanguage">Multi-Language Support</Label>
              <p className="text-sm text-muted-foreground">Generate captions in multiple languages</p>
            </div>
            <Switch
              id="multiLanguage"
              checked={captionSettings.multiLanguage}
              onCheckedChange={(checked) => handleSettingChange('multiLanguage', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="accessibility">Accessibility Compliance</Label>
              <p className="text-sm text-muted-foreground">Ensure captions meet accessibility standards</p>
            </div>
            <Switch
              id="accessibility"
              checked={captionSettings.accessibility}
              onCheckedChange={(checked) => handleSettingChange('accessibility', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="keywordOptimization">SEO Keyword Integration</Label>
              <p className="text-sm text-muted-foreground">Optimize captions for search engines</p>
            </div>
            <Switch
              id="keywordOptimization"
              checked={captionSettings.keywordOptimization}
              onCheckedChange={(checked) => handleSettingChange('keywordOptimization', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Caption Styles */}
      <div className="space-y-4">
        <h4 className="font-medium text-primary">Caption Styles</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {captionStyles.map((style) => (
            <Card
              key={style.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedStyle?.id === style.id
                  ? 'ring-2 ring-primary bg-primary/5'
                  : 'hover:bg-muted/50'
              }`}
              onClick={() => onSelect(style)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    {style.name}
                    {selectedStyle?.id === style.id && (
                      <CheckCircle className="h-4 w-4 text-primary" />
                    )}
                  </CardTitle>
                  {style.is_premium && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      <Star className="h-3 w-3 mr-1" />
                      Pro
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Style Preview */}
                <div className="h-16 bg-gradient-to-br from-muted/50 to-muted rounded flex items-center justify-center relative">
                  <div
                    className="text-sm font-medium px-2 py-1 rounded"
                    style={{
                      color: style.style_data.color || '#ffffff',
                      backgroundColor: style.style_data.background || 'rgba(0,0,0,0.7)',
                      fontFamily: style.style_data.font || 'Inter'
                    }}
                  >
                    Sample Caption
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Type className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {style.style_data.font || 'Inter'} • {style.style_data.size || 24}px
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant={selectedStyle?.id === style.id ? "default" : "outline"}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(style);
                    }}
                  >
                    {selectedStyle?.id === style.id ? 'Selected' : 'Select'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {selectedStyle && (
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Selected Caption Style
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Type className="h-4 w-4" />
              <span className="font-medium">{selectedStyle.name}</span>
              <Badge variant="secondary">
                {selectedStyle.style_data.font} • {selectedStyle.style_data.size}px
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
