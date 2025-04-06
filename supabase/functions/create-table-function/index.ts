
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

    // SQL to create the function that creates the table if it doesn't exist
    const { error: functionError } = await supabaseAdmin.rpc('exec_sql', {
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
              created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
              title TEXT,
              is_favorite BOOLEAN DEFAULT false
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
              
            -- Allow users to update their own images
            CREATE POLICY "Users can update their own images" 
              ON public.generated_images 
              FOR UPDATE 
              USING (auth.uid() = user_id);
          END IF;
        END;
        $$ LANGUAGE plpgsql;
      `
    });

    if (functionError) {
      throw new Error(`Failed to create function: ${functionError.message}`);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );
  } catch (error) {
    console.error('Error creating table function:', error);
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
