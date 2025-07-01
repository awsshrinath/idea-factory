import { supabase } from '@/integrations/supabase/client';

export async function checkDemoUsers() {
  try {
    // Check if demo users exist by trying to sign them in
    const adminCheck = await supabase.auth.signInWithPassword({
      email: 'admin@ideafactory.com',
      password: 'admin123'
    }).then(result => {
      if (!result.error) {
        supabase.auth.signOut(); // Sign out immediately
        return true;
      }
      return false;
    }).catch(() => false);

    const demoCheck = await supabase.auth.signInWithPassword({
      email: 'demo@ideafactory.com',
      password: 'demo123'
    }).then(result => {
      if (!result.error) {
        supabase.auth.signOut(); // Sign out immediately
        return true;
      }
      return false;
    }).catch(() => false);

    return {
      adminExists: adminCheck,
      demoExists: demoCheck
    };
  } catch (error) {
    console.error('Error checking demo users:', error);
    return {
      adminExists: false,
      demoExists: false,
      error
    };
  }
}

export async function createDemoUserProfiles() {
  try {
    // This function should be called after demo users are created
    // to ensure they have proper profiles with roles
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'No authenticated user' };

    // Check if current user needs a profile
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!existingProfile) {
      // Determine role based on email
      const role = user.email === 'admin@ideafactory.com' ? 'admin' : 'user';
      
      const { error } = await supabase
        .from('profiles')
        .insert([
          {
            id: user.id,
            username: user.email,
            full_name: user.user_metadata?.full_name || (role === 'admin' ? 'Admin User' : 'Demo User'),
            role: role
          }
        ]);

      if (error) {
        console.error('Error creating profile:', error);
        return { success: false, error };
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error creating demo user profile:', error);
    return { success: false, error };
  }
} 