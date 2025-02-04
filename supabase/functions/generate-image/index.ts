import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, style, aspectRatio } = await req.json();

    // Get user information from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Enhance the prompt based on the selected style
    let enhancedPrompt = prompt;
    switch (style) {
      case 'realistic':
        enhancedPrompt += ', photorealistic, highly detailed';
        break;
      case 'artistic':
        enhancedPrompt += ', artistic style, creative interpretation';
        break;
      case 'cartoon':
        enhancedPrompt += ', cartoon style, vibrant colors';
        break;
      case '3d':
        enhancedPrompt += ', 3D rendered, cinema 4d style';
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
      case '4:3':
        size = '1024x768';
        break;
    }

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: enhancedPrompt,
        n: 1,
        size: size,
        quality: "standard",
      }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    // Store the generated image in Supabase
    const imageUrl = data.data[0].url;
    const imageResponse = await fetch(imageUrl);
    const imageBlob = await imageResponse.blob();

    // Get the supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // Upload to Storage
    const timestamp = new Date().getTime();
    const fileName = `${timestamp}-${Math.random().toString(36).substring(7)}.png`;
    const { data: uploadData, error: uploadError } = await supabaseClient
      .storage
      .from('ai_generated_images')
      .upload(fileName, imageBlob, {
        contentType: 'image/png',
        cacheControl: '3600',
      });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    // Get the public URL
    const { data: publicUrlData } = supabaseClient
      .storage
      .from('ai_generated_images')
      .getPublicUrl(fileName);

    // Save to generated_images table
    const { error: dbError } = await supabaseClient
      .from('generated_images')
      .insert({
        prompt: prompt,
        style: style,
        aspect_ratio: aspectRatio,
        image_path: fileName,
      });

    if (dbError) {
      throw new Error(dbError.message);
    }

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
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
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