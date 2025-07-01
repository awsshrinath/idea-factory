import { useSession, useUser } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';

interface UserProfile {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  role?: string;
}

export const useAuth = () => {
  const session = useSession();
  const user = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error) {
            console.error('Error fetching profile:', error);
            // If profile doesn't exist, create it
            const { data: newProfile, error: createError } = await supabase
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
      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  const signInWithGithub = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
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
    signInWithGithub,
    signOut,
    isAuthenticated: !!session,
    isAdmin,
    isUser,
  };
}; 