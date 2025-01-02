import { Sidebar } from "@/components/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export function Settings() {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <h1 className="text-4xl font-bold text-white mb-6">Documentation</h1>
        
        <Tabs defaultValue="changelog" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="changelog">Changelog</TabsTrigger>
            <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
            <TabsTrigger value="workflows">Page Workflows</TabsTrigger>
            <TabsTrigger value="tech">Tech Stack</TabsTrigger>
          </TabsList>

          <TabsContent value="changelog">
            <Card>
              <CardHeader>
                <CardTitle>Changelog</CardTitle>
                <CardDescription>Track all updates and changes to the application</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-bold">Version 1.1.0 (Current)</h3>
                      <ul className="list-disc ml-6 space-y-2">
                        <li>Added Videos page with AI-powered video generation capabilities</li>
                        <li>Implemented workflow selection for direct and fine-tuned video creation</li>
                        <li>Added script generation and management interface</li>
                        <li>Integrated audio and caption generation UI components</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-bold">Version 1.0.0</h3>
                      <ul className="list-disc ml-6 space-y-2">
                        <li>Initial dashboard implementation with performance metrics</li>
                        <li>Added Quick Actions with improved visual design and 2x2 grid layout</li>
                        <li>Implemented Recent Activity section with action buttons</li>
                        <li>Created basic page structure and navigation</li>
                      </ul>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roadmap">
            <Card>
              <CardHeader>
                <CardTitle>Roadmap</CardTitle>
                <CardDescription>Upcoming features and improvements</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-bold mb-2">Video Generation Features</h3>
                      <ul className="list-disc ml-6 space-y-2">
                        <li>Integrate Eleven Labs for text-to-speech conversion</li>
                        <li>Implement Whisper for automatic caption generation</li>
                        <li>Add support for custom video styles and transitions</li>
                        <li>Enable direct social media sharing</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">Dashboard Improvements</h3>
                      <ul className="list-disc ml-6 space-y-2">
                        <li>Add legends and toggles for Performance Metrics graphs</li>
                        <li>Implement trend indicators with percentage changes</li>
                        <li>Enhanced hover animations for Quick Actions</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">Recent Activity Enhancements</h3>
                      <ul className="list-disc ml-6 space-y-2">
                        <li>Categorize activities by type</li>
                        <li>Add detailed view for each activity</li>
                        <li>Implement activity filtering</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">Content Management</h3>
                      <ul className="list-disc ml-6 space-y-2">
                        <li>Content generation workflow</li>
                        <li>Image creation and management</li>
                        <li>Video content tools</li>
                        <li>Scheduling system</li>
                      </ul>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workflows">
            <Card>
              <CardHeader>
                <CardTitle>Page Workflows</CardTitle>
                <CardDescription>Detailed documentation for each page</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-bold mb-2">Dashboard</h3>
                      <p className="mb-2">Main features:</p>
                      <ul className="list-disc ml-6 space-y-2">
                        <li>Performance Metrics: View content analytics and engagement</li>
                        <li>Quick Actions: Fast access to key features</li>
                        <li>Recent Activity: Track content and changes</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">Content Page</h3>
                      <p className="mb-2">Planned features:</p>
                      <ul className="list-disc ml-6 space-y-2">
                        <li>Content creation and editing</li>
                        <li>Content templates</li>
                        <li>Content analytics</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">Images Page</h3>
                      <p className="mb-2">Planned features:</p>
                      <ul className="list-disc ml-6 space-y-2">
                        <li>Image generation</li>
                        <li>Image library management</li>
                        <li>Image editing tools</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">Videos Page</h3>
                      <p className="mb-2">Planned features:</p>
                      <ul className="list-disc ml-6 space-y-2">
                        <li>Video creation tools</li>
                        <li>Video library management</li>
                        <li>Video analytics</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">Schedule Page</h3>
                      <p className="mb-2">Planned features:</p>
                      <ul className="list-disc ml-6 space-y-2">
                        <li>Content calendar</li>
                        <li>Automated scheduling</li>
                        <li>Publishing queue</li>
                      </ul>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tech">
            <Card>
              <CardHeader>
                <CardTitle>Technology Stack</CardTitle>
                <CardDescription>Technologies and frameworks used in this application</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-bold mb-2">Core Technologies</h3>
                      <ul className="list-disc ml-6 space-y-2">
                        <li>React - Frontend library</li>
                        <li>TypeScript - Programming language</li>
                        <li>Vite - Build tool and development server</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">UI Framework</h3>
                      <ul className="list-disc ml-6 space-y-2">
                        <li>Tailwind CSS - Utility-first CSS framework</li>
                        <li>shadcn/ui - React component library</li>
                        <li>Lucide React - Icon library</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">Data Visualization</h3>
                      <ul className="list-disc ml-6 space-y-2">
                        <li>Recharts - Charting library</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">State Management</h3>
                      <ul className="list-disc ml-6 space-y-2">
                        <li>TanStack Query - Data fetching and caching</li>
                      </ul>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}