
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut, Crown, Sparkles, Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const UserProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      });
    } else {
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
      navigate("/auth");
    }
  };

  return (
    <div className="flex items-center gap-4">
      {/* Notifications */}
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/20 transition-all duration-300"
      >
        <Bell className="h-4 w-4" />
        <span className="sr-only">Notifications</span>
      </Button>

      {/* User Profile Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-auto p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/20 transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" alt="Creator" />
                <AvatarFallback className="bg-gradient-to-br from-purple-600/20 to-indigo-600/20 text-white border border-purple-500/20">
                  C
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <div className="flex items-center gap-2">
                  <span className="premium-subheading text-sm">Creator</span>
                  <Badge className="badge-premium px-2 py-0.5 text-xs">
                    <Crown className="h-3 w-3 mr-1" />
                    Pro
                  </Badge>
                </div>
                <span className="premium-caption text-xs text-white/70">creator@example.com</span>
              </div>
            </div>
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          align="end" 
          className="w-64 premium-card border border-white/10 bg-slate-900/95 backdrop-blur-xl"
        >
          {/* Profile Header */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src="/placeholder.svg" alt="Creator" />
                <AvatarFallback className="bg-gradient-to-br from-purple-600/20 to-indigo-600/20 text-white border border-purple-500/20">
                  C
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="premium-subheading text-sm">Creator</span>
                  <Badge className="badge-premium px-2 py-0.5 text-xs">
                    <Crown className="h-3 w-3 mr-1" />
                    Pro
                  </Badge>
                </div>
                <span className="premium-caption text-xs text-white/70">creator@example.com</span>
                <div className="flex items-center gap-1 mt-1">
                  <Sparkles className="h-3 w-3 text-amber-400" />
                  <span className="text-xs text-amber-400 font-bold">1,250 tokens</span>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            <DropdownMenuItem className="premium-caption hover:bg-white/10 rounded-lg p-3 cursor-pointer">
              <User className="h-4 w-4 mr-3" />
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="premium-caption hover:bg-white/10 rounded-lg p-3 cursor-pointer"
              onClick={() => navigate("/settings")}
            >
              <Settings className="h-4 w-4 mr-3" />
              Preferences
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10 my-2" />
            <DropdownMenuItem 
              className="premium-caption hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg p-3 cursor-pointer"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-3" />
              Sign Out
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
