
import { Sidebar } from "@/components/Sidebar";
import { MobileNavigation } from "@/components/MobileNavigation";
import { MultimediaPremiumBackground } from "@/components/ui/multimedia-premium-background";
import { useMobileOptimized } from "@/hooks/use-mobile-optimized";
import { cn } from "@/lib/utils";
import { Rss } from "lucide-react";
import { RSSOverviewCards } from "@/components/sources/RSSOverviewCards";
import { RSSFeedManager } from "@/components/sources/RSSFeedManager";
import { AddRSSForm } from "@/components/sources/AddRSSForm";

export function Sources() {
  const { isMobile, getCardPadding } = useMobileOptimized();

  return (
    <div className="min-h-screen flex bg-background overflow-x-hidden w-full relative">
      <MultimediaPremiumBackground />
      <Sidebar />
      <MobileNavigation />
      <main className={cn(
        "flex-1 animate-fadeIn w-full max-w-full pb-20 relative z-10 transition-all duration-300",
        getCardPadding(),
        isMobile ? "ml-0 pt-20 px-4" : "ml-64 pl-8 p-6 md:p-8 lg:p-10",
      )}>
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Enhanced Header */}
          <div className="mb-8 space-y-3">
            <div className="flex items-center gap-3">
              <h1 className={cn(
                "enterprise-heading",
                isMobile ? "text-2xl" : "text-4xl"
              )}>
                Content Sources
              </h1>
              <Rss className="h-6 w-6 text-orange-400 animate-pulse" />
            </div>
            <p className={cn(
              "premium-body max-w-2xl",
              isMobile ? "text-base" : "text-lg"
            )}>
              Monitor RSS feeds, track trends, and curate high-quality content from trusted sources
            </p>
          </div>

          {/* RSS Overview Cards */}
          <RSSOverviewCards />

          {/* RSS Feed Management */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RSSFeedManager />
            </div>
            <div>
              <AddRSSForm />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
