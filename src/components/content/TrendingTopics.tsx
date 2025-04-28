import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

interface TrendingTopic {
  id: string;
  title: string;
  description: string;
}

interface TrendingTopicsProps {
  onSelect: (topic: TrendingTopic) => void;
}

const dummyTopics = [
  {
    id: "1",
    title: "#AIMarketing",
    description: "Explore AI-powered marketing strategies and tools",
  },
  {
    id: "2",
    title: "#SocialGrowth",
    description: "Tips and tricks for growing your social media presence",
  },
  {
    id: "3",
    title: "#ContentCreation",
    description: "Best practices for creating engaging content",
  },
];

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

  const displayTopics = topics?.length ? topics : dummyTopics;

  return (
    <Card className="border border-[rgba(255,255,255,0.05)] shadow-[0_8px_12px_rgba(0,0,0,0.2)] bg-gradient-to-br from-[#121212] to-[#1a1a1a] backdrop-blur-sm animate-fade-in hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.01] rounded-[12px]">
      <CardHeader className="p-4">
        <CardTitle className="flex items-center gap-2 text-lg font-[600] bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
          <Sparkles className="w-5 h-5" />
          Trending Topics
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid gap-3">
          {displayTopics.map((topic) => (
            <TooltipProvider key={topic.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className="p-4 rounded-lg border border-white/10 bg-background/50 hover:shadow-xl transition-all duration-300 hover:scale-[1.01] hover:border-primary/50 group cursor-pointer"
                    onClick={() => onSelect(topic)}
                  >
                    <h3 className="font-[600] text-[16px] mb-2 group-hover:text-primary transition-colors duration-300">
                      {topic.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {topic.description}
                    </p>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-background/95 backdrop-blur-sm border-primary/20">
                  <p>Trending now — tap to add to your post</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
