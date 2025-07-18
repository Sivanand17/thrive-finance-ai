<<<<<<< HEAD
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const WhatIfSimulator = () => {
  const [tab, setTab] = useState<"goal" | "debt" | "subscription">("goal");

  // Goal Savings
  const [monthlySave, setMonthlySave] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [months, setMonths] = useState<number | null>(null);

  // Debt Payoff
  const [debtAmount, setDebtAmount] = useState("");
  const [debtInterest, setDebtInterest] = useState("");
  const [debtMonthly, setDebtMonthly] = useState("");
  const [debtResult, setDebtResult] = useState<string | null>(null);

  // Subscription Cuts
  const [subAmount, setSubAmount] = useState("");
  const [subMonths, setSubMonths] = useState("");
  const [subResult, setSubResult] = useState<string | null>(null);

  const handleSimulateGoal = () => {
    const save = parseFloat(monthlySave);
    const goal = parseFloat(goalAmount);
    if (!save || !goal) return;
    setMonths(Math.ceil(goal / save));
  };

  const handleSimulateDebt = () => {
    const principal = parseFloat(debtAmount);
    const rate = parseFloat(debtInterest) / 100 / 12;
    const payment = parseFloat(debtMonthly);
    if (!principal || !rate || !payment) return;
    // Amortization formula: n = -log(1 - r*P/A) / log(1 + r)
    const n =
      (Math.log(1 - (rate * principal) / payment) / Math.log(1 + rate)) * -1;
    if (n > 0 && isFinite(n)) {
      setDebtResult(
        `You will pay off your debt in ${Math.ceil(n)} month${
          Math.ceil(n) > 1 ? "s" : ""
        }.`
      );
    } else {
      setDebtResult("Monthly payment is too low to ever pay off this debt.");
    }
  };

  const handleSimulateSub = () => {
    const cut = parseFloat(subAmount);
    const months = parseInt(subMonths);
    if (!cut || !months) return;
    setSubResult(
      `You will save ₹${(cut * months).toLocaleString()} in ${months} month${
        months > 1 ? "s" : ""
      } by cancelling this subscription.`
    );
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>What-If Simulator</CardTitle>
        <div className="flex gap-2 mt-2">
          <Button
            variant={tab === "goal" ? "default" : "outline"}
            size="sm"
            onClick={() => setTab("goal")}
          >
            Goal Savings
          </Button>
          <Button
            variant={tab === "debt" ? "default" : "outline"}
            size="sm"
            onClick={() => setTab("debt")}
          >
            Debt Payoff
          </Button>
          <Button
            variant={tab === "subscription" ? "default" : "outline"}
            size="sm"
            onClick={() => setTab("subscription")}
          >
            Subscription Cut
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {tab === "goal" && (
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm mb-1">Goal Amount (₹)</label>
              <Input
                type="number"
                value={goalAmount}
                onChange={(e) => setGoalAmount(e.target.value)}
                placeholder="e.g., 50000"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Monthly Savings (₹)</label>
              <Input
                type="number"
                value={monthlySave}
                onChange={(e) => setMonthlySave(e.target.value)}
                placeholder="e.g., 5000"
              />
            </div>
            <Button onClick={handleSimulateGoal}>Simulate</Button>
            {months !== null && (
              <div className="mt-2 text-green-700 font-medium">
                You will reach your goal in <b>{months}</b> month
                {months > 1 ? "s" : ""}.
              </div>
            )}
          </div>
        )}
        {tab === "debt" && (
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm mb-1">Debt Amount (₹)</label>
              <Input
                type="number"
                value={debtAmount}
                onChange={(e) => setDebtAmount(e.target.value)}
                placeholder="e.g., 100000"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">
                Interest Rate (Annual %)
              </label>
              <Input
                type="number"
                value={debtInterest}
                onChange={(e) => setDebtInterest(e.target.value)}
                placeholder="e.g., 12"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Monthly Payment (₹)</label>
              <Input
                type="number"
                value={debtMonthly}
                onChange={(e) => setDebtMonthly(e.target.value)}
                placeholder="e.g., 5000"
              />
            </div>
            <Button onClick={handleSimulateDebt}>Simulate</Button>
            {debtResult && (
              <div className="mt-2 text-blue-700 font-medium">{debtResult}</div>
            )}
          </div>
        )}
        {tab === "subscription" && (
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm mb-1">
                Subscription Amount (₹/month)
              </label>
              <Input
                type="number"
                value={subAmount}
                onChange={(e) => setSubAmount(e.target.value)}
                placeholder="e.g., 499"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Months</label>
              <Input
                type="number"
                value={subMonths}
                onChange={(e) => setSubMonths(e.target.value)}
                placeholder="e.g., 12"
              />
            </div>
            <Button onClick={handleSimulateSub}>Simulate</Button>
            {subResult && (
              <div className="mt-2 text-purple-700 font-medium">
                {subResult}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WhatIfSimulator;
=======
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Calculator, TrendingUp, PiggyBank } from "lucide-react";

const WhatIfSimulator = () => {
  const [currentIncome, setCurrentIncome] = useState(75000);
  const [currentExpenses, setCurrentExpenses] = useState(45000);
  const [currentSavings, setCurrentSavings] = useState(125000);
  const [incomeChange, setIncomeChange] = useState([0]);
  const [expenseChange, setExpenseChange] = useState([0]);
  const [results, setResults] = useState<any>(null);

  const runSimulation = () => {
    const newIncome = currentIncome * (1 + incomeChange[0] / 100);
    const newExpenses = currentExpenses * (1 + expenseChange[0] / 100);
    const monthlySavings = newIncome - newExpenses;
    const yearlyImpact = monthlySavings * 12;
    const futureBalance = currentSavings + yearlyImpact;

    setResults({
      newIncome,
      newExpenses,
      monthlySavings,
      yearlyImpact,
      futureBalance,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            What-If Financial Simulator
          </CardTitle>
          <CardDescription>
            Explore how changes to your income and expenses would impact your finances
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="income">Current Monthly Income</Label>
              <Input
                id="income"
                type="number"
                value={currentIncome}
                onChange={(e) => setCurrentIncome(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expenses">Current Monthly Expenses</Label>
              <Input
                id="expenses"
                type="number"
                value={currentExpenses}
                onChange={(e) => setCurrentExpenses(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="savings">Current Savings</Label>
              <Input
                id="savings"
                type="number"
                value={currentSavings}
                onChange={(e) => setCurrentSavings(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label>Income Change: {incomeChange[0] > 0 ? '+' : ''}{incomeChange[0]}%</Label>
              <Slider
                value={incomeChange}
                onValueChange={setIncomeChange}
                max={50}
                min={-50}
                step={1}
                className="w-full"
              />
            </div>
            <div className="space-y-4">
              <Label>Expense Change: {expenseChange[0] > 0 ? '+' : ''}{expenseChange[0]}%</Label>
              <Slider
                value={expenseChange}
                onValueChange={setExpenseChange}
                max={50}
                min={-50}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          <Button onClick={runSimulation} className="w-full">
            Run Simulation
          </Button>

          {results && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    New Monthly Income
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-600">
                    ₹{results.newIncome.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <PiggyBank className="w-4 h-4" />
                    New Monthly Expenses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-red-600">
                    ₹{results.newExpenses.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Monthly Savings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`text-2xl font-bold ${results.monthlySavings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ₹{results.monthlySavings.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Yearly Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`text-2xl font-bold ${results.yearlyImpact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ₹{results.yearlyImpact.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Future Balance (1 Year)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-blue-600">
                    ₹{results.futureBalance.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WhatIfSimulator;
>>>>>>> cc00acb52af95c2461dec170f5799b022e1e6f24
