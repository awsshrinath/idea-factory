
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    console.log("Request received for image generation");
    const { prompt, style, aspectRatio, detailLevel, seed, lighting } = await req.json();
    console.log("Request data:", { prompt, style, aspectRatio, detailLevel, seed, lighting });

    // Get user information from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error("No authorization header");
      throw new Error('No authorization header');
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    console.log("Creating Supabase client with URL:", supabaseUrl);
    
    const supabaseClient = createClient(
      supabaseUrl,
      supabaseServiceKey,
      { global: { headers: { Authorization: authHeader } } }
    );

    // Get user ID from the session
    console.log("Getting user from auth token");
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''));

    if (userError) {
      console.error("User error:", userError);
      throw new Error(`Unauthorized: ${userError.message}`);
    }
    
    if (!user) {
      console.error("No user found");
      throw new Error('Unauthorized: No user found');
    }
    
    console.log("User authenticated:", user.id);

    // Enhance the prompt based on the selected style and other parameters
    let enhancedPrompt = prompt;
    
    // Add style enhancement
    switch (style) {
      case "realistic":
        enhancedPrompt += ', photorealistic, highly detailed, 8k resolution';
        break;
      case "cyberpunk":
        enhancedPrompt += ', cyberpunk style, neon lights, futuristic, urban dystopia';
        break;
      case "watercolor":
        enhancedPrompt += ', watercolor painting, soft colors, artistic, flowing, handpainted';
        break;
      case "anime":
        enhancedPrompt += ', anime style, vibrant colors, 2D, manga inspired';
        break;
      case "3d":
        enhancedPrompt += ', 3D rendered, cinema 4d style, octane render, realistic lighting';
        break;
      case "sketch":
        enhancedPrompt += ', pencil sketch, hand drawn, detailed linework, black and white';
        break;
    }
    
    // Add detail level enhancement
    switch (detailLevel) {
      case "low":
        enhancedPrompt += ', simple, minimalist';
        break;
      case "medium":
        // medium is default, no additional prompt needed
        break;
      case "high":
        enhancedPrompt += ', extremely detailed, intricate, high definition, sharp focus';
        break;
    }
    
    // Add lighting enhancement
    switch (lighting) {
      case "natural":
        enhancedPrompt += ', natural lighting, soft shadows';
        break;
      case "studio":
        enhancedPrompt += ', studio lighting, professional photography, even illumination';
        break;
      case "cinematic":
        enhancedPrompt += ', cinematic lighting, dramatic shadows, professional color grading';
        break;
    }

    // Map aspect ratio to DALL-E size options
    let size = '1024x1024';
    switch (aspectRatio) {
      case '16:9':
        size = '1792x1024';
        break;
      case '9:16':
        size = '1024x1792';
        break;
      case '4:5':
        size = '1024x1280';
        break;
    }

    console.log('Generating image with prompt:', enhancedPrompt);
    console.log('Using OpenAI API with key length:', openAIApiKey ? openAIApiKey.length : 0);
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
    }
    
    console.log('Making request to OpenAI API');
    
    // Prepare request body
    const openAIRequestBody: any = {
      model: "dall-e-3",
      prompt: enhancedPrompt,
      n: 1,
      size: size,
      quality: "standard",
    };
    
    // Add seed if provided
    if (seed) {
      openAIRequestBody.seed = parseInt(seed, 10);
    }
    
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(openAIRequestBody),
    });

    console.log('OpenAI response status:', response.status);
    const data = await response.json();
    console.log('OpenAI response:', data);

    if (data.error) {
      console.error('OpenAI API error:', data.error);
      throw new Error(data.error.message || 'Error from OpenAI API');
    }

    // Store the generated image in Supabase
    const imageUrl = data.data[0].url;
    console.log('Image URL received:', imageUrl);
    
    console.log('Fetching image from URL');
    const imageResponse = await fetch(imageUrl);
    
    if (!imageResponse.ok) {
      console.error('Failed to fetch image:', imageResponse.status);
      throw new Error(`Failed to fetch image: ${imageResponse.status}`);
    }
    
    const imageBlob = await imageResponse.blob();
    console.log('Image blob size:', imageBlob.size);

    // Upload to Storage
    const timestamp = new Date().getTime();
    const fileName = `${timestamp}-${Math.random().toString(36).substring(7)}.png`;
    
    console.log('Creating storage bucket if it does not exist');
    const { error: bucketError } = await supabaseClient
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

    if (bucketError) {
      console.error('Storage bucket creation error:', bucketError);
    }
    
    console.log('Uploading image to Supabase Storage...');
    const { error: uploadError, data: uploadData } = await supabaseClient
      .storage
      .from('ai_generated_images')
      .upload(fileName, imageBlob, {
        contentType: 'image/png',
        cacheControl: '3600',
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw new Error(`Storage upload error: ${uploadError.message}`);
    }

    // Get the public URL
    const { data: publicUrlData } = supabaseClient
      .storage
      .from('ai_generated_images')
      .getPublicUrl(fileName);

    console.log('Public URL:', publicUrlData.publicUrl);

    console.log('Checking if table exists and creating if needed');
    // Create the table if it doesn't exist (this is a simple approach for demo purposes)
    // In production, you'd want to use proper migrations
    try {
      const { error: tableCheckError } = await supabaseClient
        .from('generated_images')
        .select('id')
        .limit(1);
      
      if (tableCheckError && tableCheckError.code === '42P01') { // table doesn't exist error code
        console.log('Table does not exist, creating it');
        // Create the table using SQL
        const { error: createTableError } = await supabaseClient.rpc('create_generated_images_table');
        if (createTableError) {
          console.error('Error creating table:', createTableError);
        }
      }
    } catch (e) {
      console.log('Error checking table existence:', e);
      // Continue anyway as the table might already exist
    }

    console.log('Saving to generated_images table...');
    // Save to generated_images table with all the new parameters
    const { error: dbError } = await supabaseClient
      .from('generated_images')
      .insert({
        user_id: user.id,
        prompt: prompt,
        style: style,
        aspect_ratio: aspectRatio,
        image_path: fileName,
        detail_level: detailLevel,
        lighting: lighting,
        seed: seed || null,
        title: null, // Add the new fields with default values
        is_favorite: false
      });

    if (dbError) {
      console.error('Database insert error:', dbError);
      // Don't throw here, we still want to return the image URL
      console.log('Continuing despite database error');
    }

    console.log('Returning success response with image URL');
    return new Response(
      JSON.stringify({ 
        imageUrl: publicUrlData.publicUrl,
        fileName: fileName
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );
  } catch (error) {
    console.error('Error in generate-image function:', error);
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
