
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
      gradient: "from-[#FF416C]/10 to-[#FF4B2B]/10",
      iconGradient: "from-[#FF416C] to-[#FF4B2B]",
    },
    {
      title: "Create Images",
      description: "Generate unique images using AI technology",
      icon: Image,
      path: "/images",
      gradient: "from-[#00C6FF]/10 to-[#0072FF]/10",
      iconGradient: "from-[#00C6FF] to-[#0072FF]",
    },
    {
      title: "Make Videos",
      description: "Produce professional videos with AI assistance",
      icon: Video,
      path: "/videos",
      gradient: "from-[#42E695]/10 to-[#3BB2B8]/10",
      iconGradient: "from-[#42E695] to-[#3BB2B8]",
    },
    {
      title: "Schedule Post",
      description: "Plan and schedule your content calendar",
      icon: Calendar,
      path: "/schedule",
      gradient: "from-[#FFD54F]/10 to-[#FFB74D]/10",
      iconGradient: "from-[#FFD54F] to-[#FFB74D]",
    },
  ];

  return (
    <section className="mb-6">
      <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <div
              key={action.title}
              className={`bg-gradient-to-br ${action.gradient} backdrop-blur-sm border border-white/10 p-5 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20 group relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
              <div className={`h-12 w-12 rounded-full bg-gradient-to-br ${action.iconGradient} flex items-center justify-center mb-3 transform transition-transform duration-300 group-hover:scale-110`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-1">{action.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {action.description}
              </p>
              <Button
                className="w-full bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 transition-all duration-300"
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
