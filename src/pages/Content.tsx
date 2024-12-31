import { Sidebar } from "@/components/Sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Image,
  Video,
  Calendar,
  TrendingUp,
  Star,
  Bell,
} from "lucide-react";
import { ChartContainer } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

const data = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 600 },
  { name: "Apr", value: 800 },
  { name: "May", value: 700 },
];

const chartConfig = {
  primary: {
    color: "#E91E63",
  },
  secondary: {
    color: "#1DE9B6",
  },
};

export function Content() {
  return (
    <div className="min-h-screen flex bg-[#121826]">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 animate-fadeIn">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-white">
                Welcome back, Creator!
              </h1>
              <p className="text-muted-foreground mt-2">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { icon: FileText, label: "New Content" },
              { icon: Video, label: "Create Video" },
              { icon: Image, label: "Generate Image" },
              { icon: Calendar, label: "Schedule Post" },
            ].map((action) => (
              <Button
                key={action.label}
                className="h-24 flex-col gap-2 bg-white/5 hover:bg-white/10"
              >
                <action.icon className="h-6 w-6" />
                {action.label}
              </Button>
            ))}
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Total Content</CardTitle>
                <CardDescription>This month's performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] w-full">
                  <ChartContainer config={chartConfig}>
                    <AreaChart data={data}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#E91E63"
                        fill="#E91E63"
                        fillOpacity={0.2}
                      />
                    </AreaChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Engagement</CardTitle>
                <CardDescription>Views and interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">8.6K</div>
                <p className="text-green-400 flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  32% increase
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Top Content</CardTitle>
                <CardDescription>Best performing post</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span className="text-white">
                    "10 Tips for Better Content" reached 12K views
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
              <CardDescription>Your latest content and actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 rounded-lg bg-white/5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded bg-primary/20 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">
                          New Content Created
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          2 hours ago
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}