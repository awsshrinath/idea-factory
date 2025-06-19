
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Eye, Heart, Share, Users, BarChart3 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export const PerformanceMetrics = () => {
  const metrics = [
    {
      title: "Total Reach",
      value: "47.2K",
      change: "+23%",
      description: "vs last month",
      icon: Eye,
      progress: 78,
      gradient: "from-blue-600/20 to-indigo-600/20",
      iconBg: "bg-gradient-to-br from-blue-600/20 to-indigo-600/20",
      borderColor: "border-blue-500/20",
      changeColor: "text-emerald-400",
    },
    {
      title: "Engagement Rate", 
      value: "8.4%",
      change: "+12%",
      description: "avg across platforms",
      icon: Heart,
      progress: 84,
      gradient: "from-pink-600/20 to-rose-600/20",
      iconBg: "bg-gradient-to-br from-pink-600/20 to-rose-600/20",
      borderColor: "border-pink-500/20",
      changeColor: "text-emerald-400",
    },
    {
      title: "Content Shares",
      value: "2.8K",
      change: "+45%",
      description: "this week",
      icon: Share,
      progress: 92,
      gradient: "from-purple-600/20 to-violet-600/20",
      iconBg: "bg-gradient-to-br from-purple-600/20 to-violet-600/20",
      borderColor: "border-purple-500/20",
      changeColor: "text-emerald-400",
    },
    {
      title: "New Followers",
      value: "1.2K",
      change: "+67%",
      description: "growth rate",
      icon: Users,
      progress: 67,
      gradient: "from-teal-600/20 to-cyan-600/20",
      iconBg: "bg-gradient-to-br from-teal-600/20 to-cyan-600/20",
      borderColor: "border-teal-500/20",
      changeColor: "text-emerald-400",
    },
  ];

  return (
    <section className="mb-12 animate-fadeIn" style={{ animationDelay: "600ms" }}>
      <div className="flex items-center gap-3 mb-8">
        <h2 className="enterprise-heading text-3xl">Performance Metrics</h2>
        <BarChart3 className="h-6 w-6 text-indigo-400 animate-pulse" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card
              key={metric.title}
              className={`
                group premium-card premium-card-hover cursor-pointer
                bg-gradient-to-br from-white/[0.04] to-white/[0.01] ${metric.gradient}
                ${metric.borderColor} hover:border-white/[0.15]
                transform transition-all duration-500 ease-out
                hover:scale-[1.02] hover:-translate-y-1 animate-fadeIn
                elevation-2 hover:elevation-4
              `}
              style={{ animationDelay: `${700 + index * 100}ms` }}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className={`
                    h-12 w-12 rounded-xl ${metric.iconBg} 
                    flex items-center justify-center ${metric.borderColor}
                    shadow-lg group-hover:shadow-xl border
                    transform transition-all duration-300 
                    group-hover:scale-110 group-hover:rotate-3
                  `}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className={`flex items-center gap-1 ${metric.changeColor}`}>
                      <TrendingUp className="h-3 w-3" />
                      <span className="text-sm font-bold">{metric.change}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <CardTitle className="premium-stats text-3xl mb-1 leading-tight">
                    {metric.value}
                  </CardTitle>
                  <CardDescription className="premium-caption text-sm">
                    {metric.title}
                  </CardDescription>
                </div>
                
                <div className="space-y-3">
                  <Progress 
                    value={metric.progress} 
                    className="h-2 rounded-full bg-slate-800/50 shadow-inner" 
                  />
                  <p className="premium-caption text-xs">
                    {metric.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};
