import { Skeleton } from "@/components/ui/skeleton";

interface LoadingStateProps {
  previewMode?: boolean;
}

export function LoadingState({ previewMode = false }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <Skeleton className="w-[200px] h-[200px] rounded-md" />
      <p className="text-muted-foreground">
        {previewMode ? "Loading your latest creation..." : "Loading your images..."}
      </p>
    </div>
  );
}
