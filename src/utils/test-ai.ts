import { supabase } from "@/integrations/supabase/client";

export const testAIAdvisor = async (userId: string) => {
  try {
    console.log('[TEST] Testing AI Advisor with userId:', userId);
    
    const { data, error } = await supabase.functions.invoke('financial-ai-advisor', {
      body: {
        message: 'Give me a quick financial tip',
        type: 'test',
        userId: userId
      }
    });
    
    console.log('[TEST] AI Response:', data);
    console.log('[TEST] Error (if any):', error);
    
    return { data, error };
  } catch (err) {
    console.error('[TEST] Fetch error:', err);
    return { data: null, error: err };
  }
};