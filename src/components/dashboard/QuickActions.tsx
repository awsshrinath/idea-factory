
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
      hoverGradient: "hover:from-slate-700 hover:to-slate-800",
      emoji: "📝",
    },
    {
      title: "Create Images",
      description: "Generate unique images using AI technology",
      icon: Image,
      path: "/images",
      gradient: "from-indigo-600 to-purple-600",
      hoverGradient: "hover:from-indigo-700 hover:to-purple-700",
      emoji: "🖼️",
    },
    {
      title: "Make Videos",
      description: "Produce professional videos with AI assistance",
      icon: Video,
      path: "/videos",
      gradient: "from-teal-600 to-cyan-600",
      hoverGradient: "hover:from-teal-700 hover:to-cyan-700",
      emoji: "🎬",
    },
    {
      title: "Schedule Post",
      description: "Plan and schedule your content calendar",
      icon: Calendar,
      path: "/schedule",
      gradient: "from-violet-600 to-purple-600",
      hoverGradient: "hover:from-violet-700 hover:to-purple-700",
      emoji: "📅",
    },
  ];

  return (
    <section className="mb-8 animate-fadeIn">
      <h2 className="text-3xl font-black mb-6 text-slate-100 leading-tight">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <div
              key={action.title}
              className={`bg-gradient-to-br ${action.gradient} relative rounded-2xl transition-all duration-300 hover:scale-105 
                         shadow-lg hover:shadow-2xl group overflow-hidden border border-slate-700/50 hover:border-slate-600/60
                         animate-fadeIn cursor-pointer transform hover:-translate-y-1`}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => navigate(action.path)}
            >
              <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
              <div className="relative p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30 group-hover:rotate-3 shadow-lg">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-2xl group-hover:scale-110 group-hover:animate-bounce transition-transform duration-300">{action.emoji}</span>
                </div>
                <h3 className="text-lg font-bold mb-2 text-white leading-tight group-hover:text-white/90">{action.title}</h3>
                <p className="text-sm text-white/80 mb-auto line-clamp-2 leading-relaxed font-medium group-hover:text-white/90">
                  {action.description}
                </p>
                <Button
                  className={`w-full mt-4 bg-white/15 hover:bg-white/25 border border-white/20 hover:border-white/40 transition-all duration-300 text-sm font-semibold backdrop-blur-sm shadow-md hover:shadow-lg transform hover:scale-105 group-hover:animate-pulse ${action.hoverGradient} hover:shadow-white/10`}
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
