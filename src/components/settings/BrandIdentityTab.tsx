import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Palette, Volume2, Hash, Building } from 'lucide-react';
import { useState } from 'react';

export function BrandIdentityTab() {
  const [brandColors, setBrandColors] = useState({
    primary: '#8B5CF6',
    secondary: '#06B6D4',
    accent: '#10B981'
  });
  
  const [toneValue, setToneValue] = useState([50]);
  const [selectedTraits, setSelectedTraits] = useState<string[]>(['innovative', 'professional']);

  const personalityTraits = [
    'Professional', 'Casual', 'Innovative', 'Traditional', 'Friendly', 
    'Authoritative', 'Playful', 'Serious', 'Empathetic', 'Bold'
  ];

  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Marketing',
    'Real Estate', 'E-commerce', 'Consulting', 'Non-profit', 'Entertainment'
  ];

  return (
    <div className="space-y-8">
      {/* Brand Colors */}
      <Card className="premium-card border border-gray-800">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30">
              <Palette className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-white">Brand Colors</CardTitle>
              <CardDescription className="text-gray-400">
                Define your brand's color palette for consistent content styling
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <Label className="text-white">Primary Color</Label>
              <div className="flex items-center space-x-3">
                <div 
                  className="w-12 h-12 rounded-lg border-2 border-gray-600 cursor-pointer"
                  style={{ backgroundColor: brandColors.primary }}
                />
                <Input 
                  type="color" 
                  value={brandColors.primary}
                  onChange={(e) => setBrandColors({...brandColors, primary: e.target.value})}
                  className="w-20 h-10 p-1 bg-gray-800 border-gray-700"
                />
                <Input 
                  value={brandColors.primary}
                  onChange={(e) => setBrandColors({...brandColors, primary: e.target.value})}
                  className="bg-gray-800 border-gray-700 text-gray-300"
                />
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-white">Secondary Color</Label>
              <div className="flex items-center space-x-3">
                <div 
                  className="w-12 h-12 rounded-lg border-2 border-gray-600 cursor-pointer"
                  style={{ backgroundColor: brandColors.secondary }}
                />
                <Input 
                  type="color" 
                  value={brandColors.secondary}
                  onChange={(e) => setBrandColors({...brandColors, secondary: e.target.value})}
                  className="w-20 h-10 p-1 bg-gray-800 border-gray-700"
                />
                <Input 
                  value={brandColors.secondary}
                  onChange={(e) => setBrandColors({...brandColors, secondary: e.target.value})}
                  className="bg-gray-800 border-gray-700 text-gray-300"
                />
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-white">Accent Color</Label>
              <div className="flex items-center space-x-3">
                <div 
                  className="w-12 h-12 rounded-lg border-2 border-gray-600 cursor-pointer"
                  style={{ backgroundColor: brandColors.accent }}
                />
                <Input 
                  type="color" 
                  value={brandColors.accent}
                  onChange={(e) => setBrandColors({...brandColors, accent: e.target.value})}
                  className="w-20 h-10 p-1 bg-gray-800 border-gray-700"
                />
                <Input 
                  value={brandColors.accent}
                  onChange={(e) => setBrandColors({...brandColors, accent: e.target.value})}
                  className="bg-gray-800 border-gray-700 text-gray-300"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logo Upload */}
      <Card className="premium-card border border-gray-800">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/30">
              <Upload className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-white">Brand Logo</CardTitle>
              <CardDescription className="text-gray-400">
                Upload your logo with automatic background removal
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-gray-600 transition-colors">
            <Upload className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">Drag and drop your logo here, or click to browse</p>
            <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
              Choose File
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Brand Voice */}
      <Card className="premium-card border border-gray-800">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/30">
              <Volume2 className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-white">Brand Voice</CardTitle>
              <CardDescription className="text-gray-400">
                Define your brand's tone and personality traits
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-white">Tone Style</Label>
              <span className="text-sm text-gray-400">
                {toneValue[0] < 25 ? 'Very Professional' : 
                 toneValue[0] < 50 ? 'Professional' :
                 toneValue[0] < 75 ? 'Balanced' : 'Casual'}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Professional</span>
                <span>Casual</span>
              </div>
              <Slider
                value={toneValue}
                onValueChange={setToneValue}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-white">Personality Traits</Label>
            <div className="flex flex-wrap gap-2">
              {personalityTraits.map((trait) => (
                <Badge
                  key={trait}
                  variant={selectedTraits.includes(trait.toLowerCase()) ? "default" : "secondary"}
                  className={`cursor-pointer transition-colors ${
                    selectedTraits.includes(trait.toLowerCase())
                      ? "bg-purple-600 hover:bg-purple-700 text-white"
                      : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                  }`}
                  onClick={() => {
                    const traitLower = trait.toLowerCase();
                    setSelectedTraits(prev => 
                      prev.includes(traitLower)
                        ? prev.filter(t => t !== traitLower)
                        : [...prev, traitLower]
                    );
                  }}
                >
                  {trait}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Brand Keywords */}
      <Card className="premium-card border border-gray-800">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-orange-600/20 to-red-600/20 border border-orange-500/30">
              <Hash className="h-5 w-5 text-orange-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-white">Keywords & Hashtags</CardTitle>
              <CardDescription className="text-gray-400">
                Build your brand's keyword library for consistent messaging
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label className="text-white">Brand Keywords</Label>
            <Textarea
              placeholder="Enter keywords separated by commas (e.g., innovation, technology, growth, leadership)"
              className="bg-gray-800 border-gray-700 text-gray-300 focus:border-purple-500"
              rows={3}
            />
          </div>
          
          <div className="space-y-3">
            <Label className="text-white">Default Hashtags</Label>
            <Textarea
              placeholder="Enter hashtags separated by commas (e.g., #innovation, #tech, #leadership)"
              className="bg-gray-800 border-gray-700 text-gray-300 focus:border-purple-500"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Industry Selection */}
      <Card className="premium-card border border-gray-800">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-teal-600/20 to-cyan-600/20 border border-teal-500/30">
              <Building className="h-5 w-5 text-teal-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-white">Industry & Niche</CardTitle>
              <CardDescription className="text-gray-400">
                Select your industry for relevant content suggestions
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label className="text-white">Primary Industry</Label>
            <Select>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-300">
                <SelectValue placeholder="Select your industry" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry.toLowerCase()}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-3">
            <Label className="text-white">Niche/Specialization</Label>
            <Input
              placeholder="e.g., AI & Machine Learning, Digital Marketing, Sustainable Finance"
              className="bg-gray-800 border-gray-700 text-gray-300 focus:border-purple-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="premium-button bg-gradient-to-r from-purple-600 to-indigo-600">
          Save Brand Settings
        </Button>
      </div>
    </div>
  );
}
