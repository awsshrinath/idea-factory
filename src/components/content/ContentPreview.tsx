import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";
import { ContentFormData } from "@/pages/Content";

interface ContentPreviewProps {
  formData: ContentFormData;
}

export function ContentPreview({ formData }: ContentPreviewProps) {
  const getPreviewContent = () => {
    if (!formData.description) {
      return "Your content preview will appear here...";
    }
    return formData.description;
  };

  const getCharacterLimit = (platform: string) => {
    switch (platform) {
      case "twitter":
        return 280;
      case "linkedin":
        return 3000;
      case "facebook":
        return 2000;
      default:
        return Infinity;
    }
  };

  return (
    <Card className="border border-accent/20 shadow-lg bg-gradient-to-br from-card/80 to-card backdrop-blur-sm animate-fade-in hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          <Eye className="w-5 h-5" />
          Live Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {formData.platforms.map((platform) => {
            const content = getPreviewContent();
            const limit = getCharacterLimit(platform);
            const count = content.length;

            return (
              <div
                key={platform}
                className="p-4 rounded-lg border border-accent/20 bg-background/50 hover:shadow-md transition-all duration-300 hover:scale-[1.02] hover:border-primary/50 group"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium capitalize text-foreground group-hover:text-primary transition-colors duration-300">
                    {platform}
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    {count}/{limit} characters
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap text-foreground/90">
                  {content}
                </p>
              </div>
            );
          })}

          {formData.platforms.length === 0 && (
            <div className="text-center text-muted-foreground py-8 animate-pulse">
              Select a platform to see the preview
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}