
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
      <Card className="bg-gradient-to-br from-[#1D2433] to-[#283047] border border-white/10 
                      shadow-[0_4px_15px_rgba(0,0,0,0.2)] rounded-xl backdrop-blur-sm 
                      hover:shadow-[0_8px_30px_rgba(233,30,99,0.15)] transition-all duration-300 transform hover:scale-[1.01] overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-white flex items-center gap-2 text-lg">
            Total Content
            <span className="text-xs text-green-400 font-normal">(+15%)</span>
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
        <CardContent className="pt-0">
          <div className="h-[160px] w-full">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E91E63" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#E91E63" stopOpacity={0} />
                    </linearGradient>
                  </defs>
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
                    fill="url(#colorValue)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-[#1D2433] to-[#283047] border border-white/10 
                      shadow-[0_4px_15px_rgba(0,0,0,0.2)] rounded-xl backdrop-blur-sm 
                      hover:shadow-[0_8px_30px_rgba(66,230,149,0.15)] transition-all duration-300 transform hover:scale-[1.01] overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-white flex items-center gap-2 text-lg">
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
        <CardContent className="pt-0">
          <div className="text-2xl font-bold text-white mb-2">8.6K</div>
          <p className="text-green-400 flex items-center gap-1 mb-2 text-sm">
            <TrendingUp className="h-4 w-4" />
            32% increase
          </p>
          <div className="h-[60px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData}>
                <defs>
                  <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#42E695" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#42E695" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#42E695"
                  fill="url(#colorGreen)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-[#1D2433] to-[#283047] border border-white/10 
                      shadow-[0_4px_15px_rgba(0,0,0,0.2)] rounded-xl backdrop-blur-sm 
                      hover:shadow-[0_8px_30px_rgba(255,213,79,0.15)] transition-all duration-300 transform hover:scale-[1.01] overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-white flex items-center gap-2 text-lg">
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
        <CardContent className="pt-0">
          <div className="flex items-center gap-2 mb-2">
            <Star className="h-5 w-5 text-yellow-400" />
            <span className="text-white text-sm">
              "10 Tips for Better Content" reached 12K views
            </span>
          </div>
          <div className="h-[60px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData}>
                <defs>
                  <linearGradient id="colorYellow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFD54F" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FFD54F" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#FFD54F"
                  fill="url(#colorYellow)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
