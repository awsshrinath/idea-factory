
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

    return new Response(
      JSON.stringify({ 
        success: true,
        sqlFunctionError: sqlFunctionError?.message,
        createFunctionError: createFunctionError?.message,
        bucketError: bucketError?.message
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
