
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Download, Edit, Clock, TrendingUp } from "lucide-react";

export const RecentActivity = () => {
  const activities = [
    {
      type: "Generated Post",
      title: "Summer Product Launch Campaign", 
      description: "LinkedIn & Twitter content",
      time: "2 hours ago",
      icon: FileText,
      status: "published",
      engagement: "+34%",
    },
    {
      type: "Scheduled Post",
      title: "Weekly Brand Update",
      description: "Instagram story series",
      time: "4 hours ago", 
      icon: FileText,
      status: "scheduled",
      engagement: "—",
    },
    {
      type: "Generated Image",
      title: "Product Showcase Visual",
      description: "Hero banner design",
      time: "6 hours ago",
      icon: FileText, 
      status: "draft",
      engagement: "—",
    },
  ];

  return (
    <Card className="premium-card premium-card-hover border border-white/10">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="premium-heading text-2xl">Recent Activity</CardTitle>
            <CardDescription className="premium-body mt-2">Your latest content and actions</CardDescription>
          </div>
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600/20 to-indigo-600/20 flex items-center justify-center border border-blue-500/20">
            <TrendingUp className="h-6 w-6 text-blue-400" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity, i) => (
          <div
            key={i}
            className="group glass-card rounded-xl p-6 hover:bg-white/[0.06] transition-all duration-300 border border-white/5 hover:border-white/10"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-purple-600/20 to-indigo-600/20 flex items-center justify-center border border-purple-500/20 group-hover:scale-105 transition-transform duration-300">
                  <activity.icon className="h-7 w-7 text-purple-400" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h4 className="premium-subheading text-base">{activity.title}</h4>
                    <span className={`premium-badge text-xs ${
                      activity.status === 'published' ? 'badge-recommended' :
                      activity.status === 'scheduled' ? 'badge-trending' :
                      'bg-slate-500/20 text-slate-300 border-slate-500/40'
                    }`}>
                      {activity.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="premium-body text-sm text-white/70">
                    {activity.description}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-2 premium-caption text-xs">
                      <Clock className="h-3 w-3 text-white/50" />
                      {activity.time}
                    </div>
                    {activity.engagement !== "—" && (
                      <div className="flex items-center gap-1 text-emerald-400">
                        <TrendingUp className="h-3 w-3" />
                        <span className="text-xs font-bold">{activity.engagement}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-white/10 hover:text-purple-400 transition-colors">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-white/10 hover:text-purple-400 transition-colors">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-white/10 hover:text-purple-400 transition-colors">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
