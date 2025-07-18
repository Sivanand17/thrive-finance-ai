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