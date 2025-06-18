
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
      gradient: "from-slate-600 to-slate-700",
      emoji: "📝",
    },
    {
      title: "Create Images",
      description: "Generate unique images using AI technology",
      icon: Image,
      path: "/images",
      gradient: "from-indigo-600 to-purple-600",
      emoji: "🖼️",
    },
    {
      title: "Make Videos",
      description: "Produce professional videos with AI assistance",
      icon: Video,
      path: "/videos",
      gradient: "from-teal-600 to-cyan-600",
      emoji: "🎬",
    },
    {
      title: "Schedule Post",
      description: "Plan and schedule your content calendar",
      icon: Calendar,
      path: "/schedule",
      gradient: "from-violet-600 to-purple-600",
      emoji: "📅",
    },
  ];

  return (
    <section className="mb-8 animate-fadeIn">
      <h2 className="text-2xl font-bold mb-6 text-foreground leading-tight">Quick Actions</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <div
              key={action.title}
              className={`premium-card premium-card-hover bg-gradient-to-br ${action.gradient} relative rounded-xl 
                         cursor-pointer transform transition-all duration-200 gentle-hover group overflow-hidden
                         animate-fadeIn`}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => navigate(action.path)}
            >
              <div className="absolute inset-0 bg-black/20 backdrop-blur-xs"></div>
              <div className="relative p-5 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 rounded-lg bg-white/15 backdrop-blur-sm flex items-center justify-center transform transition-all duration-200 group-hover:scale-110 group-hover:bg-white/25 shadow-soft">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl group-hover:scale-110 transition-transform duration-200">{action.emoji}</span>
                </div>
                <h3 className="text-base font-semibold mb-2 text-white leading-tight">{action.title}</h3>
                <p className="text-sm text-white/80 mb-auto line-clamp-2 leading-relaxed">
                  {action.description}
                </p>
                <Button
                  className="w-full mt-4 bg-white/10 hover:bg-white/20 border border-white/15 hover:border-white/30 transition-all duration-200 text-sm font-medium backdrop-blur-sm shadow-soft micro-bounce text-white"
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
