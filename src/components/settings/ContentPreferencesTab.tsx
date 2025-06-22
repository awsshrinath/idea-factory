
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { FileText, Image, Video, Calendar, Target, TrendingUp } from 'lucide-react';
import { useState } from 'react';

export function ContentPreferencesTab() {
  const [contentMix, setContentMix] = useState({
    educational: [60],
    promotional: [30],
    personal: [10]
  });

  const [contentThemes, setContentThemes] = useState({
    businessTips: [80],
    industryNews: [70],
    behindScenes: [40],
    productFeatures: [60]
  });

  const [selectedContentTypes, setSelectedContentTypes] = useState(['text', 'images']);
  const [platformPriority, setPlatformPriority] = useState(['linkedin', 'instagram', 'twitter']);

  const contentTypes = [
    { id: 'text', label: 'Text Posts', icon: FileText },
    { id: 'images', label: 'Images & Carousels', icon: Image },
    { id: 'videos', label: 'Videos & Reels', icon: Video },
    { id: 'stories', label: 'Stories', icon: Calendar }
  ];

  const platforms = [
    { id: 'linkedin', label: 'LinkedIn', color: 'bg-blue-600' },
    { id: 'instagram', label: 'Instagram', color: 'bg-purple-600' },
    { id: 'twitter', label: 'Twitter', color: 'bg-sky-500' },
    { id: 'facebook', label: 'Facebook', color: 'bg-blue-700' },
    { id: 'tiktok', label: 'TikTok', color: 'bg-gray-800' }
  ];

  return (
    <div className="space-y-8">
      {/* Content Types */}
      <Card className="premium-card border border-gray-800">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/30">
              <FileText className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-white">Default Content Types</CardTitle>
              <CardDescription className="text-gray-400">
                Choose your preferred content formats for generation
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {contentTypes.map(({ id, label, icon: Icon }) => (
              <div
                key={id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                  selectedContentTypes.includes(id)
                    ? 'border-purple-500 bg-purple-600/10'
                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                }`}
                onClick={() => {
                  setSelectedContentTypes(prev =>
                    prev.includes(id)
                      ? prev.filter(type => type !== id)
                      : [...prev, id]
                  );
                }}
              >
                <Icon className={`h-8 w-8 mb-3 ${
                  selectedContentTypes.includes(id) ? 'text-purple-400' : 'text-gray-400'
                }`} />
                <p className={`font-medium ${
                  selectedContentTypes.includes(id) ? 'text-white' : 'text-gray-300'
                }`}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content Length & Frequency */}
      <Card className="premium-card border border-gray-800">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/30">
              <Target className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-white">Content Preferences</CardTitle>
              <CardDescription className="text-gray-400">
                Set your default content length and posting frequency
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-white">Preferred Content Length</Label>
              <Select>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-300">
                  <SelectValue placeholder="Select content length" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="short">Short-form (50-150 words)</SelectItem>
                  <SelectItem value="medium">Medium-form (150-400 words)</SelectItem>
                  <SelectItem value="long">Long-form (400+ words)</SelectItem>
                  <SelectItem value="mixed">Mixed lengths</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-white">Posting Frequency</Label>
              <Select>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-300">
                  <SelectValue placeholder="Select posting frequency" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="3x-week">3 times per week</SelectItem>
                  <SelectItem value="2x-week">2 times per week</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="custom">Custom schedule</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Mix Ratios */}
      <Card className="premium-card border border-gray-800">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-orange-600/20 to-red-600/20 border border-orange-500/30">
              <TrendingUp className="h-5 w-5 text-orange-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-white">Content Mix Ratios</CardTitle>
              <CardDescription className="text-gray-400">
                Balance different types of content for optimal engagement
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-white">Educational Content</Label>
                <span className="text-sm text-gray-400">{contentMix.educational[0]}%</span>
              </div>
              <Slider
                value={contentMix.educational}
                onValueChange={(value) => setContentMix({...contentMix, educational: value})}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-white">Promotional Content</Label>
                <span className="text-sm text-gray-400">{contentMix.promotional[0]}%</span>
              </div>
              <Slider
                value={contentMix.promotional}
                onValueChange={(value) => setContentMix({...contentMix, promotional: value})}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-white">Personal/Behind-the-Scenes</Label>
                <span className="text-sm text-gray-400">{contentMix.personal[0]}%</span>
              </div>
              <Slider
                value={contentMix.personal}
                onValueChange={(value) => setContentMix({...contentMix, personal: value})}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Themes */}
      <Card className="premium-card border border-gray-800">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">Content Theme Preferences</CardTitle>
          <CardDescription className="text-gray-400">
            Adjust how often you want to focus on different content themes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-white">Business Tips & Advice</Label>
                <span className="text-sm text-gray-400">{contentThemes.businessTips[0]}%</span>
              </div>
              <Slider
                value={contentThemes.businessTips}
                onValueChange={(value) => setContentThemes({...contentThemes, businessTips: value})}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-white">Industry News & Trends</Label>
                <span className="text-sm text-gray-400">{contentThemes.industryNews[0]}%</span>
              </div>
              <Slider
                value={contentThemes.industryNews}
                onValueChange={(value) => setContentThemes({...contentThemes, industryNews: value})}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-white">Behind-the-Scenes</Label>
                <span className="text-sm text-gray-400">{contentThemes.behindScenes[0]}%</span>
              </div>
              <Slider
                value={contentThemes.behindScenes}
                onValueChange={(value) => setContentThemes({...contentThemes, behindScenes: value})}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-white">Product Features & Updates</Label>
                <span className="text-sm text-gray-400">{contentThemes.productFeatures[0]}%</span>
              </div>
              <Slider
                value={contentThemes.productFeatures}
                onValueChange={(value) => setContentThemes({...contentThemes, productFeatures: value})}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Platform Priority */}
      <Card className="premium-card border border-gray-800">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">Platform Priority</CardTitle>
          <CardDescription className="text-gray-400">
            Drag to reorder platforms by priority for content distribution
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {platformPriority.map((platformId, index) => {
              const platform = platforms.find(p => p.id === platformId);
              return (
                <div
                  key={platformId}
                  className="flex items-center space-x-4 p-3 bg-gray-800 rounded-lg border border-gray-700"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-400 font-medium">#{index + 1}</span>
                    <div className={`w-4 h-4 rounded ${platform?.color}`} />
                    <span className="text-white font-medium">{platform?.label}</span>
                  </div>
                  <div className="ml-auto flex items-center space-x-2">
                    <Switch />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="premium-button bg-gradient-to-r from-purple-600 to-indigo-600">
          Save Content Preferences
        </Button>
      </div>
    </div>
  );
}
