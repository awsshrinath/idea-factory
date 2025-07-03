
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

    // Test basic table access with specific table names
    const tableTests = [
      { name: 'profiles', query: () => supabase.from('profiles').select('*').limit(1) },
      { name: 'generated_content', query: () => supabase.from('generated_content').select('*').limit(1) },
      { name: 'generated_images', query: () => supabase.from('generated_images').select('*').limit(1) },
      { name: 'videos', query: () => supabase.from('videos').select('*').limit(1) },
      { name: 'scheduled_posts', query: () => supabase.from('scheduled_posts').select('*').limit(1) }
    ];

    for (const test of tableTests) {
      try {
        const { error } = await test.query();
        if (error) {
          console.error(`❌ Error accessing ${test.name}:`, error);
        } else {
          console.log(`✅ ${test.name} table accessible`);
        }
      } catch (err) {
        console.error(`❌ Exception accessing ${test.name}:`, err);
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
