import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { User, Session } from "@supabase/supabase-js";
import {
  Bot,
  TrendingUp,
  Target,
  CreditCard,
  PiggyBank,
  ShoppingCart,
  LogOut,
  Settings,
  Plus,
  MessageCircle,
  BarChart3,
  Calendar,
  AlertCircle,
  CalendarCheck,
  ArrowRightCircle,
  BookOpen,
  Star,
  Shield,
  Lightbulb,
} from "lucide-react";
import { format } from "date-fns";
import confetti from "canvas-confetti";
import { ThemeToggle } from "@/components/ThemeToggle";
import AIChat from "@/components/AIChat";
import FinancialSetup from "@/components/FinancialSetup";
import PurchaseAdvisor from "@/components/PurchaseAdvisor";
import BudgetPlanner from "@/components/BudgetPlanner";
import DebtManager from "@/components/DebtManager";
import GoalTracker from "@/components/GoalTracker";
import WhatIfSimulator from "../components/WhatIfSimulator";
import { formatAIContent } from "../components/ai-format";
import { sendPushNotification } from "../main";
import PersonalizedInsights from "@/components/PersonalizedInsights";
import Gamification from "@/components/Gamification";
import VoiceInput from "@/components/VoiceInput";
import WhatIfTools from "@/components/WhatIfTools";
import ExplainableAI from "@/components/ExplainableAI";
import { ChartContainer } from "../components/ui/chart";
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";

// AI Response formatting function (same as AIChat component)
const formatAIResponse = (content: string) => {
  return (
    content
      // Add emojis to common financial terms
      .replace(/budget/gi, "💰 budget")
      .replace(/credit score/gi, "📊 credit score")
      .replace(/savings/gi, "🏦 savings")
      .replace(/debt/gi, "💳 debt")
      .replace(/investment/gi, "📈 investment")
      .replace(/emergency fund/gi, "🚨 emergency fund")
      .replace(/goal/gi, "🎯 goal")
      // Format headings with better typography
      .replace(
        /^### (.+)$/gm,
        '<h3 class="text-lg font-semibold text-primary mb-2 mt-4">💡 $1</h3>'
      )
      .replace(
        /^## (.+)$/gm,
        '<h2 class="text-xl font-bold text-primary mb-3 mt-4">✨ $1</h2>'
      )
      .replace(
        /^# (.+)$/gm,
        '<h1 class="text-2xl font-bold text-primary mb-4 mt-4">🌟 $1</h1>'
      )
      // Format bold text
      .replace(
        /\*\*(.+?)\*\*/g,
        '<strong class="font-semibold text-primary">$1</strong>'
      )
      // Format bullet points with emojis
      .replace(/^- (.+)$/gm, "• $1")
      .replace(/^• /gm, "✅ ")
      // Add line breaks for better readability
      .replace(/\n/g, "<br/>")
  );
};

// Define types for financial profile, budget category, goal, bill, trend, and debt
interface FinancialProfile {
  user_id: string;
  credit_score: number;
  monthly_income: number;
  monthly_expenses: number;
  savings_balance: number;
  debt_amount: number;
  created_at: string;
  updated_at: string;
}

interface BudgetCategory {
  id: string;
  name: string;
  spent_amount: number;
  allocated_amount: number;
}

interface Goal {
  id: string;
  user_id: string;
  category: string;
  current_amount: number;
  target_amount: number;
  status: string;
  created_at: string;
}

interface Bill {
  id: string;
  name: string;
  due_date: string;
  amount: number;
}

interface Debt {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  due_date: string;
  status: string;
}

interface TrendData {
  month: string;
  networth: number;
  spending: number;
  income: number;
}

