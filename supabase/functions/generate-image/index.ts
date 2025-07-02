
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = process.env.OPENAI_API_KEY || Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const authHeader = req.headers.get('Authorization')!;
    const supabaseClient = createClient(
      process.env.SUPABASE_URL || Deno.env.get('SUPABASE_URL') ?? '',
      process.env.SUPABASE_ANON_KEY || Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { data } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''));
    const user = data.user;
    if (!user) throw new Error('User not authenticated');

    const { prompt, size = "1024x1024", quality = "standard" } = await req.json();

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt: prompt,
        n: 1,
        size: size,
        quality: quality,
      }),
    });

    const data_response = await response.json();
    
    if (!response.ok) {
      throw new Error(data_response.error?.message || 'Failed to generate image');
    }

    const imageUrl = data_response.data[0].url;

    const supabaseService = createClient(
      process.env.SUPABASE_URL || Deno.env.get('SUPABASE_URL') ?? '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    await supabaseService.from('ai_generations').insert({
      user_id: user.id,
      type: 'image',
      prompt: prompt,
      image_url: imageUrl,
      tokens_used: 1
    });

    return new Response(JSON.stringify({ imageUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-image function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
