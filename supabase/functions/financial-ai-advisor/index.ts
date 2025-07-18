import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY') || Deno.env.get('OPEN_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { message, type, context, userId } = await req.json();
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get user's financial profile
    const { data: financialProfile } = await supabase
      .from('financial_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Get user's goals, debts, and budget
    const [goalsRes, debtsRes, budgetRes] = await Promise.all([
      supabase.from('financial_goals').select('*').eq('user_id', userId),
      supabase.from('debts_subscriptions').select('*').eq('user_id', userId),
      supabase.from('budget_categories').select('*').eq('user_id', userId)
    ]);

    const systemPrompt = `You are FinanceAI, a helpful financial advisor for young professionals. 

User's Financial Profile:
- Credit Score: ${financialProfile?.credit_score || 'Not provided'}
- Monthly Income: ₹${financialProfile?.monthly_income || 'Not provided'}
- Monthly Expenses: ₹${financialProfile?.monthly_expenses || 'Not provided'}
- Savings: ₹${financialProfile?.savings_balance || 'Not provided'}
- Total Debt: ₹${financialProfile?.debt_amount || 'Not provided'}

Current Goals: ${goalsRes.data?.map(g => `${g.title} (₹${g.target_amount})`).join(', ') || 'None set'}
Active Debts/Subscriptions: ${debtsRes.data?.map(d => `${d.name} (₹${d.amount})`).join(', ') || 'None'}
Budget Categories: ${budgetRes.data?.map(b => `${b.name}: ₹${b.allocated_amount}`).join(', ') || 'None set'}

Provide practical, actionable financial advice. Be encouraging but realistic. Always consider their credit score and financial situation when giving advice. Use rupees (₹) for all amounts.`;

    let userPrompt = message;
    
    if (type === 'purchase_advice' && context?.itemPrice) {
      userPrompt = `I want to buy ${context.itemName} for ₹${context.itemPrice}. Can I afford this? Should I buy it now or wait? Consider my credit score, monthly budget, and financial goals.`;
    } else if (type === 'budget_help') {
      userPrompt = `Help me create a monthly budget plan based on my income of ₹${financialProfile?.monthly_income}. Suggest allocations for different categories.`;
    } else if (type === 'credit_improvement') {
      userPrompt = `My credit score is ${financialProfile?.credit_score}. Explain what this means and give me a specific plan to improve it.`;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response from OpenAI API');
    }
    
    const aiResponse = data.choices[0].message.content;

    // Save conversation to database
    await supabase.from('ai_conversations').insert({
      user_id: userId,
      conversation_type: type || 'chat',
      user_message: message,
      ai_response: aiResponse,
      context_data: context || null
    });

    // If it's purchase advice, save the decision
    if (type === 'purchase_advice' && context?.itemPrice) {
      const recommendation = aiResponse.toLowerCase().includes('yes') || aiResponse.toLowerCase().includes('afford') ? 'approve' : 
                           aiResponse.toLowerCase().includes('wait') ? 'wait' : 'reject';
      
      await supabase.from('purchase_decisions').insert({
        user_id: userId,
        item_name: context.itemName,
        item_price: context.itemPrice,
        ai_recommendation: recommendation,
        reasoning: aiResponse
      });
    }

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in financial-ai-advisor:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});