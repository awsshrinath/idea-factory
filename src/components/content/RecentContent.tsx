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
import { Clock, Copy, Eye, Trash } from "lucide-react";
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Content
          </CardTitle>
          <CardDescription>Your previously created content</CardDescription>
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
          <Clock className="w-5 h-5" />
          Recent Content
        </CardTitle>
        <CardDescription>Your previously created content</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {content?.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-md border bg-card"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="font-medium mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
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
                  <Button variant="ghost" size="icon">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {content?.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              No content created yet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}