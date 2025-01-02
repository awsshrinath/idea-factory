import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function TipsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Tips & Examples</CardTitle>
        <CardDescription>How to get the best results</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="font-medium">Writing Great Prompts</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Be specific about the style and tone</li>
            <li>• Include your target audience</li>
            <li>• Mention any specific visuals</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}