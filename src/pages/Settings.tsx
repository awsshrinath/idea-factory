import { Sidebar } from "@/components/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChangelogSection } from "@/components/settings/ChangelogSection";
import { RoadmapSection } from "@/components/settings/RoadmapSection";
import { WorkflowsSection } from "@/components/settings/WorkflowsSection";
import { TechStackSection } from "@/components/settings/TechStackSection";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function Settings() {
  const [isTesting, setIsTesting] = useState(false);
  const { toast } = useToast();

  const testOpenAIConnection = async () => {
    setIsTesting(true);
    try {
      const { data, error } = await supabase.functions.invoke('test-openai');
      
      if (error) throw error;

      if (data?.success) {
        toast({
          title: "OpenAI Connection Test",
          description: "Connection successful! API key is working correctly.",
        });
      } else {
        throw new Error(data?.error || 'Failed to test OpenAI connection');
      }
    } catch (error) {
      console.error('Error testing OpenAI connection:', error);
      toast({
        variant: "destructive",
        title: "OpenAI Connection Test Failed",
        description: error.message || "Failed to connect to OpenAI API. Please check your API key.",
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 animate-fadeIn">
        <h1 className="text-4xl font-bold text-foreground mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Documentation
        </h1>
        
        <Tabs defaultValue="changelog" className="w-full">
          <TabsList className="mb-4 bg-card border border-white/10">
            <TabsTrigger 
              value="changelog"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Changelog
            </TabsTrigger>
            <TabsTrigger 
              value="roadmap"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Roadmap
            </TabsTrigger>
            <TabsTrigger 
              value="workflows"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Page Workflows
            </TabsTrigger>
            <TabsTrigger 
              value="tech"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Tech Stack
            </TabsTrigger>
            <TabsTrigger 
              value="integrations"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Integrations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="changelog">
            <ChangelogSection />
          </TabsContent>

          <TabsContent value="roadmap">
            <RoadmapSection />
          </TabsContent>

          <TabsContent value="workflows">
            <WorkflowsSection />
          </TabsContent>

          <TabsContent value="tech">
            <TechStackSection />
          </TabsContent>

          <TabsContent value="integrations">
            <div className="space-y-6">
              <div className="bg-card p-6 rounded-lg border border-white/10">
                <h2 className="text-xl font-semibold mb-4">OpenAI Integration</h2>
                <p className="text-muted-foreground mb-4">
                  Test your OpenAI API connection to ensure content generation will work properly.
                </p>
                <Button
                  onClick={testOpenAIConnection}
                  disabled={isTesting}
                  className="w-full sm:w-auto"
                >
                  {isTesting ? "Testing Connection..." : "Test OpenAI Connection"}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}