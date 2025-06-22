
import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Calendar, 
  Image, 
  Video, 
  Settings, 
  User, 
  LogOut,
  Rss
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Sidebar() {
  const location = useLocation();
  const { signOut } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: FileText, label: "Content", path: "/content" },
    { icon: Calendar, label: "Schedule", path: "/schedule" },
    { icon: Image, label: "Images", path: "/images" },
    { icon: Video, label: "Videos", path: "/videos" },
    { icon: Rss, label: "Sources", path: "/sources" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <aside className="fixed left-0 top-0 z-20 flex h-full w-64 flex-col gap-2 border-r border-r-white/5 bg-black/5 backdrop-blur-sm">
      {/* Logo and Brand */}
      <Link to="/" className="flex h-16 items-center justify-start px-4">
        <img src="/logo.svg" alt="Logo" className="h-8 w-auto mr-2" />
        <span className="font-bold text-xl text-white">
          AI Content Platform
        </span>
      </Link>

      {/* Navigation Links */}
      <nav className="flex flex-col flex-1 p-2 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-white/5 hover:text-white ${
              location.pathname === item.path
                ? "bg-white/10 text-white"
                : "text-gray-400"
            }`}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* User Profile and Logout */}
      <div className="border-t border-t-white/10 p-4">
        <DropdownMenu open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex w-full justify-between px-4">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium text-gray-400">
                  User Profile
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-gray-800 border-gray-700">
            <DropdownMenuItem className="text-gray-300 hover:bg-gray-700">
              <User className="h-4 w-4 mr-2" />
              <span>View Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-gray-300 hover:bg-gray-700">
              <Settings className="h-4 w-4 mr-2" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-400 hover:bg-gray-700"
              onClick={() => {
                signOut();
                setIsUserMenuOpen(false);
              }}
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
