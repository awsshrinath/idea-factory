import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const stats = [
  {
    title: "Total Posts",
    value: "24",
    change: "+12%",
    icon: Calendar,
    color: "text-blue-400"
  },
  {
    title: "Scheduled",
    value: "8",
    change: "-5%",
    icon: Clock,
    color: "text-purple-400"
  },
  {
    title: "Completed",
    value: "16",
    change: "+20%",
    icon: CheckCircle,
    color: "text-green-400"
  },
  {
    title: "Errors",
    value: "2",
    change: "-10%",
    icon: AlertCircle,
    color: "text-red-400"
  }
];

export function QuickStats() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="premium-card border border-white/10 shadow-lg backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              <Badge variant="secondary" className={stat.color}>
                {stat.change}
              </Badge>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
