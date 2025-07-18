import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const WhatIfSimulator = () => {
  const [monthlySavings, setMonthlySavings] = useState(0);
  const [years, setYears] = useState(1);
  const [interestRate, setInterestRate] = useState(5);
  const [result, setResult] = useState<number | null>(null);

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    // Compound interest formula: FV = P * [((1 + r)^n - 1) / r]
    const r = interestRate / 100 / 12;
    const n = years * 12;
    const fv = monthlySavings * ((Math.pow(1 + r, n) - 1) / r);
    setResult(fv);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>What-If Simulator</CardTitle>
        <CardDescription>
          Simulate your future savings: "What if I save X more per month?"
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSimulate} className="space-y-4">
          <div>
            <label htmlFor="monthlySavings">Monthly Savings (₹)</label>
            <Input
              id="monthlySavings"
              type="number"
              min="0"
              value={monthlySavings}
              onChange={(e) => setMonthlySavings(Number(e.target.value))}
              required
            />
          </div>
          <div>
            <label htmlFor="years">Years</label>
            <Input
              id="years"
              type="number"
              min="1"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              required
            />
          </div>
          <div>
            <label htmlFor="interestRate">Annual Interest Rate (%)</label>
            <Input
              id="interestRate"
              type="number"
              min="0"
              step="0.01"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              required
            />
          </div>
          <Button type="submit">Simulate</Button>
        </form>
        {result !== null && (
          <div className="mt-4 p-4 bg-muted rounded">
            <strong>Future Value:</strong> ₹
            {result.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WhatIfSimulator;
