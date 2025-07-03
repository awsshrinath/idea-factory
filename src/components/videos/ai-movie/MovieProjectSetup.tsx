
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Drama, 
  Smile, 
  BookOpen, 
  Megaphone, 
  GraduationCap, 
  Users,
  Clock,
  Sparkles,
  Play
} from 'lucide-react';

interface MovieProjectSetupProps {
  onComplete: (data: any) => void;
}

const genres = [
  { id: 'drama', name: 'Drama', icon: Drama, color: 'from-red-600 to-pink-600', description: 'Emotional storytelling' },
  { id: 'comedy', name: 'Comedy', icon: Smile, color: 'from-yellow-500 to-orange-500', description: 'Light and entertaining' },
  { id: 'documentary', name: 'Documentary', icon: BookOpen, color: 'from-blue-600 to-cyan-600', description: 'Factual and informative' },
  { id: 'promotional', name: 'Promotional', icon: Megaphone, color: 'from-purple-600 to-indigo-600', description: 'Marketing focused' },
  { id: 'educational', name: 'Educational', icon: GraduationCap, color: 'from-green-600 to-emerald-600', description: 'Learning content' },
  { id: 'explainer', name: 'Explainer', icon: Users, color: 'from-gray-600 to-slate-600', description: 'Concept explanation' },
];

const audiences = [
  { id: 'general', name: 'General Audience', description: 'Broad appeal for everyone' },
  { id: 'professional', name: 'Professional', description: 'Business and corporate focused' },
  { id: 'educational', name: 'Educational', description: 'Students and learners' },
  { id: 'social', name: 'Social Media', description: 'Optimized for social platforms' },
];

const styles = [
  { 
    id: 'cinematic', 
    name: 'Cinematic', 
    preview: '/placeholder.svg',
    description: 'Professional film quality with dramatic lighting'
  },
  { 
    id: 'corporate', 
    name: 'Corporate', 
    preview: '/placeholder.svg',
    description: 'Clean, professional business style'
  },
  { 
    id: 'animated', 
    name: 'Animated', 
    preview: '/placeholder.svg',
    description: 'Motion graphics and animated elements'
  },
  { 
    id: 'documentary', 
    name: 'Documentary', 
    preview: '/placeholder.svg',
    description: 'Realistic, journalistic approach'
  },
];

export function MovieProjectSetup({ onComplete }: MovieProjectSetupProps) {
  const [formData, setFormData] = useState({
    topic: '',
    title: '',
    genre: '',
    duration: [60],
    audience: '',
    style: '',
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.topic.trim()) {
      newErrors.topic = 'Movie topic is required';
    }
    if (!formData.genre) {
      newErrors.genre = 'Please select a genre';
    }
    if (!formData.audience) {
      newErrors.audience = 'Please select target audience';
    }
    if (!formData.style) {
      newErrors.style = 'Please select a visual style';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onComplete({
        ...formData,
        duration: formData.duration[0],
        title: formData.title || `${formData.genre.charAt(0).toUpperCase() + formData.genre.slice(1)} Movie`
      });
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${remainingSeconds}s`;
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-8 px-6 bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg border border-gray-700">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-600">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white">Create Your AI Movie</h2>
        </div>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Describe your movie concept and let our AI create a complete film with script, visuals, voiceover, and music
        </p>
      </div>

      {/* Topic Input */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Movie Topic & Concept</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="topic" className="text-gray-300">What should your movie be about? *</Label>
            <Textarea
              id="topic"
              placeholder="Describe your movie concept, story, or message. Be as detailed as possible..."
              value={formData.topic}
              onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
              className="mt-2 bg-gray-900 border-gray-600 text-white min-h-[120px]"
            />
            {errors.topic && <p className="text-red-400 text-sm mt-1">{errors.topic}</p>}
          </div>

          <div>
            <Label htmlFor="title" className="text-gray-300">Movie Title (Optional)</Label>
            <Input
              id="title"
              placeholder="Leave blank for AI to generate a title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="mt-2 bg-gray-900 border-gray-600 text-white"
            />
          </div>
        </CardContent>
      </Card>

      {/* Genre Selection */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Movie Genre *</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {genres.map((genre) => (
              <div
                key={genre.id}
                onClick={() => setFormData(prev => ({ ...prev, genre: genre.id }))}
                className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                  formData.genre === genre.id
                    ? 'border-amber-500 bg-amber-500/10'
                    : 'border-gray-600 bg-gray-900/50 hover:border-gray-500'
                }`}
              >
                <div className={`p-3 rounded-full bg-gradient-to-r ${genre.color} w-fit mb-3`}>
                  <genre.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-1">{genre.name}</h3>
                <p className="text-gray-400 text-sm">{genre.description}</p>
                {formData.genre === genre.id && (
                  <div className="absolute top-2 right-2">
                    <div className="w-4 h-4 bg-amber-500 rounded-full" />
                  </div>
                )}
              </div>
            ))}
          </div>
          {errors.genre && <p className="text-red-400 text-sm mt-2">{errors.genre}</p>}
        </CardContent>
      </Card>

      {/* Duration Selection */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" />
            Target Duration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Duration:</span>
              <Badge className="bg-amber-500/20 text-amber-400 text-lg px-3 py-1">
                {formatDuration(formData.duration[0])}
              </Badge>
            </div>
            <Slider
              value={formData.duration}
              onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}
              max={300}
              min={30}
              step={15}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-400">
              <span>30s</span>
              <span>2m 30s</span>
              <span>5m</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audience Selection */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Target Audience *</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {audiences.map((audience) => (
              <div
                key={audience.id}
                onClick={() => setFormData(prev => ({ ...prev, audience: audience.id }))}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                  formData.audience === audience.id
                    ? 'border-amber-500 bg-amber-500/10'
                    : 'border-gray-600 bg-gray-900/50 hover:border-gray-500'
                }`}
              >
                <h3 className="text-white font-semibold mb-2">{audience.name}</h3>
                <p className="text-gray-400 text-sm">{audience.description}</p>
              </div>
            ))}
          </div>
          {errors.audience && <p className="text-red-400 text-sm mt-2">{errors.audience}</p>}
        </CardContent>
      </Card>

      {/* Style Selection */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Visual Style *</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {styles.map((style) => (
              <div
                key={style.id}
                onClick={() => setFormData(prev => ({ ...prev, style: style.id }))}
                className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                  formData.style === style.id
                    ? 'border-amber-500 bg-amber-500/10'
                    : 'border-gray-600 bg-gray-900/50 hover:border-gray-500'
                }`}
              >
                <div className="aspect-video bg-gray-700 rounded-lg mb-3 flex items-center justify-center">
                  <img 
                    src={style.preview} 
                    alt={style.name}
                    className="w-full h-full object-cover rounded-lg opacity-50"
                  />
                  <Play className="absolute h-8 w-8 text-white" />
                </div>
                <h3 className="text-white font-semibold text-sm mb-1">{style.name}</h3>
                <p className="text-gray-400 text-xs">{style.description}</p>
                {formData.style === style.id && (
                  <div className="absolute top-2 right-2">
                    <div className="w-4 h-4 bg-amber-500 rounded-full" />
                  </div>
                )}
              </div>
            ))}
          </div>
          {errors.style && <p className="text-red-400 text-sm mt-2">{errors.style}</p>}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleSubmit}
          size="lg"
          className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-3 text-lg"
        >
          <Sparkles className="h-5 w-5 mr-2" />
          Generate AI Movie Script
        </Button>
      </div>
    </div>
  );
}
