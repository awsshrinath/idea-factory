
import { Sidebar } from "@/components/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChangelogSection } from "@/components/settings/ChangelogSection";
import { RoadmapSection } from "@/components/settings/RoadmapSection";
import { WorkflowsSection } from "@/components/settings/WorkflowsSection";
import { TechStackSection } from "@/components/settings/TechStackSection";
import { MultimediaPremiumBackground } from "@/components/ui/multimedia-premium-background";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Settings as SettingsIcon, Sparkles } from "lucide-react";

export function Settings() {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex bg-background overflow-x-hidden w-full relative">
      <MultimediaPremiumBackground />
      <Sidebar />
      <main className={cn(
        "flex-1 animate-fadeIn w-full max-w-full pb-20 relative z-10",
        "p-6 md:p-8 lg:p-10",
        isMobile ? "ml-0 pt-20" : "ml-64 pl-8", 
      )}>
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Enhanced Header */}
          <div className="mb-8 space-y-3">
            <div className="flex items-center gap-3">
              <h1 className={cn(
                "enterprise-heading",
                isMobile ? "text-3xl" : "text-4xl"
              )}>
                Settings & Documentation
              </h1>
              <SettingsIcon className="h-6 w-6 text-purple-400 animate-pulse" />
            </div>
            <p className="premium-body text-lg max-w-2xl">
              Configure your workspace and explore platform documentation
            </p>
          </div>
          
          <div className="premium-card premium-card-hover rounded-2xl backdrop-blur-sm border border-white/10 p-2">
            <Tabs defaultValue="changelog" className="w-full">
              <TabsList className={cn(
                "mb-6 premium-card border border-white/10 bg-gradient-to-r from-slate-900/80 to-slate-800/60 p-1 rounded-xl",
                isMobile && "flex flex-wrap overflow-x-auto max-w-full gap-1"
              )}>
                <TabsTrigger 
                  value="changelog"
                  className={cn(
                    "premium-subheading data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/20 data-[state=active]:to-indigo-600/20 data-[state=active]:border data-[state=active]:border-purple-500/30 rounded-lg",
                    isMobile && "flex-1 min-w-[30%] py-3"
                  )}
                >
                  <Sparkles className="h-3 w-3 mr-2" />
                  Changelog
                </TabsTrigger>
                <TabsTrigger 
                  value="roadmap"
                  className={cn(
                    "premium-subheading data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/20 data-[state=active]:to-indigo-600/20 data-[state=active]:border data-[state=active]:border-purple-500/30 rounded-lg",
                    isMobile && "flex-1 min-w-[30%] py-3"
                  )}
                >
                  Roadmap
                </TabsTrigger>
                <TabsTrigger 
                  value="workflows"
                  className={cn(
                    "premium-subheading data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/20 data-[state=active]:to-indigo-600/20 data-[state=active]:border data-[state=active]:border-purple-500/30 rounded-lg",
                    isMobile && "flex-1 min-w-[30%] py-3"
                  )}
                >
                  Workflows
                </TabsTrigger>
                <TabsTrigger 
                  value="tech"
                  className={cn(
                    "premium-subheading data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/20 data-[state=active]:to-indigo-600/20 data-[state=active]:border data-[state=active]:border-purple-500/30 rounded-lg",
                    isMobile && "flex-1 min-w-[30%] py-3"
                  )}
                >
                  Tech
                </TabsTrigger>
                <TabsTrigger 
                  value="integrations"
                  className={cn(
                    "premium-subheading data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/20 data-[state=active]:to-indigo-600/20 data-[state=active]:border data-[state=active]:border-purple-500/30 rounded-lg",
                    isMobile && "flex-1 min-w-[30%] py-3"
                  )}
                >
                  API
                </TabsTrigger>
              </TabsList>

              <div className="p-6">
                <TabsContent value="changelog" className="mt-0">
                  <ChangelogSection />
                </TabsContent>

                <TabsContent value="roadmap" className="mt-0">
                  <RoadmapSection />
                </TabsContent>

                <TabsContent value="workflows" className="mt-0">
                  <WorkflowsSection />
                </TabsContent>

                <TabsContent value="tech" className="mt-0">
                  <TechStackSection />
                </TabsContent>

                <TabsContent value="integrations" className="mt-0">
                  <div className="premium-card rounded-xl p-6 border border-white/10 bg-gradient-to-br from-white/[0.02] to-white/[0.01]">
                    <h3 className="premium-heading text-xl mb-4">API Integration</h3>
                    <p className="premium-body">
                      Integration documentation and API endpoints will be available here.
                    </p>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
