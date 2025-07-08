import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  PiggyBank, 
  Plus, 
  Edit, 
  Trash2, 
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface BudgetPlannerProps {
  userId?: string;
}

interface BudgetCategory {
  id: string;
  name: string;
  allocated_amount: number;
  spent_amount: number;
  month_year: string;
}

const BudgetPlanner = ({ userId }: BudgetPlannerProps) => {
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [newCategory, setNewCategory] = useState({ name: '', amount: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM format
  const { toast } = useToast();

  const loadBudgetCategories = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('budget_categories')
        .select('*')
        .eq('user_id', userId)
        .eq('month_year', currentMonth)
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      console.error('Error loading budget categories:', error);
    }
  };

  useEffect(() => {
    loadBudgetCategories();
  }, [userId, currentMonth]);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name.trim() || !newCategory.amount || !userId) return;

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('budget_categories')
        .insert({
          user_id: userId,
          name: newCategory.name.trim(),
          allocated_amount: parseFloat(newCategory.amount),
          month_year: currentMonth
        });

      if (error) throw error;

      setNewCategory({ name: '', amount: '' });
      await loadBudgetCategories();

      toast({
        title: "Category added",
        description: `${newCategory.name} has been added to your budget.`,
      });
    } catch (error: any) {
      toast({
        title: "Error adding category",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSpent = async (id: string, spentAmount: number) => {
    try {
      const { error } = await supabase
        .from('budget_categories')
        .update({ spent_amount: spentAmount })
        .eq('id', id);

      if (error) throw error;

      await loadBudgetCategories();
      setEditingId(null);

      toast({
        title: "Spending updated",
        description: "Your spending has been recorded.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating spending",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('budget_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await loadBudgetCategories();

      toast({
        title: "Category deleted",
        description: "The budget category has been removed.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting category",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const generateBudgetSuggestions = async () => {
    if (!userId) return;

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('financial-ai-advisor', {
        body: {
          message: 'Help me create a monthly budget plan',
          type: 'budget_help',
          userId
        }
      });

      if (error) throw error;

      toast({
        title: "Budget suggestions ready",
        description: "Check the AI response for personalized budget recommendations.",
      });
    } catch (error: any) {
      toast({
        title: "Error getting budget suggestions",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const totalAllocated = categories.reduce((sum, cat) => sum + cat.allocated_amount, 0);
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent_amount, 0);
  const remainingBudget = totalAllocated - totalSpent;

  const getProgressColor = (percentage: number) => {
    if (percentage <= 70) return 'bg-green-500';
    if (percentage <= 90) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusIcon = (spent: number, allocated: number) => {
    const percentage = (spent / allocated) * 100;
    if (percentage <= 70) return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (percentage <= 90) return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    return <AlertTriangle className="w-4 h-4 text-red-600" />;
  };

  const defaultCategories = [
    'Groceries', 'Transportation', 'Dining Out', 'Entertainment', 
    'Shopping', 'Utilities', 'Rent/EMI', 'Healthcare', 
    'Education', 'Travel', 'Savings', 'Emergency Fund'
  ];

  return (
    <div className="space-y-6">
      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ₹{totalAllocated.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ₹{totalSpent.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₹{remainingBudget.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add New Category */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PiggyBank className="w-5 h-5 text-primary" />
            Budget Planner - {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </CardTitle>
          <CardDescription>
            Create and manage your monthly budget categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddCategory} className="flex gap-4 mb-4">
            <div className="flex-1">
              <Input
                value={newCategory.name}
                onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Category name (e.g., Groceries)"
                list="category-suggestions"
              />
              <datalist id="category-suggestions">
                {defaultCategories.map(cat => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>
            <div className="w-32">
              <Input
                type="number"
                min="1"
                value={newCategory.amount}
                onChange={(e) => setNewCategory(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="Amount"
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              <Plus className="w-4 h-4" />
            </Button>
          </form>

          <Button 
            variant="outline" 
            onClick={generateBudgetSuggestions}
            disabled={isLoading}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Get AI Budget Suggestions
          </Button>
        </CardContent>
      </Card>

      {/* Budget Categories */}
      {categories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Budget Categories</CardTitle>
            <CardDescription>
              Track your spending against your planned budget
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categories.map((category) => {
                const percentage = Math.min((category.spent_amount / category.allocated_amount) * 100, 100);
                const isOverBudget = category.spent_amount > category.allocated_amount;
                
                return (
                  <div key={category.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(category.spent_amount, category.allocated_amount)}
                        <h4 className="font-medium">{category.name}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={isOverBudget ? "destructive" : "secondary"}>
                          ₹{category.spent_amount.toLocaleString()} / ₹{category.allocated_amount.toLocaleString()}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingId(editingId === category.id ? null : category.id)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <Progress 
                      value={percentage} 
                      className="mb-2"
                    />
                    
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{percentage.toFixed(1)}% used</span>
                      <span>₹{(category.allocated_amount - category.spent_amount).toLocaleString()} remaining</span>
                    </div>

                    {editingId === category.id && (
                      <div className="mt-3 flex gap-2">
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder={`Update spent amount (current: ₹${category.spent_amount})`}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const newAmount = parseFloat((e.target as HTMLInputElement).value);
                              if (!isNaN(newAmount)) {
                                handleUpdateSpent(category.id, newAmount);
                              }
                            }
                          }}
                        />
                        <Button
                          size="sm"
                          onClick={(e) => {
                            const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                            const newAmount = parseFloat(input.value);
                            if (!isNaN(newAmount)) {
                              handleUpdateSpent(category.id, newAmount);
                            }
                          }}
                        >
                          Update
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BudgetPlanner;