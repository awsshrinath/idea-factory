
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="flex items-center space-x-2 rounded-lg bg-destructive p-3 text-destructive-foreground shadow-lg">
        <WifiOff className="h-5 w-5" />
        <div>
          <p className="font-bold">You are offline</p>
          <p className="text-sm">Please check your internet connection.</p>
        </div>
      </div>
    </div>
  );
}
