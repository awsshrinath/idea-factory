import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";
import { ContentFormData } from "@/pages/Content";
import { useEffect, useRef, useState } from "react";

interface ContentPreviewProps {
  formData: ContentFormData;
}

export function ContentPreview({ formData }: ContentPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let rafId: number;

    const observer = new ResizeObserver((entries) => {
      // Skip if already processing a resize
      if (isResizing) return;

      // Cancel any pending frames
      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      // Clear any pending timeouts
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      setIsResizing(true);

      // Schedule the resize handling
      rafId = requestAnimationFrame(() => {
        entries.forEach(() => {
          // Handle resize if needed in the future
        });

        // Reset the resize flag after a short delay
        timeoutId = setTimeout(() => {
          setIsResizing(false);
        }, 100);
      });
    });

    if (previewRef.current) {
      observer.observe(previewRef.current);
    }

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      observer.disconnect();
    };
  }, [isResizing]);

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
    <Card 
      ref={previewRef}
      className="border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)] bg-gradient-to-br from-[#1D2433] to-[#283047] backdrop-blur-sm animate-fade-in hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.01] rounded-xl"
    >
      <CardHeader className="p-6">
        <CardTitle className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
          <Eye className="w-6 h-6" />
          Live Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {formData.platforms.map((platform) => {
            const content = getPreviewContent();
            const limit = getCharacterLimit(platform);
            const count = content.length;

            return (
              <div
                key={platform}
                className="p-6 rounded-lg border border-white/10 bg-background/50 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-primary/50 group"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium capitalize text-lg text-foreground group-hover:text-primary transition-colors duration-300">
                    {platform}
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    {count}/{limit} characters
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap text-foreground/90 leading-relaxed">
                  {content}
                </p>
              </div>
            );
          })}

          {formData.platforms.length === 0 && (
            <div className="text-center text-muted-foreground py-12 animate-pulse">
              Select a platform to see the preview
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}