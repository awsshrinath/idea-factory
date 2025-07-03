
import { AnimatedLayout } from "@/components/layouts/animated-layout";
import { RoleBasedSidebar } from "@/components/RoleBasedSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrandIdentityTab } from "@/components/settings/BrandIdentityTab";
import { ContentPreferencesTab } from "@/components/settings/ContentPreferencesTab";
import { VisualStyleTab } from "@/components/settings/VisualStyleTab";
import { WorkflowsSection } from "@/components/settings/WorkflowsSection";
import { TechStackSection } from "@/components/settings/TechStackSection";
import { RoadmapSection } from "@/components/settings/RoadmapSection";
import { ChangelogSection } from "@/components/settings/ChangelogSection";
import { FeatureValidationDashboard } from "@/components/system/FeatureValidationDashboard";
import { Settings as SettingsIcon, Palette, Brain, Code, GitBranch, Scroll, Shield } from "lucide-react";

export function Settings() {
  return (
    <AnimatedLayout>
      <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <RoleBasedSidebar />
        
        <main className="flex-1 ml-64 p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
              <SettingsIcon className="h-8 w-8 text-purple-400" />
              <div>
                <h1 className="text-3xl font-bold text-white">Settings</h1>
                <p className="text-gray-400">Customize your AI content platform experience</p>
              </div>
            </div>

            <Tabs defaultValue="brand" className="space-y-6">
              <TabsList className="grid w-full grid-cols-7 bg-gray-800/50 border border-gray-700">
                <TabsTrigger value="brand" className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Brand
                </TabsTrigger>
                <TabsTrigger value="content" className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Content
                </TabsTrigger>
                <TabsTrigger value="visual" className="flex items-center gap-2">
                  <SettingsIcon className="h-4 w-4" />
                  Visual
                </TabsTrigger>
                <TabsTrigger value="workflows" className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4" />
                  Workflows
                </TabsTrigger>
                <TabsTrigger value="tech" className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  Tech Stack
                </TabsTrigger>
                <TabsTrigger value="roadmap" className="flex items-center gap-2">
                  <Scroll className="h-4 w-4" />
                  Roadmap
                </TabsTrigger>
                <TabsTrigger value="validation" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Validation
                </TabsTrigger>
              </TabsList>

              <TabsContent value="brand">
                <BrandIdentityTab />
              </TabsContent>

              <TabsContent value="content">
                <ContentPreferencesTab />
              </TabsContent>

              <TabsContent value="visual">
                <VisualStyleTab />
              </TabsContent>

              <TabsContent value="workflows">
                <WorkflowsSection />
              </TabsContent>

              <TabsContent value="tech">
                <TechStackSection />
              </TabsContent>

              <TabsContent value="roadmap">
                <div className="space-y-6">
                  <RoadmapSection />
                  <ChangelogSection />
                </div>
              </TabsContent>

              <TabsContent value="validation">
                <FeatureValidationDashboard />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </AnimatedLayout>
  );
}
