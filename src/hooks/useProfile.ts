import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          setLoading(true);
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error) {
            throw error;
          }

          setProfile(data);
        } catch (error) {
          setError(error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfile();
  }, [user]);

  const updateProfile = async (updates: {
    username: string;
    full_name: string;
  }) => {
    if (user) {
      try {
        setLoading(true);
        const { error } = await supabase.from('profiles').upsert({
          id: user.id,
          ...updates,
          updated_at: new Date(),
        });

        if (error) {
          throw error;
        }

        // Refetch profile to get the latest data
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return { profile, loading, error, updateProfile };
}; 