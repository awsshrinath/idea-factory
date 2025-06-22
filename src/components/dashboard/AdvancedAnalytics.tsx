
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Download, DollarSign, Users, Target } from 'lucide-react';
import { useState } from 'react';

const chartConfig = {
  engagement: {
    label: "Engagement Rate",
    color: "#8b5cf6",
  },
  reach: {
    label: "Reach",
    color: "#06b6d4",
  },
  conversions: {
    label: "Conversions",
    color: "#10b981",
  },
};

export function AdvancedAnalytics() {
  const [timeRange, setTimeRange] = useState("30d");
  const [selectedMetric, setSelectedMetric] = useState("engagement");

  const performanceData = [
    { date: "2024-01-01", engagement: 4.2, reach: 12500, conversions: 125 },
    { date: "2024-01-07", engagement: 5.1, reach: 15200, conversions: 158 },
    { date: "2024-01-14", engagement: 3.8, reach: 11800, conversions: 102 },
    { date: "2024-01-21", engagement: 6.3, reach: 18900, conversions: 203 },
    { date: "2024-01-28", engagement: 5.7, reach: 16400, conversions: 187 },
  ];

  const platformData = [
    { platform: "Instagram", value: 35, color: "#e91e63" },
    { platform: "LinkedIn", value: 28, color: "#0077b5" },
    { platform: "Twitter", value: 22, color: "#1da1f2" },
    { platform: "TikTok", value: 15, color: "#ff0050" },
  ];

  const contentTypeData = [
    { type: "Video", performance: 85, count: 24 },
    { type: "Carousel", performance: 78, count: 31 },
    { type: "Single Image", performance: 65, count: 45 },
    { type: "Text Post", performance: 52, count: 18 },
  ];

  const kpiMetrics = [
    {
      title: "Total ROI",
      value: "$12,543",
      change: "+18.2%",
      changeType: "increase",
      icon: DollarSign,
      color: "text-green-400"
    },
    {
      title: "Avg. Engagement Rate",
      value: "5.8%",
      change: "+1.2%",
      changeType: "increase",
      icon: TrendingUp,
      color: "text-blue-400"
    },
    {
      title: "Audience Growth",
      value: "2,847",
      change: "+24.5%",
      changeType: "increase",
      icon: Users,
      color: "text-purple-400"
    },
    {
      title: "Conversion Rate",
      value: "3.2%",
      change: "-0.3%",
      changeType: "decrease",
      icon: Target,
      color: "text-orange-400"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Analytics Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Advanced Analytics</h2>
          <p className="text-gray-400">Comprehensive performance insights and ROI tracking</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32 bg-gray-800 border-gray-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="border-gray-700 text-gray-300">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <Card key={index} className="premium-card bg-gray-900/50 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm text-gray-400 font-medium">{metric.title}</h3>
                  <IconComponent className={`h-5 w-5 ${metric.color}`} />
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-white">{metric.value}</p>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={metric.changeType === 'increase' ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {metric.change}
                    </Badge>
                    <span className="text-xs text-gray-400">vs last period</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Performance Trends */}
      <Card className="premium-card bg-gray-900/50 border-gray-800">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-bold text-white">Performance Trends</CardTitle>
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-40 bg-gray-800 border-gray-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="engagement">Engagement</SelectItem>
                <SelectItem value="reach">Reach</SelectItem>
                <SelectItem value="conversions">Conversions</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9ca3af"
                fontSize={12}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey={selectedMetric}
                stroke={chartConfig[selectedMetric as keyof typeof chartConfig].color}
                strokeWidth={3}
                dot={{ fill: chartConfig[selectedMetric as keyof typeof chartConfig].color, strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Platform Distribution & Content Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Distribution */}
        <Card className="premium-card bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-white">Platform Distribution</CardTitle>
            <p className="text-sm text-gray-400">Content performance by platform</p>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64">
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
            <div className="mt-4 space-y-2">
              {platformData.map((platform, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: platform.color }}
                    />
                    <span className="text-white text-sm">{platform.platform}</span>
                  </div>
                  <span className="text-gray-400 text-sm">{platform.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Content Type Performance */}
        <Card className="premium-card bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-white">Content Type Performance</CardTitle>
            <p className="text-sm text-gray-400">Performance score by content type</p>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64">
              <BarChart data={contentTypeData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9ca3af" fontSize={12} />
                <YAxis dataKey="type" type="category" stroke="#9ca3af" fontSize={12} width={80} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="performance" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
            <div className="mt-4 space-y-2">
              {contentTypeData.map((type, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-white text-sm">{type.type}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400 text-sm">{type.count} posts</span>
                    <Badge variant="outline" className="border-gray-600">
                      {type.performance}/100
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
