
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
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
        // For now, we'll use the user data from auth
        // In the future, we can extend this to use a profiles table
        setProfile({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name,
          avatar_url: user.user_metadata?.avatar_url,
        });
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
      const { error } = await supabase.auth.updateUser({
        data: updates
      });

      if (error) throw error;

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
