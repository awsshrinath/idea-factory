
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Clock, 
  Sparkles, 
  Zap, 
  Star, 
  Users, 
  BarChart3, 
  Shield, 
  Palette, 
  Brain,
  FileText,
  Video,
  Smartphone
} from 'lucide-react';

const roadmapItems = [
  {
    phase: "Q1 2024",
    status: "completed",
    items: [
      {
        title: "Enhanced AI Image Generation",
        description: "Advanced style controls and higher resolution outputs",
        icon: Palette,
        priority: "high"
      },
      {
        title: "AI Content Generation",
        description: "Generate articles, social media posts, and marketing copy",
        icon: FileText,
        priority: "high"
      },
      {
        title: "Improved User Interface",
        description: "A more intuitive and streamlined user experience",
        icon: Sparkles,
        priority: "medium"
      }
    ]
  },
  {
    phase: "Q2 2024",
    status: "in progress",
    items: [
      {
        title: "AI Video Generation",
        description: "Create short videos from text prompts",
        icon: Video,
        priority: "high"
      },
      {
        title: "Team Collaboration Features",
        description: "Share projects and collaborate with team members",
        icon: Users,
        priority: "medium"
      },
      {
        title: "Mobile App",
        description: "Access all features on the go with our mobile app",
        icon: Smartphone,
        priority: "low"
      }
    ]
  },
  {
    phase: "Q3 2024",
    status: "planned",
    items: [
      {
        title: "AI-Powered SEO Tools",
        description: "Optimize content for search engines with AI",
        icon: BarChart3,
        priority: "high"
      },
      {
        title: "Advanced Security Features",
        description: "Enhanced security measures to protect user data",
        icon: Shield,
        priority: "medium"
      },
      {
        title: "Personalized Recommendations",
        description: "AI-driven content and tool recommendations",
        icon: Brain,
        priority: "low"
      }
    ]
  }
];

const statusIcons = {
  completed: CheckCircle,
  "in progress": Clock,
  planned: Star
};

export function RoadmapSection() {
  return (
    <Card className="premium-card border border-white/10 shadow-lg backdrop-blur-sm">
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-600/20 to-yellow-600/20 flex items-center justify-center border border-orange-500/20">
            <Zap className="h-4 w-4 text-orange-400" />
          </div>
          <div>
            <CardTitle className="premium-heading text-xl">Product Roadmap</CardTitle>
            <CardDescription className="premium-body">
              Our vision for the future of AI-powered creativity
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {roadmapItems.map((phase, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="premium-subheading text-lg">{phase.phase}</h3>
              <Badge variant="secondary" className="flex items-center gap-1">
                {React.createElement(statusIcons[phase.status as keyof typeof statusIcons], { className: "h-3 w-3" })}
                {phase.status}
              </Badge>
            </div>
            <div className="space-y-3">
              {phase.items.map((item, itemIndex) => (
                <div key={itemIndex} className="premium-card premium-card-hover border border-white/10 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-md bg-gradient-to-br from-blue-600/20 to-indigo-600/20 flex items-center justify-center border border-blue-500/20">
                      {React.createElement(item.icon, { className: "h-3 w-3 text-blue-400" })}
                    </div>
                    <div className="space-y-1">
                      <h4 className="premium-subheading text-sm">{item.title}</h4>
                      <p className="premium-body text-xs">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
