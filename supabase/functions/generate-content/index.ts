import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { description, platform, tone, language, aiModel } = await req.json();

    // Construct the system prompt based on platform and tone
    const systemPrompt = `You are an AI content writer specializing in creating ${tone} content for ${platform}. 
    Follow these platform-specific guidelines:
    ${platform === 'twitter' ? '- Keep the content within 280 characters\n' : ''}
    ${platform === 'linkedin' ? '- Include professional hashtags and a call-to-action\n' : ''}
    ${platform === 'facebook' ? '- Create engaging, shareable content with optional emojis\n' : ''}
    - Maintain a ${tone} tone throughout the content
    - Write in ${language}`;

    console.log('Generating content with parameters:', {
      description,
      platform,
      tone,
      language,
      aiModel
    });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: aiModel === 'chatgpt' ? 'gpt-4o-mini' : 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: description }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const generatedText = data.choices[0].message.content;

    // Store the generated content in the database
    const { data: contentData, error: contentError } = await supabase
      .from('generated_content')
      .insert({
        description,
        platform: [platform],
        tone,
        language,
        ai_model: aiModel,
        generated_text: generatedText,
        version: 1,
      })
      .select()
      .single();

    if (contentError) {
      throw new Error(`Error storing content: ${contentError.message}`);
    }

    // Log the activity
    await supabase
      .from('recent_activity')
      .insert({
        activity_type: 'content_generation',
        details: {
          content_id: contentData.id,
          platform,
          tone,
          language,
        },
      });

    return new Response(
      JSON.stringify({ 
        success: true, 
        content: generatedText,
        contentId: contentData.id 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in generate-content function:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});