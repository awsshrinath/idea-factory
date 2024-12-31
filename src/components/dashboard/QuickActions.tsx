import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Image, Video, Calendar } from "lucide-react";

export const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Generate Content",
      description: "Create engaging posts for your social media platforms",
      icon: FileText,
      path: "/content",
    },
    {
      title: "Create Images",
      description: "Generate unique images using AI technology",
      icon: Image,
      path: "/images",
    },
    {
      title: "Make Videos",
      description: "Produce professional videos with AI assistance",
      icon: Video,
      path: "/videos",
    },
    {
      title: "Schedule Post",
      description: "Plan and schedule your content calendar",
      icon: Calendar,
      path: "/schedule",
    },
  ];

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold mb-6">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-6">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <div
              key={action.title}
              className="glass p-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
            >
              <Icon className="h-8 w-8 mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {action.description}
              </p>
              <Button
                className="w-full"
                onClick={() => navigate(action.path)}
              >
                Get Started
              </Button>
            </div>
          );
        })}
      </div>
    </section>
  );
};