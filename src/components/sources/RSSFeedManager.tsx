
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Rss, Globe, TrendingUp, AlertTriangle, CheckCircle, MoreVertical, Trash2, Settings } from 'lucide-react';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface RSSFeed {
  id: string;
  name: string;
  url: string;
  category: string;
  status: 'active' | 'inactive' | 'error';
  lastUpdate: string;
  articlesCount: number;
  credibilityScore: number;
  isEnabled: boolean;
}

export function RSSFeedManager() {
  const [feeds] = useState<RSSFeed[]>([
    {
      id: '1',
      name: 'TechCrunch',
      url: 'https://techcrunch.com/feed/',
      category: 'Technology',
      status: 'active',
      lastUpdate: '2 hours ago',
      articlesCount: 12,
      credibilityScore: 9.2,
      isEnabled: true
    },
    {
      id: '2',
      name: 'Harvard Business Review',
      url: 'https://hbr.org/feed',
      category: 'Business',
      status: 'active',
      lastUpdate: '1 hour ago',
      articlesCount: 8,
      credibilityScore: 9.5,
      isEnabled: true
    },
    {
      id: '3',
      name: 'Wired Technology',
      url: 'https://www.wired.com/feed/tag/ai/latest/rss',
      category: 'AI & Tech',
      status: 'active',
      lastUpdate: '30 minutes ago',
      articlesCount: 15,
      credibilityScore: 8.8,
      isEnabled: true
    },
    {
      id: '4',
      name: 'MIT Technology Review',
      url: 'https://www.technologyreview.com/feed/',
      category: 'Research',
      status: 'error',
      lastUpdate: 'Failed 4 hours ago',
      articlesCount: 0,
      credibilityScore: 9.1,
      isEnabled: false
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'inactive': return 'text-gray-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'inactive': return AlertTriangle;
      case 'error': return AlertTriangle;
      default: return AlertTriangle;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Technology': 'bg-blue-600/20 text-blue-300 border-blue-500/40',
      'Business': 'bg-green-600/20 text-green-300 border-green-500/40',
      'AI & Tech': 'bg-purple-600/20 text-purple-300 border-purple-500/40',
      'Research': 'bg-orange-600/20 text-orange-300 border-orange-500/40'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-600/20 text-gray-300 border-gray-500/40';
  };

  const getCredibilityColor = (score: number) => {
    if (score >= 9) return 'text-green-400';
    if (score >= 7) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <Card className="premium-card bg-gray-900/50 border-gray-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-orange-600/20 to-red-600/20 border border-orange-500/30">
              <Rss className="h-5 w-5 text-orange-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-white">RSS Feed Sources</CardTitle>
              <p className="text-sm text-gray-400">Manage your content sources and monitoring</p>
            </div>
          </div>
          <Button size="sm" className="premium-button">
            <Settings className="h-4 w-4 mr-2" />
            Bulk Settings
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {feeds.map((feed) => {
          const StatusIcon = getStatusIcon(feed.status);
          return (
            <div key={feed.id} className="border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <h4 className="text-white font-medium">{feed.name}</h4>
                    </div>
                    <Badge className={getCategoryColor(feed.category)}>
                      {feed.category}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <StatusIcon className={`h-4 w-4 ${getStatusColor(feed.status)}`} />
                      <span className={`text-xs ${getStatusColor(feed.status)}`}>
                        {feed.status === 'active' ? 'Active' : feed.status === 'error' ? 'Error' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-400">
                    <span>Last update: {feed.lastUpdate}</span>
                    <span>{feed.articlesCount} articles</span>
                    <span className={`font-medium ${getCredibilityColor(feed.credibilityScore)}`}>
                      Credibility: {feed.credibilityScore}/10
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-500 font-mono bg-gray-800/50 px-2 py-1 rounded truncate">
                    {feed.url}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 ml-4">
                  <Switch checked={feed.isEnabled} />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-gray-800 border-gray-700">
                      <DropdownMenuItem className="text-gray-300 hover:bg-gray-700">
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-gray-300 hover:bg-gray-700">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        View Analytics
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-400 hover:bg-gray-700">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove Feed
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
