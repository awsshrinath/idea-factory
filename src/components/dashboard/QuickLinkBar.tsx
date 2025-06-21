import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { 
  ImageIcon, 
  Video, 
  FileText, 
  Calendar,
  Sparkles
} from 'lucide-react';

const quickLinks = [
  {
    title: "AI Images",
    description: "Generate stunning visuals",
    path: "/images",
    icon: ImageIcon,
    color: "from-purple-600 to-indigo-600",
    bgGradient: "from-purple-600/10 to-indigo-600/10",
    borderColor: "border-purple-500/20"
  },
  {
    title: "AI Videos",
    description: "Create engaging video content",
    path: "/videos",
    icon: Video,
    color: "from-blue-600 to-cyan-600",
    bgGradient: "from-blue-600/10 to-cyan-600/10",
    borderColor: "border-blue-500/20"
  },
  {
    title: "AI Content",
    description: "Generate articles and copy",
    path: "/content",
    icon: FileText,
    color: "from-orange-600 to-yellow-600",
    bgGradient: "from-orange-600/10 to-yellow-600/10",
    borderColor: "border-orange-500/20"
  },
  {
    title: "AI Schedule",
    description: "Plan and schedule content",
    path: "/schedule",
    icon: Calendar,
    color: "from-red-600 to-pink-600",
    bgGradient: "from-red-600/10 to-pink-600/10",
    borderColor: "border-red-500/20"
  }
];

export function QuickLinkBar() {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="premium-heading text-2xl">
            Quick Links
          </h2>
          <Sparkles className="h-5 w-5 text-purple-400 animate-pulse" />
        </div>
        <Badge variant="secondary">
          AI Powered
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickLinks.map((link) => (
          <Card 
            key={link.path}
            className="premium-card premium-card-hover cursor-pointer transition-all duration-300 group hover:scale-[1.02] border border-white/10 bg-gradient-to-br from-slate-900/60 to-slate-800/40 backdrop-blur-sm"
            onClick={() => navigate(link.path)}
          >
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${link.bgGradient} flex items-center justify-center border ${link.borderColor}`}>
                  <link.icon className="h-4 w-4 text-white" />
                </div>
                <CardTitle className="premium-subheading text-lg">
                  {link.title}
                </CardTitle>
              </div>
              <p className="premium-body text-sm line-clamp-2">
                {link.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
