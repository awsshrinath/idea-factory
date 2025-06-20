
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  Images, 
  Calendar, 
  BarChart3, 
  Sparkles,
  ArrowRight,
  Zap
} from "lucide-react";

export const WorkflowActions = () => {
  const navigate = useNavigate();

  const workflowActions = [
    {
      title: "Generate Today's Content",
      description: "Pre-filled daily content workflow with trending topics",
      icon: FileText,
      path: "/content",
      action: "daily-content",
      gradient: "from-emerald-900/70 to-teal-900/50",
      iconBg: "bg-gradient-to-br from-emerald-600/80 to-teal-600/60",
      borderGlow: "hover:shadow-[0_0_40px_rgba(16,185,129,0.2)]",
      emoji: "✨",
    },
    {
      title: "Batch Create Images",
      description: "Multi-image generation workflow for campaigns",
      icon: Images,
      path: "/images",
      action: "batch-images",
      gradient: "from-purple-900/70 to-indigo-900/50",
      iconBg: "bg-gradient-to-br from-purple-600/80 to-indigo-600/60",
      borderGlow: "hover:shadow-[0_0_40px_rgba(139,92,246,0.2)]",
      emoji: "🎨",
    },
    {
      title: "Schedule This Week",
      description: "7-day content planning interface with AI suggestions",
      icon: Calendar,
      path: "/schedule",
      action: "weekly-plan",
      gradient: "from-blue-900/70 to-cyan-900/50",
      iconBg: "bg-gradient-to-br from-blue-600/80 to-cyan-600/60",
      borderGlow: "hover:shadow-[0_0_40px_rgba(59,130,246,0.2)]",
      emoji: "📅",
    },
    {
      title: "Performance Review",
      description: "Quick analytics and insights dashboard",
      icon: BarChart3,
      path: "/",
      action: "analytics",
      gradient: "from-orange-900/70 to-red-900/50",
      iconBg: "bg-gradient-to-br from-orange-600/80 to-red-600/60",
      borderGlow: "hover:shadow-[0_0_40px_rgba(249,115,22,0.2)]",
      emoji: "📊",
    },
  ];

  const handleActionClick = (path: string, action: string) => {
    // Add workflow-specific state/params when navigating
    navigate(path, { state: { workflow: action } });
  };

  return (
    <Card className="premium-card border border-white/10 shadow-lg backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600/20 to-indigo-600/20 flex items-center justify-center border border-purple-500/20">
            <Zap className="h-4 w-4 text-purple-400" />
          </div>
          <div>
            <CardTitle className="premium-heading text-xl">Workflow Actions</CardTitle>
            <p className="premium-body text-sm text-muted-foreground">
              One-click shortcuts for common workflows
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {workflowActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <div
                key={action.title}
                className={`
                  group relative overflow-hidden rounded-xl cursor-pointer
                  bg-gradient-to-br ${action.gradient}
                  border border-white/[0.08] hover:border-white/[0.15]
                  backdrop-blur-xl shadow-lg hover:shadow-xl
                  transform transition-all duration-300 ease-out
                  hover:scale-[1.02] hover:-translate-y-1
                  ${action.borderGlow}
                  animate-fadeIn
                `}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => handleActionClick(action.path, action.action)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative p-4 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`
                      h-10 w-10 rounded-lg ${action.iconBg} 
                      flex items-center justify-center
                      shadow-lg group-hover:shadow-xl
                      transform transition-all duration-300 
                      group-hover:scale-110 group-hover:rotate-3
                      border border-white/10 group-hover:border-white/20
                    `}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl transform transition-transform duration-300 group-hover:scale-110">
                      {action.emoji}
                    </span>
                  </div>
                  
                  <h3 className="text-sm font-bold text-white mb-2 leading-tight group-hover:text-white/95 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-xs text-white/70 mb-3 leading-relaxed font-medium flex-grow">
                    {action.description}
                  </p>
                  
                  <Button
                    size="sm"
                    className="
                      w-full h-8 bg-white/5 hover:bg-white/15 
                      border border-white/10 hover:border-white/25
                      text-white font-semibold text-xs
                      backdrop-blur-sm transition-all duration-300
                      shadow-sm hover:shadow-lg
                      group-hover:bg-white/20 group-hover:border-white/30
                    "
                  >
                    Start Workflow
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
