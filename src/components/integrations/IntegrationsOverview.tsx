
import { Card, CardContent } from '@/components/ui/card';
import { Zap, CheckCircle, Clock, TrendingUp } from 'lucide-react';

export function IntegrationsOverview() {
  const stats = [
    {
      title: "Active Integrations",
      value: "3",
      change: "+1 this week",
      changeColor: "text-green-400",
      icon: CheckCircle,
      iconColor: "text-green-400"
    },
    {
      title: "Automated Actions",
      value: "47",
      change: "this month",
      changeColor: "text-blue-400",
      icon: Zap,
      iconColor: "text-yellow-400"
    },
    {
      title: "Time Saved",
      value: "12h",
      change: "per week",
      changeColor: "text-purple-400",
      icon: Clock,
      iconColor: "text-purple-400"
    },
    {
      title: "Workflow Efficiency",
      value: "85%",
      change: "+12% improvement",
      changeColor: "text-green-400",
      icon: TrendingUp,
      iconColor: "text-green-400"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index} className="premium-card bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm text-gray-400 font-medium">{stat.title}</h3>
                <IconComponent className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <span className={`text-xs font-medium ${stat.changeColor}`}>
                  {stat.change}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
