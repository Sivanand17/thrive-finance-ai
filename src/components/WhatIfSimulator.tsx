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
