
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Sidebar } from "@/components/Sidebar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if user is already authenticated
  useState(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate("/");
      }
    };
    checkAuth();
  });

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log(`Attempting ${isLogin ? 'login' : 'signup'} with:`, { email, password });
      
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        
        navigate("/");
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: "Account created",
          description: "Your account has been created successfully.",
        });
        
        // If email verification is required, show a message
        if (data?.user?.identities?.length === 0) {
          toast({
            title: "Email verification required",
            description: "Please check your email to verify your account.",
          });
        } else {
          navigate("/");
        }
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: error.message || "An error occurred during authentication",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoAccount = async () => {
    setEmail("demo@example.com");
    setPassword("password123");
    setIsLogin(true);
  };

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 flex items-center justify-center">
        <Card className="w-[450px] bg-gradient-card border border-white/10 shadow-card hover:shadow-card-hover transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              {isLogin ? "Login" : "Sign Up"}
            </CardTitle>
            <CardDescription className="text-center">
              {isLogin
                ? "Sign in to your account"
                : "Create a new account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="email">
                  Email
                </label>
                <Input
                  id="email"
                  placeholder="your@email.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="bg-background border-white/10 focus:border-primary transition-colors"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="password">
                  Password
                </label>
                <Input
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  className="bg-background border-white/10 focus:border-primary transition-colors"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-secondary hover:bg-gradient-primary shadow-glow hover:shadow-card-hover transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading
                  ? "Processing..."
                  : isLogin
                  ? "Sign In"
                  : "Create Account"}
              </Button>
            </form>
            
            <div className="mt-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or use
                  </span>
                </div>
              </div>
              
              <Button
                variant="outline"
                className="w-full mt-4 bg-background/30 hover:bg-primary/20"
                onClick={handleDemoAccount}
              >
                Use Demo Account
              </Button>
            </div>
          </CardContent>
          <CardFooter className="justify-center">
            <Button
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:text-primary/80"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
