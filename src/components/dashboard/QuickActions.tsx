
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Image, Video, Calendar, Sparkles } from "lucide-react";

export const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Generate Content",
      description: "Create engaging posts with AI-powered content generation",
      icon: FileText,
      path: "/content",
      gradient: "from-slate-800/80 to-slate-900/60",
      iconBg: "bg-gradient-to-br from-slate-600/80 to-slate-700/60",
      borderGlow: "hover:shadow-[0_0_40px_rgba(148,163,184,0.15)]",
      emoji: "📝",
    },
    {
      title: "Create Images",
      description: "Generate stunning visuals with advanced AI models",
      icon: Image,
      path: "/images",
      gradient: "from-indigo-900/70 to-purple-900/50",
      iconBg: "bg-gradient-to-br from-indigo-600/80 to-purple-600/60",
      borderGlow: "hover:shadow-[0_0_40px_rgba(99,102,241,0.2)]",
      emoji: "🎨",
    },
    {
      title: "Make Videos",
      description: "Produce professional videos with intelligent automation",
      icon: Video,
      path: "/videos",
      gradient: "from-teal-900/70 to-cyan-900/50",
      iconBg: "bg-gradient-to-br from-teal-600/80 to-cyan-600/60",
      borderGlow: "hover:shadow-[0_0_40px_rgba(20,184,166,0.2)]",
      emoji: "🎬",
    },
    {
      title: "Schedule Posts",
      description: "Plan and automate your content calendar strategically",
      icon: Calendar,
      path: "/schedule",
      gradient: "from-violet-900/70 to-purple-900/50",
      iconBg: "bg-gradient-to-br from-violet-600/80 to-purple-600/60",
      borderGlow: "hover:shadow-[0_0_40px_rgba(139,92,246,0.2)]",
      emoji: "📅",
    },
  ];

  return (
    <section className="mb-12 animate-fadeIn">
      <div className="flex items-center gap-3 mb-8">
        <h2 className="text-3xl font-bold text-white leading-tight tracking-tight">Quick Actions</h2>
        <Sparkles className="h-6 w-6 text-purple-400/80 animate-pulse" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <div
              key={action.title}
              className={`
                group relative overflow-hidden rounded-2xl cursor-pointer
                bg-gradient-to-br ${action.gradient}
                border border-white/[0.08] hover:border-white/[0.15]
                backdrop-blur-xl shadow-xl hover:shadow-2xl
                transform transition-all duration-500 ease-out
                hover:scale-[1.02] hover:-translate-y-1
                ${action.borderGlow}
                animate-fadeIn
              `}
              style={{ animationDelay: `${index * 150}ms` }}
              onClick={() => navigate(action.path)}
            >
              {/* Premium gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Content */}
              <div className="relative p-6 h-full flex flex-col">
                {/* Header with icon and emoji */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`
                    h-12 w-12 rounded-xl ${action.iconBg} 
                    flex items-center justify-center
                    shadow-lg group-hover:shadow-xl
                    transform transition-all duration-300 
                    group-hover:scale-110 group-hover:rotate-3
                    border border-white/10 group-hover:border-white/20
                  `}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-2xl transform transition-transform duration-300 group-hover:scale-110">
                    {action.emoji}
                  </span>
                </div>
                
                {/* Title and description */}
                <h3 className="text-lg font-bold text-white mb-3 leading-tight group-hover:text-white/95 transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-white/70 mb-6 leading-relaxed font-medium flex-grow">
                  {action.description}
                </p>
                
                {/* CTA Button */}
                <Button
                  className="
                    w-full h-11 bg-white/5 hover:bg-white/10 
                    border border-white/10 hover:border-white/25
                    text-white font-semibold text-sm
                    backdrop-blur-sm transition-all duration-300
                    shadow-sm hover:shadow-lg
                    group-hover:bg-white/15 group-hover:border-white/30
                  "
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
