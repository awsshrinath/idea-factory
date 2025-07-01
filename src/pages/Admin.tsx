
import { RoleBasedSidebar } from "@/components/RoleBasedSidebar";
import { MobileNavigation } from "@/components/MobileNavigation";
import { MultimediaPremiumBackground } from "@/components/ui/multimedia-premium-background";
import { useMobileOptimized } from "@/hooks/use-mobile-optimized";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Zap, 
  BarChart3, 
  Shield, 
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

export function Admin() {
  const { isMobile, getCardPadding } = useMobileOptimized();

  const stats = [
    {
      title: "Total Users",
      value: "1,247",
      change: "+12%",
      icon: Users,
      color: "text-blue-400",
      bgColor: "bg-blue-600/20"
    },
    {
      title: "API Integrations",
      value: "8",
      change: "100%",
      icon: Zap,
      color: "text-green-400",
      bgColor: "bg-green-600/20"
    },
    {
      title: "Monthly Usage",
      value: "45.2K",
      change: "+23%",
      icon: BarChart3,
      color: "text-purple-400",
      bgColor: "bg-purple-600/20"
    },
    {
      title: "System Health",
      value: "99.9%",
      change: "Optimal",
      icon: Activity,
      color: "text-emerald-400",
      bgColor: "bg-emerald-600/20"
    }
  ];

  const systemStatus = [
    { service: "OpenAI API", status: "operational", lastCheck: "2 min ago" },
    { service: "Database", status: "operational", lastCheck: "1 min ago" },
    { service: "Authentication", status: "operational", lastCheck: "3 min ago" },
    { service: "File Storage", status: "degraded", lastCheck: "5 min ago" },
  ];

  return (
    <div className="min-h-screen flex bg-background overflow-x-hidden w-full relative">
      <MultimediaPremiumBackground />
      <RoleBasedSidebar />
      <MobileNavigation />
      <main className={cn(
        "flex-1 animate-fadeIn w-full max-w-full pb-20 relative z-10 transition-all duration-300",
        getCardPadding(),
        isMobile ? "ml-0 pt-20 px-4" : "ml-64 pl-8 p-6 md:p-8 lg:p-10",
      )}>
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Enhanced Header */}
          <div className="mb-8 space-y-3">
            <div className="flex items-center gap-3">
              <h1 className={cn(
                "enterprise-heading",
                isMobile ? "text-2xl" : "text-4xl"
              )}>
                Admin Overview
              </h1>
              <Badge className="bg-orange-600/20 text-orange-400 border-orange-500/30">
                Administrator
              </Badge>
            </div>
            <p className={cn(
              "premium-body max-w-2xl",
              isMobile ? "text-base" : "text-lg"
            )}>
              Manage system integrations, monitor user activity, and configure platform settings
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="premium-card bg-gray-900/50 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                      <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                      <p className={`text-sm mt-1 ${stat.color}`}>
                        <TrendingUp className="h-3 w-3 inline mr-1" />
                        {stat.change}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* System Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="premium-card bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="h-5 w-5 text-orange-400" />
                  System Status
                </CardTitle>
                <CardDescription>Real-time service monitoring</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {systemStatus.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {service.status === 'operational' ? (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-yellow-400" />
                      )}
                      <span className="text-white font-medium">{service.service}</span>
                    </div>
                    <div className="text-right">
                      <Badge 
                        className={service.status === 'operational' 
                          ? 'bg-green-600/20 text-green-400' 
                          : 'bg-yellow-600/20 text-yellow-400'
                        }
                      >
                        {service.status}
                      </Badge>
                      <p className="text-xs text-gray-400 mt-1">{service.lastCheck}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="premium-card bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-orange-400" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest system events</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                    <div>
                      <p className="text-white text-sm">New user registered</p>
                      <p className="text-gray-400 text-xs">2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                    <div>
                      <p className="text-white text-sm">API integration updated</p>
                      <p className="text-gray-400 text-xs">15 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                    <div>
                      <p className="text-white text-sm">Content template created</p>
                      <p className="text-gray-400 text-xs">1 hour ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="premium-card bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors text-left">
                  <Zap className="h-8 w-8 text-orange-400 mb-2" />
                  <h3 className="text-white font-medium">Manage Integrations</h3>
                  <p className="text-gray-400 text-sm">Configure API keys and connections</p>
                </button>
                <button className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors text-left">
                  <Users className="h-8 w-8 text-blue-400 mb-2" />
                  <h3 className="text-white font-medium">User Management</h3>
                  <p className="text-gray-400 text-sm">View and manage user accounts</p>
                </button>
                <button className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors text-left">
                  <BarChart3 className="h-8 w-8 text-purple-400 mb-2" />
                  <h3 className="text-white font-medium">Analytics</h3>
                  <p className="text-gray-400 text-sm">View system usage metrics</p>
                </button>
                <button className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors text-left">
                  <Shield className="h-8 w-8 text-green-400 mb-2" />
                  <h3 className="text-white font-medium">System Settings</h3>
                  <p className="text-gray-400 text-sm">Configure platform preferences</p>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
