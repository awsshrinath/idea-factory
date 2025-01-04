import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function QuickStats() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Scheduled Posts</p>
          <p className="text-2xl font-bold">12</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">This Week</p>
          <p className="text-2xl font-bold">5</p>
        </div>
      </CardContent>
    </Card>
  );
}