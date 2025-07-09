import { useState, useEffect } from "react";
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
} from "lucide-react";

import { ThemeToggle } from "@/components/ThemeToggle";
import AIChat from "@/components/AIChat";
import FinancialSetup from "@/components/FinancialSetup";
import PurchaseAdvisor from "@/components/PurchaseAdvisor";
import BudgetPlanner from "@/components/BudgetPlanner";
import DebtManager from "@/components/DebtManager";
import GoalTracker from "@/components/GoalTracker";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [financialProfile, setFinancialProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (!session?.user) {
        navigate("/auth");
      }
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (!session?.user) {
        navigate("/auth");
      } else {
        loadFinancialProfile(session.user.id);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadFinancialProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("financial_profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      setFinancialProfile(data);
    } catch (error: any) {
      console.error("Error loading financial profile:", error);
    }
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
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
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
                {/* Credit Score Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Credit Score Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div
                          className={`text-3xl font-bold ${getCreditScoreColor(
                            financialProfile.credit_score
                          )}`}
                        >
                          {financialProfile.credit_score}
                        </div>
                        <Badge variant="secondary">
                          {getCreditScoreLabel(financialProfile.credit_score)}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          Range: 300-850
                        </p>
                        <Progress
                          value={(financialProfile.credit_score / 850) * 100}
                          className="w-32 mt-2"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Financial Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Monthly Income
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        ₹{financialProfile.monthly_income?.toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Monthly Expenses
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-600">
                        ₹{financialProfile.monthly_expenses?.toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Savings Balance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">
                        ₹{financialProfile.savings_balance?.toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>
                      Access your most-used financial tools
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Button
                        variant="outline"
                        className="h-20 flex-col gap-2"
                        onClick={() => setActiveTab("chat")}
                      >
                        <MessageCircle className="w-6 h-6" />
                        <span className="text-sm">Ask AI</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-20 flex-col gap-2"
                        onClick={() => setActiveTab("purchase")}
                      >
                        <ShoppingCart className="w-6 h-6" />
                        <span className="text-sm">Purchase Advice</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-20 flex-col gap-2"
                        onClick={() => setActiveTab("budget")}
                      >
                        <PiggyBank className="w-6 h-6" />
                        <span className="text-sm">Budget Plan</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-20 flex-col gap-2"
                        onClick={() => setActiveTab("goals")}
                      >
                        <Target className="w-6 h-6" />
                        <span className="text-sm">Set Goals</span>
                      </Button>
                    </div>
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
