
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function TipsSection() {
  return (
    <Card className="border border-white/10 bg-gradient-card backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-foreground">Tips & Examples</CardTitle>
        <CardDescription className="text-muted-foreground">How to get the best results</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="font-medium text-foreground">Writing Great Prompts</h4>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li className="flex items-center gap-2 hover:text-foreground transition-colors">
              <span className="text-primary text-lg">•</span> Be specific about the style and tone
            </li>
            <li className="flex items-center gap-2 hover:text-foreground transition-colors">
              <span className="text-primary text-lg">•</span> Include your target audience
            </li>
            <li className="flex items-center gap-2 hover:text-foreground transition-colors">
              <span className="text-primary text-lg">•</span> Mention any specific visuals
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
