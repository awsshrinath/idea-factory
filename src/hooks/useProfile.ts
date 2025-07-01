import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface UserProfile {
  id: string;
  email?: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  role?: string;
}

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Fetch from profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
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
            throw createError;
          } else {
            setProfile({
              id: user.id,
              email: user.email,
              username: newProfile.username || undefined,
              full_name: newProfile.full_name || undefined,
              avatar_url: newProfile.avatar_url || undefined,
              role: newProfile.role || undefined,
            });
          }
        } else {
          setProfile({
            id: user.id,
            email: user.email,
            username: profileData.username || undefined,
            full_name: profileData.full_name || undefined,
            avatar_url: profileData.avatar_url || undefined,
            role: profileData.role || undefined,
          });
        }
      } else {
        setProfile(null);
      }
    } catch (error: any) {
      console.error('Error loading user profile:', error);
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load profile",
      });
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile(updates: Partial<UserProfile>) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      // Update profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Also update auth metadata if needed
      if (updates.full_name) {
        const { error: authError } = await supabase.auth.updateUser({
          data: { full_name: updates.full_name }
        });
        if (authError) throw authError;
      }

      setProfile(prev => prev ? { ...prev, ...updates } : null);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile",
      });
    }
  }

  return {
    profile,
    loading,
    error,
    updateProfile,
    refetch: getProfile,
  };
}
