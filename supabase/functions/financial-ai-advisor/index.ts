import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const openAIApiKey = Deno.env.get("OPENAI_API_KEY") || Deno.env.get("OPEN_API_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

// Defensive: check env vars
if (!openAIApiKey) {
  console.warn("OPENAI_API_KEY is not set in Edge Function environment");
}
if (!supabaseUrl) {
  throw new Error("SUPABASE_URL is not set in Edge Function environment");
}
if (!supabaseServiceKey) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set in Edge Function environment");
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error("OpenAI API key not configured");
    }

    const { message, type, context, userId, history } = await req.json();
    
    if (!userId) {
      return new Response(
        JSON.stringify({
          error: "User ID is required",
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user's financial profile (optional for new users)
    const { data: financialProfile } = await supabase
      .from("financial_profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    // Get user's goals, debts, and budget (all optional for new users)
    const [goalsRes, debtsRes, budgetRes] = await Promise.all([
      supabase.from("financial_goals").select("*").eq("user_id", userId),
      supabase.from("debts_subscriptions").select("*").eq("user_id", userId),
      supabase.from("budget_categories").select("*").eq("user_id", userId),
    ]);

    // Build system prompt based on available data
    let systemPrompt = `You are FinanceAI, a helpful financial advisor for young professionals. `;

    if (financialProfile) {
      systemPrompt += `
User's Financial Profile:
- Credit Score: ${financialProfile.credit_score || "Not provided"}
- Monthly Income: ₹${financialProfile.monthly_income || "Not provided"}
- Monthly Expenses: ₹${financialProfile.monthly_expenses || "Not provided"}
- Savings: ₹${financialProfile.savings_balance || "Not provided"}
- Total Debt: ₹${financialProfile.debt_amount || "Not provided"}`;
    } else {
      systemPrompt += `
Note: This user is new and hasn't completed their financial profile yet. Provide general financial advice and encourage them to complete their profile setup.`;
    }

    // Add available data to context
    if (goalsRes.data && goalsRes.data.length > 0) {
      systemPrompt += `
Current Goals: ${goalsRes.data.map((g) => `${g.title} (₹${g.target_amount})`).join(", ")}`;
    }

    if (debtsRes.data && debtsRes.data.length > 0) {
      systemPrompt += `
Active Debts/Subscriptions: ${debtsRes.data.map((d) => `${d.name} (₹${d.amount})`).join(", ")}`;
    }

    if (budgetRes.data && budgetRes.data.length > 0) {
      systemPrompt += `
Budget Categories: ${budgetRes.data.map((b) => `${b.name}: ₹${b.allocated_amount}`).join(", ")}`;
    }

    systemPrompt += `

Provide practical, actionable financial advice. Be encouraging but realistic. If the user hasn't completed their profile, guide them to do so. Use rupees (₹) for all amounts.`;

    let userPrompt = message;

    if (type === "explain") {
      userPrompt = `Explain the following advice in simple, beginner-friendly terms. Keep it concise but clear. Advice: \n${message}`;
    } else if (type === "purchase_advice" && context?.itemPrice) {
      if (financialProfile) {
        userPrompt = `I want to buy ${context.itemName} for ₹${context.itemPrice}. Can I afford this? Should I buy it now or wait? Consider my credit score, monthly budget, and financial goals.`;
      } else {
        userPrompt = `I want to buy ${context.itemName} for ₹${context.itemPrice}. Can I afford this? Should I buy it now or wait? (Note: I haven't completed my financial profile yet, so provide general advice and encourage me to complete my profile for personalized recommendations.)`;
      }
    } else if (type === "budget_help") {
      if (financialProfile?.monthly_income) {
        userPrompt = `Help me create a monthly budget plan based on my income of ₹${financialProfile.monthly_income}. Suggest allocations for different categories.`;
      } else {
        userPrompt = `Help me create a monthly budget plan. I haven't set up my financial profile yet, so provide general budgeting advice and encourage me to complete my profile for personalized recommendations.`;
      }
    } else if (type === "credit_improvement") {
      if (financialProfile?.credit_score) {
        userPrompt = `My credit score is ${financialProfile.credit_score}. Explain what this means and give me a specific plan to improve it.`;
      } else {
        userPrompt = `I want to improve my credit score. Explain what credit scores mean and give me general tips for improvement. Encourage me to complete my financial profile for personalized advice.`;
      }
    } else if (type === "subscription_opt") {
      if (debtsRes.data && debtsRes.data.length > 0) {
        userPrompt = `Review my subscriptions and recommend which ones I should cancel or downgrade to save money.`;
      } else {
        userPrompt = `I want to optimize my subscriptions. Since I haven't added any yet, provide general advice on subscription management and encourage me to add my subscriptions to get personalized recommendations.`;
      }
    } else if (type === "utility_opt") {
      userPrompt = `Analyze my recent electricity and gas bills and provide practical, personalized energy-saving actions I can take to lower my monthly utility costs. Keep suggestions realistic for an average apartment.`;
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openAIApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          ...(Array.isArray(history) ? history.slice(-6) : []),
          { role: "user", content: userPrompt },
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
    await supabase.from("ai_conversations").insert({
      user_id: userId,
      conversation_type: type || "chat",
      user_message: message,
      ai_response: aiResponse,
      context_data: context || null,
    });

    // If it's purchase advice, save the decision
    if (type === "purchase_advice" && context?.itemPrice) {
      const recommendation =
        aiResponse.toLowerCase().includes("yes") ||
        aiResponse.toLowerCase().includes("afford")
          ? "approve"
          : aiResponse.toLowerCase().includes("wait")
          ? "wait"
          : "reject";

      await supabase.from("purchase_decisions").insert({
        user_id: userId,
        item_name: context.itemName,
        item_price: context.itemPrice,
        ai_recommendation: recommendation,
        reasoning: aiResponse,
      });
    }

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    let message = "Unknown error";
    if (typeof error === "string") message = error;
    else if (error instanceof Error) message = error.message;
    else if (error && typeof error === "object" && "message" in error)
      message = (error as any).message;
    console.error("Error in financial-ai-advisor:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
