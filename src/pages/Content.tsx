
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { ContentForm } from '@/components/content/ContentForm';
import { ContentPreview } from '@/components/content/ContentPreview';
import { RecentContent } from '@/components/content/RecentContent';
import { TrendingTopics } from '@/components/content/TrendingTopics';
import { PromptTemplates } from '@/components/content/PromptTemplates';

export function Content() {
  const [generatedContent, setGeneratedContent] = useState<string>('');

  const handleContentGenerated = (content: string) => {
    setGeneratedContent(content);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            AI Content Generator
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create engaging content for social media, blogs, and marketing campaigns with the power of AI
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          <div className="space-y-6">
            <ContentForm onContentGenerated={handleContentGenerated} />
            
            <Separator className="bg-white/10" />
            
            <PromptTemplates onSelectTemplate={(template: string) => console.log('Template selected:', template)} />
          </div>

          <div className="space-y-6">
            <ContentPreview 
              content={generatedContent}
              platform="instagram"
              tone="professional"
            />
            
            <Separator className="bg-white/10" />
            
            <TrendingTopics onTopicSelect={(topic: string) => console.log('Topic selected:', topic)} />
          </div>
        </div>

        <div className="mt-12">
          <RecentContent />
        </div>
      </div>
    </div>
  );
}
