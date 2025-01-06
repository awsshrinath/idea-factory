import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export function TechStackSection() {
  return (
    <Card className="bg-gradient-to-br from-[#1F1F33] to-[#2C2C4A] border border-white/10 shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader>
        <CardTitle className="text-foreground">Technology Stack</CardTitle>
        <CardDescription>Technologies and frameworks used in this application</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] w-full rounded-md border border-white/10 p-4 bg-background/50">
          <div className="space-y-6">
            <div>
              <h3 className="font-bold mb-2 text-foreground">Core Technologies</h3>
              <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
                <li>React - Frontend library</li>
                <li>TypeScript - Programming language</li>
                <li>Vite - Build tool and development server</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-2 text-foreground">UI Framework</h3>
              <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
                <li>Tailwind CSS - Utility-first CSS framework</li>
                <li>shadcn/ui - React component library</li>
                <li>Lucide React - Icon library</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-2 text-foreground">Data Visualization</h3>
              <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
                <li>Recharts - Charting library</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-2 text-foreground">State Management</h3>
              <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
                <li>TanStack Query - Data fetching and caching</li>
              </ul>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
