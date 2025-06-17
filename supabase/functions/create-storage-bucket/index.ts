
import { createClient } from '@supabase/supabase-js';
import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
=======

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';


const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {

    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      throw new Error("Supabase URL or service key is not defined in environment variables.");
    }
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const { bucketName, isPublic } = await req.json();

    if (!bucketName) {
      return new Response(JSON.stringify({ error: 'Bucket name is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { data, error } = await supabase.storage.createBucket(bucketName, {
      public: isPublic || false,
    });

    if (error) {
      // Check if the bucket already exists
      if (error.message.includes('already exists')) {
        return new Response(JSON.stringify({ message: `Bucket '${bucketName}' already exists.` }), {
          status: 200, // Or 409 Conflict, depending on desired behavior
          headers: { 'Content-Type': 'application/json' },
        });
      }
      throw error;
    }

    return new Response(JSON.stringify({ message: 'Bucket created successfully!', data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(String(err?.message ?? err), { status: 500 });

    // Create Supabase client with service role key (caution: powerful privileges)
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Create storage bucket for AI generated images
    const { data: bucketData, error: bucketError } = await supabaseClient
      .storage
      .createBucket('ai_generated_images', {
        public: true,
        fileSizeLimit: 10485760, // 10MB
      });

    if (bucketError) {
      // Bucket may already exist, which is fine
      console.log('Bucket creation error (may already exist):', bucketError.message);
    } else {
      console.log('Bucket created successfully:', bucketData);
    }

    // Set up bucket policies to allow authenticated users to access
    const { error: policyError } = await supabaseClient
      .storage
      .from('ai_generated_images')
      .createSignedUrl('test.txt', 60);

    if (policyError && !policyError.message.includes('does not exist')) {
      console.error('Error setting up bucket policies:', policyError);
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Storage bucket setup completed' }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );
  } catch (error) {
    console.error('Error in create-storage-bucket function:', error);
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
