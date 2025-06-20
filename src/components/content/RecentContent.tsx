
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Clock } from 'lucide-react';

interface ContentItem {
  id: string;
  description: string;
  generated_text: string | null;
  platform: string[];
  tone: string;
  created_at: string | null;
  status: string;
}

interface RecentContentProps {
  onContentSelect?: (content: string) => void;
}

export function RecentContent({ onContentSelect }: RecentContentProps) {
  const [recentContent, setRecentContent] = useState<ContentItem[]>([]);

  useEffect(() => {
    fetchRecentContent();
  }, []);

  const fetchRecentContent = async () => {
    try {
      const { data, error } = await supabase
        .from('generated_content')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      if (data) {
        // Map the data to match our ContentItem interface
        const mappedData: ContentItem[] = data.map(item => ({
          id: item.id,
          description: item.description,
          generated_text: item.generated_text,
          platform: item.platform,
          tone: item.tone,
          created_at: item.created_at,
          status: item.status || 'draft'
        }));
        setRecentContent(mappedData);
      }
    } catch (error) {
      console.error('Error fetching recent content:', error);
    }
  };

  return (
    <Card className="premium-card premium-card-hover border border-white/10 shadow-lg backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center border border-purple-500/20">
            <Clock className="h-4 w-4 text-purple-400" />
          </div>
          <div>
            <CardTitle className="premium-heading text-lg">Recent Content</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentContent.length === 0 ? (
          <div className="text-center py-6">
            <p className="premium-caption text-muted-foreground">
              No recent content found
            </p>
          </div>
        ) : (
          recentContent.map((item) => (
            <div
              key={item.id}
              className="premium-card rounded-lg p-3 cursor-pointer transition-all duration-300 hover:shadow-[0_0_15px_rgba(147,51,234,0.15)] hover:border-purple-500/30 group border border-white/10"
              onClick={() => onContentSelect?.(item.generated_text || item.description)}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h4 className="premium-subheading text-sm font-medium group-hover:text-purple-300 transition-colors line-clamp-2">
                    {item.description}
                  </h4>
                  <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/20 shrink-0 ml-2">
                    {item.tone}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {item.platform.join(', ')}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Unknown date'}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
