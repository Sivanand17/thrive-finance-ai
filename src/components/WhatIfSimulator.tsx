import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Calculator,
  TrendingUp,
  Target,
  Calendar,
  DollarSign,
  PiggyBank,
  CreditCard,
  Lightbulb,
  BarChart3,
  ArrowRight,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Brain,
  Rocket,
  Home,
  Car,
  GraduationCap,
  Plane,
  Heart,
  Building,
} from "lucide-react";

// AI Response formatting function (same as other components)
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

interface WhatIfSimulatorProps {
  userId?: string;
}

interface FinancialProfile {
  monthly_income: number;
  monthly_expenses: number;
  savings_balance: number;
  debt_amount: number;
  credit_score: number;
}

interface Scenario {
  id: string;
  type: "savings" | "debt" | "goal" | "investment" | "combined";
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  calculations: any;
}

const WhatIfSimulator = ({ userId }: WhatIfSimulatorProps) => {
  const [financialProfile, setFinancialProfile] =
    useState<FinancialProfile | null>(null);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeScenario, setActiveScenario] = useState<string | null>(null);

  // Input states
  const [extraSavings, setExtraSavings] = useState(5000);
  const [extraDebtPayment, setExtraDebtPayment] = useState(2000);
  const [timeframe, setTimeframe] = useState(12);
  const [goalAmount, setGoalAmount] = useState(100000);
  const [interestRate, setInterestRate] = useState(7);
  const [investmentAmount, setInvestmentAmount] = useState(10000);

  const { toast } = useToast();

  // Load user's financial profile
  useEffect(() => {
    const loadFinancialProfile = async () => {
      if (!userId) return;

      try {
        const { data, error } = await supabase
          .from("financial_profiles")
          .select("*")
          .eq("user_id", userId)
          .single();

        if (error) throw error;
        setFinancialProfile(data);
      } catch (error: any) {
        console.error("Error loading financial profile:", error);
        // Use demo data if profile not found
        setFinancialProfile({
          monthly_income: 50000,
          monthly_expenses: 35000,
          savings_balance: 100000,
          debt_amount: 200000,
          credit_score: 720,
        });
      }
    };

    loadFinancialProfile();
  }, [userId]);

  const calculateCompoundInterest = (
    principal: number,
    rate: number,
    time: number,
    frequency: number = 12
  ) => {
    const r = rate / 100 / frequency;
    const n = time * frequency;
    return principal * Math.pow(1 + r, n);
  };

  const calculateScenarios = () => {
    if (!financialProfile) return;

    const newScenarios: Scenario[] = [];

    // 1. Savings Growth Scenario
    const savingsGrowth = {
      id: "savings",
      type: "savings" as const,
      title: "Savings Growth Projection",
      description: `What if you save ₹${extraSavings.toLocaleString()} more per month?`,
      icon: <PiggyBank className="w-5 h-5" />,
      color: "text-green-600 bg-green-50 border-green-200",
      calculations: {
        currentSavings: financialProfile.savings_balance,
        monthlySavings: extraSavings,
        projectedSavings:
          financialProfile.savings_balance + extraSavings * timeframe,
        withInterest: calculateCompoundInterest(
          financialProfile.savings_balance + extraSavings * timeframe,
          interestRate,
          timeframe / 12
        ),
        totalContribution: extraSavings * timeframe,
        interestEarned:
          calculateCompoundInterest(
            financialProfile.savings_balance + extraSavings * timeframe,
            interestRate,
            timeframe / 12
          ) -
          (financialProfile.savings_balance + extraSavings * timeframe),
        monthlyImpact: extraSavings,
        timeline: timeframe,
      },
    };

    // 2. Debt Payoff Scenario
    const debtPayoff = {
      id: "debt",
      type: "debt" as const,
      title: "Debt Elimination Strategy",
      description: `What if you pay ₹${extraDebtPayment.toLocaleString()} extra towards debt monthly?`,
      icon: <CreditCard className="w-5 h-5" />,
      color: "text-red-600 bg-red-50 border-red-200",
      calculations: {
        currentDebt: financialProfile.debt_amount,
        monthlyPayment: extraDebtPayment,
        debtPaidOff: Math.min(
          financialProfile.debt_amount,
          extraDebtPayment * timeframe
        ),
        remainingDebt: Math.max(
          0,
          financialProfile.debt_amount - extraDebtPayment * timeframe
        ),
        payoffTime: Math.ceil(financialProfile.debt_amount / extraDebtPayment),
        interestSaved: financialProfile.debt_amount * 0.15 * (timeframe / 12), // Assuming 15% interest
        monthlyImpact: extraDebtPayment,
      },
    };

    // 3. Goal Achievement Scenario
    const goalAchievement = {
      id: "goal",
      type: "goal" as const,
      title: "Goal Achievement Timeline",
      description: `How long to reach ₹${goalAmount.toLocaleString()}?`,
      icon: <Target className="w-5 h-5" />,
      color: "text-blue-600 bg-blue-50 border-blue-200",
      calculations: {
        goalAmount: goalAmount,
        currentSavings: financialProfile.savings_balance,
        additionalNeeded: Math.max(
          0,
          goalAmount - financialProfile.savings_balance
        ),
        monthsToGoal: Math.ceil(
          Math.max(0, goalAmount - financialProfile.savings_balance) /
            extraSavings
        ),
        monthlyRequired: Math.ceil(
          Math.max(0, goalAmount - financialProfile.savings_balance) / timeframe
        ),
        feasibility:
          Math.max(0, goalAmount - financialProfile.savings_balance) /
            timeframe <=
          financialProfile.monthly_income - financialProfile.monthly_expenses
            ? "achievable"
            : "challenging",
        withInterest: calculateCompoundInterest(
          extraSavings,
          interestRate,
          Math.ceil(
            Math.max(0, goalAmount - financialProfile.savings_balance) /
              extraSavings
          ) / 12
        ),
      },
    };

    // 4. Investment Growth Scenario
    const investmentGrowth = {
      id: "investment",
      type: "investment" as const,
      title: "Investment Growth Projection",
      description: `What if you invest ₹${investmentAmount.toLocaleString()} with ${interestRate}% annual return?`,
      icon: <TrendingUp className="w-5 h-5" />,
      color: "text-purple-600 bg-purple-50 border-purple-200",
      calculations: {
        initialInvestment: investmentAmount,
        annualReturn: interestRate,
        projectedValue: calculateCompoundInterest(
          investmentAmount,
          interestRate,
          timeframe / 12
        ),
        totalGrowth:
          calculateCompoundInterest(
            investmentAmount,
            interestRate,
            timeframe / 12
          ) - investmentAmount,
        growthPercentage:
          ((calculateCompoundInterest(
            investmentAmount,
            interestRate,
            timeframe / 12
          ) -
            investmentAmount) /
            investmentAmount) *
          100,
        monthlyContribution: investmentAmount,
        timeline: timeframe,
      },
    };

    // 5. Combined Strategy Scenario
    const combinedStrategy = {
      id: "combined",
      type: "combined" as const,
      title: "Combined Financial Strategy",
      description: "Saving more + paying debt + investing",
      icon: <Zap className="w-5 h-5" />,
      color: "text-orange-600 bg-orange-50 border-orange-200",
      calculations: {
        totalMonthlyCommitment:
          extraSavings + extraDebtPayment + investmentAmount,
        savingsGrowth: calculateCompoundInterest(
          financialProfile.savings_balance + extraSavings * timeframe,
          interestRate,
          timeframe / 12
        ),
        debtReduction: Math.min(
          financialProfile.debt_amount,
          extraDebtPayment * timeframe
        ),
        investmentGrowth: calculateCompoundInterest(
          investmentAmount,
          interestRate,
          timeframe / 12
        ),
        netWorthImprovement:
          calculateCompoundInterest(
            financialProfile.savings_balance + extraSavings * timeframe,
            interestRate,
            timeframe / 12
          ) +
          Math.min(financialProfile.debt_amount, extraDebtPayment * timeframe) +
          calculateCompoundInterest(
            investmentAmount,
            interestRate,
            timeframe / 12
          ),
        affordability:
          extraSavings + extraDebtPayment + investmentAmount <=
          financialProfile.monthly_income - financialProfile.monthly_expenses
            ? "affordable"
            : "stretching",
      },
    };

    setScenarios([
      savingsGrowth,
      debtPayoff,
      goalAchievement,
      investmentGrowth,
      combinedStrategy,
    ]);
  };

  const getAIInsights = async () => {
    if (!userId || !financialProfile) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "financial-ai-advisor",
        {
          body: {
            message: `Based on my financial profile (income: ₹${financialProfile.monthly_income}, expenses: ₹${financialProfile.monthly_expenses}, savings: ₹${financialProfile.savings_balance}, debt: ₹${financialProfile.debt_amount}), what are the best what-if scenarios I should consider? Give me 3 actionable recommendations with specific amounts and timelines.`,
            type: "what_if_analysis",
            userId,
          },
        }
      );

      if (error) throw error;
      if (data?.response) {
        setAiInsights(data.response);
      }
    } catch (error: any) {
      console.error("Error getting AI insights:", error);
      setAiInsights(
        "Based on your financial profile, I recommend focusing on building an emergency fund first, then paying off high-interest debt, and finally investing for long-term growth. Start with small, achievable goals and gradually increase your commitments."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const presetGoals = [
    {
      label: "House Down Payment",
      amount: 500000,
      icon: <Home className="w-4 h-4" />,
    },
    {
      label: "New Car Fund",
      amount: 800000,
      icon: <Car className="w-4 h-4" />,
    },
    {
      label: "Education Fund",
      amount: 200000,
      icon: <GraduationCap className="w-4 h-4" />,
    },
    {
      label: "Vacation Fund",
      amount: 100000,
      icon: <Plane className="w-4 h-4" />,
    },
    {
      label: "Wedding Fund",
      amount: 300000,
      icon: <Heart className="w-4 h-4" />,
    },
    {
      label: "Business Startup",
      amount: 1000000,
      icon: <Building className="w-4 h-4" />,
    },
  ];

  const getScenarioIcon = (type: string) => {
    switch (type) {
      case "savings":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "debt":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case "goal":
        return <Target className="w-4 h-4 text-blue-600" />;
      case "investment":
        return <TrendingUp className="w-4 h-4 text-purple-600" />;
      case "combined":
        return <Zap className="w-4 h-4 text-orange-600" />;
      default:
        return <Calculator className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-0">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <Calculator className="w-5 h-5" />
            What-If Financial Simulator
          </CardTitle>
          <CardDescription className="text-lg">
            Explore different financial scenarios and see how small changes
            today can create big impacts tomorrow
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Input Controls */}
    <Card>
      <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary" />
            Scenario Parameters
          </CardTitle>
        <CardDescription>
            Adjust these values to see how different financial decisions impact
            your future
        </CardDescription>
      </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Extra Savings */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <PiggyBank className="w-4 h-4" />
                Extra Monthly Savings
              </Label>
              <div className="space-y-2">
                <Input
                  type="number"
                  value={extraSavings}
                  onChange={(e) => setExtraSavings(Number(e.target.value))}
                  placeholder="5000"
                />
                <Slider
                  value={[extraSavings]}
                  onValueChange={(value) => setExtraSavings(value[0])}
                  max={50000}
                  min={1000}
                  step={1000}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  ₹{extraSavings.toLocaleString()} per month
                </p>
              </div>
            </div>

            {/* Extra Debt Payment */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Extra Debt Payment
              </Label>
              <div className="space-y-2">
                <Input
                  type="number"
                  value={extraDebtPayment}
                  onChange={(e) => setExtraDebtPayment(Number(e.target.value))}
                  placeholder="2000"
                />
                <Slider
                  value={[extraDebtPayment]}
                  onValueChange={(value) => setExtraDebtPayment(value[0])}
                  max={20000}
                  min={500}
                  step={500}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  ₹{extraDebtPayment.toLocaleString()} per month
                </p>
              </div>
            </div>

            {/* Time Period */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Time Period
              </Label>
              <div className="space-y-2">
            <Input
              type="number"
                  value={timeframe}
                  onChange={(e) => setTimeframe(Number(e.target.value))}
                  placeholder="12"
                />
                <Slider
                  value={[timeframe]}
                  onValueChange={(value) => setTimeframe(value[0])}
                  max={60}
                  min={6}
                  step={3}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  {timeframe} months ({(timeframe / 12).toFixed(1)} years)
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Goal Amount */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <Target className="w-4 h-4" />
                Financial Goal
              </Label>
            <Input
              type="number"
                value={goalAmount}
                onChange={(e) => setGoalAmount(Number(e.target.value))}
                placeholder="100000"
            />
          </div>

            {/* Interest Rate */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Interest Rate (%)
              </Label>
            <Input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
                placeholder="7"
                step="0.1"
              />
            </div>

            {/* Investment Amount */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Investment Amount
              </Label>
              <Input
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                placeholder="10000"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={calculateScenarios}
              className="flex items-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              Calculate Scenarios
            </Button>
            <Button
              onClick={getAIInsights}
              variant="outline"
              className="flex items-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4" />
                  Get AI Insights
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Goal Presets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-primary" />
            Quick Goal Presets
          </CardTitle>
          <CardDescription>Try these common financial goals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {presetGoals.map((preset, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 flex-col gap-2"
                onClick={() => {
                  setGoalAmount(preset.amount);
                  calculateScenarios();
                }}
              >
                {preset.icon}
                <span className="text-sm font-medium">{preset.label}</span>
                <span className="text-xs text-muted-foreground">
                  ₹{preset.amount.toLocaleString()}
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scenario Results */}
      {scenarios.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Scenario Analysis Results
          </h3>

          {scenarios.map((scenario) => (
            <Card
              key={scenario.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <CardTitle className="text-base flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {scenario.icon}
                    {scenario.title}
                  </div>
                  <Badge variant="secondary" className={scenario.color}>
                    {scenario.type}
                  </Badge>
                </CardTitle>
                <CardDescription>{scenario.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {scenario.type === "savings" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Current Savings
                        </p>
                        <p className="text-lg font-semibold text-green-600">
                          ₹
                          {scenario.calculations.currentSavings.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          After {timeframe} months
                        </p>
                        <p className="text-lg font-semibold text-blue-600">
                          ₹
                          {scenario.calculations.projectedSavings.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          With Interest
                        </p>
                        <p className="text-lg font-semibold text-purple-600">
                          ₹{scenario.calculations.withInterest.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Interest Earned
                        </p>
                        <p className="text-lg font-semibold text-orange-600">
                          ₹
                          {scenario.calculations.interestEarned.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm">
                        <strong>Insight:</strong> By saving ₹
                        {scenario.calculations.monthlyImpact.toLocaleString()}{" "}
                        more per month, you could have ₹
                        {scenario.calculations.withInterest.toLocaleString()} in{" "}
                        {timeframe} months, earning ₹
                        {scenario.calculations.interestEarned.toLocaleString()}{" "}
                        in interest!
                      </p>
                    </div>
                  </div>
                )}

                {scenario.type === "debt" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Current Debt
                        </p>
                        <p className="text-lg font-semibold text-red-600">
                          ₹{scenario.calculations.currentDebt.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Debt Paid Off
                        </p>
                        <p className="text-lg font-semibold text-green-600">
                          ₹{scenario.calculations.debtPaidOff.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Remaining Debt
                        </p>
                        <p className="text-lg font-semibold text-blue-600">
                          ₹
                          {scenario.calculations.remainingDebt.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Interest Saved
                        </p>
                        <p className="text-lg font-semibold text-purple-600">
                          ₹
                          {scenario.calculations.interestSaved.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-sm">
                        <strong>Insight:</strong> By paying ₹
                        {scenario.calculations.monthlyImpact.toLocaleString()}{" "}
                        extra monthly, you could eliminate ₹
                        {scenario.calculations.debtPaidOff.toLocaleString()} in
                        debt and save ₹
                        {scenario.calculations.interestSaved.toLocaleString()}{" "}
                        in interest payments!
                      </p>
                    </div>
                  </div>
                )}

                {scenario.type === "goal" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Goal Amount
                        </p>
                        <p className="text-lg font-semibold text-blue-600">
                          ₹{scenario.calculations.goalAmount.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Time Needed
                        </p>
                        <p className="text-lg font-semibold text-green-600">
                          {scenario.calculations.monthsToGoal} months
                        </p>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Monthly Required
                        </p>
                        <p className="text-lg font-semibold text-purple-600">
                          ₹
                          {scenario.calculations.monthlyRequired.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Feasibility
                        </p>
                        <Badge
                          variant={
                            scenario.calculations.feasibility === "achievable"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {scenario.calculations.feasibility}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm">
                        <strong>Insight:</strong> To reach ₹
                        {scenario.calculations.goalAmount.toLocaleString()}, you
                        need to save ₹
                        {scenario.calculations.monthlyRequired.toLocaleString()}{" "}
                        monthly for
                        {scenario.calculations.monthsToGoal} months. This goal
                        is {scenario.calculations.feasibility}
                        with your current income.
                      </p>
                    </div>
                  </div>
                )}

                {scenario.type === "investment" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Initial Investment
                        </p>
                        <p className="text-lg font-semibold text-purple-600">
                          ₹
                          {scenario.calculations.initialInvestment.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Projected Value
                        </p>
                        <p className="text-lg font-semibold text-green-600">
                          ₹
                          {scenario.calculations.projectedValue.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Total Growth
                        </p>
                        <p className="text-lg font-semibold text-blue-600">
                          ₹{scenario.calculations.totalGrowth.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Growth %
                        </p>
                        <p className="text-lg font-semibold text-orange-600">
                          {scenario.calculations.growthPercentage.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="text-sm">
                        <strong>Insight:</strong> Investing ₹
                        {scenario.calculations.initialInvestment.toLocaleString()}
                        with {scenario.calculations.annualReturn}% annual return
                        could grow to ₹
                        {scenario.calculations.projectedValue.toLocaleString()}{" "}
                        in {timeframe} months, giving you a{" "}
                        {scenario.calculations.growthPercentage.toFixed(1)}%
                        return!
                      </p>
                    </div>
                  </div>
                )}

                {scenario.type === "combined" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Savings Growth
                        </p>
                        <p className="text-lg font-semibold text-green-600">
                          ₹
                          {scenario.calculations.savingsGrowth.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Debt Reduction
                        </p>
                        <p className="text-lg font-semibold text-blue-600">
                          ₹
                          {scenario.calculations.debtReduction.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Investment Growth
                        </p>
                        <p className="text-lg font-semibold text-purple-600">
                          ₹
                          {scenario.calculations.investmentGrowth.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <p className="text-sm">
                        <strong>Insight:</strong> By committing ₹
                        {scenario.calculations.totalMonthlyCommitment.toLocaleString()}
                        per month to this combined strategy, you could improve
                        your net worth by ₹
                        {scenario.calculations.netWorthImprovement.toLocaleString()}{" "}
                        in {timeframe} months! This strategy is{" "}
                        {scenario.calculations.affordability} with your current
                        income.
                      </p>
                    </div>
          </div>
        )}
      </CardContent>
    </Card>
          ))}
        </div>
      )}

      {/* AI Insights */}
      {aiInsights && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              AI-Powered Insights & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="space-y-2 text-sm leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: formatAIResponse(aiInsights),
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Financial Profile Summary */}
      {financialProfile && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              Your Current Financial Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Monthly Income</p>
                <p className="text-lg font-semibold text-green-600">
                  ₹{financialProfile.monthly_income.toLocaleString()}
                </p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Monthly Expenses
                </p>
                <p className="text-lg font-semibold text-red-600">
                  ₹{financialProfile.monthly_expenses.toLocaleString()}
                </p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Current Savings</p>
                <p className="text-lg font-semibold text-blue-600">
                  ₹{financialProfile.savings_balance.toLocaleString()}
                </p>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Current Debt</p>
                <p className="text-lg font-semibold text-orange-600">
                  ₹{financialProfile.debt_amount.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm">
                <strong>Available for Investment:</strong> ₹
                {(
                  financialProfile.monthly_income -
                  financialProfile.monthly_expenses
                ).toLocaleString()}{" "}
                per month
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WhatIfSimulator;
