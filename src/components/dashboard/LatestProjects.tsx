
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Copy, Image as ImageIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export const LatestProjects = () => {
  const isMobile = useIsMobile();
  
  const projects = [
    {
      type: "Content",
      title: "Weekly Newsletter Draft",
      description: "Email content for subscribers",
      date: "2 hours ago",
      icon: "text",
    },
    {
      type: "Image",
      title: "Product Showcase",
      description: "Promotional image for social media",
      date: "Yesterday",
      icon: "image",
    },
    {
      type: "Video",
      title: "Feature Explanation",
      description: "30-second explainer video",
      date: "3 days ago",
      icon: "video",
    },
  ];

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">Latest Projects</h2>
      <div className={cn(
        "grid gap-4",
        isMobile ? "grid-cols-1" : "grid-cols-3"
      )}>
        {projects.map((project, index) => (
          <Card 
            key={index} 
            className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 hover:shadow-lg group overflow-hidden"
          >
            <div className="h-32 bg-gradient-to-br from-background via-muted to-background flex items-center justify-center">
              {project.icon === "text" && (
                <div className="text-4xl font-bold text-primary/30">Aa</div>
              )}
              {project.icon === "image" && (
                <ImageIcon className="h-12 w-12 text-primary/30" />
              )}
              {project.icon === "video" && (
                <div className="rounded-full bg-primary/20 p-4">
                  <div className="w-8 h-8 rounded-full bg-primary/40"></div>
                </div>
              )}
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg group-hover:text-white transition-colors duration-300">
                {project.title}
              </CardTitle>
              <CardDescription className="flex justify-between items-center">
                <span>{project.description}</span>
                <span className="text-xs opacity-70">{project.date}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 hover:bg-primary/20 hover:text-primary"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 hover:bg-secondary/20 hover:text-secondary"
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Duplicate
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
