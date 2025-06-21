
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Upload, Palette, Type, Mic, Save } from 'lucide-react';
import { useVideoProduction } from '@/hooks/useVideoProduction';

interface BrandSettingsProps {
  brandSettings: any;
}

export function BrandSettings({ brandSettings }: BrandSettingsProps) {
  const { updateBrandSettings } = useVideoProduction();
  const [settings, setSettings] = useState({
    brand_name: '',
    logo_url: '',
    primary_color: '#6366f1',
    secondary_color: '#8b5cf6',
    font_family: 'Inter',
    voice_id: '',
    brand_style: 'modern'
  });

  useEffect(() => {
    if (brandSettings) {
      setSettings({
        brand_name: brandSettings.brand_name || '',
        logo_url: brandSettings.logo_url || '',
        primary_color: brandSettings.primary_color || '#6366f1',
        secondary_color: brandSettings.secondary_color || '#8b5cf6',
        font_family: brandSettings.font_family || 'Inter',
        voice_id: brandSettings.voice_id || '',
        brand_style: brandSettings.brand_style || 'modern'
      });
    }
  }, [brandSettings]);

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    await updateBrandSettings(settings);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Brand Customization</h3>
        <p className="text-muted-foreground">
          Configure your brand identity for consistent video styling across all content
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Brand Identity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Brand Identity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="brand_name">Brand Name</Label>
              <Input
                id="brand_name"
                placeholder="Your brand name"
                value={settings.brand_name}
                onChange={(e) => handleChange('brand_name', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo_url">Logo URL</Label>
              <div className="flex gap-2">
                <Input
                  id="logo_url"
                  placeholder="https://example.com/logo.png"
                  value={settings.logo_url}
                  onChange={(e) => handleChange('logo_url', e.target.value)}
                />
                <Button size="icon" variant="outline">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primary_color">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="primary_color"
                    type="color"
                    value={settings.primary_color}
                    onChange={(e) => handleChange('primary_color', e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={settings.primary_color}
                    onChange={(e) => handleChange('primary_color', e.target.value)}
                    placeholder="#6366f1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondary_color">Secondary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="secondary_color"
                    type="color"
                    value={settings.secondary_color}
                    onChange={(e) => handleChange('secondary_color', e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={settings.secondary_color}
                    onChange={(e) => handleChange('secondary_color', e.target.value)}
                    placeholder="#8b5cf6"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Typography & Voice */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Type className="h-4 w-4" />
              Typography & Voice
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="font_family">Font Family</Label>
              <Select value={settings.font_family} onValueChange={(value) => handleChange('font_family', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Inter">Inter (Modern)</SelectItem>
                  <SelectItem value="Roboto">Roboto (Clean)</SelectItem>
                  <SelectItem value="Poppins">Poppins (Friendly)</SelectItem>
                  <SelectItem value="Playfair Display">Playfair (Elegant)</SelectItem>
                  <SelectItem value="Montserrat">Montserrat (Professional)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand_style">Brand Style</Label>
              <Select value={settings.brand_style} onValueChange={(value) => handleChange('brand_style', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="corporate">Corporate</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="bold">Bold</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="voice_id">ElevenLabs Voice</Label>
              <Select value={settings.voice_id} onValueChange={(value) => handleChange('voice_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a voice" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rachel">Rachel (Professional Female)</SelectItem>
                  <SelectItem value="drew">Drew (Warm Male)</SelectItem>
                  <SelectItem value="clyde">Clyde (Authoritative)</SelectItem>
                  <SelectItem value="dave">Dave (Conversational)</SelectItem>
                  <SelectItem value="fin">Fin (Energetic)</SelectItem>
                  <SelectItem value="sarah">Sarah (Friendly)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Brand Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Brand Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-6 rounded-lg border-2 border-dashed" style={{ borderColor: settings.primary_color }}>
            <div className="text-center space-y-4">
              {settings.brand_name && (
                <h3 
                  className="text-2xl font-bold"
                  style={{ 
                    color: settings.primary_color,
                    fontFamily: settings.font_family 
                  }}
                >
                  {settings.brand_name}
                </h3>
              )}
              <div className="flex justify-center gap-4">
                <Badge style={{ backgroundColor: settings.primary_color }}>
                  Primary Color
                </Badge>
                <Badge style={{ backgroundColor: settings.secondary_color }}>
                  Secondary Color
                </Badge>
              </div>
              <p 
                className="text-sm"
                style={{ fontFamily: settings.font_family }}
              >
                Sample text using {settings.font_family} font family
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Brand Settings
        </Button>
      </div>
    </div>
  );
}
