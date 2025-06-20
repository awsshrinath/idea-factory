
import { supabase } from '@/integrations/supabase/client';
import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';

const AuthPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated, session } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    // Don't render the auth form until we know the auth state
    if (session === undefined) {
        return <div>Loading...</div>; // Or a spinner
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <SupabaseAuth
                    supabaseClient={supabase}
                    appearance={{ theme: ThemeSupa }}
                    providers={['github']}
                    redirectTo="/"
                />
            </div>
        </div>
    );
};

export default AuthPage;


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
import { AnimatedLayout } from "@/components/layouts/animated-layout";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MultimediaPremiumBackground } from "@/components/ui/multimedia-premium-background";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

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
    <div className="min-h-screen flex bg-background relative">
      <MultimediaPremiumBackground />
      <Sidebar />
      <main className={cn(
        "flex-1 p-8 flex items-center justify-center relative z-10",
        isMobile ? "ml-0 pt-20" : "ml-64"
      )}>
        <Card className="w-[480px] premium-card premium-card-hover border border-white/10 shadow-2xl backdrop-blur-xl">
          <CardHeader className="text-center space-y-4 pb-8">
            <CardTitle className="enterprise-heading text-3xl">
              {isLogin ? "Welcome Back" : "Join Creator Studio"}
            </CardTitle>
            <CardDescription className="premium-body text-base">
              {isLogin
                ? "Sign in to your creative workspace"
                : "Start creating professional content today"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleAuth} className="space-y-6">
              <div className="space-y-3">
                <label className="premium-subheading text-sm" htmlFor="email">
                  Email Address
                </label>
                <Input
                  id="email"
                  placeholder="your@email.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="premium-focus bg-white/5 border-white/10 hover:border-white/20 focus:border-purple-400 transition-all duration-300 h-12 text-base rounded-xl"
                  required
                />
              </div>
              <div className="space-y-3">
                <label className="premium-subheading text-sm" htmlFor="password">
                  Password
                </label>
                <Input
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  className="premium-focus bg-white/5 border-white/10 hover:border-white/20 focus:border-purple-400 transition-all duration-300 h-12 text-base rounded-xl"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full h-12 premium-button bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-xl hover:shadow-purple-500/25 border border-purple-500/20 hover:border-purple-400/40 font-semibold text-base micro-bounce"
                disabled={isLoading || isInitializing}
              >
                {isLoading
                  ? "Processing..."
                  : isLogin
                  ? "Sign In"
                  : "Create Account"}
              </Button>
            </form>
            
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="bg-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-4 premium-caption">
                    Or continue with
                  </span>
                </div>
              </div>
              
              <Button
                variant="outline"
                className="w-full h-12 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 premium-body text-base rounded-xl transition-all duration-300"
                onClick={handleDemoAccount}
                disabled={isLoading || isInitializing}
              >
                {isInitializing ? "Initializing..." : "Use Demo Account"}
              </Button>
            </div>
          </CardContent>
          <CardFooter className="justify-center pt-6">
            <Button
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
              className="premium-body text-purple-400 hover:text-purple-300 transition-colors"
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

