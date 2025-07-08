import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  CreditCard, 
  Plus, 
  Calendar, 
  AlertTriangle,
  CheckCircle,
  Trash2,
  Bell
} from 'lucide-react';

interface DebtManagerProps {
  userId?: string;
}

interface DebtSubscription {
  id: string;
  name: string;
  type: string;
  amount: number;
  due_date: string;
  frequency: string;
  status: string;
}

const DebtManager = ({ userId }: DebtManagerProps) => {
  const [debtsSubscriptions, setDebtsSubscriptions] = useState<DebtSubscription[]>([]);
  const [newItem, setNewItem] = useState({
    name: '',
    type: 'subscription',
    amount: '',
    due_date: '',
    frequency: 'monthly'
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loadDebtsSubscriptions = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('debts_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .order('due_date');

      if (error) throw error;
      setDebtsSubscriptions(data || []);
    } catch (error: any) {
      console.error('Error loading debts and subscriptions:', error);
    }
  };

  useEffect(() => {
    loadDebtsSubscriptions();
  }, [userId]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name.trim() || !newItem.amount || !userId) return;

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('debts_subscriptions')
        .insert({
          user_id: userId,
          name: newItem.name.trim(),
          type: newItem.type,
          amount: parseFloat(newItem.amount),
          due_date: newItem.due_date || null,
          frequency: newItem.frequency,
          status: 'active'
        });

      if (error) throw error;

      setNewItem({
        name: '',
        type: 'subscription',
        amount: '',
        due_date: '',
        frequency: 'monthly'
      });
      await loadDebtsSubscriptions();

      toast({
        title: "Item added",
        description: `${newItem.name} has been added to your list.`,
      });
    } catch (error: any) {
      toast({
        title: "Error adding item",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('debts_subscriptions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await loadDebtsSubscriptions();

      toast({
        title: "Item deleted",
        description: "The item has been removed from your list.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting item",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleMarkPaid = async (id: string) => {
    try {
      const { error } = await supabase
        .from('debts_subscriptions')
        .update({ status: 'paid' })
        .eq('id', id);

      if (error) throw error;

      await loadDebtsSubscriptions();

      toast({
        title: "Marked as paid",
        description: "Payment has been recorded.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'active': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'debt': return 'bg-red-100 text-red-800';
      case 'emi': return 'bg-orange-100 text-orange-800';
      case 'subscription': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    if (!dueDate) return null;
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const activeItems = debtsSubscriptions.filter(item => item.status === 'active');
  const paidItems = debtsSubscriptions.filter(item => item.status === 'paid');
  const totalMonthlyAmount = activeItems.reduce((sum, item) => {
    if (item.frequency === 'monthly') return sum + item.amount;
    if (item.frequency === 'yearly') return sum + (item.amount / 12);
    if (item.frequency === 'weekly') return sum + (item.amount * 4);
    return sum;
  }, 0);

  // Get upcoming payments (next 7 days)
  const upcomingPayments = activeItems.filter(item => {
    if (!item.due_date) return false;
    const daysUntilDue = getDaysUntilDue(item.due_date);
    return daysUntilDue !== null && daysUntilDue >= 0 && daysUntilDue <= 7;
  });

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Obligations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ₹{totalMonthlyAmount.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {activeItems.length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {upcomingPayments.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Payments Alert */}
      {upcomingPayments.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <Bell className="w-5 h-5" />
              Upcoming Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {upcomingPayments.map((item) => {
                const daysUntilDue = getDaysUntilDue(item.due_date);
                return (
                  <div key={item.id} className="flex items-center justify-between">
                    <span className="font-medium">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">₹{item.amount.toLocaleString()}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {daysUntilDue === 0 ? 'Due today' : `Due in ${daysUntilDue} day${daysUntilDue > 1 ? 's' : ''}`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add New Item */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            Debt & Subscription Manager
          </CardTitle>
          <CardDescription>
            Track your debts, EMIs, and subscriptions in one place
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddItem} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newItem.name}
                  onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Credit Card, Netflix, Car EMI"
                  required
                />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Select 
                  value={newItem.type} 
                  onValueChange={(value) => setNewItem(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="debt">Debt</SelectItem>
                    <SelectItem value="emi">EMI</SelectItem>
                    <SelectItem value="subscription">Subscription</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  min="1"
                  value={newItem.amount}
                  onChange={(e) => setNewItem(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="e.g., 5000"
                  required
                />
              </div>
              <div>
                <Label htmlFor="frequency">Frequency</Label>
                <Select 
                  value={newItem.frequency} 
                  onValueChange={(value) => setNewItem(prev => ({ ...prev, frequency: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="due_date">Next Due Date (Optional)</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={newItem.due_date}
                  onChange={(e) => setNewItem(prev => ({ ...prev, due_date: e.target.value }))}
                />
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Active Items */}
      {activeItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Active Debts & Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeItems.map((item) => {
                const daysUntilDue = item.due_date ? getDaysUntilDue(item.due_date) : null;
                
                return (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(item.status)}
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getTypeColor(item.type)}>
                            {item.type.toUpperCase()}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            ₹{item.amount.toLocaleString()} / {item.frequency}
                          </span>
                          {item.due_date && (
                            <span className="text-sm text-muted-foreground">
                              <Calendar className="w-3 h-3 inline mr-1" />
                              {daysUntilDue !== null && daysUntilDue >= 0 
                                ? `Due in ${daysUntilDue} day${daysUntilDue > 1 ? 's' : ''}`
                                : 'Overdue'
                              }
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkPaid(item.id)}
                      >
                        Mark Paid
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recently Paid Items */}
      {paidItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recently Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {paidItems.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <Badge variant="secondary">₹{item.amount.toLocaleString()}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DebtManager;