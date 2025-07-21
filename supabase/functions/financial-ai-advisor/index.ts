import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const openAIApiKey = Deno.env.get("OPENAI_API_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

// Defensive: check env vars
if (!openAIApiKey)
  throw new Error("OPENAI_API_KEY is not set in Edge Function environment");
if (!supabaseUrl)
  throw new Error("SUPABASE_URL is not set in Edge Function environment");
if (!supabaseServiceKey)
  throw new Error(
    "SUPABASE_SERVICE_ROLE_KEY is not set in Edge Function environment"
  );

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
    const { message, type, context, userId, history } = await req.json();

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user's financial profile
    const { data: financialProfile } = await supabase
      .from("financial_profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    // Get user's goals, debts, and budget
    const [goalsRes, debtsRes, budgetRes] = await Promise.all([
      supabase.from("financial_goals").select("*").eq("user_id", userId),
      supabase.from("debts_subscriptions").select("*").eq("user_id", userId),
      supabase.from("budget_categories").select("*").eq("user_id", userId),
    ]);

    // Check if user has basic setup
    const hasFinancialProfile = !!financialProfile;
    const hasGoals = goalsRes.data && goalsRes.data.length > 0;
    const hasDebts = debtsRes.data && debtsRes.data.length > 0;
    const hasBudget = budgetRes.data && budgetRes.data.length > 0;

    // If user doesn't have financial profile, provide setup guidance
    if (!hasFinancialProfile) {
      const setupResponse = `Welcome to FinanceAI! 🎉 

To get personalized financial advice, please complete your financial profile first:

1. **Go to your Dashboard**
2. **Click on "Financial Setup"** 
3. **Enter your basic financial information** (credit score, income, expenses, etc.)

Once you've set up your profile, I'll be able to provide you with personalized financial advice and recommendations!

For now, here's a general financial tip: Start by tracking your monthly income and expenses to understand your spending patterns. This is the foundation of good financial planning.`;

      return new Response(JSON.stringify({ response: setupResponse }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build system prompt with available data
    let systemPrompt = `You are FinanceAI, a helpful financial advisor for young professionals. 

User's Financial Profile:
- Credit Score: ${financialProfile?.credit_score || "Not provided"}
- Monthly Income: ₹${financialProfile?.monthly_income || "Not provided"}
- Monthly Expenses: ₹${financialProfile?.monthly_expenses || "Not provided"}
- Savings: ₹${financialProfile?.savings_balance || "Not provided"}
- Total Debt: ₹${financialProfile?.debt_amount || "Not provided"}`;

    // Add optional sections based on available data
    if (hasGoals) {
      systemPrompt += `\nCurrent Goals: ${
        goalsRes.data
          ?.map((g) => `${g.title} (₹${g.target_amount})`)
          .join(", ") || "None set"
      }`;
    }

    if (hasDebts) {
      systemPrompt += `\nActive Debts/Subscriptions: ${
        debtsRes.data?.map((d) => `${d.name} (₹${d.amount})`).join(", ") ||
        "None"
      }`;
    }

    if (hasBudget) {
      systemPrompt += `\nBudget Categories: ${
        budgetRes.data
          ?.map((b) => `${b.name}: ₹${b.allocated_amount}`)
          .join(", ") || "None set"
      }`;
    }

    // Add setup recommendations if data is missing
    if (!hasGoals || !hasDebts || !hasBudget) {
      systemPrompt += `\n\nNote: The user is still setting up their financial profile. Some data may be missing. Provide helpful guidance and encourage them to complete their setup for more personalized advice.`;
    }

    systemPrompt += `\n\nProvide practical, actionable financial advice. Be encouraging but realistic. Always consider their credit score and financial situation when giving advice. Use rupees (₹) for all amounts.`;

    let userPrompt = message;

    if (type === "explain") {
      userPrompt = `Explain the following advice in simple, beginner-friendly terms. Keep it concise but clear. Advice: \n${message}`;
    } else if (type === "purchase_advice" && context?.itemPrice) {
      userPrompt = `I want to buy ${context.itemName} for ₹${context.itemPrice}. Can I afford this? Should I buy it now or wait? Consider my credit score, monthly budget, and financial goals.`;
    } else if (type === "budget_help") {
      userPrompt = `Help me create a monthly budget plan based on my income of ₹${financialProfile?.monthly_income}. Suggest allocations for different categories.`;
    } else if (type === "credit_improvement") {
      userPrompt = `My credit score is ${financialProfile?.credit_score}. Explain what this means and give me a specific plan to improve it.`;
    } else if (type === "subscription_opt") {
      userPrompt = `Review my subscriptions and recommend which ones I should cancel or downgrade to save money.`;
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
    if (!data.choices || !data.choices[0]?.message?.content) {
      throw new Error("OpenAI API did not return a valid response.");
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
