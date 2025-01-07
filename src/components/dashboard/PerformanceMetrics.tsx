import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Star, Info } from "lucide-react";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const data = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 600 },
  { name: "Apr", value: 800 },
  { name: "May", value: 700 },
];

const sparklineData = [
  { name: "1", value: 40 },
  { name: "2", value: 30 },
  { name: "3", value: 60 },
  { name: "4", value: 50 },
  { name: "5", value: 75 },
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
      <Card className="bg-gradient-to-br from-[#1D2433] to-[#283047] border border-white/10 
                      shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-sm 
                      hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            Total Content
            <span className="text-xs text-green-400">(+15%)</span>
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Total content pieces created across all platforms</p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription>This month's performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <XAxis dataKey="name" stroke="#A0A0A0" />
                  <YAxis stroke="#A0A0A0" />
                  <Tooltip 
                    contentStyle={{ 
                      background: '#1F1F33', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px' 
                    }} 
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#E91E63"
                    fill="#E91E63"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-[#1D2433] to-[#283047] border border-white/10 
                      shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-sm 
                      hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            Engagement
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Total views and interactions across all content</p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription>Views and interactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white mb-4">8.6K</div>
          <p className="text-green-400 flex items-center gap-1 mb-4">
            <TrendingUp className="h-4 w-4" />
            32% increase
          </p>
          <div className="h-[50px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData}>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#42E695"
                  fill="#42E695"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-[#1D2433] to-[#283047] border border-white/10 
                      shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-sm 
                      hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            Top Content
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Your best performing content piece this month</p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription>Best performing post</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-400" />
            <span className="text-white">
              "10 Tips for Better Content" reached 12K views
            </span>
          </div>
          <div className="h-[50px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData}>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#FFD54F"
                  fill="#FFD54F"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};