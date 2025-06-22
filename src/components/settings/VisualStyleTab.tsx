
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, Palette, Layout, Video, Heart } from 'lucide-react';
import { useState } from 'react';

export function VisualStyleTab() {
  const [selectedPhotoStyle, setSelectedPhotoStyle] = useState('modern');
  const [selectedColorScheme, setSelectedColorScheme] = useState('brand-focused');
  const [selectedComposition, setSelectedComposition] = useState('rule-of-thirds');
  const [favoriteTemplates, setFavoriteTemplates] = useState(['minimal-quote', 'product-showcase']);

  const photoStyles = [
    { id: 'modern', label: 'Modern & Clean', description: 'Minimalist, contemporary aesthetic' },
    { id: 'vintage', label: 'Vintage & Retro', description: 'Classic, nostalgic feel' },
    { id: 'minimalist', label: 'Minimalist', description: 'Simple, focused compositions' },
    { id: 'bold', label: 'Bold & Vibrant', description: 'High contrast, eye-catching' }
  ];

  const colorSchemes = [
    { id: 'vibrant', label: 'Vibrant', description: 'Bright, energetic colors' },
    { id: 'muted', label: 'Muted', description: 'Subtle, sophisticated tones' },
    { id: 'monochrome', label: 'Monochrome', description: 'Black, white, and grays' },
    { id: 'brand-focused', label: 'Brand Colors', description: 'Uses your brand palette' }
  ];

  const compositionStyles = [
    { id: 'centered', label: 'Centered', description: 'Symmetrical, balanced layouts' },
    { id: 'rule-of-thirds', label: 'Rule of Thirds', description: 'Classic photography principle' },
    { id: 'creative', label: 'Creative Angles', description: 'Dynamic, unique perspectives' }
  ];

  const templateCategories = [
    { id: 'minimal-quote', label: 'Minimal Quote' },
    { id: 'product-showcase', label: 'Product Showcase' },
    { id: 'before-after', label: 'Before/After' },
    { id: 'carousel-tips', label: 'Carousel Tips' },
    { id: 'infographic', label: 'Infographic' },
    { id: 'team-photo', label: 'Team Photo' },
    { id: 'event-promo', label: 'Event Promo' },
    { id: 'testimonial', label: 'Testimonial' }
  ];

  const videoStyles = [
    { id: 'smooth', label: 'Smooth Transitions', description: 'Gentle, flowing animations' },
    { id: 'dynamic', label: 'Dynamic Cuts', description: 'Fast-paced, energetic' },
    { id: 'minimal', label: 'Minimal Motion', description: 'Subtle, professional' },
    { id: 'creative', label: 'Creative Effects', description: 'Artistic, unique style' }
  ];

  return (
    <div className="space-y-8">
      {/* Photography Style */}
      <Card className="premium-card border border-gray-800">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30">
              <Camera className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-white">Photography Style</CardTitle>
              <CardDescription className="text-gray-400">
                Choose your preferred visual style for generated images
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {photoStyles.map((style) => (
              <div
                key={style.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                  selectedPhotoStyle === style.id
                    ? 'border-purple-500 bg-purple-600/10'
                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                }`}
                onClick={() => setSelectedPhotoStyle(style.id)}
              >
                <h3 className={`font-semibold mb-2 ${
                  selectedPhotoStyle === style.id ? 'text-white' : 'text-gray-300'
                }`}>
                  {style.label}
                </h3>
                <p className="text-sm text-gray-400">{style.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Color Scheme */}
      <Card className="premium-card border border-gray-800">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/30">
              <Palette className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-white">Color Scheme Preferences</CardTitle>
              <CardDescription className="text-gray-400">
                Define your preferred color approach for visual content
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {colorSchemes.map((scheme) => (
              <div
                key={scheme.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                  selectedColorScheme === scheme.id
                    ? 'border-purple-500 bg-purple-600/10'
                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                }`}
                onClick={() => setSelectedColorScheme(scheme.id)}
              >
                <h3 className={`font-semibold mb-2 ${
                  selectedColorScheme === scheme.id ? 'text-white' : 'text-gray-300'
                }`}>
                  {scheme.label}
                </h3>
                <p className="text-sm text-gray-400">{scheme.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Composition Style */}
      <Card className="premium-card border border-gray-800">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/30">
              <Layout className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-white">Composition Preferences</CardTitle>
              <CardDescription className="text-gray-400">
                Select your preferred layout and composition style
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {compositionStyles.map((comp) => (
              <div
                key={comp.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                  selectedComposition === comp.id
                    ? 'border-purple-500 bg-purple-600/10'
                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                }`}
                onClick={() => setSelectedComposition(comp.id)}
              >
                <h3 className={`font-semibold mb-2 ${
                  selectedComposition === comp.id ? 'text-white' : 'text-gray-300'
                }`}>
                  {comp.label}
                </h3>
                <p className="text-sm text-gray-400">{comp.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Video Style */}
      <Card className="premium-card border border-gray-800">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-red-600/20 to-pink-600/20 border border-red-500/30">
              <Video className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-white">Video Style Preferences</CardTitle>
              <CardDescription className="text-gray-400">
                Choose your preferred video animation and transition styles
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-3">
              <Label className="text-white">Animation Style</Label>
              <Select>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-300">
                  <SelectValue placeholder="Select animation style" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {videoStyles.map((style) => (
                    <SelectItem key={style.id} value={style.id}>
                      {style.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-white">Text Overlay Style</Label>
              <Select>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-300">
                  <SelectValue placeholder="Select text overlay style" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="bold">Bold & Prominent</SelectItem>
                  <SelectItem value="subtle">Subtle & Elegant</SelectItem>
                  <SelectItem value="animated">Animated Text</SelectItem>
                  <SelectItem value="minimal">Minimal Text</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Template Favorites */}
      <Card className="premium-card border border-gray-800">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-orange-600/20 to-yellow-600/20 border border-orange-500/30">
              <Heart className="h-5 w-5 text-orange-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-white">Favorite Templates</CardTitle>
              <CardDescription className="text-gray-400">
                Mark your favorite templates for quick access
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {templateCategories.map((template) => (
              <Badge
                key={template.id}
                variant={favoriteTemplates.includes(template.id) ? "default" : "secondary"}
                className={`cursor-pointer transition-colors ${
                  favoriteTemplates.includes(template.id)
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                }`}
                onClick={() => {
                  setFavoriteTemplates(prev => 
                    prev.includes(template.id)
                      ? prev.filter(t => t !== template.id)
                      : [...prev, template.id]
                  );
                }}
              >
                {favoriteTemplates.includes(template.id) && <Heart className="h-3 w-3 mr-1 fill-current" />}
                {template.label}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="premium-button bg-gradient-to-r from-purple-600 to-indigo-600">
          Save Visual Preferences
        </Button>
      </div>
    </div>
  );
}
