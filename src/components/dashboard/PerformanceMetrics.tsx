
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Star, Info, ArrowUp, ArrowDown } from "lucide-react";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState, useEffect } from "react";

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
  const [animatedValue, setAnimatedValue] = useState(0);
  const targetValue = 8.6;

  useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0;
      const increment = targetValue / 50;
      const counter = setInterval(() => {
        start += increment;
        if (start >= targetValue) {
          setAnimatedValue(targetValue);
          clearInterval(counter);
        } else {
          setAnimatedValue(start);
        }
      }, 30);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fadeIn" style={{ animationDelay: "600ms" }}>
      <Card className="bg-gradient-to-br from-card/80 via-card/60 to-muted/40 border border-white/20 
                      shadow-xl hover:shadow-2xl rounded-2xl backdrop-blur-sm 
                      hover:border-white/30 transition-all duration-300 transform hover:scale-105 overflow-hidden group">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2 text-xl font-bold">
            Total Content
            <div className="flex items-center gap-1">
              <ArrowUp className="h-4 w-4 text-green-400 animate-bounce" />
              <span className="text-sm text-green-400 font-semibold">(+15%)</span>
            </div>
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground hover:text-blue-400 transition-colors cursor-help" />
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
          <div className="h-[160px] w-full group-hover:scale-105 transition-transform duration-300">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#A0A0A0" fontSize={12} />
                  <YAxis stroke="#A0A0A0" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'rgba(30, 41, 59, 0.95)', 
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '12px',
                      backdropFilter: 'blur(10px)',
                      animation: 'fadeIn 0.2s ease-out'
                    }} 
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#3B82F6"
                    fill="url(#colorValue)"
                    strokeWidth={3}
                    className="hover:stroke-[#1D4ED8] transition-colors duration-300"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-card/80 via-card/60 to-muted/40 border border-white/20 
                      shadow-xl hover:shadow-2xl rounded-2xl backdrop-blur-sm 
                      hover:border-white/30 transition-all duration-300 transform hover:scale-105 overflow-hidden group">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2 text-xl font-bold">
            Engagement
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground hover:text-blue-400 transition-colors cursor-help" />
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
          <div className="text-3xl font-black text-white mb-3 leading-tight tabular-nums">
            {animatedValue.toFixed(1)}K
          </div>
          <p className="text-cyan-400 flex items-center gap-2 mb-3 text-sm font-semibold">
            <TrendingUp className="h-4 w-4 animate-pulse" />
            <ArrowUp className="h-3 w-3 animate-bounce" />
            32% increase
          </p>
          <div className="h-[60px] group-hover:scale-105 transition-transform duration-300">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData}>
                <defs>
                  <linearGradient id="colorCyan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#06B6D4"
                  fill="url(#colorCyan)"
                  strokeWidth={3}
                  className="hover:stroke-[#0891B2] transition-colors duration-300"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-card/80 via-card/60 to-muted/40 border border-white/20 
                      shadow-xl hover:shadow-2xl rounded-2xl backdrop-blur-sm 
                      hover:border-white/30 transition-all duration-300 transform hover:scale-105 overflow-hidden group">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2 text-xl font-bold">
            Top Content
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground hover:text-blue-400 transition-colors cursor-help" />
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
            <Star className="h-6 w-6 text-yellow-400 animate-pulse" />
            <span className="text-white text-sm font-semibold leading-relaxed">
              "10 Tips for Better Content" reached 12K views
            </span>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1 text-green-400 text-sm font-semibold">
              <ArrowUp className="h-3 w-3 animate-bounce" />
              +250% vs last month
            </div>
          </div>
          <div className="h-[60px] group-hover:scale-105 transition-transform duration-300">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData}>
                <defs>
                  <linearGradient id="colorYellow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#F59E0B"
                  fill="url(#colorYellow)"
                  strokeWidth={3}
                  className="hover:stroke-[#D97706] transition-colors duration-300"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
