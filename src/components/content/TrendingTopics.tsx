import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface TrendingTopic {
  id: string;
  title: string;
  description: string;
}

interface TrendingTopicsProps {
  onSelect: (topic: TrendingTopic) => void;
}

export function TrendingTopics({ onSelect }: TrendingTopicsProps) {
  const { data: topics, isLoading } = useQuery({
    queryKey: ["trending-topics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trending_topics")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data as TrendingTopic[];
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Trending Topics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 rounded-md bg-muted animate-pulse"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          Trending Topics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topics?.map((topic) => (
            <div
              key={topic.id}
              className="p-4 rounded-md border bg-card hover:bg-accent/50 transition-colors"
            >
              <h3 className="font-medium mb-1">{topic.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">
                {topic.description}
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onSelect(topic)}
              >
                Use This
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}