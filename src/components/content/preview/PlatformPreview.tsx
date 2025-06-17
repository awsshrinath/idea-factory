
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PlatformPreviewProps {
  platform: string;
  content: string;
  isEditing: boolean;
  onContentChange: (content: string) => void;
}

export function PlatformPreview({ platform, content, isEditing, onContentChange }: PlatformPreviewProps) {
  const commonClasses = "p-[24px] rounded-[12px] border transition-all duration-300 hover:shadow-xl group relative shadow-[0_12px_12px_rgba(0,0,0,0.2)]";

  const getPlatformStyles = () => {
    switch (platform) {
      case "linkedin":
        return "border-[#0077B5]/20 bg-gradient-to-br from-[#131820] to-[#1a202c] hover:border-[#0077B5]/50";
      case "twitter":
        return "border-[#1DA1F2]/20 bg-gradient-to-br from-[#131820] to-[#1a2030] hover:border-[#1DA1F2]/50";
      case "facebook":
        return "border-[#1877F2]/20 bg-gradient-to-br from-[#131820] to-[#1a2033] hover:border-[#1877F2]/50";
      default:
        return "bg-gradient-to-br from-[#121212] to-[#1a1a1a]";
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
          <h4 className="font-[600] text-[18px] text-foreground mb-[16px]">John Doe</h4>
          <p className="text-sm text-muted-foreground">
            {platform === "linkedin" && "Marketing Director • 2nd"}
            {platform === "twitter" && "@johndoe"}
            {platform === "facebook" && "Just now • 🌎"}
          </p>
        </div>
      </div>
    );
  };

  // Function to format content with styling
  const formatContent = (text: string) => {
    // Format hashtags
    let formattedText = text.replace(
      /#(\w+)/g, 
      '<span class="text-[#1DA1F2] font-medium">#$1</span>'
    );
    
    // Format headers (lines starting with # or ##)
    formattedText = formattedText.replace(
      /^(#{1,2})\s+(.+)$/gm,
      '<h3 class="font-bold text-lg my-2">$2</h3>'
    );
    
    // Format bullet points
    formattedText = formattedText.replace(
      /^(\s*)-\s+(.+)$/gm,
      '<div class="flex items-start my-1"><span class="mr-2">•</span><span>$2</span></div>'
    );
    
    return formattedText;
  };

  return (
    <div className={cn(commonClasses, getPlatformStyles())}>
      {renderHeader()}
      
      {!isEditing && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onContentChange(content)}
          className="absolute top-3 right-3 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 hover:bg-primary/20 transition-all duration-300"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      )}
      
      {isEditing ? (
        <Textarea
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          className="min-h-[120px] bg-background/50 border-primary/30 focus:border-primary mt-[12px]"
          placeholder={`Write your ${platform} post here...`}
        />
      ) : (
        <div 
          className="prose prose-invert max-w-none whitespace-pre-wrap animate-[fadeIn_0.4s_ease]"
          dangerouslySetInnerHTML={{ __html: formatContent(content) }}
        />
      )}
    </div>
  );
}
