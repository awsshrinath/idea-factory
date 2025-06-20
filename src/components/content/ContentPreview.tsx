
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';

interface ContentPreviewProps {
  content: string;
  platform?: string;
  tone?: string;
}

export function ContentPreview({ content, platform, tone }: ContentPreviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedContent(e.target.value);
  };

  const wordCount = content ? content.split(/\s+/).filter(Boolean).length : 0;
  const characterCount = content ? content.length : 0;

  return (
    <Card className="premium-card premium-card-hover border border-white/10 shadow-lg backdrop-blur-sm">
      <CardHeader className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600/20 to-indigo-600/20 flex items-center justify-center border border-blue-500/20">
            <Eye className="h-4 w-4 text-blue-400" />
          </div>
          <div>
            <CardTitle className="premium-heading text-xl">Content Preview</CardTitle>
            <CardDescription className="premium-body">
              Review and refine your generated content
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-x-2">
              <Badge variant="secondary">
                Platform: {platform || 'N/A'}
              </Badge>
              <Badge variant="secondary">
                Tone: {tone || 'N/A'}
              </Badge>
            </div>
            <div className="flex items-center text-xs">
              <span className="mr-2 premium-caption">
                {wordCount} words, {characterCount} characters
              </span>
            </div>
          </div>
          <Separator className="bg-white/10" />
        </div>

        {isEditing ? (
          <Textarea
            value={editedContent}
            onChange={handleContentChange}
            placeholder="Edit your content..."
            className="premium-focus bg-white/5 border-white/10 hover:border-white/20 focus:border-blue-400 transition-all duration-300 resize-none"
            rows={8}
          />
        ) : (
          <ScrollArea className="h-[300px]">
            <div className="premium-body text-base whitespace-pre-line">
              {content || 'No content to preview'}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
