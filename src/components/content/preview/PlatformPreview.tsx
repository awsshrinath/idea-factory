import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface PlatformPreviewProps {
  platform: string;
  content: string;
  isEditing: boolean;
  onContentChange: (content: string) => void;
}

export function PlatformPreview({ platform, content, isEditing, onContentChange }: PlatformPreviewProps) {
  const commonClasses = "p-6 rounded-lg border transition-all duration-300 hover:shadow-xl group relative";

  const getPlatformStyles = () => {
    switch (platform) {
      case "linkedin":
        return "border-[#0077B5]/20 bg-white/5 hover:border-[#0077B5]/50";
      case "twitter":
        return "border-[#1DA1F2]/20 bg-white/5 hover:border-[#1DA1F2]/50";
      case "facebook":
        return "border-[#1877F2]/20 bg-white/5 hover:border-[#1877F2]/50";
      default:
        return "";
    }
  };

  const renderHeader = () => {
    return (
      <div className="flex items-center gap-3 mb-4">
        <Avatar className={platform === "linkedin" ? "h-12 w-12" : "h-10 w-10"}>
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-semibold text-foreground">John Doe</h4>
          <p className="text-sm text-muted-foreground">
            {platform === "linkedin" && "Marketing Director • 2nd"}
            {platform === "twitter" && "@johndoe"}
            {platform === "facebook" && "Just now • 🌎"}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className={cn(commonClasses, getPlatformStyles())}>
      {renderHeader()}
      <div 
        className={cn(
          "prose prose-invert max-w-none",
          isEditing ? "border border-dashed border-primary/50 p-2 rounded" : ""
        )}
        contentEditable={isEditing}
        onBlur={(e) => onContentChange(e.currentTarget.textContent || "")}
        suppressContentEditableWarning
      >
        {content}
      </div>
    </div>
  );
}