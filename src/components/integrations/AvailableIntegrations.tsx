
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Star } from 'lucide-react';

export function AvailableIntegrations() {
  const integrations = [
    {
      name: "Slack",
      description: "Get notified about content updates",
      category: "Communication",
      status: "available",
      popular: true,
      icon: "💬",
      color: "bg-purple-600/20 border-purple-500/30"
    },
    {
      name: "Google Sheets",
      description: "Export analytics and content data",
      category: "Productivity",
      status: "available",
      popular: true,
      icon: "📊",
      color: "bg-green-600/20 border-green-500/30"
    },
    {
      name: "Trello",
      description: "Create cards for content approvals",
      category: "Project Management",
      status: "available",
      popular: false,
      icon: "📋",
      color: "bg-blue-600/20 border-blue-500/30"
    },
    {
      name: "HubSpot",
      description: "Sync content with CRM contacts",
      category: "CRM",
      status: "coming-soon",
      popular: true,
      icon: "🎯",
      color: "bg-orange-600/20 border-orange-500/30"
    },
    {
      name: "Airtable",
      description: "Organize content in custom databases",
      category: "Database",
      status: "available",
      popular: false,
      icon: "🗃️",
      color: "bg-yellow-600/20 border-yellow-500/30"
    },
    {
      name: "Discord",
      description: "Send content updates to channels",
      category: "Communication",
      status: "available",
      popular: false,
      icon: "🎮",
      color: "bg-indigo-600/20 border-indigo-500/30"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Popular Integrations */}
      <Card className="premium-card bg-gray-900/50 border-gray-800">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border border-yellow-500/30">
              <Star className="h-5 w-5 text-yellow-400" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-white">Popular Integrations</CardTitle>
              <p className="text-sm text-gray-400">Most requested by users</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {integrations
            .filter(integration => integration.popular)
            .map((integration, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${integration.color}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{integration.icon}</span>
                    <div>
                      <h4 className="text-white font-medium text-sm">{integration.name}</h4>
                      <p className="text-gray-400 text-xs">{integration.description}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {integration.category}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <Badge 
                    variant={integration.status === 'available' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {integration.status === 'available' ? 'Available' : 'Coming Soon'}
                  </Badge>
                  {integration.status === 'available' && (
                    <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            ))}
        </CardContent>
      </Card>

      {/* All Integrations */}
      <Card className="premium-card bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-white">All Integrations</CardTitle>
          <p className="text-sm text-gray-400">Browse all available connections</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {integrations
            .filter(integration => !integration.popular)
            .map((integration, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{integration.icon}</span>
                  <div>
                    <h4 className="text-white font-medium text-sm">{integration.name}</h4>
                    <p className="text-gray-400 text-xs">{integration.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs border-gray-600">
                    {integration.category}
                  </Badge>
                  {integration.status === 'available' ? (
                    <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300">
                      Connect
                    </Button>
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      Soon
                    </Badge>
                  )}
                </div>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
