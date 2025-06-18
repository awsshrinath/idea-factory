import { Sidebar } from "@/components/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChangelogSection } from "@/components/settings/ChangelogSection";
import { RoadmapSection } from "@/components/settings/RoadmapSection";
import { WorkflowsSection } from "@/components/settings/WorkflowsSection";
import { TechStackSection } from "@/components/settings/TechStackSection";
import { BackgroundAnimation } from "@/components/ui/background-animation";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export function Settings() {
  const [isTesting, setIsTesting] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

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
    <div className="min-h-screen flex bg-background overflow-x-hidden w-full relative">
      <BackgroundAnimation />
      <Sidebar />
      <main className={cn(
        "flex-1 p-4 md:p-6 lg:p-8 animate-fadeIn w-full max-w-full pb-20 relative z-10",
        isMobile ? "ml-0 pt-16" : "ml-64", // Add top padding on mobile for the menu button
      )}>
        <div className="max-w-5xl mx-auto">
          <h1 className={cn(
            "text-4xl font-bold text-foreground mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent",
            isMobile && "text-2xl text-center"
          )}>
            Settings & Documentation
          </h1>
          
          <Tabs defaultValue="changelog" className="w-full">
            <TabsList className={cn(
              "mb-4 bg-card border border-white/10",
              isMobile && "flex flex-wrap overflow-x-auto max-w-full"
            )}>
              <TabsTrigger 
                value="changelog"
                className={cn(
                  "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                  isMobile && "flex-1 min-w-[32%] py-3"
                )}
              >
                Changelog
              </TabsTrigger>
              <TabsTrigger 
                value="roadmap"
                className={cn(
                  "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                  isMobile && "flex-1 min-w-[32%] py-3"
                )}
              >
                Roadmap
              </TabsTrigger>
              <TabsTrigger 
                value="workflows"
                className={cn(
                  "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                  isMobile && "flex-1 min-w-[32%] py-3"
                )}
              >
                Workflows
              </TabsTrigger>
              <TabsTrigger 
                value="tech"
                className={cn(
                  "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                  isMobile && "flex-1 min-w-[32%] py-3"
                )}
              >
                Tech
              </TabsTrigger>
              <TabsTrigger 
                value="integrations"
                className={cn(
                  "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                  isMobile && "flex-1 min-w-[32%] py-3"
                )}
              >
                API
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
                <div className={cn(
                  "bg-card p-6 rounded-lg border border-white/10",
                  isMobile && "p-4"
                )}>
                  <h2 className="text-xl font-semibold mb-4">OpenAI Integration</h2>
                  <p className="text-muted-foreground mb-4">
                    Test your OpenAI API connection to ensure content generation will work properly.
                  </p>
                  <Button
                    onClick={testOpenAIConnection}
                    disabled={isTesting}
                    className={cn(
                      "w-full sm:w-auto",
                      isMobile && "mobile-touch-friendly h-12"
                    )}
                  >
                    {isTesting ? "Testing Connection..." : "Test OpenAI Connection"}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
