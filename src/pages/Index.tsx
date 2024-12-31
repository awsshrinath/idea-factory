import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { FileText, Image, Video, Calendar, TrendingUp, Star, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

const QuickActionCard = ({
  icon: Icon,
  title,
  description,
  onClick,
}: {
  icon: any;
  title: string;
  description: string;
  onClick: () => void;
}) => (
  <div className="glass p-6 rounded-xl">
    <Icon className="h-8 w-8 mb-4 text-primary" />
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground mb-4">{description}</p>
    <Button className="w-full" onClick={onClick}>
      Get Started
    </Button>
  </div>
);

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 animate-fadeIn">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
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

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <QuickActionCard
                icon={FileText}
                title="Generate Content"
                description="Create engaging posts for your social media platforms"
                onClick={() => navigate('/content')}
              />
              <QuickActionCard
                icon={Image}
                title="Create Images"
                description="Generate unique images using AI technology"
                onClick={() => navigate('/images')}
              />
              <QuickActionCard
                icon={Video}
                title="Make Videos"
                description="Produce professional videos with AI assistance"
                onClick={() => navigate('/videos')}
              />
              <QuickActionCard
                icon={Calendar}
                title="Schedule Post"
                description="Plan and schedule your content calendar"
                onClick={() => navigate('/schedule')}
              />
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
};

export default Index;