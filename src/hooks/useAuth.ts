
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  role?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Then check for existing session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        } else {
          console.log('Initial session:', session?.user?.email);
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Error in getSession:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          // Use type assertion to bypass TypeScript checking for profiles table
          const { data: profileData, error } = await (supabase as any)
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error) {
            console.error('Error fetching profile:', error);
            // If profile doesn't exist, create it
            const { data: newProfile, error: createError } = await (supabase as any)
              .from('profiles')
              .insert([
                {
                  id: user.id,
                  username: user.email,
                  full_name: user.user_metadata?.full_name,
                  role: 'user'
                }
              ])
              .select()
              .single();

            if (createError) {
              console.error('Error creating profile:', createError);
            } else {
              setProfile({
                id: user.id,
                email: user.email,
                full_name: newProfile.full_name || undefined,
                role: newProfile.role || undefined
              });
            }
          } else {
            setProfile({
              id: user.id,
              email: user.email,
              full_name: profileData.full_name || undefined,
              role: profileData.role || undefined
            });
          }
        } catch (error) {
          console.error('Error in fetchProfile:', error);
        }
      } else {
        setProfile(null);
      }
    };

    fetchProfile();
  }, [user]);

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }

      console.log('Sign in successful:', data.user?.email);
      return { data, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, password: string, options?: { data?: any }) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          ...options,
        },
      });

      if (error) {
        console.error('Sign up error:', error);
        throw error;
      }

      console.log('Sign up successful:', data.user?.email);
      return { data, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signInWithGithub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/`
      }
    });
    if (error) console.error('Error signing in with GitHub:', error);
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        throw error;
      }
      console.log('Sign out successful');
      setProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = () => {
    return profile?.role === 'admin';
  };

  const isUser = () => {
    return profile?.role === 'user';
  };

  return {
    session,
    user,
    profile,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signInWithGithub,
    signOut,
    isAuthenticated: !!session,
    isAdmin,
    isUser,
  };
};
