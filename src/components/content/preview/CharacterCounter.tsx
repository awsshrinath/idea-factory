
import { cn } from "@/lib/utils";

interface CharacterCounterProps {
  platform: string;
  count: number;
}

export function CharacterCounter({ platform, count }: CharacterCounterProps) {
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

  const limit = getCharacterLimit(platform);

  return (
    <span className={cn(
      "text-sm",
      count > limit ? "text-destructive" : "text-muted-foreground"
    )}>
      {count}/{limit} characters
    </span>
  );
}
