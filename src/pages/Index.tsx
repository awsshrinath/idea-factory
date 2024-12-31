import { Sidebar } from "@/components/Sidebar";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { PerformanceMetrics } from "@/components/dashboard/PerformanceMetrics";
import { RecentActivity } from "@/components/dashboard/RecentActivity";

const Index = () => {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 animate-fadeIn">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white">
                Welcome back, Creator!
              </h1>
              <p className="text-muted-foreground mt-2">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
          </div>

          <QuickActions />
          <PerformanceMetrics />
          <RecentActivity />
        </div>
      </main>
    </div>
  );
};

export default Index;