
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function TipsSection() {
  return (
    <Card className="border border-white/5 bg-[#1F1F33]/50 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Tips & Examples</CardTitle>
        <CardDescription>How to get the best results</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="font-medium">Writing Clear Prompts</h4>
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
