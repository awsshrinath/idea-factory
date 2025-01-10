import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    const { description, platform, tone, language, aiModel } = await req.json();
    console.log('Received request:', { description, platform, tone, language, aiModel });

    // Construct the system prompt
    const systemPrompt = `You are an AI content writer specializing in creating ${tone} content for ${platform}. 
    Follow these platform-specific guidelines:
    ${platform === 'twitter' ? '- Keep the content within 280 characters\n' : ''}
    ${platform === 'linkedin' ? '- Include professional hashtags and a call-to-action\n' : ''}
    ${platform === 'facebook' ? '- Create engaging, shareable content with optional emojis\n' : ''}
    - Maintain a ${tone} tone throughout the content
    - Write in ${language}`;

    console.log('Making request to OpenAI API...');
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`);
    }

    const data = await openAIResponse.json();
    console.log('OpenAI response received:', data);

    const generatedText = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ 
        success: true, 
        content: generatedText 
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error in generate-content function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});