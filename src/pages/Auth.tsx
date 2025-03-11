
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, UserPlus, LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setIsAuthenticated(true);
        navigate('/images');
      }
    };
    
    checkAuth();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate('/images');
      }
    });
    
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [navigate]);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      navigate('/images');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Failed to login. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Signup successful",
        description: "Please check your email to confirm your account.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: error.message || "Failed to create account. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // If already authenticated, don't show the login page
  if (isAuthenticated) {
    return null;
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-6 bg-gradient-card border border-white/10 shadow-card">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2 text-foreground font-heading">
            Welcome to AI Studio
          </h1>
          <p className="text-muted-foreground">
            Login or create an account to generate AI images
          </p>
        </div>
        
        <Tabs defaultValue="login" className="mb-4">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email-login" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email-login"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background border-white/10"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password-login" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password-login"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-background border-white/10"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-secondary hover:bg-gradient-primary shadow-glow transition-all duration-300"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </>
                )}
              </Button>
              
              <div className="text-center mt-4">
                <Button 
                  type="button"
                  variant="link" 
                  className="text-sm text-muted-foreground hover:text-primary"
                  onClick={() => {
                    setEmail("demo@example.com");
                    setPassword("password123");
                    toast({
                      title: "Test Account",
                      description: "Demo credentials filled in. Click Login to continue.",
                    });
                  }}
                >
                  Use Demo Account
                </Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email-signup" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email-signup"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background border-white/10"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password-signup" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password-signup"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-background border-white/10"
                />
                <p className="text-xs text-muted-foreground">
                  Password must be at least 6 characters
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-secondary hover:bg-gradient-primary shadow-glow transition-all duration-300"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create Account
                  </>
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
