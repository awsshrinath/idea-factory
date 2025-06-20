import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Clock, Copy, Eye, Heart, MoreHorizontal } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface ContentItem {
  id: string;
  created_at: string;
  description: string;
  generated_text: string;
  platform: string[];
  tone: string;
  status: string;
}

interface RecentContentProps {
  onContentSelect?: (content: string) => void;
  refreshTrigger?: number;
}

export function RecentContent({ onContentSelect, refreshTrigger }: RecentContentProps) {
  const [contentList, setContentList] = useState<ContentItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchContent();
  }, [refreshTrigger]);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('generated_content')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      if (data) setContentList(data);
    } catch (error: any) {
      console.error('Error fetching content:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load recent content. Please try again.',
      });
    }
  };

  const handleContentCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard',
      description: 'Content has been copied to your clipboard.',
    });
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) {
      return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    } else if (days < 7) {
      return `${days} day${days === 1 ? '' : 's'} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <Card className="premium-card premium-card-hover border border-white/10 shadow-lg backdrop-blur-sm">
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center border border-purple-500/20">
            <Clock className="h-4 w-4 text-purple-400" />
          </div>
          <div>
            <CardTitle className="premium-heading text-lg">Recent Content</CardTitle>
          </div>
        </div>
        <Badge variant="secondary" className="bg-white/5">
          {contentList.length} items
        </Badge>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="divide-y divide-white/10">
            {contentList.length === 0 ? (
              <div className="text-center p-6">
                <CardDescription className="premium-caption text-muted-foreground">
                  No recent content available
                </CardDescription>
              </div>
            ) : (
              contentList.map((item) => (
                <div key={item.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="premium-subheading text-sm font-medium line-clamp-1">
                        {item.description}
                      </p>
                      <p className="premium-caption text-xs text-muted-foreground">
                        Generated for {item.platform.join(', ')}
                      </p>
                      <p className="premium-caption text-xs text-muted-foreground">
                        {formatDate(item.created_at)}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-6 w-6 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuItem onClick={() => handleContentCopy(item.generated_text)}>
                          <Copy className="h-3.5 w-3.5 mr-2" />
                          Copy content
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onContentSelect?.(item.generated_text)}>
                          <Eye className="h-3.5 w-3.5 mr-2" />
                          View details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
