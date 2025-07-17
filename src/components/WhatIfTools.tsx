import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
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
  ArrowRight
} from 'lucide-react';

interface WhatIfToolsProps {
  financialProfile: any;
}

const WhatIfTools = ({ financialProfile }: WhatIfToolsProps) => {
  const [savingsAmount, setSavingsAmount] = useState(5000);
  const [debtPayment, setDebtPayment] = useState(2000);
  const [timeframe, setTimeframe] = useState(12);
  const [goalAmount, setGoalAmount] = useState(50000);
  const [scenarios, setScenarios] = useState<any[]>([]);

  const calculateScenarios = () => {
    const currentSavings = financialProfile.savings_balance;
    const currentDebt = financialProfile.debt_amount;
    const monthlyIncome = financialProfile.monthly_income;
    const monthlyExpenses = financialProfile.monthly_expenses;
    
    // Scenario calculations
    const savingsScenario = {
      type: 'savings',
      title: '💰 Increased Savings Impact',
      description: `What if you save ₹${savingsAmount} more per month?`,
      calculations: {
        current: currentSavings,
        projected: currentSavings + (savingsAmount * timeframe),
        difference: savingsAmount * timeframe,
        monthlyImpact: savingsAmount,
        timeline: timeframe
      }
    };

    const debtScenario = {
      type: 'debt',
      title: '💳 Accelerated Debt Payment',
      description: `What if you pay ₹${debtPayment} extra towards debt monthly?`,
      calculations: {
        current: currentDebt,
        projected: Math.max(0, currentDebt - (debtPayment * timeframe)),
        difference: Math.min(currentDebt, debtPayment * timeframe),
        monthlyImpact: debtPayment,
        timeline: Math.ceil(currentDebt / debtPayment)
      }
    };

    const goalScenario = {
      type: 'goal',
      title: '🎯 Goal Achievement Timeline',
      description: `How long to reach ₹${goalAmount}?`,
      calculations: {
        current: 0,
        projected: goalAmount,
        monthsNeeded: Math.ceil(goalAmount / savingsAmount),
        monthlyRequired: Math.ceil(goalAmount / timeframe),
        feasibility: (goalAmount / timeframe) <= (monthlyIncome - monthlyExpenses) ? 'achievable' : 'challenging'
      }
    };

    const combinedScenario = {
      type: 'combined',
      title: '⚡ Combined Strategy Impact',
      description: 'Saving more + paying debt faster',
      calculations: {
        totalSavings: currentSavings + (savingsAmount * timeframe),
        totalDebtReduction: Math.min(currentDebt, debtPayment * timeframe),
        netWorthImprovement: (savingsAmount * timeframe) + Math.min(currentDebt, debtPayment * timeframe),
        monthlyCommitment: savingsAmount + debtPayment
      }
    };

    setScenarios([savingsScenario, debtScenario, goalScenario, combinedScenario]);
  };

  const getScenarioColor = (type: string) => {
    switch (type) {
      case 'savings': return 'text-green-600 bg-green-100';
      case 'debt': return 'text-red-600 bg-red-100';
      case 'goal': return 'text-blue-600 bg-blue-100';
      case 'combined': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* What-If Calculator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary" />
            🔮 What-If Financial Simulator
          </CardTitle>
          <CardDescription>
            Explore different financial scenarios and their impact on your goals
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <PiggyBank className="w-4 h-4" />
                💰 Extra Monthly Savings
              </Label>
              <div className="space-y-2">
                <Input
                  type="number"
                  value={savingsAmount}
                  onChange={(e) => setSavingsAmount(Number(e.target.value))}
                  placeholder="5000"
                />
                <Slider
                  value={[savingsAmount]}
                  onValueChange={(value) => setSavingsAmount(value[0])}
                  max={20000}
                  min={1000}
                  step={500}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  ₹{savingsAmount.toLocaleString()} per month
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                💳 Extra Debt Payment
              </Label>
              <div className="space-y-2">
                <Input
                  type="number"
                  value={debtPayment}
                  onChange={(e) => setDebtPayment(Number(e.target.value))}
                  placeholder="2000"
                />
                <Slider
                  value={[debtPayment]}
                  onValueChange={(value) => setDebtPayment(value[0])}
                  max={10000}
                  min={500}
                  step={250}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  ₹{debtPayment.toLocaleString()} per month
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                📅 Time Period
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

          {/* Goal Amount Input */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <Target className="w-4 h-4" />
              🎯 Financial Goal Amount
            </Label>
            <div className="flex gap-3">
              <Input
                type="number"
                value={goalAmount}
                onChange={(e) => setGoalAmount(Number(e.target.value))}
                placeholder="50000"
                className="flex-1"
              />
              <Button onClick={calculateScenarios} className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Calculate Scenarios
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Scenario Buttons */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            ⚡ Quick Scenarios
          </CardTitle>
          <CardDescription>Try these common financial scenarios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: '🏠 House Down Payment', goal: 500000, savings: 10000 },
              { label: '🚗 New Car Fund', goal: 800000, savings: 15000 },
              { label: '📚 Education Fund', goal: 200000, savings: 5000 },
              { label: '🏖️ Vacation Fund', goal: 100000, savings: 3000 }
            ].map((preset, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 flex-col gap-2"
                onClick={() => {
                  setGoalAmount(preset.goal);
                  setSavingsAmount(preset.savings);
                  calculateScenarios();
                }}
              >
                <span className="text-sm font-medium">{preset.label}</span>
                <span className="text-xs text-muted-foreground">
                  ₹{preset.goal.toLocaleString()}
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
            📊 Scenario Analysis Results
          </h3>
          
          {scenarios.map((scenario, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-base flex items-center justify-between">
                  {scenario.title}
                  <Badge variant="secondary" className={getScenarioColor(scenario.type)}>
                    {scenario.type}
                  </Badge>
                </CardTitle>
                <CardDescription>{scenario.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {scenario.type === 'savings' && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Current Savings</p>
                      <p className="text-lg font-semibold">
                        ₹{scenario.calculations.current.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">After {timeframe} months</p>
                      <p className="text-lg font-semibold text-green-600">
                        ₹{scenario.calculations.projected.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Increase</p>
                      <p className="text-lg font-semibold">
                        ₹{scenario.calculations.difference.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Monthly Commitment</p>
                      <p className="text-lg font-semibold">
                        ₹{scenario.calculations.monthlyImpact.toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                {scenario.type === 'debt' && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Current Debt</p>
                      <p className="text-lg font-semibold text-red-600">
                        ₹{scenario.calculations.current.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">After {timeframe} months</p>
                      <p className="text-lg font-semibold text-green-600">
                        ₹{scenario.calculations.projected.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Debt Paid Off</p>
                      <p className="text-lg font-semibold">
                        ₹{scenario.calculations.difference.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Payoff Timeline</p>
                      <p className="text-lg font-semibold">
                        {scenario.calculations.timeline} months
                      </p>
                    </div>
                  </div>
                )}

                {scenario.type === 'goal' && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Goal Amount</p>
                      <p className="text-lg font-semibold">
                        ₹{scenario.calculations.projected.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Time Needed</p>
                      <p className="text-lg font-semibold">
                        {scenario.calculations.monthsNeeded} months
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Monthly Required</p>
                      <p className="text-lg font-semibold">
                        ₹{scenario.calculations.monthlyRequired.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Feasibility</p>
                      <Badge variant={scenario.calculations.feasibility === 'achievable' ? 'default' : 'destructive'}>
                        {scenario.calculations.feasibility}
                      </Badge>
                    </div>
                  </div>
                )}

                {scenario.type === 'combined' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Savings Increase</p>
                        <p className="text-lg font-semibold text-green-600">
                          ₹{scenario.calculations.totalSavings.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Debt Reduction</p>
                        <p className="text-lg font-semibold text-blue-600">
                          ₹{scenario.calculations.totalDebtReduction.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Net Worth Improvement</p>
                        <p className="text-lg font-semibold text-purple-600">
                          ₹{scenario.calculations.netWorthImprovement.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="text-sm">
                        <strong>📈 Combined Strategy Impact:</strong> By committing 
                        ₹{scenario.calculations.monthlyCommitment.toLocaleString()} per month, 
                        you could improve your net worth by 
                        ₹{scenario.calculations.netWorthImprovement.toLocaleString()} 
                        in {timeframe} months!
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Insights and Recommendations */}
      {scenarios.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              💡 AI Insights & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-sm text-green-800 mb-2">
                  ✅ Optimal Strategy
                </h4>
                <p className="text-sm text-green-700">
                  Based on your current financial situation, prioritize building your 
                  emergency fund while making minimum debt payments. Once you have 
                  3-6 months of expenses saved, focus on debt elimination.
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-sm text-blue-800 mb-2">
                  🎯 Quick Wins
                </h4>
                <p className="text-sm text-blue-700">
                  Start with small, achievable goals. Even ₹2,000 extra savings 
                  per month can make a significant impact over time. Consider 
                  automating your savings to make it effortless.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WhatIfTools;