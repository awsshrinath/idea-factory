import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Copy, Eye, Trash, FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Content {
  id: string;
  title: string;
  description: string;
  created_at: string;
  platforms: string[];
  status: string;
}

export function RecentContent() {
  const { data: content, isLoading } = useQuery({
    queryKey: ["recent-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data as Content[];
    },
  });

  if (isLoading) {
    return (
      <Card className="border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)] bg-gradient-to-br from-[#1D2433] to-[#283047] backdrop-blur-sm animate-fade-in rounded-xl">
        <CardHeader className="p-6">
          <CardTitle className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
            <Clock className="w-6 h-6" />
            Recent Content
          </CardTitle>
          <CardDescription>Your previously created content</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
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
    <Card className="border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)] bg-gradient-to-br from-[#1D2433] to-[#283047] backdrop-blur-sm animate-fade-in hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.01] rounded-xl">
      <CardHeader className="p-6">
        <CardTitle className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
          <Clock className="w-6 h-6" />
          Recent Content
        </CardTitle>
        <CardDescription>Your previously created content</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {content?.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-lg border border-white/10 bg-background/50 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-primary/50 group"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-medium text-lg mb-2 group-hover:text-primary transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>
                      {formatDistanceToNow(new Date(item.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                    <span>•</span>
                    <span className="capitalize">{item.status}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-accent/50 transition-colors group rounded-lg"
                  >
                    <Eye className="w-4 h-4 group-hover:text-primary transition-colors" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-accent/50 transition-colors group rounded-lg"
                  >
                    <Copy className="w-4 h-4 group-hover:text-primary transition-colors" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-accent/50 transition-colors group rounded-lg"
                  >
                    <Trash className="w-4 h-4 group-hover:text-primary transition-colors" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {content?.length === 0 && (
            <div className="text-center py-12 px-4">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-muted-foreground mb-2">
                No content yet
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Start by generating your first piece of content
              </p>
              <Button
                variant="outline"
                className="bg-gradient-to-r from-[#00C6FF] to-[#0072FF] text-primary-foreground hover:shadow-[0_0_15px_rgba(0,198,255,0.6)] transition-all duration-300 rounded-lg"
              >
                Create Your First Content
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}