
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

export function AuthStatus() {
  const { user, signOut, loading } = useAuth();

  if (loading) {
    return <div className="text-sm text-gray-600">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 text-sm">
        <User className="h-4 w-4" />
        <span>{user.email}</span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={signOut}
        className="text-red-600 hover:text-red-700"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}