// Use environment variable for API key
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY || ""; // Set this in .env.local, never commit your key

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [financialProfile, setFinancialProfile] =
    useState<FinancialProfile | null>(null);
  // Insights state
  const [overspentCategories, setOverspentCategories] = useState<
    BudgetCategory[]
  >([]);
  const [emergencyGoal, setEmergencyGoal] = useState<Goal | null>(null);
  const [upcomingBills, setUpcomingBills] = useState<Bill[]>([]);
  const [creditAlert, setCreditAlert] = useState<string | null>(null);
  const [nextSteps, setNextSteps] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [achievements, setAchievements] = useState<string[]>([]);
  const [streak, setStreak] = useState<number>(0);
  const lastCheckinRef = useRef<string | null>(null);
  const subscriptionRefs = useRef<RealtimeChannel[]>([]);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const overspendNotified = useRef(false);
  const billNotified = useRef(false);
  const creditNotified = useRef(false);
  const achievementNotified = useRef<string[]>([]);
  const [aiError, setAiError] = useState(false);
  const [aiRetryCount, setAiRetryCount] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadFinancialProfile(session.user.id);
        loadInsights(session.user.id);
      }
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (achievements.includes("Goal Achiever")) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.7 },
      });
    }
  }, [achievements]);

  useEffect(() => {
    if (!user) return;
    // Subscribe to real-time changes for gamification triggers
    const tables = [
      { name: "financial_goals", filter: `user_id=eq.${user.id}` },
      { name: "debts_subscriptions", filter: `user_id=eq.${user.id}` },
      { name: "financial_profiles", filter: `user_id=eq.${user.id}` },
    ];
    tables.forEach(({ name, filter }) => {
      const channel = supabase
        .channel(`${name}_realtime_${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: name,
            filter,
          },
          () => {
            loadGamification(user.id);
          }
        )
        .subscribe();
      subscriptionRefs.current.push(channel as RealtimeChannel);
    });
    return () => {
      subscriptionRefs.current.forEach((channel) => {
        supabase.removeChannel(channel);
      });
      subscriptionRefs.current = [];
    };
  }, [user]);

  useEffect(() => {
    if (!user) return;
    // Fetch 6 months of data for trends
    const fetchTrends = async () => {
      const months = Array.from({ length: 6 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - (5 - i));
        return d.toISOString().slice(0, 7); // YYYY-MM
      });
      const trendArr: TrendData[] = [];
      for (const month of months) {
        // Budget (spending)
        const { data: budgetData } = await supabase
          .from("budget_categories")
          .select("spent_amount")
          .eq("user_id", user.id)
          .eq("month_year", month);
        const spending = (budgetData || []).reduce(
          (sum, b) => sum + (b.spent_amount || 0),
          0
        );
        // Income & savings
        const { data: profileData } = await supabase
          .from("financial_profiles")
          .select("monthly_income,savings_balance")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1);
        const income = profileData?.[0]?.monthly_income || 0;
        const savings = profileData?.[0]?.savings_balance || 0;
        // Debts
        const { data: debtsData } = await supabase
          .from("debts_subscriptions")
          .select("amount")
          .eq("user_id", user.id)
          .eq("status", "active");
        const debts = (debtsData || []).reduce(
          (sum, d) => sum + (d.amount || 0),
          0
        );
        // Net worth = savings - debts
        trendArr.push({
          month,
          networth: savings - debts,
          spending,
          income,
        });
      }
      setTrendData(trendArr);
    };
    fetchTrends();
  }, [user]);

  const loadFinancialProfile = async (userId: string) => {
    // Fetch from Supabase
    const { data, error } = await supabase
      .from("financial_profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error || !data) {
      setFinancialProfile(null); // Show FinancialSetup
    } else {
      setFinancialProfile(data);
    }
  };

  // Load insights (budget overspending & emergency fund progress)
  const loadInsights = async (uid: string) => {
    console.log("[AI DEBUG] loadInsights called with uid:", uid);
    try {
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
      // Budget categories for current month
      const { data: budgetData } = await supabase
        .from("budget_categories")
        .select("*")
        .eq("user_id", uid)
        .eq("month_year", currentMonth);
      console.log("[AI DEBUG] budgetData:", budgetData);
      if (budgetData) {
        const overspent = (budgetData as BudgetCategory[]).filter(
          (cat) => (cat.spent_amount || 0) > (cat.allocated_amount || 0)
        );
        setOverspentCategories(overspent);
        if (overspent.length > 0 && !overspendNotified.current) {
          sendPushNotification("Overspending Alert!", {
            body: `You’ve overspent on ${overspent[0].name}. Check your dashboard for details.`,
          });
          overspendNotified.current = true;
        }
      }
      // Emergency fund goal (take the most recent active one)
      const { data: goalsData } = await supabase
        .from("financial_goals")
        .select("*")
        .eq("user_id", uid)
        .eq("category", "emergency")
        .order("created_at", { ascending: false })
        .limit(1);
      console.log("[AI DEBUG] goalsData:", goalsData);
      setEmergencyGoal(
        goalsData && goalsData.length > 0 ? (goalsData[0] as Goal) : null
      );
      // Upcoming bills within next 7 days
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);
      const { data: billsData } = await supabase
        .from("debts_subscriptions")
        .select("*")
        .eq("user_id", uid)
        .neq("due_date", null);
      console.log("[AI DEBUG] billsData:", billsData);
      if (billsData) {
        const upcoming = (billsData as Bill[]).filter((b) => {
          const due = new Date(b.due_date);
          return due >= today && due <= nextWeek;
        });
        setUpcomingBills(upcoming);
        if (upcoming.length > 0 && !billNotified.current) {
          sendPushNotification("Bill Reminder", {
            body: `${upcoming[0].name} is due soon. Don’t miss your payment!`,
          });
          billNotified.current = true;
        }
      }
      // Credit utilization alert using expenses vs income (proxy)
      const { data: profileData } = await supabase
        .from("financial_profiles")
        .select("*")
        .eq("user_id", uid)
        .single();
      console.log("[AI DEBUG] profileData:", profileData);
      if (profileData) {
        const ratio =
          (profileData.monthly_expenses || 0) /
          (profileData.monthly_income || 1);
        if (ratio > 0.9 && !creditNotified.current) {
          setCreditAlert(
            `Your expenses are ${Math.round(
              ratio * 100
            )}% of your income this month, which can impact your credit.`
          );
          sendPushNotification("Credit Utilization Alert", {
            body: `Your expenses are high compared to your income. Check your dashboard for details.`,
          });
          creditNotified.current = true;
        }
      }
      // Weekly AI next steps (generate once per day)
      setAiError(false);
      setNextSteps(null);
      try {
        console.log(
          "[AI DEBUG] Calling Supabase Edge Function financial-ai-advisor..."
        );
        const { data: aiData, error: supabaseError } =
          await supabase.functions.invoke("financial-ai-advisor", {
            body: {
              message:
                "Give me 3 actionable next steps for my finances for this week",
              type: "next_steps",
              userId: uid,
            },
          });
        console.log("[AI DEBUG] Supabase response:", aiData, supabaseError);
        if (supabaseError || aiData?.error) {
          setAiError(true);
          setNextSteps(
            aiData?.error ||
              supabaseError?.message ||
              "AI plan error from Supabase. Check logs."
          );
          console.error(
            "[AI DEBUG] Supabase AI error:",
            aiData?.error || supabaseError
          );
        } else if (aiData?.response) {
          setNextSteps(aiData.response);
          setAiError(false);
          console.log("[AI DEBUG] Supabase AI plan:", aiData.response);
        } else {
          // Fallback to OpenAI directly
          console.log(
            "[AI DEBUG] Supabase returned no response, falling back to OpenAI. Key present:",
            !!API_KEY
          );
          if (API_KEY === "") {
            setAiError(true);
            setNextSteps(
              "OpenAI API key is missing. Please set it in .env.local."
            );
            console.error("[AI DEBUG] OpenAI key missing");
          } else {
            const openaiRes = await fetch(
              "https://api.openai.com/v1/chat/completions",
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${API_KEY}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  model: "gpt-4o-mini",
                  messages: [
                    {
                      role: "system",
                      content:
                        "You are FinanceAI, a helpful financial advisor for young professionals. Give 3 actionable next steps for the user's finances for this week. Be concise and practical.",
                    },
                    {
                      role: "user",
                      content:
                        "Give me 3 actionable next steps for my finances for this week",
                    },
                  ],
                  temperature: 0.7,
                  max_tokens: 500,
                }),
              }
            );
            const openaiData = await openaiRes.json();
            console.log("[AI DEBUG] OpenAI response:", openaiData);
            if (openaiData.error) {
              setAiError(true);
              setNextSteps(
                openaiData.error.message || "OpenAI API error. Check logs."
              );
              console.error("[AI DEBUG] OpenAI API error:", openaiData.error);
            } else if (
              openaiData.choices &&
              openaiData.choices[0]?.message?.content
            ) {
              setNextSteps(openaiData.choices[0].message.content);
              setAiError(false);
              console.log(
                "[AI DEBUG] OpenAI AI plan:",
                openaiData.choices[0].message.content
              );
            } else {
              setAiError(true);
              setNextSteps("AI plan could not be generated. Please try again.");
              console.error(
                "[AI DEBUG] OpenAI did not return a valid response:",
                openaiData
              );
            }
          }
        }
      } catch (e) {
        // Fallback to OpenAI directly if Supabase call throws
        console.error("[AI DEBUG] Supabase fetch threw error:", e);
        if (API_KEY === "") {
          setAiError(true);
          setNextSteps(
            "OpenAI API key is missing. Please set it in .env.local."
          );
          console.error("[AI DEBUG] OpenAI key missing (catch)");
        } else {
          try {
            const openaiRes = await fetch(
              "https://api.openai.com/v1/chat/completions",
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${API_KEY}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  model: "gpt-4o-mini",
                  messages: [
                    {
                      role: "system",
                      content:
                        "You are FinanceAI, a helpful financial advisor for young professionals. Give 3 actionable next steps for the user's finances for this week. Be concise and practical.",
                    },
                    {
                      role: "user",
                      content:
                        "Give me 3 actionable next steps for my finances for this week",
                    },
                  ],
                  temperature: 0.7,
                  max_tokens: 500,
                }),
              }
            );
            const openaiData = await openaiRes.json();
            console.log("[AI DEBUG] OpenAI response (catch):", openaiData);
            if (openaiData.error) {
              setAiError(true);
              setNextSteps(
                openaiData.error.message || "OpenAI API error. Check logs."
              );
              console.error(
                "[AI DEBUG] OpenAI API error (catch):",
                openaiData.error
              );
            } else if (
              openaiData.choices &&
              openaiData.choices[0]?.message?.content
            ) {
              setNextSteps(openaiData.choices[0].message.content);
              setAiError(false);
              console.log(
                "[AI DEBUG] OpenAI AI plan (catch):",
                openaiData.choices[0].message.content
              );
            } else {
              setAiError(true);
              setNextSteps("AI plan could not be generated. Please try again.");
              console.error(
                "[AI DEBUG] OpenAI did not return a valid response (catch):",
                openaiData
              );
            }
          } catch (err) {
            setAiError(true);
            setNextSteps("AI plan could not be generated. Please try again.");
            console.error("[AI DEBUG] OpenAI fetch error (catch):", err);
          }
        }
      }
    } catch (err) {
      setAiError(true);
      setNextSteps("Unexpected error loading AI plan. Please try again.");
      console.error("[AI DEBUG] Error loading insights:", err);
    }
  };

  // Retry handler
  const retryLoadInsights = () => {
    if (user) loadInsights(user.id);
  };

  // Load achievements and streaks
  const loadGamification = async (uid: string) => {
    // Achievements
    const { data: goals } = await supabase
      .from("financial_goals")
      .select("*")
      .eq("user_id", uid);
    const { data: debts } = await supabase
      .from("debts_subscriptions")
      .select("*")
      .eq("user_id", uid);
    const { data: profile } = await supabase
      .from("financial_profiles")
      .select("*")
      .eq("user_id", uid)
      .single();

    const newAchievements: string[] = [];
    // First ₹10,000 saved
    if (
      profile?.savings_balance >= 10000 &&
      !achievementNotified.current.includes("First ₹10,000 Saved")
    ) {
      newAchievements.push("First ₹10,000 Saved");
      sendPushNotification("Achievement Unlocked!", {
        body: "First ₹10,000 Saved! 🎉",
      });
      achievementNotified.current.push("First ₹10,000 Saved");
    }
    // 3 months of on-time payments
    const paidDebts = ((debts as Debt[]) || []).filter(
      (d) => d.status === "paid"
    );
    if (
      paidDebts.length >= 3 &&
      !achievementNotified.current.includes("3 Months of On-Time Payments")
    ) {
      newAchievements.push("3 Months of On-Time Payments");
      sendPushNotification("Achievement Unlocked!", {
        body: "3 Months of On-Time Payments! 🏆",
      });
      achievementNotified.current.push("3 Months of On-Time Payments");
    }
    // Goal completed
    if (
      ((goals as Goal[]) || []).some((g) => g.status === "completed") &&
      !achievementNotified.current.includes("Goal Achiever")
    ) {
      newAchievements.push("Goal Achiever");
      sendPushNotification("Achievement Unlocked!", {
        body: "Goal Achiever! 🎯",
      });
      achievementNotified.current.push("Goal Achiever");
    }
    setAchievements(newAchievements);

    // Streaks (daily check-in)
    const today = new Date().toISOString().slice(0, 10);
    const last = localStorage.getItem("lastCheckin");
    let streakCount = Number(localStorage.getItem("streak") || 0);
    if (last !== today) {
      if (
        last &&
        new Date(today).getTime() - new Date(last).getTime() <= 86400000 * 2
      ) {
        streakCount += 1;
        sendPushNotification("Streak Update!", {
          body: `🔥 ${streakCount}-day streak! Keep it up!`,
        });
      } else {
        streakCount = 1;
      }
      localStorage.setItem("lastCheckin", today);
      localStorage.setItem("streak", String(streakCount));
    }
    setStreak(streakCount);
    lastCheckinRef.current = today;
  };

  const cleanupAuthState = () => {
    // Remove all Supabase auth keys from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("supabase.auth.") || key.includes("sb-")) {
        localStorage.removeItem(key);
      }
    });
  };

  const handleSignOut = async () => {
    try {
      // Clean up auth state
      cleanupAuthState();
      // Attempt global sign out
      try {
        await supabase.auth.signOut({ scope: "global" });
      } catch (err) {
        // Continue even if this fails
      }
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
      // Force page reload for clean state
      window.location.href = "/";
    } catch (error) {
      const err = error as Error;
      toast({
        title: "Error signing out",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const getCreditScoreColor = (score: number) => {
    if (score >= 750) return "text-green-600";
    if (score >= 650) return "text-yellow-600";
    return "text-red-600";
  };

  const getCreditScoreLabel = (score: number) => {
    if (score >= 750) return "Excellent";
    if (score >= 650) return "Good";
    if (score >= 550) return "Fair";
    return "Poor";
  };

  const demoTrendData = [
    { month: "Jan", networth: 100000, spending: 20000, income: 30000 },
    { month: "Feb", networth: 120000, spending: 22000, income: 32000 },
    { month: "Mar", networth: 140000, spending: 21000, income: 31000 },
    { month: "Apr", networth: 160000, spending: 23000, income: 33000 },
    { month: "May", networth: 180000, spending: 25000, income: 35000 },
    { month: "Jun", networth: 200000, spending: 24000, income: 34000 },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!financialProfile) {
    return <FinancialSetup user={user} onComplete={loadFinancialProfile} />;
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "chat", label: "AI Chat", icon: MessageCircle },
    { id: "purchase", label: "Purchase Advisor", icon: ShoppingCart },
    { id: "budget", label: "Budget Planner", icon: PiggyBank },
    { id: "debts", label: "Debts & Subscriptions", icon: CreditCard },
    { id: "goals", label: "Financial Goals", icon: Target },
    { id: "whatif", label: "What-If Simulator", icon: AlertCircle }, // Add What-If tab
    { id: "learn", label: "Learn", icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Bot className="w-8 h-8 text-primary" />
            <h1 className="text-xl font-bold">FinanceAI Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user?.user_metadata?.full_name || user?.email}
            </span>
            {/* Dark mode toggle */}
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Navigation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {tabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <tab.icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* HEADER */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    Good Morning,{" "}
                    {user?.user_metadata?.full_name || user?.email}{" "}
                    <span aria-label="wave" role="img">
                      👋
                    </span>
                  </h2>
                  <p className="text-muted-foreground text-lg mt-1">
                    Your money, your progress, your future.
                  </p>
                </div>
                {/* Main Grid: Left (Trends/Progress), Right (Insights/Actions) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* LEFT COLUMN: Progress & Trends */}
                  <div className="space-y-6">
                    {/* Net Worth Trend */}
                    <Card>
                      <CardHeader className="pb-2 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" aria-hidden="true" />
                        <CardTitle className="text-sm font-medium">
                          Net Worth Trend
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ChartContainer
                          config={{
                            networth: { color: "#6366f1", label: "Net Worth" },
                          }}
                          className="w-full h-[300px]"
                        >
                          <LineChart
                            data={demoTrendData}
                            aria-label="Net Worth Trend Chart"
                          >
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line
                              type="monotone"
                              dataKey="networth"
                              stroke="#6366f1"
                              strokeWidth={2}
                              dot
                              isAnimationActive
                            />
                          </LineChart>
                        </ChartContainer>
                      </CardContent>
                    </Card>
                    {/* Spending Trend */}
                    <Card>
                      <CardHeader className="pb-2 flex items-center gap-2">
                        <PiggyBank className="w-5 h-5" aria-hidden="true" />
                        <CardTitle className="text-sm font-medium">
                          Spending Trend
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ChartContainer
                          config={{
                            spending: { color: "#ef4444", label: "Spending" },
                          }}
                          className="w-full h-[300px]"
                        >
                          <LineChart
                            data={demoTrendData}
                            aria-label="Spending Trend Chart"
                          >
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line
                              type="monotone"
                              dataKey="spending"
                              stroke="#ef4444"
                              strokeWidth={2}
                              dot
                              isAnimationActive
                            />
                          </LineChart>
                        </ChartContainer>
                      </CardContent>
                    </Card>
                    {/* Income Trend */}
                    <Card>
                      <CardHeader className="pb-2 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" aria-hidden="true" />
                        <CardTitle className="text-sm font-medium">
                          Income Trend
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ChartContainer
                          config={{
                            income: { color: "#22c55e", label: "Income" },
                          }}
                          className="w-full h-[300px]"
                        >
                          <LineChart
                            data={demoTrendData}
                            aria-label="Income Trend Chart"
                          >
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line
                              type="monotone"
                              dataKey="income"
                              stroke="#22c55e"
                              strokeWidth={2}
                              dot
                              isAnimationActive
                            />
                          </LineChart>
                        </ChartContainer>
                      </CardContent>
                    </Card>
                    {/* Achievements & Streaks */}
                    {(achievements.length > 0 || streak > 0) && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            🏆 Achievements & Streaks
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2">
                          <div className="flex flex-wrap gap-2 items-center">
                            {achievements.map((ach, i) => (
                              <Badge
                                key={i}
                                variant="secondary"
                                className="text-base px-3 py-2"
                              >
                                {ach}
                              </Badge>
                            ))}
                            {streak > 0 && (
                              <span className="text-green-700 font-semibold">
                                🔥 {streak}-day streak!
                              </span>
                            )}
                          </div>
                          {/* Progress bar for next badge (mock example) */}
                          <div className="mt-2">
                            <p className="text-xs text-muted-foreground mb-1">
                              Progress to next badge
                            </p>
                            <Progress
                              value={Math.min(
                                ((financialProfile.savings_balance || 0) /
                                  20000) *
                                  100,
                                100
                              )}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                  {/* RIGHT COLUMN: Insights & Actions */}
                  <div className="space-y-6">
                    {/* Personalized Insights */}
                    {(emergencyGoal ||
                      overspentCategories.length > 0 ||
                      upcomingBills.length > 0 ||
                      creditAlert) && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <AlertCircle
                              className="w-5 h-5 text-primary"
                              aria-hidden="true"
                            />{" "}
                            Personalized Insights
                          </CardTitle>
                          <CardDescription>
                            Tips and nudges based on your recent activity
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {emergencyGoal && (
                            <div>
                              <p className="text-sm font-medium mb-1">
                                Emergency Fund Progress
                              </p>
                              {(() => {
                                const saved = emergencyGoal.current_amount || 0;
                                const target = emergencyGoal.target_amount || 1;
                                const pct = Math.min(
                                  (saved / target) * 100,
                                  100
                                );
                                return (
                                  <>
                                    <Progress
                                      value={pct}
                                      className="mb-1 h-3"
                                    />
                                    <p className="text-sm">
                                      You’re {pct.toFixed(1)}% towards your
                                      emergency fund goal of ₹
                                      {target.toLocaleString()}.
                                    </p>
                                  </>
                                );
                              })()}
                            </div>
                          )}

                          {overspentCategories.length > 0 && (
                            <div>
                              <p className="text-sm font-medium mb-1">
                                Overspending Alerts
                              </p>
                              <ul className="list-disc ml-5 space-y-1 text-sm">
                                {overspentCategories.map((cat) => (
                                  <li key={cat.id}>
                                    You’ve overspent on{" "}
                                    <span className="font-semibold">
                                      {cat.name}
                                    </span>{" "}
                                    by ₹
                                    {(
                                      cat.spent_amount - cat.allocated_amount
                                    ).toLocaleString()}{" "}
                                    this month.
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {upcomingBills.length > 0 && (
                            <div>
                              <p className="text-sm font-medium mb-1">
                                Upcoming Bills (next 7 days)
                              </p>
                              <ul className="list-disc ml-5 space-y-1 text-sm">
                                {upcomingBills.map((bill: Bill) => (
                                  <li
                                    key={bill.id}
                                    className="flex items-center gap-1"
                                  >
                                    <CalendarCheck className="w-3 h-3" />{" "}
                                    {bill.name} due on{" "}
                                    {format(new Date(bill.due_date), "MMM d")}:
                                    ₹{bill.amount.toLocaleString()}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {creditAlert && (
                            <div className="text-sm text-yellow-700 bg-yellow-100 rounded p-2">
                              {creditAlert}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}
                    {/* AI Next Steps (Collapsible) */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          🤖 Your AI Plan for This Week
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <details open>
                          <summary className="cursor-pointer text-sm font-medium flex items-center gap-1">
                            Show AI Next Steps
                          </summary>
                          <div className="text-sm whitespace-pre-wrap mt-2">
                            {aiError ? (
                              <span className="text-red-600">
                                Could not load AI plan.{" "}
                                <button
                                  onClick={retryLoadInsights}
                                  className="underline text-primary"
                                >
                                  Retry
                                </button>
                              </span>
                            ) : nextSteps ? (
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: formatAIResponse(nextSteps),
                                }}
                              />
                            ) : (
                              <span className="text-muted-foreground">
                                Loading AI plan...
                              </span>
                            )}
                          </div>
                        </details>
                      </CardContent>
                    </Card>
                    {/* Credit Score Overview */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5" aria-hidden="true" />{" "}
                          Credit Score Overview
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col items-center mb-4">
                          <div
                            className={`text-4xl font-bold ${getCreditScoreColor(
                              financialProfile.credit_score
                            )}`}
                          >
                            {financialProfile.credit_score}
                          </div>
                          <Badge variant="secondary">
                            {getCreditScoreLabel(financialProfile.credit_score)}
                          </Badge>
                          <div className="text-xs text-muted-foreground mt-1">
                            Range: 300-850
                          </div>
                          {/* Small line chart for credit score trend (optional, mock) */}
                        </div>
                      </CardContent>
                    </Card>
                    {/* Monthly Snapshot */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Calendar className="w-5 h-5" aria-hidden="true" />{" "}
                          Monthly Snapshot
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <TrendingUp
                              className="w-4 h-4 text-green-600"
                              aria-hidden="true"
                            />
                            <span className="font-medium">Income:</span>
                            <span className="text-green-600">
                              ₹
                              {financialProfile.monthly_income?.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <PiggyBank
                              className="w-4 h-4 text-red-600"
                              aria-hidden="true"
                            />
                            <span className="font-medium">Expenses:</span>
                            <span className="text-red-600">
                              ₹
                              {financialProfile.monthly_expenses?.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CreditCard
                              className="w-4 h-4 text-blue-600"
                              aria-hidden="true"
                            />
                            <span className="font-medium">Savings:</span>
                            <span className="text-blue-600">
                              ₹
                              {financialProfile.savings_balance?.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    {/* Quick Actions (Sticky) */}
                    <div className="sticky top-4 z-10">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            ⚡ Quick Actions
                          </CardTitle>
                          <CardDescription>
                            Access your most-used tools
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Button
                              variant="outline"
                              className="h-20 flex-col gap-2"
                              onClick={() => setActiveTab("chat")}
                              aria-label="Ask AI"
                            >
                              <MessageCircle
                                className="w-6 h-6"
                                aria-hidden="true"
                              />
                              <span className="text-sm">Ask AI</span>
                            </Button>
                            <Button
                              variant="outline"
                              className="h-20 flex-col gap-2"
                              onClick={() => setActiveTab("purchase")}
                              aria-label="Purchase Advice"
                            >
                              <ShoppingCart
                                className="w-6 h-6"
                                aria-hidden="true"
                              />
                              <span className="text-sm">Purchase Advice</span>
                            </Button>
                            <Button
                              variant="outline"
                              className="h-20 flex-col gap-2"
                              onClick={() => setActiveTab("budget")}
                              aria-label="Budget Plan"
                            >
                              <PiggyBank
                                className="w-6 h-6"
                                aria-hidden="true"
                              />
                              <span className="text-sm">Budget Plan</span>
                            </Button>
                            <Button
                              variant="outline"
                              className="h-20 flex-col gap-2"
                              onClick={() => setActiveTab("goals")}
                              aria-label="Set Goals"
                            >
                              <Target className="w-6 h-6" aria-hidden="true" />
                              <span className="text-sm">Set Goals</span>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "whatif" && <WhatIfSimulator userId={user?.id} />}

            {activeTab === "learn" && (
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-primary/10 to-accent/10 shadow-xl border-0 animate-fade-in-up">
                  <CardHeader className="flex flex-col items-center text-center">
                    <Badge className="mb-2 bg-primary-light text-primary">
                      {" "}
                      <BookOpen className="w-4 h-4 mr-1" /> Learn & Grow{" "}
                    </Badge>
                    <CardTitle className="text-2xl font-bold">
                      Master Your Money
                    </CardTitle>
                    <CardDescription className="text-base mt-2">
                      Interactive lessons, quizzes, and videos to boost your
                      financial confidence.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="lessons" className="w-full">
                      <TabsList className="mb-4 flex justify-center">
                        <TabsTrigger value="lessons">
                          <Lightbulb className="w-4 h-4 mr-1" />
                          Lessons
                        </TabsTrigger>
                        <TabsTrigger value="quiz">
                          <Star className="w-4 h-4 mr-1" />
                          Quiz
                        </TabsTrigger>
                        <TabsTrigger value="videos">
                          <Calendar className="w-4 h-4 mr-1" />
                          Videos
                        </TabsTrigger>
                      </TabsList>

                      {/* Lessons Tab */}
                      <TabsContent value="lessons">
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="item-1">
                            <AccordionTrigger className="flex items-center gap-2 text-lg font-semibold">
                              <CreditCard className="w-5 h-5 text-primary" />{" "}
                              What is credit utilization?
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                              Credit utilization is the percentage of your
                              credit limit you’re using. Keeping it below 30%
                              helps your credit score.{" "}
                              <a
                                href="https://www.experian.com/blogs/ask-experian/credit-education/score-basics/credit-utilization-rate/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline text-primary"
                              >
                                Learn more at Experian
                              </a>
                              .
                            </AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="item-2">
                            <AccordionTrigger className="flex items-center gap-2 text-lg font-semibold">
                              <PiggyBank className="w-5 h-5 text-green-600" />{" "}
                              How to build an emergency fund
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                              Set aside 3-6 months of expenses in a separate
                              savings account. Start small and automate your
                              savings.{" "}
                              <a
                                href="https://www.consumerfinance.gov/about-us/blog/how-build-emergency-savings/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline text-primary"
                              >
                                Learn more at Consumer Finance
                              </a>
                              .
                            </AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="item-3">
                            <AccordionTrigger className="flex items-center gap-2 text-lg font-semibold">
                              <TrendingUp className="w-5 h-5 text-accent" />{" "}
                              Understanding compound interest
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                              Compound interest means you earn interest on your
                              interest. The earlier you start saving, the more
                              you benefit.{" "}
                              <a
                                href="https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline text-primary"
                              >
                                Try the Compound Interest Calculator
                              </a>
                              .
                            </AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="item-4">
                            <AccordionTrigger className="flex items-center gap-2 text-lg font-semibold">
                              <BookOpen className="w-5 h-5 text-blue-600" />{" "}
                              Budgeting 101: The 50/30/20 Rule
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                              Allocate 50% of income to needs, 30% to wants, and
                              20% to savings/debt.{" "}
                              <a
                                href="https://www.nerdwallet.com/article/finance/budget-50-30-20-rule"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline text-primary"
                              >
                                Learn more at NerdWallet
                              </a>
                              .
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </TabsContent>

                      {/* Quiz Tab */}
                      <TabsContent value="quiz">
                        <QuizInteractive />
                      </TabsContent>

                      {/* Videos Tab */}
                      <TabsContent value="videos">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Card className="overflow-hidden shadow-lg animate-fade-in-up">
                            <div className="aspect-w-16 aspect-h-9 bg-black">
                              <iframe
                                src="https://www.youtube.com/embed/HQzoZfc3GwQ"
                                title="How To Manage Your Money (50/30/20 Rule)"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full"
                              ></iframe>
                            </div>
                            <CardContent className="p-4 flex flex-col gap-2">
                              <div className="flex items-center gap-2 text-primary font-semibold text-lg">
                                <BookOpen className="w-5 h-5" /> 50/30/20 Rule
                                Explained
                              </div>
                              <div className="text-muted-foreground text-sm">
                                A simple guide to budgeting using the 50/30/20
                                rule for financial success.
                              </div>
                            </CardContent>
                          </Card>
                          <Card className="overflow-hidden shadow-lg animate-fade-in-up">
                            <div className="aspect-w-16 aspect-h-9 bg-black">
                              <iframe
                                src="https://www.youtube.com/embed/Izw-xaVkO0g"
                                title="10 Crucial Personal Finance Lessons That Transformed My Life"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full"
                              ></iframe>
                            </div>
                            <CardContent className="p-4 flex flex-col gap-2">
                              <div className="flex items-center gap-2 text-green-700 font-semibold text-lg">
                                <TrendingUp className="w-5 h-5" /> 10 Personal
                                Finance Lessons
                              </div>
                              <div className="text-muted-foreground text-sm">
                                Key lessons and habits that can transform your
                                financial life, from saving to investing.
                              </div>
                            </CardContent>
                          </Card>
                          <Card className="overflow-hidden shadow-lg animate-fade-in-up">
                            <div className="aspect-w-16 aspect-h-9 bg-black">
                              <iframe
                                src="https://www.youtube.com/embed/MXCvtC0HqLE"
                                title="The Student Guide to Personal Finance"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full"
                              ></iframe>
                            </div>
                            <CardContent className="p-4 flex flex-col gap-2">
                              <div className="flex items-center gap-2 text-blue-700 font-semibold text-lg">
                                <PiggyBank className="w-5 h-5" /> Student Guide
                                to Personal Finance
                              </div>
                              <div className="text-muted-foreground text-sm">
                                A practical guide for students and young adults
                                to start managing money and building good habits
                                early.
                              </div>
                            </CardContent>
                          </Card>
                          <Card className="overflow-hidden shadow-lg animate-fade-in-up">
                            <div className="aspect-w-16 aspect-h-9 bg-black">
                              <iframe
                                src="https://www.youtube.com/embed/v9Va136MHtg"
                                title="Major MONEY Milestones To Accomplish in Your 20s!"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full"
                              ></iframe>
                            </div>
                            <CardContent className="p-4 flex flex-col gap-2">
                              <div className="flex items-center gap-2 text-yellow-700 font-semibold text-lg">
                                <Star className="w-5 h-5" /> Money Milestones in
                                Your 20s
                              </div>
                              <div className="text-muted-foreground text-sm">
                                Essential financial milestones to hit in your
                                20s for a strong financial foundation.
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "chat" && <AIChat userId={user?.id} />}
            {activeTab === "purchase" && <PurchaseAdvisor userId={user?.id} />}
            {activeTab === "budget" && <BudgetPlanner userId={user?.id} />}
            {activeTab === "debts" && <DebtManager userId={user?.id} />}
            {activeTab === "goals" && <GoalTracker userId={user?.id} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

function QuizInteractive() {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const questions = [
    {
      q: "Which of the following is a good credit score?",
      options: ["A) 300", "B) 650", "C) 800"],
      answer: 2,
    },
    {
      q: "What percentage of your income should go to savings (50/30/20 rule)?",
      options: ["A) 10%", "B) 20%", "C) 30%"],
      answer: 1,
    },
    {
      q: "What is the best way to build an emergency fund?",
      options: [
        "A) Save what's left at month end",
        "B) Set aside a fixed amount each month",
        "C) Use a credit card for emergencies",
      ],
      answer: 1,
    },
  ];
  const [current, setCurrent] = useState(0);

  function handleSubmit() {
    setSubmitted(true);
    if (selected === String(questions[current].answer)) {
      setScore((s) => s + 1);
    }
  }
  function handleNext() {
    setSubmitted(false);
    setSelected(null);
    setCurrent((c) => c + 1);
  }
  function handleRestart() {
    setCurrent(0);
    setScore(0);
    setSubmitted(false);
    setSelected(null);
  }

  if (current >= questions.length) {
    return (
      <div className="text-center space-y-4">
        <div className="text-lg font-semibold">Quiz Complete!</div>
        <div>
          Your score:{" "}
          <span className="font-bold">
            {score} / {questions.length}
          </span>
        </div>
        <Button onClick={handleRestart}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="font-medium">{questions[current].q}</div>
      <RadioGroup
        value={selected}
        onValueChange={setSelected}
        className="space-y-2"
      >
        {questions[current].options.map((opt, idx) => (
          <div key={idx} className="flex items-center">
            <RadioGroupItem value={String(idx)} id={`opt${idx}`} />
            <label htmlFor={`opt${idx}`} className="ml-2 cursor-pointer">
              {opt}
            </label>
          </div>
        ))}
      </RadioGroup>
      {!submitted ? (
        <Button onClick={handleSubmit} disabled={selected === null}>
          Submit
        </Button>
      ) : (
        <div className="space-y-2">
          {selected === String(questions[current].answer) ? (
            <div className="text-green-600 font-medium">Correct!</div>
          ) : (
            <div className="text-red-600 font-medium">
              Incorrect. The correct answer is{" "}
              {questions[current].options[questions[current].answer]}
            </div>
          )}
          <Button onClick={handleNext}>Next</Button>
        </div>
      )}
    </div>
  );
}
