
import {
  LayoutDashboard,
  Calendar,
  Video,
  Image,
  FileText,
  Settings,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function Sidebar() {
  const [profile, setProfile] = useState<{
    id: string;
    username: string | null;
    avatar_url: string | null;
  } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setProfile({
          id: user.id,
          username: user.email?.split('@')[0] || 'User',
          avatar_url: null,
        });
      }
    };

    fetchProfile();
  }, [toast]);
  
  const navigationItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
      description: "Overview of your content performance"
    },
    {
      name: "Schedule",
      href: "/schedule",
      icon: Calendar,
      description: "Plan and manage your content calendar"
    },
    {
      name: "Videos",
      href: "/videos",
      icon: Video,
      description: "Create and edit engaging video content"
    },
    {
      name: "Video Studio",
      href: "/video-studio",
      icon: Sparkles,
      description: "Professional video production"
    },
    {
      name: "Images",
      href: "/images",
      icon: Image,
      description: "Generate and optimize visual content"
    },
    {
      name: "Content",
      href: "/content",
      icon: FileText,
      description: "Generate and refine written content"
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      description: "Customize your platform preferences"
    },
    {
      name: "Help",
      href: "/help",
      icon: HelpCircle,
      description: "Access support and documentation"
    },
  ];

  return (
    <aside className="fixed left-0 top-0 z-20 flex h-full w-64 flex-col space-y-4 bg-gray-900 border-r border-gray-800 py-4 text-white">
      <div className="px-6">
        <NavLink to="/" className="flex items-center space-x-2">
          <Video className="h-6 w-6 text-purple-500" />
          <span className="font-bold text-xl text-white">AI Suite</span>
        </NavLink>
      </div>

      <nav className="flex-1 space-y-1 px-2">
        {navigationItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `group relative flex items-center space-x-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200 hover:bg-gray-800 ${
                isActive 
                  ? "bg-purple-600/10 text-purple-400 border-l-4 border-purple-500" 
                  : "text-gray-300 hover:text-white border-l-4 border-transparent"
              }`
            }
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-gray-800 p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex h-10 w-full items-center justify-between rounded-lg px-3 py-2 hover:bg-gray-800 transition-colors">
              <div className="flex items-center space-x-3">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={profile?.avatar_url || `https://avatar.vercel.sh/${profile?.username}.png`} />
                  <AvatarFallback className="bg-purple-600 text-white text-sm">
                    {profile?.username?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-300">{profile?.username || 'User'}</span>
              </div>
              <Settings className="h-4 w-4 text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-gray-800 border-gray-700">
            <DropdownMenuItem className="text-gray-300 hover:bg-gray-700 hover:text-white">
              <NavLink to="/settings" className="w-full">
                Settings
              </NavLink>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-gray-300 hover:bg-gray-700 hover:text-white"
              onClick={async () => {
                await supabase.auth.signOut();
                window.location.href = '/auth';
              }}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
