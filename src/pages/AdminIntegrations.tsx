import { useState } from "react";
import { RoleBasedSidebar } from "@/components/RoleBasedSidebar";
import { MobileNavigation } from "@/components/MobileNavigation";
import { MultimediaPremiumBackground } from "@/components/ui/multimedia-premium-background";
import { useMobileOptimized } from "@/hooks/use-mobile-optimized";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Zap, 
  Eye, 
  EyeOff, 
  TestTube, 
  CheckCircle, 
  XCircle,
  ExternalLink,
  Copy,
  Settings,
  Brain,
  Image,
  Video,
  Mic,
  MessageSquare
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function AdminIntegrations() {
  const { isMobile, getCardPadding } = useMobileOptimized();
  const { toast } = useToast();
  const [showApiKeys, setShowApiKeys] = useState<{[key: string]: boolean}>({});

  const toggleApiKeyVisibility = (service: string) => {
    setShowApiKeys(prev => ({
      ...prev,
      [service]: !prev[service]
    }));
  };

  const aiServices = [
    {
      name: "OpenAI GPT-4",
      key: "openai",
      status: "connected",
      apiKey: "sk-proj-abc123...xyz789",
      lastTested: "2 min ago",
      usage: "1,247 requests today",
      cost: "$23.45 this month",
      category: "text",
      icon: Brain,
      description: "Advanced language model for content generation"
    },
    {
      name: "Leonardo AI",
      key: "leonardo",
      status: "disconnected",
      apiKey: "",
      lastTested: "Never",
      usage: "0 requests",
      cost: "$0.00",
      category: "image",
      icon: Image,
      description: "AI image generation and enhancement"
    },
    {
      name: "DALL-E 3",
      key: "dalle",
      status: "connected",
      apiKey: "sk-proj-def456...abc123",
      lastTested: "5 min ago",
      usage: "89 images today",
      cost: "$12.30 this month",
      category: "image",
      icon: Image,
      description: "OpenAI's advanced image generation"
    },
    {
      name: "Pika Labs",
      key: "pikalabs",
      status: "disconnected",
      apiKey: "",
      lastTested: "Never",
      usage: "0 requests",
      cost: "$0.00",
      category: "video",
      icon: Video,
      description: "AI video generation from text and images"
    },
    {
      name: "Google Veo",
      key: "googleveo",
      status: "disconnected",
      apiKey: "",
      lastTested: "Never",
      usage: "0 requests",
      cost: "$0.00",
      category: "video",
      icon: Video,
      description: "Google's AI video generation model"
    },
    {
      name: "ElevenLabs",
      key: "elevenlabs",
      status: "connected",
      apiKey: "el_abc123...def456",
      lastTested: "10 min ago",
      usage: "45 minutes today",
      cost: "$8.90 this month",
      category: "voice",
      icon: Mic,
      description: "Premium voice synthesis and cloning"
    },
    {
      name: "Descript",
      key: "descript",
      status: "disconnected",
      apiKey: "",
      lastTested: "Never",
      usage: "0 requests",
      cost: "$0.00",
      category: "voice",
      icon: MessageSquare,
      description: "Audio transcription and caption generation"
    }
  ];

  const socialPlatforms = [
    {
      name: "Instagram Business",
      key: "instagram",
      status: "connected",
      appId: "123456789",
      connectedAccounts: 3,
      lastSync: "5 min ago"
    },
    {
      name: "LinkedIn Marketing",
      key: "linkedin",
      status: "connected",
      clientId: "abc123def456",
      connectedAccounts: 1,
      lastSync: "10 min ago"
    },
    {
      name: "Twitter API v2",
      key: "twitter",
      status: "error",
      bearerToken: "AAAA...1234",
      connectedAccounts: 0,
      lastSync: "Error: Rate limit exceeded"
    },
    {
      name: "Facebook Pages",
      key: "facebook",
      status: "disconnected",
      appId: "",
      connectedAccounts: 0,
      lastSync: "Not configured"
    },
    {
      name: "TikTok for Business",
      key: "tiktok",
      status: "disconnected",
      appId: "",
      connectedAccounts: 0,
      lastSync: "Not configured"
    },
    {
      name: "YouTube Data API",
      key: "youtube",
      status: "connected",
      clientId: "youtube123...abc",
      connectedAccounts: 2,
      lastSync: "1 hour ago"
    }
  ];

  const externalServices = [
    {
      name: "Zapier Webhooks",
      key: "zapier",
      webhookUrl: "https://hooks.zapier.com/hooks/catch/12345/abc123",
      status: "connected",
      triggers: 15
    },
    {
      name: "Google Analytics 4",
      key: "ga4",
      trackingId: "G-XXXXXXXXXX",
      status: "connected",
      events: 1250
    },
    {
      name: "Stripe Payments",
      key: "stripe",
      publicKey: "pk_live_...",
      status: "connected",
      transactions: 23
    },
    {
      name: "SendGrid Email",
      key: "sendgrid",
      apiKey: "SG.abc123...",
      status: "connected",
      emailsSent: 456
    }
  ];

  const testConnection = async (service: string) => {
    toast({
      title: "Testing Connection",
      description: `Testing ${service} integration...`,
    });
    
    // Simulate API test
    setTimeout(() => {
      toast({
        title: "Connection Test",
        description: `${service} connection successful!`,
      });
    }, 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'text':
        return <Brain className="h-5 w-5" />;
      case 'image':
        return <Image className="h-5 w-5" />;
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'voice':
        return <Mic className="h-5 w-5" />;
      default:
        return <Zap className="h-5 w-5" />;
    }
  };

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
          {/* Header */}
          <div className="mb-8 space-y-3">
            <div className="flex items-center gap-3">
              <h1 className={cn(
                "enterprise-heading",
                isMobile ? "text-2xl" : "text-4xl"
              )}>
                API Integrations Hub
              </h1>
              <Badge className="bg-orange-600/20 text-orange-400 border-orange-500/30">
                Admin Only
              </Badge>
            </div>
            <p className={cn(
              "premium-body max-w-2xl",
              isMobile ? "text-base" : "text-lg"
            )}>
              Configure API keys, manage connections, and monitor service health across all platforms
            </p>
          </div>

          <Tabs defaultValue="ai" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-gray-800/50 border border-gray-700">
              <TabsTrigger value="ai" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                AI Services
              </TabsTrigger>
              <TabsTrigger value="social" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Social Media
              </TabsTrigger>
              <TabsTrigger value="external" className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                External APIs
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ai">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Brain className="h-6 w-6 text-orange-400" />
                  AI & Content Generation Services
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {aiServices.map((service) => (
                    <Card key={service.key} className="premium-card bg-gray-900/50 border-gray-800">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${service.status === 'connected' ? 'bg-green-600/20' : 'bg-gray-600/20'}`}>
                              {getCategoryIcon(service.category)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                {service.name}
                                {getStatusIcon(service.status)}
                              </div>
                              <p className="text-sm text-gray-400 font-normal">{service.description}</p>
                            </div>
                          </CardTitle>
                          <Badge className={service.status === 'connected' 
                            ? 'bg-green-600/20 text-green-400' 
                            : 'bg-red-600/20 text-red-400'
                          }>
                            {service.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <Label className="text-white">API Key</Label>
                          <div className="flex gap-2">
                            <Input
                              type={showApiKeys[service.key] ? "text" : "password"}
                              value={service.apiKey}
                              placeholder="Enter API key..."
                              className="bg-gray-800 border-gray-700 text-gray-300"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => toggleApiKeyVisibility(service.key)}
                              className="border-gray-700"
                            >
                              {showApiKeys[service.key] ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        {service.status === 'connected' && (
                          <div className="grid grid-cols-2 gap-4 p-3 bg-gray-800/50 rounded-lg">
                            <div>
                              <p className="text-gray-400 text-xs">Usage Today</p>
                              <p className="text-white text-sm font-medium">{service.usage}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-xs">Monthly Cost</p>
                              <p className="text-white text-sm font-medium">{service.cost}</p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-gray-400 text-xs">Last Tested</p>
                              <p className="text-white text-sm font-medium">{service.lastTested}</p>
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button 
                            onClick={() => testConnection(service.name)}
                            className="premium-button flex-1"
                          >
                            <TestTube className="h-4 w-4 mr-2" />
                            Test Connection
                          </Button>
                          <Button variant="outline" size="icon" className="border-gray-700">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="social">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Social Media Platforms</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {socialPlatforms.map((platform) => (
                    <Card key={platform.key} className="premium-card bg-gray-900/50 border-gray-800">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white">{platform.name}</CardTitle>
                          <Badge className={platform.status === 'connected' 
                            ? 'bg-green-600/20 text-green-400' 
                            : platform.status === 'error'
                            ? 'bg-red-600/20 text-red-400'
                            : 'bg-gray-600/20 text-gray-400'
                          }>
                            {platform.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-gray-400 text-xs">Connected Accounts</p>
                            <p className="text-white text-lg font-bold">{platform.connectedAccounts}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-xs">Last Sync</p>
                            <p className="text-white text-sm">{platform.lastSync}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-white">
                            {platform.key === 'twitter' ? 'Bearer Token' : 'App ID/Client ID'}
                          </Label>
                          <Input
                            type="password"
                            value={platform.appId || platform.clientId || platform.bearerToken}
                            placeholder="Enter credentials..."
                            className="bg-gray-800 border-gray-700 text-gray-300"
                          />
                        </div>

                        <Button className="w-full premium-button">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Configure OAuth
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="external">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">External Services</h2>
                
                <div className="grid grid-cols-1 gap-6">
                  {externalServices.map((service) => (
                    <Card key={service.key} className="premium-card bg-gray-900/50 border-gray-800">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white">{service.name}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-600/20 text-green-400">
                              {service.status}
                            </Badge>
                            <Switch checked={true} />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {service.webhookUrl && (
                          <div className="space-y-2">
                            <Label className="text-white">Webhook URL</Label>
                            <div className="flex gap-2">
                              <Input
                                value={service.webhookUrl}
                                readOnly
                                className="bg-gray-800 border-gray-700 text-gray-300"
                              />
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => navigator.clipboard.writeText(service.webhookUrl)}
                                className="border-gray-700"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="text-gray-400 text-xs">
                              Active Triggers: {service.triggers}
                            </p>
                          </div>
                        )}
                        
                        {service.apiKey && (
                          <div className="space-y-2">
                            <Label className="text-white">API Key</Label>
                            <Input
                              type="password"
                              value={service.apiKey}
                              className="bg-gray-800 border-gray-700 text-gray-300"
                            />
                            {service.region && (
                              <p className="text-gray-400 text-xs">Region: {service.region}</p>
                            )}
                          </div>
                        )}
                        
                        {service.activeFeeds && (
                          <div className="p-3 bg-gray-800/50 rounded-lg">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400 text-sm">Active RSS Feeds</span>
                              <span className="text-white font-medium">{service.activeFeeds}</span>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-gray-400 text-sm">Last Update</span>
                              <span className="text-white font-medium">{service.lastUpdate}</span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Usage Analytics</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="premium-card bg-gray-900/50 border-gray-800">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-400">87%</div>
                        <div className="text-sm text-gray-400">API Success Rate</div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="premium-card bg-gray-900/50 border-gray-800">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-400">2.3s</div>
                        <div className="text-sm text-gray-400">Avg Response Time</div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="premium-card bg-gray-900/50 border-gray-800">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-400">$156</div>
                        <div className="text-sm text-gray-400">Monthly API Costs</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
