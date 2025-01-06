import { Sidebar } from "@/components/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChangelogSection } from "@/components/settings/ChangelogSection";
import { RoadmapSection } from "@/components/settings/RoadmapSection";
import { WorkflowsSection } from "@/components/settings/WorkflowsSection";
import { TechStackSection } from "@/components/settings/TechStackSection";

export function Settings() {
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
        </Tabs>
      </main>
    </div>
  );
}