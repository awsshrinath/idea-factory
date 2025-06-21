
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  GitBranch, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Play,
  Pause,
  ArrowRight
} from 'lucide-react';

export function ContentPipeline() {
  const pipelineStages = [
    {
      stage: "Ideation",
      count: 12,
      status: "active",
      progress: 85,
      color: "text-blue-400",
      bgColor: "bg-blue-600/10"
    },
    {
      stage: "Creation",
      count: 5,
      status: "in-progress",
      progress: 60,
      color: "text-orange-400",
      bgColor: "bg-orange-600/10"
    },
    {
      stage: "Review",
      count: 3,
      status: "pending",
      progress: 100,
      color: "text-yellow-400",
      bgColor: "bg-yellow-600/10"
    },
    {
      stage: "Scheduled",
      count: 8,
      status: "ready",
      progress: 100,
      color: "text-green-400",
      bgColor: "bg-green-600/10"
    }
  ];

  const recentActivity = [
    {
      action: "Generated 3 images for social media campaign",
      type: "Images",
      time: "2 minutes ago",
      status: "completed"
    },
    {
      action: "Created weekly content calendar",
      type: "Schedule",
      time: "15 minutes ago",
      status: "completed"
    },
    {
      action: "Started video generation workflow",
      type: "Videos",
      time: "1 hour ago",
      status: "in-progress"
    },
    {
      action: "Published Instagram post",
      type: "Content",
      time: "2 hours ago",
      status: "completed"
    }
  ];

  const trendingOpportunities = [
    {
      trend: "AI Art Tutorials",
      engagement: "+45%",
      platforms: ["Instagram", "TikTok"],
      confidence: 85
    },
    {
      trend: "Behind-the-Scenes Content",
      engagement: "+32%",
      platforms: ["YouTube", "LinkedIn"],
      confidence: 78
    },
    {
      trend: "Quick Tips Format",
      engagement: "+28%",
      platforms: ["Instagram", "Twitter"],
      confidence: 72
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Content Pipeline Status */}
      <Card className="premium-card border border-white/10 shadow-lg backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-teal-600/20 to-cyan-600/20 flex items-center justify-center border border-teal-500/20">
                <GitBranch className="h-4 w-4 text-teal-400" />
              </div>
              <div>
                <CardTitle className="premium-heading text-lg">Pipeline Status</CardTitle>
                <p className="premium-body text-xs text-muted-foreground">
                  Content workflow progress
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {pipelineStages.map((stage) => (
            <div key={stage.stage} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${stage.bgColor}`} />
                  <span className="premium-subheading text-sm">{stage.stage}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">{stage.count}</Badge>
                  {stage.status === 'in-progress' && <Play className="h-3 w-3 text-orange-400" />}
                  {stage.status === 'pending' && <Pause className="h-3 w-3 text-yellow-400" />}
                  {stage.status === 'ready' && <CheckCircle2 className="h-3 w-3 text-green-400" />}
                </div>
              </div>
              <Progress value={stage.progress} className="h-1" />
            </div>
          ))}
          
          <Button variant="outline" size="sm" className="w-full mt-4">
            Manage Pipeline
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </CardContent>
      </Card>

      {/* Recent Activity Feed */}
      <Card className="premium-card border border-white/10 shadow-lg backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600/20 to-purple-600/20 flex items-center justify-center border border-violet-500/20">
              <Clock className="h-4 w-4 text-violet-400" />
            </div>
            <div>
              <CardTitle className="premium-heading text-lg">Recent Activity</CardTitle>
              <p className="premium-body text-xs text-muted-foreground">
                What you've been working on
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentActivity.map((activity) => (
            <div key={activity.action} className="premium-card premium-card-hover border border-white/10 p-3 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {activity.status === 'completed' ? 
                    <CheckCircle2 className="h-4 w-4 text-green-400" /> :
                    <AlertCircle className="h-4 w-4 text-orange-400" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="premium-body text-sm leading-relaxed">{activity.action}</p>
                  <div className="flex items-center justify-between mt-1">
                    <Badge variant="outline" className="text-xs">{activity.type}</Badge>
                    <span className="premium-body text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <Button variant="ghost" size="sm" className="w-full">
            View All Activity
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </CardContent>
      </Card>

      {/* Trending Opportunities */}
      <Card className="premium-card border border-white/10 shadow-lg backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-pink-600/20 to-rose-600/20 flex items-center justify-center border border-pink-500/20">
              <AlertCircle className="h-4 w-4 text-pink-400" />
            </div>
            <div>
              <CardTitle className="premium-heading text-lg">Trending Now</CardTitle>
              <p className="premium-body text-xs text-muted-foreground">
                Content opportunities to explore
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {trendingOpportunities.map((opportunity) => (
            <div key={opportunity.trend} className="premium-card premium-card-hover border border-white/10 p-3 rounded-lg cursor-pointer group">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="premium-subheading text-sm">{opportunity.trend}</h4>
                  <Badge variant="secondary" className="text-xs text-green-400 bg-green-400/10">
                    {opportunity.engagement}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {opportunity.platforms.map((platform) => (
                      <Badge key={platform} variant="outline" className="text-xs">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                  <span className="premium-body text-xs text-muted-foreground">
                    {opportunity.confidence}% confidence
                  </span>
                </div>
                
                <Progress value={opportunity.confidence} className="h-1" />
              </div>
            </div>
          ))}
          
          <Button variant="outline" size="sm" className="w-full mt-4">
            Explore Trends
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
