
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Upload, Sparkles } from 'lucide-react';
import { useState } from 'react';

export function AddRSSForm() {
  const [feedUrl, setFeedUrl] = useState('');
  const [feedName, setFeedName] = useState(''); 
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const categories = [
    'Technology',
    'Business', 
    'AI & Tech',
    'Research',
    'Marketing',
    'Industry News',
    'Competitor Analysis',
    'Thought Leadership'
  ];

  const recommendedFeeds = [
    { name: 'TechCrunch', url: 'https://techcrunch.com/feed/', category: 'Technology' },
    { name: 'Harvard Business Review', url: 'https://hbr.org/feed', category: 'Business' },
    { name: 'MIT Technology Review', url: 'https://www.technologyreview.com/feed/', category: 'Research' },
    { name: 'Wired AI', url: 'https://www.wired.com/feed/tag/ai/latest/rss', category: 'AI & Tech' }
  ];

  const handleAddFeed = () => {
    console.log('Adding RSS feed:', { feedUrl, feedName, category, description });
    // Reset form
    setFeedUrl('');
    setFeedName('');
    setCategory('');
    setDescription('');
  };

  const handleQuickAdd = (feed: typeof recommendedFeeds[0]) => {
    setFeedUrl(feed.url);
    setFeedName(feed.name);
    setCategory(feed.category);
  };

  return (
    <div className="space-y-6">
      {/* Add New RSS Feed */}
      <Card className="premium-card bg-gray-900/50 border-gray-800">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/30">
              <Plus className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-white">Add New Source</CardTitle>
              <p className="text-sm text-gray-400">Monitor RSS feeds and content sources</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label className="text-white">Feed URL</Label>
            <Input
              placeholder="https://example.com/feed.xml"
              value={feedUrl}
              onChange={(e) => setFeedUrl(e.target.value)}
              className="bg-gray-800 border-gray-700 text-gray-300 focus:border-purple-500"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-white">Feed Name</Label>
            <Input
              placeholder="Source name"
              value={feedName}
              onChange={(e) => setFeedName(e.target.value)}
              className="bg-gray-800 border-gray-700 text-gray-300 focus:border-purple-500"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-white">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-300">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat.toLowerCase()}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-white">Description (Optional)</Label>
            <Textarea
              placeholder="Brief description of the content source"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-gray-800 border-gray-700 text-gray-300 focus:border-purple-500"
              rows={3}
            />
          </div>

          <div className="flex space-x-3">
            <Button 
              onClick={handleAddFeed}
              className="premium-button flex-1"
              disabled={!feedUrl || !feedName}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Feed
            </Button>
            <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
              <Upload className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recommended Sources */}
      <Card className="premium-card bg-gray-900/50 border-gray-800">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600/20 to-indigo-600/20 border border-purple-500/30">
              <Sparkles className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-white">Recommended Sources</CardTitle>
              <p className="text-sm text-gray-400">Popular feeds for your industry</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {recommendedFeeds.map((feed, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
              onClick={() => handleQuickAdd(feed)}
            >
              <div className="flex-1">
                <h4 className="text-white font-medium text-sm">{feed.name}</h4>
                <p className="text-gray-400 text-xs">{feed.category}</p>
              </div>
              <Button size="sm" variant="ghost" className="text-purple-400 hover:text-purple-300">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
