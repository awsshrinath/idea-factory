import { useSession, useUser } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const session = useSession();
  const user = useUser();

  const signInWithGithub = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return {
    session,
    user,
    signInWithGithub,
    signOut,
    isAuthenticated: !!session,
  };
}; 