import { supabase } from '@/integrations/supabase/client';

export interface DatabaseValidation {
  tables: {
    profiles: boolean;
    content_generation_jobs: boolean;
    generated_images: boolean;
    user_metrics: boolean;
  };
  existingUsers: Array<{
    id: string;
    email: string;
    role?: string;
    full_name?: string;
  }>;
  errors: string[];
}

export async function validateExistingDatabase(): Promise<DatabaseValidation> {
  const result: DatabaseValidation = {
    tables: {
      profiles: false,
      content_generation_jobs: false,
      generated_images: false,
      user_metrics: false,
    },
    existingUsers: [],
    errors: []
  };

  try {
    // Check profiles table
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (!profilesError) {
      result.tables.profiles = true;
      
      // Get all users from profiles
      const { data: allProfiles } = await supabase
        .from('profiles')
        .select('id, username, full_name, role');
      
      if (allProfiles) {
        // Get corresponding auth users
        for (const profile of allProfiles) {
          try {
            const { data: authUser } = await supabase.auth.admin.getUserById(profile.id);
            if (authUser.user) {
              result.existingUsers.push({
                id: profile.id,
                email: authUser.user.email || 'unknown',
                role: profile.role || undefined,
                full_name: profile.full_name || undefined
              });
            }
          } catch (e) {
            // Continue with next user if this one fails
          }
        }
      }
    } else {
      result.errors.push(`Profiles table error: ${profilesError.message}`);
    }

    // Check content_generation_jobs table
    const { error: jobsError } = await supabase
      .from('content_generation_jobs')
      .select('id')
      .limit(1);
    
    if (!jobsError) {
      result.tables.content_generation_jobs = true;
    } else {
      result.errors.push(`Jobs table error: ${jobsError.message}`);
    }

    // Check generated_images table
    const { error: imagesError } = await supabase
      .from('generated_images')
      .select('id')
      .limit(1);
    
    if (!imagesError) {
      result.tables.generated_images = true;
    } else {
      result.errors.push(`Images table error: ${imagesError.message}`);
    }

    // Check user_metrics table
    const { error: metricsError } = await supabase
      .from('user_metrics')
      .select('user_id')
      .limit(1);
    
    if (!metricsError) {
      result.tables.user_metrics = true;
    } else {
      result.errors.push(`Metrics table error: ${metricsError.message}`);
    }

  } catch (error: any) {
    result.errors.push(`General validation error: ${error.message}`);
  }

  return result;
} 