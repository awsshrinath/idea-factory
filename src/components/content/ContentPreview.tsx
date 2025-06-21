
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Copy, Download, Share2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';

interface ContentPreviewProps {
  content: string;
  platform?: string;
  tone?: string;
}

export function ContentPreview({ content, platform, tone }: ContentPreviewProps) {
  const [isEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedContent(e.target.value);
  };

  const wordCount = content ? content.split(/\s+/).filter(Boolean).length : 0;
  const characterCount = content ? content.length : 0;

  const handleCopy = () => {
    navigator.clipboard.writeText(content || '');
  };

  return (
    <Card className="bg-gray-900 border-gray-800 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-gray-700">
      <CardHeader className="space-y-6 pb-6">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600/20 to-indigo-600/20 flex items-center justify-center border border-blue-500/30">
            <Eye className="h-5 w-5 text-blue-400" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl font-bold text-white mb-2">Content Preview</CardTitle>
            <CardDescription className="text-gray-400 text-base">
              Review and refine your generated content
            </CardDescription>
          </div>
        </div>
        
        {/* Platform and Tone Badges + Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-purple-600/10 text-purple-400 border-purple-500/20 hover:bg-purple-600/20 transition-colors">
              {platform || 'General'}
            </Badge>
            <Badge variant="secondary" className="bg-blue-600/10 text-blue-400 border-blue-500/20 hover:bg-blue-600/20 transition-colors">
              {tone || 'Professional'}
            </Badge>
          </div>
          <div className="text-xs text-gray-500 font-medium">
            {wordCount} words • {characterCount} characters
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Separator className="bg-gray-800" />

        {/* Content Display Area */}
        {isEditing ? (
          <Textarea
            value={editedContent}
            onChange={handleContentChange}
            placeholder="Edit your content..."
            className="bg-gray-800 border-gray-700 hover:border-gray-600 focus:border-purple-500 transition-all duration-300 resize-none text-gray-200 min-h-[300px]"
            rows={12}
          />
        ) : (
          <div className="relative">
            <ScrollArea className="h-[300px] rounded-lg">
              <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700">
                {content ? (
                  <div className="text-gray-200 text-base leading-relaxed whitespace-pre-line">
                    {content}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-center">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center mb-4 border border-purple-500/30">
                      <Eye className="h-8 w-8 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">No content yet</h3>
                    <p className="text-gray-500 text-sm max-w-sm">
                      Generated content will appear here. Use the form on the left to create your first piece of content.
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Action Buttons */}
        {content && (
          <>
            <Separator className="bg-gray-800" />
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="bg-purple-600/10 border-purple-500/30 text-purple-400 hover:bg-purple-600/20 hover:border-purple-400/50 transition-all duration-200"
              >
                Regenerate
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
