
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  TrendingUp, 
  Clock, 
  Lightbulb,
  ArrowRight,
  FileText,
  Image,
  Video,
  CheckCircle2
} from 'lucide-react';

export function SmartInsights() {
  const insights = [
    {
      title: "Content in Progress",
      description: "3 drafts waiting for review",
      icon: FileText,
      action: "Review Drafts",
      status: "active",
      progress: 75,
      color: "text-blue-400",
      bgColor: "bg-blue-600/10"
    },
    {
      title: "Recent Performance",
      description: "Images performing 23% better this week",
      icon: TrendingUp,
      action: "View Analytics",
      status: "trending",
      progress: 85,
      color: "text-green-400",
      bgColor: "bg-green-600/10"
    },
    {
      title: "AI Recommendations",
      description: "Video content trending in your niche",
      icon: Brain,
      action: "Generate Videos",
      status: "new",
      progress: 60,
      color: "text-purple-400",
      bgColor: "bg-purple-600/10"
    },
    {
      title: "Quick Templates",
      description: "5 frequently used templates available",
      icon: Lightbulb,
      action: "Use Templates",
      status: "ready",
      progress: 100,
      color: "text-orange-400",
      bgColor: "bg-orange-600/10"
    }
  ];

  const priorityTasks = [
    {
      task: "Complete weekly content calendar",
      type: "Schedule",
      icon: Clock,
      priority: "high",
      estimated: "15 min"
    },
    {
      task: "Review pending image generations",
      type: "Images",
      icon: Image,
      priority: "medium",
      estimated: "5 min"
    },
    {
      task: "Optimize top-performing posts",
      type: "Content",
      icon: Video,
      priority: "low",
      estimated: "10 min"
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Smart Insights */}
      <Card className="premium-card border border-white/10 shadow-lg backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-600/20 to-purple-600/20 flex items-center justify-center border border-indigo-500/20">
              <Brain className="h-4 w-4 text-indigo-400" />
            </div>
            <div>
              <CardTitle className="premium-heading text-xl">Smart Insights</CardTitle>
              <p className="premium-body text-sm text-muted-foreground">
                AI-powered recommendations and status
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.map((insight) => (
            <div 
              key={insight.title}
              className="premium-card premium-card-hover border border-white/10 p-4 rounded-lg group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-lg ${insight.bgColor} flex items-center justify-center border border-white/10`}>
                    <insight.icon className={`h-4 w-4 ${insight.color}`} />
                  </div>
                  <div>
                    <h4 className="premium-subheading text-sm">{insight.title}</h4>
                    <p className="premium-body text-xs text-muted-foreground">{insight.description}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {insight.status}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="premium-body text-muted-foreground">Progress</span>
                  <span className="premium-body font-medium">{insight.progress}%</span>
                </div>
                <Progress value={insight.progress} className="h-1.5" />
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full mt-3 justify-between group-hover:bg-white/5 transition-colors"
              >
                {insight.action}
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Priority Tasks */}
      <Card className="premium-card border border-white/10 shadow-lg backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-600/20 to-red-600/20 flex items-center justify-center border border-orange-500/20">
              <CheckCircle2 className="h-4 w-4 text-orange-400" />
            </div>
            <div>
              <CardTitle className="premium-heading text-xl">Today's Priority Tasks</CardTitle>
              <p className="premium-body text-sm text-muted-foreground">
                Smart recommendations for maximum impact
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {priorityTasks.map((task) => (
            <div 
              key={task.task}
              className="premium-card premium-card-hover border border-white/10 p-4 rounded-lg group cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-slate-600/20 to-slate-700/20 flex items-center justify-center border border-slate-500/20">
                  <task.icon className="h-4 w-4 text-slate-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="premium-subheading text-sm">{task.task}</h4>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        task.priority === 'high' ? 'border-red-500/30 text-red-400' :
                        task.priority === 'medium' ? 'border-yellow-500/30 text-yellow-400' :
                        'border-green-500/30 text-green-400'
                      }`}
                    >
                      {task.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="premium-body text-xs text-muted-foreground">{task.type}</span>
                    <span className="premium-body text-xs text-muted-foreground">{task.estimated}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <Button variant="outline" className="w-full mt-4">
            View All Tasks
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
