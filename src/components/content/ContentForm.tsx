import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAIGeneration } from '@/hooks/api/useAIGeneration';
import { Loader2 } from 'lucide-react';

interface ContentFormProps {
  onContentGenerated?: (content: string) => void;
}

export function ContentForm({ onContentGenerated }: ContentFormProps) {
  const [prompt, setPrompt] = useState('');
  const [platform, setPlatform] = useState('');
  const [tone, setTone] = useState('');
  const [language, setLanguage] = useState('English');
  const [model, setModel] = useState('ChatGPT');
  
  const { toast } = useToast();
  const aiGeneration = useAIGeneration();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim() || !platform || !tone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await aiGeneration.mutateAsync({
        prompt,
        platform,
        tone,
        language,
        model
      });

      if (result.success) {
        onContentGenerated?.(result.content);
        toast({
          title: "Content Generated",
          description: "Your content has been generated successfully!"
        });
      } else {
        throw new Error(result.error || 'Failed to generate content');
      }
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "An error occurred while generating content.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Content</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">Content Description *</Label>
            <Textarea
              id="prompt"
              placeholder="Describe what you want to create..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="platform">Platform *</Label>
              <Select value={platform} onValueChange={setPlatform} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="blog">Blog</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tone">Tone *</Label>
              <Select value={tone} onValueChange={setTone} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="humorous">Humorous</SelectItem>
                  <SelectItem value="serious">Serious</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Spanish">Spanish</SelectItem>
                  <SelectItem value="French">French</SelectItem>
                  <SelectItem value="German">German</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">AI Model</Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ChatGPT">ChatGPT</SelectItem>
                  <SelectItem value="Claude">Claude</SelectItem>
                  <SelectItem value="Gemini">Gemini</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={aiGeneration.isPending}
            className="w-full"
          >
            {aiGeneration.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Content'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
