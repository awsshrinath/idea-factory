
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function TipsSection() {
  return (
    <Card className="border border-white/10 bg-[#1F1F33]/50 backdrop-blur-sm shadow-lg transition-all duration-300">
      <CardHeader className="p-8 pb-0">
        <CardTitle className="text-xl font-semibold text-white">Tips & Examples</CardTitle>
        <CardDescription>How to get the best results</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-8 pt-6">
        <div className="space-y-4">
          <h4 className="font-semibold text-white">Writing Clear Prompts</h4>
          <ul className="text-sm text-muted-foreground space-y-3">
            <li className="flex items-center gap-3 hover:text-white transition-colors">
              <span className="text-primary text-lg">•</span> Be specific about the style and tone
            </li>
            <li className="flex items-center gap-3 hover:text-white transition-colors">
              <span className="text-primary text-lg">•</span> Include your target audience
            </li>
            <li className="flex items-center gap-3 hover:text-white transition-colors">
              <span className="text-primary text-lg">•</span> Mention any specific visuals
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
