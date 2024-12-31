import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Download, Edit } from "lucide-react";

export const RecentActivity = () => {
  const activities = [
    {
      type: "Generated Post",
      title: "Social Media Strategy",
      time: "2 hours ago",
      icon: FileText,
    },
    {
      type: "Scheduled Post",
      title: "Weekly Update",
      time: "4 hours ago",
      icon: FileText,
    },
    {
      type: "Generated Image",
      title: "Product Showcase",
      time: "6 hours ago",
      icon: FileText,
    },
  ];

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Recent Activity</CardTitle>
        <CardDescription>Your latest content and actions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded bg-primary/20 flex items-center justify-center">
                  <activity.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="text-white font-medium">{activity.type}</h4>
                  <p className="text-sm text-muted-foreground">
                    {activity.time}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="hover:text-primary">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:text-primary">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:text-primary">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};