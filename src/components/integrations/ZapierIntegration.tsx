
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Zap, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export function ZapierIntegration() {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleTestWebhook = async () => {
    if (!webhookUrl) {
      toast({
        title: "Error",
        description: "Please enter your Zapier webhook URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          test: true,
          timestamp: new Date().toISOString(),
          content_created: "Test content from AI Content Platform",
          platform: ["twitter", "linkedin"],
          triggered_from: window.location.origin,
        }),
      });

      toast({
        title: "Test Sent",
        description: "Test webhook sent to Zapier. Check your Zap's history to confirm it was triggered.",
      });
    } catch (error) {
      console.error("Error testing webhook:", error);
      toast({
        title: "Error",
        description: "Failed to send test webhook. Please check the URL and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const zapierTriggers = [
    {
      name: "Content Created",
      description: "Triggers when new content is generated",
      status: "active",
      icon: CheckCircle,
      color: "text-green-400"
    },
    {
      name: "Content Scheduled",
      description: "Triggers when content is scheduled for posting",
      status: "inactive",
      icon: AlertCircle,
      color: "text-yellow-400"
    },
    {
      name: "RSS Article Found",
      description: "Triggers when new RSS articles are detected",
      status: "active",
      icon: CheckCircle,
      color: "text-green-400"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Zapier Configuration */}
      <Card className="premium-card bg-gray-900/50 border-gray-800">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-orange-600/20 to-yellow-600/20 border border-orange-500/30">
              <Zap className="h-5 w-5 text-orange-400" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-white">Zapier Integration</CardTitle>
              <p className="text-sm text-gray-400">Automate workflows with 5000+ apps</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
            <div>
              <h3 className="text-white font-medium">Enable Zapier Integration</h3>
              <p className="text-gray-400 text-sm">Connect your Zapier account to automate content workflows</p>
            </div>
            <Switch checked={isEnabled} onCheckedChange={setIsEnabled} />
          </div>

          {isEnabled && (
            <div className="space-y-4">
              <div className="space-y-3">
                <Label className="text-white">Webhook URL</Label>
                <Input
                  placeholder="https://hooks.zapier.com/hooks/catch/..."
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-gray-300 focus:border-orange-500"
                />
                <p className="text-xs text-gray-400">
                  Get this URL from your Zapier webhook trigger step
                </p>
              </div>

              <div className="flex space-x-3">
                <Button 
                  onClick={handleTestWebhook}
                  disabled={!webhookUrl || isLoading}
                  className="premium-button"
                >
                  {isLoading ? "Testing..." : "Test Webhook"}
                </Button>
                <Button 
                  variant="outline" 
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                  onClick={() => window.open('https://zapier.com/apps/webhook/integrations', '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Setup Guide
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Triggers */}
      <Card className="premium-card bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-white">Available Triggers</CardTitle>
          <p className="text-sm text-gray-400">Events that can trigger your Zapier workflows</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {zapierTriggers.map((trigger, index) => {
            const IconComponent = trigger.icon;
            return (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <IconComponent className={`h-5 w-5 ${trigger.color}`} />
                  <div>
                    <h4 className="text-white font-medium text-sm">{trigger.name}</h4>
                    <p className="text-gray-400 text-xs">{trigger.description}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  trigger.status === 'active' 
                    ? 'bg-green-600/20 text-green-400' 
                    : 'bg-yellow-600/20 text-yellow-400'
                }`}>
                  {trigger.status}
                </span>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
