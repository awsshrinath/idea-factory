
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogIn, LogOut, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function AuthStatus() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
      setLoading(false);
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);
      setUser(session?.user || null);
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    navigate("/auth");
  };

  const handleLogin = () => {
    navigate("/auth");
  };

  if (loading) {
    return <div className="w-24"></div>;
  }

  if (!user) {
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
        <User className="h-3 w-3" />
        <span className="max-w-[100px] truncate">{user.email}</span>
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
