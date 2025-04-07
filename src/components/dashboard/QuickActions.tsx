
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
      gradient: "from-[#FF416C] to-[#FF4B2B]",
      emoji: "📝",
    },
    {
      title: "Create Images",
      description: "Generate unique images using AI technology",
      icon: Image,
      path: "/images",
      gradient: "from-[#00C6FF] to-[#0072FF]",
      emoji: "🖼️",
    },
    {
      title: "Make Videos",
      description: "Produce professional videos with AI assistance",
      icon: Video,
      path: "/videos",
      gradient: "from-[#42E695] to-[#3BB2B8]",
      emoji: "🎬",
    },
    {
      title: "Schedule Post",
      description: "Plan and schedule your content calendar",
      icon: Calendar,
      path: "/schedule",
      gradient: "from-[#FFD54F] to-[#FFB74D]",
      emoji: "📅",
    },
  ];

  return (
    <section className="mb-4">
      <h2 className="text-xl font-semibold mb-3">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <div
              key={action.title}
              className={`bg-gradient-to-br ${action.gradient} relative rounded-xl transition-all duration-300 hover:scale-[1.02] 
                         hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] group overflow-hidden`}
            >
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
              <div className="relative p-4 h-full flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-lg">{action.emoji}</span>
                </div>
                <h3 className="text-lg font-semibold mb-1 text-white">{action.title}</h3>
                <p className="text-xs text-white/70 mb-auto line-clamp-2">
                  {action.description}
                </p>
                <Button
                  className="w-full mt-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 transition-all duration-300 text-sm"
                  onClick={() => navigate(action.path)}
                >
                  Get Started
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
