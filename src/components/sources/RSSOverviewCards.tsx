
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Rss, CheckCircle, FileText } from 'lucide-react';

export function RSSOverviewCards() {
  const stats = [
    {
      title: "Active Feeds",
      value: "12",
      change: "+2 this week",
      changeColor: "text-green-400",
      icon: Rss,
      iconColor: "text-orange-400"
    },
    {
      title: "New Articles",
      value: "47",
      change: "today",
      changeColor: "text-blue-400",
      icon: FileText,
      iconColor: "text-blue-400"
    },
    {
      title: "Fact-Checked",
      value: "23",
      change: "pending: 8",
      changeColor: "text-yellow-400",
      icon: CheckCircle,
      iconColor: "text-green-400"
    },
    {
      title: "Content Created",
      value: "15",
      change: "from RSS",
      changeColor: "text-purple-400",
      icon: TrendingUp,
      iconColor: "text-purple-400"
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
