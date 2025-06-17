import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function QuickStats() {
  return (
    <Card className="bg-gradient-card border border-white/10 shadow-card 
                     hover:shadow-card-hover transition-all duration-300
                     hover:bg-gradient-card-hover">
      <CardHeader>
        <CardTitle className="text-lg text-foreground font-heading">Quick Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Scheduled Posts</p>
          <p className="text-2xl font-bold text-foreground">12</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">This Week</p>
          <p className="text-2xl font-bold text-foreground">5</p>
        </div>
      </CardContent>
    </Card>
  );
}