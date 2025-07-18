import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Target, 
  Plus, 
  Edit, 
  Trash2, 
  TrendingUp,
  Smartphone,
  GraduationCap,
  Plane,
  Shield,
  Car,
  Home,
} from "lucide-react";
import { differenceInMonths, differenceInDays } from "date-fns";
import { formatAIContent } from "./ai-format";

interface GoalTrackerProps {
  userId?: string;
}

interface FinancialGoal {
  id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
  category: string;
  status: string;
  created_at?: string; // Added for expected percentage calculation
}

const GoalTracker = ({ userId }: GoalTrackerProps) => {
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [newGoal, setNewGoal] = useState({
    title: "",
    target_amount: "",
    target_date: "",
    category: "gadgets",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loadGoals = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from("financial_goals")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (error: any) {
      console.error("Error loading goals:", error);
    }
  };

  useEffect(() => {
    loadGoals();
  }, [userId]);

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.title.trim() || !newGoal.target_amount || !userId) return;

    setIsLoading(true);

    try {
      const { error } = await supabase.from("financial_goals").insert({
          user_id: userId,
          title: newGoal.title.trim(),
          target_amount: parseFloat(newGoal.target_amount),
          target_date: newGoal.target_date || null,
          category: newGoal.category,
        status: "active",
        });

      if (error) throw error;

      setNewGoal({
        title: "",
        target_amount: "",
        target_date: "",
        category: "gadgets",
      });
      await loadGoals();

      toast({
        title: "Goal added",
        description: `${newGoal.title} has been added to your goals.`,
      });
    } catch (error: any) {
      toast({
        title: "Error adding goal",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProgress = async (id: string, newAmount: number) => {
    try {
      const goal = goals.find((g) => g.id === id);
      if (!goal) return;

      const status = newAmount >= goal.target_amount ? "completed" : "active";

      const { error } = await supabase
        .from("financial_goals")
        .update({ 
          current_amount: newAmount,
          status: status,
        })
        .eq("id", id);

      if (error) throw error;

      await loadGoals();
      setEditingId(null);

      if (status === "completed") {
        toast({
          title: "🎉 Goal completed!",
          description: `Congratulations! You've reached your goal for ${goal.title}!`,
        });
      } else {
        toast({
          title: "Progress updated",
          description: "Your savings progress has been recorded.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error updating progress",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteGoal = async (id: string) => {
    try {
      const { error } = await supabase
        .from("financial_goals")
        .delete()
        .eq("id", id);

      if (error) throw error;

      await loadGoals();

      toast({
        title: "Goal deleted",
        description: "The goal has been removed from your list.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting goal",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "gadgets":
        return <Smartphone className="w-4 h-4" />;
      case "education":
        return <GraduationCap className="w-4 h-4" />;
      case "travel":
        return <Plane className="w-4 h-4" />;
      case "emergency":
        return <Shield className="w-4 h-4" />;
      case "vehicle":
        return <Car className="w-4 h-4" />;
      case "home":
        return <Home className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "gadgets":
        return "bg-blue-100 text-blue-800";
      case "education":
        return "bg-purple-100 text-purple-800";
      case "travel":
        return "bg-green-100 text-green-800";
      case "emergency":
        return "bg-red-100 text-red-800";
      case "vehicle":
        return "bg-orange-100 text-orange-800";
      case "home":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTimeToGoal = (targetDate: string) => {
    if (!targetDate) return null;
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Overdue";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day";
    if (diffDays <= 30) return `${diffDays} days`;
    
    const diffMonths = Math.floor(diffDays / 30);
    return `${diffMonths} month${diffMonths > 1 ? "s" : ""}`;
  };

  const getExpectedPercentage = (goal: FinancialGoal) => {
    if (!goal.target_date || !goal.current_amount) return null;
    const created = new Date(goal.created_at ?? goal.target_date);
    const target = new Date(goal.target_date);
    const totalDuration = Math.max(differenceInDays(target, created), 1);
    const elapsed = Math.max(differenceInDays(new Date(), created), 0);
    const expectedPct = Math.min((elapsed / totalDuration) * 100, 100);
    return expectedPct;
  };

  const getMonthlySavingSuggestion = (goal: FinancialGoal) => {
    if (!goal.target_date) return null;
    const remaining = goal.target_amount - (goal.current_amount || 0);
    if (remaining <= 0) return 0;
    const monthsLeft = Math.max(
      differenceInMonths(new Date(goal.target_date), new Date()),
      1
    );
    return Math.ceil(remaining / monthsLeft);
  };

  const activeGoals = goals.filter((goal) => goal.status === "active");
  const completedGoals = goals.filter((goal) => goal.status === "completed");
  const totalTarget = activeGoals.reduce(
    (sum, goal) => sum + goal.target_amount,
    0
  );
  const totalSaved = activeGoals.reduce(
    (sum, goal) => sum + goal.current_amount,
    0
  );

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Target</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ₹{totalTarget.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Saved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ₹{totalSaved.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Goals Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {completedGoals.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add New Goal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Financial Goal Tracker
          </CardTitle>
          <CardDescription>
            Set and track your financial goals to stay motivated
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddGoal} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Goal Title</Label>
                <Input
                  id="title"
                  value={newGoal.title}
                  onChange={(e) =>
                    setNewGoal((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="e.g., New iPhone, Emergency Fund"
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={newGoal.category} 
                  onValueChange={(value) =>
                    setNewGoal((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gadgets">Gadgets</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="travel">Travel</SelectItem>
                    <SelectItem value="emergency">Emergency Fund</SelectItem>
                    <SelectItem value="vehicle">Vehicle</SelectItem>
                    <SelectItem value="home">Home</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="target_amount">Target Amount (₹)</Label>
                <Input
                  id="target_amount"
                  type="number"
                  min="1"
                  value={newGoal.target_amount}
                  onChange={(e) =>
                    setNewGoal((prev) => ({
                      ...prev,
                      target_amount: e.target.value,
                    }))
                  }
                  placeholder="e.g., 80000"
                  required
                />
              </div>
              <div>
                <Label htmlFor="target_date">Target Date (Optional)</Label>
                <Input
                  id="target_date"
                  type="date"
                  value={newGoal.target_date}
                  onChange={(e) =>
                    setNewGoal((prev) => ({
                      ...prev,
                      target_date: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Goal
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Active Goals</CardTitle>
            <CardDescription>
              Track your progress towards your financial goals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {activeGoals.map((goal) => {
                const percentage = Math.min(
                  (goal.current_amount / goal.target_amount) * 100,
                  100
                );
                const remaining = goal.target_amount - goal.current_amount;
                const timeToGoal = goal.target_date
                  ? getTimeToGoal(goal.target_date)
                  : null;
                
                return (
                  <div key={goal.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${getCategoryColor(
                            goal.category
                          )}`}
                        >
                          {getCategoryIcon(goal.category)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">
                            {goal.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getCategoryColor(goal.category)}>
                              {goal.category.toUpperCase()}
                            </Badge>
                            {timeToGoal && (
                              <span className="text-sm text-muted-foreground">
                                Target: {timeToGoal}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setEditingId(editingId === goal.id ? null : goal.id)
                          }
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteGoal(goal.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>
                          ₹{goal.current_amount.toLocaleString()} saved
                        </span>
                        <span>
                          ₹{goal.target_amount.toLocaleString()} target
                        </span>
                      </div>
                      <Progress value={percentage} className="h-3" />
                      {getExpectedPercentage(goal) !== null && (
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>
                            Expected {getExpectedPercentage(goal)!.toFixed(1)}%
                            by now
                          </span>
                          <span>
                            {percentage >= getExpectedPercentage(goal)!
                              ? "On track"
                              : "Behind"}
                          </span>
                        </div>
                      )}
                      {getMonthlySavingSuggestion(goal) !== null && (
                        <div className="text-xs text-blue-700 mt-1">
                          Save about ₹
                          {getMonthlySavingSuggestion(goal)!.toLocaleString()}{" "}
                          per month to hit this goal on time.
                        </div>
                      )}
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{percentage.toFixed(1)}% complete</span>
                        <span>₹{remaining.toLocaleString()} remaining</span>
                      </div>
                    </div>

                    {editingId === goal.id && (
                      <div className="mt-4 flex gap-2">
                        <Input
                          type="number"
                          min="0"
                          max={goal.target_amount}
                          step="0.01"
                          placeholder={`Add savings (current: ₹${goal.current_amount})`}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              const additionalAmount = parseFloat(
                                (e.target as HTMLInputElement).value
                              );
                              if (!isNaN(additionalAmount)) {
                                handleUpdateProgress(
                                  goal.id,
                                  goal.current_amount + additionalAmount
                                );
                              }
                            }
                          }}
                        />
                        <Button
                          size="sm"
                          onClick={(e) => {
                            const input = e.currentTarget
                              .previousElementSibling as HTMLInputElement;
                            const additionalAmount = parseFloat(input.value);
                            if (!isNaN(additionalAmount)) {
                              handleUpdateProgress(
                                goal.id,
                                goal.current_amount + additionalAmount
                              );
                            }
                          }}
                        >
                          Add
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

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Completed Goals
            </CardTitle>
            <CardDescription>
              Celebrate your financial achievements!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completedGoals.map((goal) => (
                <div
                  key={goal.id}
                  className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${getCategoryColor(
                        goal.category
                      )}`}
                    >
                      {getCategoryIcon(goal.category)}
                    </div>
                    <div>
                      <h4 className="font-medium">{goal.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        Completed • ₹{goal.target_amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800"
                  >
                    ✓ Achieved
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GoalTracker;
