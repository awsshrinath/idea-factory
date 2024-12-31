import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { TrendingUp, Star } from "lucide-react";

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

export const PerformanceMetrics = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="bg-white/5 border-white/10 hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            Total Content
            <span className="text-xs text-green-400">(+15%)</span>
          </CardTitle>
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

      <Card className="bg-white/5 border-white/10 hover:shadow-lg transition-all duration-300">
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

      <Card className="bg-white/5 border-white/10 hover:shadow-lg transition-all duration-300">
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
  );
};