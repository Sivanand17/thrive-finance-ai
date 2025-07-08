import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { 
  TrendingUp, 
  DollarSign, 
  CreditCard, 
  PiggyBank,
  CheckCircle
} from 'lucide-react';

interface FinancialSetupProps {
  user: User | null;
  onComplete: (userId: string) => void;
}

const FinancialSetup = ({ user, onComplete }: FinancialSetupProps) => {
  const [formData, setFormData] = useState({
    creditScore: '',
    monthlyIncome: '',
    monthlyExpenses: '',
    savingsBalance: '',
    debtAmount: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);

    try {
      // Create profile
      await supabase.from('profiles').upsert({
        user_id: user.id,
        full_name: user.user_metadata?.full_name || '',
        email: user.email || ''
      });

      // Create financial profile
      const { error } = await supabase.from('financial_profiles').insert({
        user_id: user.id,
        credit_score: parseInt(formData.creditScore),
        monthly_income: parseFloat(formData.monthlyIncome),
        monthly_expenses: parseFloat(formData.monthlyExpenses),
        savings_balance: parseFloat(formData.savingsBalance),
        debt_amount: parseFloat(formData.debtAmount) || 0
      });

      if (error) throw error;

      toast({
        title: "Profile setup complete!",
        description: "Your financial information has been saved securely.",
      });

      onComplete(user.id);
    } catch (error: any) {
      toast({
        title: "Error saving profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const setupSteps = [
    {
      icon: TrendingUp,
      title: 'Credit Score',
      description: 'Help us understand your credit health'
    },
    {
      icon: DollarSign,
      title: 'Income & Expenses',
      description: 'Monthly financial flow information'
    },
    {
      icon: PiggyBank,
      title: 'Savings & Debt',
      description: 'Current financial position'
    }
  ];

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Let's Set Up Your Financial Profile
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            To provide personalized advice, we need to understand your current financial situation. 
            All information is encrypted and secure.
          </p>
        </div>

        {/* Setup Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {setupSteps.map((step, index) => (
            <Card key={index} className="feature-card">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Setup Form */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Financial Information
            </CardTitle>
            <CardDescription>
              This information helps our AI provide accurate, personalized advice
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="creditScore">Credit Score *</Label>
                <Input
                  id="creditScore"
                  name="creditScore"
                  type="number"
                  min="300"
                  max="850"
                  value={formData.creditScore}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., 750"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Range: 300-850. Check your bank app or credit report.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="monthlyIncome">Monthly Income (₹) *</Label>
                  <Input
                    id="monthlyIncome"
                    name="monthlyIncome"
                    type="number"
                    min="0"
                    value={formData.monthlyIncome}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., 75000"
                  />
                </div>
                <div>
                  <Label htmlFor="monthlyExpenses">Monthly Expenses (₹) *</Label>
                  <Input
                    id="monthlyExpenses"
                    name="monthlyExpenses"
                    type="number"
                    min="0"
                    value={formData.monthlyExpenses}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., 45000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="savingsBalance">Current Savings (₹) *</Label>
                  <Input
                    id="savingsBalance"
                    name="savingsBalance"
                    type="number"
                    min="0"
                    value={formData.savingsBalance}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., 150000"
                  />
                </div>
                <div>
                  <Label htmlFor="debtAmount">Total Debt (₹)</Label>
                  <Input
                    id="debtAmount"
                    name="debtAmount"
                    type="number"
                    min="0"
                    value={formData.debtAmount}
                    onChange={handleInputChange}
                    placeholder="e.g., 25000"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Include credit cards, loans, EMIs
                  </p>
                </div>
              </div>

              <div className="bg-primary/10 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm mb-1">Your data is secure</p>
                    <p className="text-sm text-muted-foreground">
                      All financial information is encrypted and stored securely. 
                      We never share your data with third parties.
                    </p>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full btn-hero" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Setting up your profile...' : 'Complete Setup'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinancialSetup;