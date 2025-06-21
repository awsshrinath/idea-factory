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
import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
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
  const location = useLocation();
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
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('id, username, avatar_url')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load profile data."
          });
        } else {
          setProfile({
            id: profileData?.id,
            username: profileData?.username,
            avatar_url: profileData?.avatar_url,
          });
        }
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
    <aside className="fixed left-0 top-0 z-20 flex h-full w-64 flex-col space-y-4 border-r border-white/10 bg-secondary py-4 text-white">
      <div className="px-6">
        <NavLink to="/" className="flex items-center space-x-2">
          <Video className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">AI Suite</span>
        </NavLink>
      </div>

      <nav className="flex-1 space-y-1 px-2">
        {navigationItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `group flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-primary/10 hover:text-primary ${
                isActive ? "bg-primary/10 text-primary" : "text-white/70"
              }`
            }
          >
            <item.icon className="h-4 w-4" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex h-8 w-full items-center justify-between rounded-md">
              <div className="flex items-center space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={profile?.avatar_url || `https://avatar.vercel.sh/${profile?.username}.png`} />
                  <AvatarFallback>{profile?.username?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{profile?.username || 'User'}</span>
              </div>
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>
              <NavLink to="/settings" className="w-full">
                Settings
              </NavLink>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = '/login';
            }}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
