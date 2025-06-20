import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Home,
  FileText,
  Image,
  Video,
  Calendar,
  Settings,
  LogOut,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAuth } from '@/hooks/useAuth';

const menuItems = [
  { icon: Home, label: 'Dashboard', path: '/' },
  { icon: FileText, label: 'Content', path: '/content' },
  { icon: Image, label: 'Images', path: '/images' },
  { icon: Video, label: 'Videos', path: '/videos' },
  { icon: Calendar, label: 'Schedule', path: '/schedule' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar() {
  const location = useLocation();
  const { isAuthenticated, signOut } = useAuth();

  return (
    <TooltipProvider>
      <aside className="fixed inset-y-0 left-0 z-10 flex w-14 flex-col border-r bg-background">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          {menuItems.map((item) => (
            <Tooltip key={item.path}>
              <TooltipTrigger asChild>
                <Link
                  to={item.path}
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8',
                    location.pathname === item.path && 'bg-accent text-accent-foreground'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="sr-only">{item.label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          ))}
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          {isAuthenticated && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={signOut}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="sr-only">Sign Out</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Sign Out</TooltipContent>
            </Tooltip>
          )}
        </nav>
      </aside>
    </TooltipProvider>
  );
}
