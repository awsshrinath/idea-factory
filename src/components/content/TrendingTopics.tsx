
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
      <Card className="border border-[rgba(255,255,255,0.05)] shadow-[0_8px_12px_rgba(0,0,0,0.2)] bg-gradient-to-br from-[#121212] to-[#1a1a1a] backdrop-blur-sm animate-fade-in rounded-xl">
        <CardHeader className="p-6 md:p-8">
          <CardTitle className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
            <Sparkles className="w-6 h-6" />
            Trending Topics
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 rounded-lg bg-background/50 animate-pulse"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-[rgba(255,255,255,0.05)] shadow-[0_8px_12px_rgba(0,0,0,0.2)] bg-gradient-to-br from-[#121212] to-[#1a1a1a] backdrop-blur-sm animate-fade-in hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.01] rounded-xl">
      <CardHeader className="p-6 md:p-8">
        <CardTitle className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
          <Sparkles className="w-6 h-6" />
          Trending Topics
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 md:p-8">
        <div className="space-y-4">
          {topics?.map((topic) => (
            <div
              key={topic.id}
              className="p-6 rounded-lg border border-white/10 bg-background/50 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-primary/50 group"
            >
              <h3 className="font-medium text-lg mb-2 group-hover:text-primary transition-colors duration-300">
                {topic.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {topic.description}
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onSelect(topic)}
                className="bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground hover:shadow-xl transition-all duration-300 group-hover:scale-105 rounded-lg"
              >
                Use This Topic
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
