import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ApiError } from '@/api';

interface ErrorDisplayProps {
  error: Error | ApiError | null;
  onReset: () => void;
  title?: string;
}

export const ErrorDisplay = ({
  error,
  onReset,
  title = "Oops! Something went wrong.",
}: ErrorDisplayProps) => {
  const errorMessage = 
    error instanceof ApiError 
      ? error.message 
      : error?.message || 'An unexpected error occurred.';

  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center space-y-4 rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center text-destructive"
    >
      <AlertTriangle className="h-10 w-10" />
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm">{errorMessage}</p>
      </div>
      <Button
        variant="destructive"
        onClick={onReset}
        className="bg-destructive/80 hover:bg-destructive"
      >
        Try Again
      </Button>
    </div>
  );
}; 