
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { TrendingUp } from 'lucide-react';

interface Topic {
  id: string;
  title: string;
  description: string;
  created_at: string | null;
}

interface TrendingTopicsProps {
  onTopicSelect?: (topic: string) => void;
}

export function TrendingTopics({ onTopicSelect }: TrendingTopicsProps) {
  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const { data, error } = await supabase
        .from('trending_topics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      if (data) {
        // Map the data to ensure proper typing
        const mappedTopics: Topic[] = data.map(topic => ({
          id: topic.id,
          title: topic.title,
          description: topic.description,
          created_at: topic.created_at
        }));
        setTopics(mappedTopics);
      }
    } catch (error) {
      console.error('Error fetching trending topics:', error);
    }
  };

  return (
    <Card className="premium-card premium-card-hover border border-white/10 shadow-lg backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-600/20 to-green-600/20 flex items-center justify-center border border-emerald-500/20">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div>
            <CardTitle className="premium-heading text-lg">Trending Topics</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {topics.length === 0 ? (
          <div className="text-center py-6">
            <p className="premium-caption text-muted-foreground">
              No trending topics available
            </p>
          </div>
        ) : (
          topics.map((topic) => (
            <div
              key={topic.id}
              className="premium-card rounded-lg p-3 cursor-pointer transition-all duration-300 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:border-emerald-500/30 group border border-white/10"
              onClick={() => onTopicSelect?.(topic.title)}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h4 className="premium-subheading text-sm font-medium group-hover:text-emerald-300 transition-colors line-clamp-2">
                    {topic.title}
                  </h4>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shrink-0 ml-2">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Hot
                  </Badge>
                </div>
                <p className="premium-caption text-xs text-muted-foreground line-clamp-2">
                  {topic.description}
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
