
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

export const useProfile = () => {
  const { user, session } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !session) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use type assertion to bypass TypeScript checking for profiles table
        const { data, error } = await (supabase as any)
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            // Profile doesn't exist, create one
            const { data: newProfile, error: createError } = await (supabase as any)
              .from('profiles')
              .insert([
                {
                  id: user.id,
                  username: user.email,
                  full_name: user.user_metadata?.full_name || null,
                  role: 'user'
                }
              ])
              .select()
              .single();

            if (createError) {
              setError('Failed to create profile');
              console.error('Error creating profile:', createError);
            } else {
              setProfile(newProfile);
            }
          } else {
            setError('Failed to fetch profile');
            console.error('Error fetching profile:', error);
          }
        } else {
          setProfile(data);
        }
      } catch (err) {
        setError('An unexpected error occurred');
        console.error('Error in fetchProfile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, session]);

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return false;

    try {
      // Use type assertion to bypass TypeScript checking for profiles table
      const { data, error } = await (supabase as any)
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        return false;
      }

      setProfile(data);
      return true;
    } catch (err) {
      console.error('Error updating profile:', err);
      return false;
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
  };
};
