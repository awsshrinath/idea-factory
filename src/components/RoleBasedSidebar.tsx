
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
  Shield,
  Users,
  BarChart3,
  Zap,
  Building
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/hooks/useRole';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export function RoleBasedSidebar() {
  const location = useLocation();
  const { signOut } = useAuth();
  const { userRole, isAdmin } = useRole();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const adminMenuItems = [
    { icon: Building, label: "Admin Overview", path: "/admin" },
    { icon: Zap, label: "Integrations", path: "/admin/integrations" },
    { icon: Users, label: "User Management", path: "/admin/users" },
    { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
    { icon: Settings, label: "System Settings", path: "/admin/settings" },
  ];

  const userMenuItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: FileText, label: "Content", path: "/content" },
    { icon: Calendar, label: "Schedule", path: "/schedule" },
    { icon: Image, label: "Images", path: "/images" },
    { icon: Video, label: "Videos", path: "/videos" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const menuItems = isAdmin ? adminMenuItems : userMenuItems;
  const themeColor = isAdmin ? 'bg-orange-600/20 text-orange-400 border-orange-500/30' : 'bg-purple-600/30 text-purple-400 border-purple-500/30';

  return (
    <aside className="fixed left-0 top-0 z-20 flex h-full w-64 flex-col gap-2 border-r border-r-white/5 bg-black/5 backdrop-blur-sm">
      {/* Logo and Brand */}
      <Link to={isAdmin ? "/admin" : "/"} className="flex h-16 items-center justify-start px-4">
        <img src="/logo.svg" alt="Logo" className="h-8 w-auto mr-2" />
        <div className="flex flex-col">
          <span className="font-bold text-lg text-white">
            AI Content Platform
          </span>
          <Badge variant="outline" className={`text-xs ${themeColor} border`}>
            {isAdmin ? 'Admin Panel' : 'User Dashboard'}
          </Badge>
        </div>
      </Link>

      {/* Navigation Links */}
      <nav className="flex flex-col flex-1 p-2 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-white/5 hover:text-white ${
              location.pathname === item.path
                ? isAdmin 
                  ? "bg-orange-600/20 text-orange-400 border-l-2 border-orange-500"
                  : "bg-purple-600/30 text-purple-400 border-l-2 border-purple-500"
                : "text-gray-400"
            }`}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}

        {/* Role switcher for admins */}
        {isAdmin && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <Link
              to="/"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
            >
              <Home className="h-5 w-5" />
              Switch to User View
            </Link>
          </div>
        )}
      </nav>

      {/* User Profile and Logout */}
      <div className="border-t border-t-white/10 p-4">
        <DropdownMenu open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex w-full justify-between px-4">
              <div className="flex items-center gap-3">
                <div className={`p-1 rounded ${isAdmin ? 'bg-orange-600/20' : 'bg-purple-600/20'}`}>
                  {isAdmin ? <Shield className="h-4 w-4 text-orange-400" /> : <User className="h-4 w-4 text-purple-400" />}
                </div>
                <div className="text-left">
                  <span className="text-sm font-medium text-gray-300 block">
                    {isAdmin ? 'Administrator' : 'User'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Access
                  </span>
                </div>
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
              <span>Account Settings</span>
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
