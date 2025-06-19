
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, FileText, Image, Video, Settings, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export const QuickLinkBar = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const quickLinks = [
    {
      title: "Content",
      icon: FileText,
      path: "/content",
      description: "Generate posts",
      gradient: "from-slate-600/20 to-slate-700/20",
      borderColor: "border-slate-500/20",
    },
    {
      title: "Images", 
      icon: Image,
      path: "/images",
      description: "Create visuals",
      gradient: "from-indigo-600/20 to-purple-600/20",
      borderColor: "border-indigo-500/20",
    },
    {
      title: "Videos",
      icon: Video,
      path: "/videos", 
      description: "Make videos",
      gradient: "from-teal-600/20 to-cyan-600/20",
      borderColor: "border-teal-500/20",
    },
    {
      title: "Schedule",
      icon: Calendar,
      path: "/schedule",
      description: "Plan posts",
      gradient: "from-violet-600/20 to-purple-600/20",
      borderColor: "border-violet-500/20",
    },
    {
      title: "Analytics",
      icon: BarChart3,
      path: "/analytics",
      description: "View metrics",
      gradient: "from-emerald-600/20 to-green-600/20",
      borderColor: "border-emerald-500/20",
    },
    {
      title: "Settings",
      icon: Settings,
      path: "/settings",
      description: "Configure",
      gradient: "from-amber-600/20 to-orange-600/20",
      borderColor: "border-amber-500/20",
    },
  ];

  return (
    <section className="mb-8 animate-fadeIn">
      <div className={cn(
        "glass-card rounded-2xl p-6 border border-white/10",
        "bg-gradient-to-br from-white/[0.02] to-white/[0.01]",
        "backdrop-blur-xl shadow-xl"
      )}>
        <div className={cn(
          "flex items-center gap-4",
          isMobile ? "flex-wrap justify-center" : "justify-between"
        )}>
          <div className="flex items-center gap-3">
            <h3 className="premium-subheading text-lg">Quick Access</h3>
            <ArrowRight className="h-5 w-5 text-purple-400" />
          </div>
          
          <div className={cn(
            "flex gap-3",
            isMobile ? "flex-wrap justify-center" : "flex-row"
          )}>
            {quickLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <Button
                  key={link.title}
                  onClick={() => navigate(link.path)}
                  variant="ghost"
                  size="sm" 
                  className={cn(
                    "group relative h-12 px-4",
                    "bg-gradient-to-br hover:bg-gradient-to-br",
                    "border hover:border-white/20 transition-all duration-300",
                    "hover:scale-105 transform",
                    link.gradient,
                    link.borderColor,
                    isMobile ? "min-w-[100px]" : ""
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                    <div className="text-left">
                      <div className="text-xs font-semibold">{link.title}</div>
                      {!isMobile && (
                        <div className="text-xs text-white/60">{link.description}</div>
                      )}
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
