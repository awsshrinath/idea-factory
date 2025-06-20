
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Calendar, TrendingUp } from "lucide-react";

export function QuickStats() {
  const stats = [
    {
      title: "Scheduled Posts",
      value: "12",
      change: "+3",
      changeType: "increase" as const,
      icon: Calendar,
      gradient: "from-purple-600/20 to-indigo-600/20",
      iconBg: "bg-gradient-to-br from-purple-600/20 to-indigo-600/20",
      borderColor: "border-purple-500/20",
    },
    {
      title: "This Week",
      value: "5",
      change: "+2",
      changeType: "increase" as const,
      icon: BarChart3,
      gradient: "from-emerald-600/20 to-green-600/20",
      iconBg: "bg-gradient-to-br from-emerald-600/20 to-green-600/20",
      borderColor: "border-emerald-500/20",
    },
  ];

  return (
    <div className="space-y-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card 
            key={stat.title}
            className={`
              premium-card premium-card-hover cursor-pointer
              bg-gradient-to-br from-white/[0.04] to-white/[0.01] ${stat.gradient}
              ${stat.borderColor} hover:border-white/[0.15]
              transform transition-all duration-500 ease-out
              hover:scale-[1.02] elevation-2 hover:elevation-3
            `}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className={`
                  h-10 w-10 rounded-lg ${stat.iconBg} 
                  flex items-center justify-center ${stat.borderColor}
                  shadow-lg border transform transition-all duration-300 
                  group-hover:scale-110
                `}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex items-center gap-1 text-emerald-400">
                  <TrendingUp className="h-3 w-3" />
                  <span className="text-sm font-bold">{stat.change}</span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-2">
              <div>
                <p className="premium-stats text-2xl mb-1">
                  {stat.value}
                </p>
                <CardTitle className="premium-caption text-sm">
                  {stat.title}
                </CardTitle>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
