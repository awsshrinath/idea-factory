
import { supabase } from '@/integrations/supabase/client';

export async function validateDatabase() {
  try {
    console.log('🔍 Validating database setup...');

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) {
      console.error('❌ Auth error:', authError);
      return false;
    }

    if (!user) {
      console.log('⚠️ No authenticated user');
      return false;
    }

    console.log('✅ User authenticated:', user.email);

    // Test basic table access
    const tables = [
      'profiles',
      'generated_content', 
      'generated_images',
      'videos',
      'scheduled_posts'
    ];

    for (const table of tables) {
      try {
        const { error } = await supabase
          .from(table)
          .select('*')
          .limit(1);

        if (error) {
          console.error(`❌ Error accessing ${table}:`, error);
        } else {
          console.log(`✅ ${table} table accessible`);
        }
      } catch (err) {
        console.error(`❌ Exception accessing ${table}:`, err);
      }
    }

    // Test storage buckets
    const buckets = ['images', 'videos', 'ai_generated_images'];
    
    for (const bucket of buckets) {
      try {
        const { error } = await supabase
          .storage
          .from(bucket)
          .list('', { limit: 1 });

        if (error) {
          console.error(`❌ Error accessing ${bucket} bucket:`, error);
        } else {
          console.log(`✅ ${bucket} bucket accessible`);
        }
      } catch (err) {
        console.error(`❌ Exception accessing ${bucket} bucket:`, err);
      }
    }

    console.log('✅ Database validation complete');
    return true;

  } catch (error) {
    console.error('❌ Database validation failed:', error);
    return false;
  }
}
