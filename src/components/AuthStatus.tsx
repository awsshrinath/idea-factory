import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogIn, LogOut, User, Loader2, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";

export function AuthStatus() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, loading, isAuthenticated, isAdmin, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
      navigate("/auth");
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: error.message || "An error occurred during logout.",
      });
    }
  };

  const handleLogin = () => {
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="w-24 flex items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleLogin}
        className="flex items-center gap-2 bg-background/10 backdrop-blur-sm hover:bg-primary/20"
      >
        <LogIn className="h-4 w-4" />
        <span>Login</span>
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 text-sm text-foreground/80 bg-background/10 px-3 py-1 rounded-md backdrop-blur-sm">
        <div className="flex items-center gap-2">
          {isAdmin() ? <Crown className="h-3 w-3 text-yellow-500" /> : <User className="h-3 w-3" />}
          <span className="max-w-[100px] truncate">{user.email}</span>
        </div>
        {profile?.role && (
          <Badge 
            variant={isAdmin() ? "default" : "secondary"} 
            className="text-xs py-0 px-1 h-4"
          >
            {profile.role}
          </Badge>
        )}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleLogout}
        className="bg-background/10 backdrop-blur-sm hover:bg-destructive/20"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}
