
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
    color: "#3B82F6",
  },
  secondary: {
    color: "#06B6D4",
  },
};

export const PerformanceMetrics = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="bg-gradient-to-br from-card/80 via-card/60 to-muted/40 border border-white/20 
                      shadow-xl hover:shadow-2xl rounded-2xl backdrop-blur-sm 
                      hover:border-white/30 transition-all duration-300 transform hover:scale-105 overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2 text-xl font-bold">
            Total Content
            <span className="text-sm text-green-400 font-semibold">(+15%)</span>
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground hover:text-blue-400 transition-colors" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Total content pieces created across all platforms</p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription className="font-medium">This month's performance</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-[160px] w-full">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#A0A0A0" fontSize={12} />
                  <YAxis stroke="#A0A0A0" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'rgba(30, 41, 59, 0.95)', 
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '12px',
                      backdropFilter: 'blur(10px)'
                    }} 
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#3B82F6"
                    fill="url(#colorValue)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-card/80 via-card/60 to-muted/40 border border-white/20 
                      shadow-xl hover:shadow-2xl rounded-2xl backdrop-blur-sm 
                      hover:border-white/30 transition-all duration-300 transform hover:scale-105 overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2 text-xl font-bold">
            Engagement
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground hover:text-blue-400 transition-colors" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Total views and interactions across all content</p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription className="font-medium">Views and interactions</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-3xl font-black text-white mb-3 leading-tight">8.6K</div>
          <p className="text-cyan-400 flex items-center gap-2 mb-3 text-sm font-semibold">
            <TrendingUp className="h-4 w-4" />
            32% increase
          </p>
          <div className="h-[60px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData}>
                <defs>
                  <linearGradient id="colorCyan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#06B6D4"
                  fill="url(#colorCyan)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-card/80 via-card/60 to-muted/40 border border-white/20 
                      shadow-xl hover:shadow-2xl rounded-2xl backdrop-blur-sm 
                      hover:border-white/30 transition-all duration-300 transform hover:scale-105 overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2 text-xl font-bold">
            Top Content
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground hover:text-blue-400 transition-colors" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Your best performing content piece this month</p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription className="font-medium">Best performing post</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center gap-3 mb-3">
            <Star className="h-6 w-6 text-yellow-400" />
            <span className="text-white text-sm font-semibold leading-relaxed">
              "10 Tips for Better Content" reached 12K views
            </span>
          </div>
          <div className="h-[60px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData}>
                <defs>
                  <linearGradient id="colorYellow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#F59E0B"
                  fill="url(#colorYellow)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
