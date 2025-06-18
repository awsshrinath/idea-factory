
import { useState, useEffect } from "react";
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
  const [isInitializing, setIsInitializing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate("/");
      } else {
        // If not authenticated, initialize the database
        initializeDatabase();
      }
    };
    checkAuth();
  }, [navigate]);

  const initializeDatabase = async () => {
    try {
      setIsInitializing(true);
      // Call the setup-database function to ensure the schema is ready
      const { error } = await supabase.functions.invoke("setup-database");
      if (error) {
        console.error("Error initializing database:", error);
      } else {
        console.log("Database initialized successfully");
      }
    } catch (error) {
      console.error("Error initializing database:", error);
    } finally {
      setIsInitializing(false);
    }
  };

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
    
    // Auto-sign up the demo account if it doesn't exist
    try {
      setIsLoading(true);
      // First try to login
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: "demo@example.com",
        password: "password123",
      });
      
      if (loginError && loginError.message.includes("Invalid login credentials")) {
        // If login fails, create the account
        const { data: signupData, error: signupError } = await supabase.auth.signUp({
          email: "demo@example.com",
          password: "password123",
        });
        
        if (signupError) throw signupError;
        
        toast({
          title: "Demo account created",
          description: "You can now login with the demo account.",
        });
      } else if (loginData.session) {
        // If login succeeds, navigate to home
        toast({
          title: "Login successful",
          description: "Welcome to the demo account!",
        });
        navigate("/");
      }
    } catch (error: any) {
      console.error('Demo account error:', error);
      toast({
        variant: "destructive",
        title: "Demo account setup failed",
        description: error.message || "An error occurred during demo account setup",
      });
    } finally {
      setIsLoading(false);
    }
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
                disabled={isLoading || isInitializing}
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
                disabled={isLoading || isInitializing}
              >
                {isInitializing ? "Initializing..." : "Use Demo Account"}
              </Button>
            </div>
          </CardContent>
          <CardFooter className="justify-center">
            <Button
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:text-primary/80"
              disabled={isLoading || isInitializing}
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
