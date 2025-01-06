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
      <Card className="border border-accent/20 shadow-lg bg-gradient-to-br from-card to-card/90 animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            <Sparkles className="w-5 h-5" />
            Trending Topics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 rounded-lg bg-muted animate-pulse"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-accent/20 shadow-lg bg-gradient-to-br from-card to-card/90 animate-fade-in hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          <Sparkles className="w-5 h-5" />
          Trending Topics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topics?.map((topic) => (
            <div
              key={topic.id}
              className="p-4 rounded-lg border border-accent/20 bg-background hover:shadow-md transition-all duration-300 hover:scale-[1.02] hover:border-primary/50"
            >
              <h3 className="font-medium mb-1">{topic.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">
                {topic.description}
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onSelect(topic)}
                className="bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground hover:shadow-md transition-all duration-300"
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