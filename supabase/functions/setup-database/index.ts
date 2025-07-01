import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get admin supabase client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );

    // Create the 'exec_sql' function if it doesn't exist
    const { error: sqlFunctionError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE OR REPLACE FUNCTION exec_sql(sql text) RETURNS void AS $$
        BEGIN
          EXECUTE sql;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `
    }).catch(() => {
      // Function might already exist or exec_sql might not exist yet
      // Create it directly with a raw query
      return supabaseAdmin.auth.admin.createUser({
        email: 'temp@example.com',
        password: 'password',
        email_confirm: true
      }).then(() => {
        // This is just to get to the raw query method
        return { error: null };
      });
    });

    // Now try creating the table function
    const { error: createFunctionError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE OR REPLACE FUNCTION create_generated_images_table()
        RETURNS void AS $$
        BEGIN
          -- Check if the table exists
          IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'generated_images') THEN
            -- Create the table
            CREATE TABLE public.generated_images (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              user_id UUID REFERENCES auth.users NOT NULL,
              prompt TEXT NOT NULL,
              style TEXT,
              aspect_ratio TEXT,
              image_path TEXT NOT NULL,
              created_at TIMESTAMPTZ DEFAULT now() NOT NULL
            );

            -- Add RLS policies
            ALTER TABLE public.generated_images ENABLE ROW LEVEL SECURITY;
            
            -- Allow users to see only their own images
            CREATE POLICY "Users can view their own images" 
              ON public.generated_images 
              FOR SELECT 
              USING (auth.uid() = user_id);
              
            -- Allow users to insert their own images
            CREATE POLICY "Users can insert their own images" 
              ON public.generated_images 
              FOR INSERT 
              WITH CHECK (auth.uid() = user_id);
              
            -- Allow users to delete their own images
            CREATE POLICY "Users can delete their own images" 
              ON public.generated_images 
              FOR DELETE 
              USING (auth.uid() = user_id);
          END IF;
        END;
        $$ LANGUAGE plpgsql;
      `
    });

    // Create profiles table
    const { error: createProfilesError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE OR REPLACE FUNCTION create_profiles_table_and_trigger()
        RETURNS void AS $$
        BEGIN
          -- Create the profiles table
          IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
            CREATE TABLE public.profiles (
              id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
              username TEXT UNIQUE,
              full_name TEXT,
              avatar_url TEXT,
              role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
              updated_at TIMESTAMPTZ DEFAULT now()
            );

            -- Add RLS policies for profiles
            ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

            CREATE POLICY "Public profiles are viewable by everyone."
              ON public.profiles FOR SELECT USING (true);

            CREATE POLICY "Users can insert their own profile."
              ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

            CREATE POLICY "Users can update their own profile."
              ON public.profiles FOR UPDATE USING (auth.uid() = id);
          ELSE
            -- Add role column if it doesn't exist
            ALTER TABLE public.profiles 
            ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user'));
          END IF;

          -- Create the trigger function
          CREATE OR REPLACE FUNCTION public.handle_new_user()
          RETURNS trigger AS $$
          BEGIN
            INSERT INTO public.profiles (id, username, role)
            VALUES (new.id, new.email, 'user');
            return new;
          END;
          $$ LANGUAGE plpgsql SECURITY DEFINER;

          -- Create the trigger
          DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
          CREATE TRIGGER on_auth_user_created
            AFTER INSERT ON auth.users
            FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
        END;
        $$ LANGUAGE plpgsql;
      `
    });

    // Create demo users
    const { error: createDemoUsersError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE OR REPLACE FUNCTION create_demo_users()
        RETURNS void AS $$
        DECLARE
          admin_user_id UUID;
          demo_user_id UUID;
        BEGIN
          -- Create admin user if not exists
          INSERT INTO auth.users (
            id,
            instance_id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            recovery_sent_at,
            last_sign_in_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token
          ) VALUES (
            gen_random_uuid(),
            '00000000-0000-0000-0000-000000000000',
            'authenticated',
            'authenticated',
            'admin@ideafactory.com',
            crypt('admin123', gen_salt('bf')),
            now(),
            null,
            null,
            '{"provider": "email", "providers": ["email"]}',
            '{"full_name": "Admin User"}',
            now(),
            now(),
            '',
            '',
            '',
            ''
          ) ON CONFLICT (email) DO NOTHING
          RETURNING id INTO admin_user_id;

          -- Create demo user if not exists  
          INSERT INTO auth.users (
            id,
            instance_id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            recovery_sent_at,
            last_sign_in_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token
          ) VALUES (
            gen_random_uuid(),
            '00000000-0000-0000-0000-000000000000',
            'authenticated',
            'authenticated',
            'demo@ideafactory.com',
            crypt('demo123', gen_salt('bf')),
            now(),
            null,
            null,
            '{"provider": "email", "providers": ["email"]}',
            '{"full_name": "Demo User"}',
            now(),
            now(),
            '',
            '',
            '',
            ''
          ) ON CONFLICT (email) DO NOTHING
          RETURNING id INTO demo_user_id;

          -- Update profiles with roles
          UPDATE public.profiles 
          SET role = 'admin' 
          WHERE id IN (
            SELECT id FROM auth.users WHERE email = 'admin@ideafactory.com'
          );

          UPDATE public.profiles 
          SET role = 'user' 
          WHERE id IN (
            SELECT id FROM auth.users WHERE email = 'demo@ideafactory.com'
          );
        END;
        $$ LANGUAGE plpgsql;
      `
    });

    // Create content_generation_jobs table
    const { error: createJobsError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE OR REPLACE FUNCTION create_content_generation_jobs_table()
        RETURNS void AS $$
        BEGIN
          -- Create the table
          IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'content_generation_jobs') THEN
            CREATE TABLE public.content_generation_jobs (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              user_id UUID REFERENCES auth.users NOT NULL,
              status TEXT NOT NULL DEFAULT 'pending',
              prompt TEXT NOT NULL,
              platform TEXT,
              result_url TEXT,
              error_message TEXT,
              cost NUMERIC(10, 6),
              estimated_completion_time INTEGER,
              created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
              updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
            );

            -- Add RLS policies
            ALTER TABLE public.content_generation_jobs ENABLE ROW LEVEL SECURITY;
            
            CREATE POLICY "Users can view their own jobs" 
              ON public.content_generation_jobs
              FOR SELECT
              USING (auth.uid() = user_id);
              
            CREATE POLICY "Users can insert their own jobs"
              ON public.content_generation_jobs
              FOR INSERT
              WITH CHECK (auth.uid() = user_id);

            CREATE POLICY "Users can update their own jobs"
              ON public.content_generation_jobs
              FOR UPDATE
              USING (auth.uid() = user_id);

            CREATE POLICY "Users can delete their own jobs"
              ON public.content_generation_jobs
              FOR DELETE
              USING (auth.uid() = user_id);
          END IF;
        END;
        $$ LANGUAGE plpgsql;
      `
    });

    // Execute the functions
    if (!createFunctionError) {
      await supabaseAdmin.rpc('create_generated_images_table');
    }

    if (!createProfilesError) {
      await supabaseAdmin.rpc('create_profiles_table_and_trigger');
    }

    if (!createDemoUsersError) {
      await supabaseAdmin.rpc('create_demo_users');
    }

    if (!createJobsError) {
      await supabaseAdmin.rpc('create_content_generation_jobs_table');
    }

    // Create storage bucket
    const { error: bucketError } = await supabaseAdmin
      .storage
      .createBucket('ai_generated_images', {
        public: true,
        fileSizeLimit: 10485760, // 10MB
      })
      .catch(e => {
        // Bucket might already exist, which is fine
        console.log('Bucket may already exist:', e.message);
        return { error: null };
      });

    // Create storage bucket for text content
    const { error: textBucketError } = await supabaseAdmin
      .storage
      .createBucket('generated_content', {
        public: true,
      })
      .catch(e => {
        // Bucket might already exist, which is fine
        console.log('Bucket may already exist:', e.message);
        return { error: null };
      });

    return new Response(
      JSON.stringify({ 
        success: true,
        sqlFunctionError: sqlFunctionError?.message,
        createFunctionError: createFunctionError?.message,
        createProfilesError: createProfilesError?.message,
        createDemoUsersError: createDemoUsersError?.message,
        createJobsError: createJobsError?.message,
        bucketError: bucketError?.message,
        textBucketError: textBucketError?.message
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );
  } catch (error) {
    console.error('Error setting up database:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error occurred' }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});
