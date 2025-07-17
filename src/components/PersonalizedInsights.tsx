import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Target, 
  AlertCircle, 
  CheckCircle, 
  Lightbulb,
  Zap,
  Trophy,
  Calendar,
  ArrowRight,
  Bell
} from 'lucide-react';

interface PersonalizedInsightsProps {
  financialProfile: any;
}

const PersonalizedInsights = ({ financialProfile }: PersonalizedInsightsProps) => {
  const savingsRate = ((financialProfile.monthly_income - financialProfile.monthly_expenses) / financialProfile.monthly_income) * 100;
  const emergencyFundGoal = financialProfile.monthly_expenses * 6;
  const emergencyFundProgress = (financialProfile.savings_balance / emergencyFundGoal) * 100;
  const creditUtilization = (financialProfile.debt_amount / (financialProfile.credit_score * 100)) * 100;

  const insights = [
    {
      type: 'success',
      icon: CheckCircle,
      title: '🎉 Great Savings Rate!',
      description: `You're saving ${savingsRate.toFixed(1)}% of your income - that's excellent!`,
      action: 'Keep it up!'
    },
    {
      type: 'warning',
      icon: AlertCircle,
      title: '⚡ Emergency Fund Alert',
      description: `You're ${emergencyFundProgress.toFixed(0)}% to your 6-month emergency fund goal!`,
      action: `₹${(emergencyFundGoal - financialProfile.savings_balance).toLocaleString()} to go`
    },
    {
      type: 'info',
      icon: TrendingUp,
      title: '📈 Credit Score Opportunity',
      description: 'Your credit score is good! You could reach "Excellent" with some optimization.',
      action: 'View tips'
    }
  ];

  const notifications = [
    {
      type: 'reminder',
      icon: Calendar,
      title: '📅 Bill Due Tomorrow',
      message: 'Credit card payment of ₹12,500 is due tomorrow',
      priority: 'high'
    },
    {
      type: 'tip',
      icon: Lightbulb,
      title: '💡 Smart Tip',
      message: 'You can save ₹2,400/month by optimizing subscriptions',
      priority: 'medium'
    },
    {
      type: 'achievement',
      icon: Trophy,
      title: '🏆 Streak Achievement!',
      message: '7 days of staying within budget - well done!',
      priority: 'low'
    }
  ];

  const nextSteps = [
    {
      title: '🎯 Increase Emergency Fund',
      description: 'Save ₹5,000 more this month',
      progress: 65,
      action: 'Auto-save setup'
    },
    {
      title: '💳 Optimize Credit Usage',
      description: 'Reduce utilization to under 30%',
      progress: 40,
      action: 'Payment plan'
    },
    {
      title: '📱 Cancel Unused Subscriptions',
      description: '3 subscriptions identified for review',
      progress: 0,
      action: 'Review now'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header with Personalized Greeting */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary" />
            Good morning! 🌅
          </CardTitle>
          <CardDescription className="text-lg">
            You're on track to save ₹{((financialProfile.monthly_income - financialProfile.monthly_expenses) * 12).toLocaleString()} this year!
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Smart Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            🔔 Smart Notifications
          </CardTitle>
          <CardDescription>Important updates and reminders</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {notifications.map((notification, index) => (
            <div key={index} className={`flex items-start gap-3 p-3 rounded-lg border ${
              notification.priority === 'high' ? 'border-red-200 bg-red-50' :
              notification.priority === 'medium' ? 'border-yellow-200 bg-yellow-50' :
              'border-green-200 bg-green-50'
            }`}>
              <notification.icon className={`w-5 h-5 mt-0.5 ${
                notification.priority === 'high' ? 'text-red-600' :
                notification.priority === 'medium' ? 'text-yellow-600' :
                'text-green-600'
              }`} />
              <div className="flex-1">
                <h4 className="font-semibold text-sm">{notification.title}</h4>
                <p className="text-sm text-muted-foreground">{notification.message}</p>
              </div>
              <Button size="sm" variant="ghost">
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Personalized Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            💡 Personalized Insights
          </CardTitle>
          <CardDescription>AI-powered tips based on your financial behavior</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.map((insight, index) => (
            <div key={index} className="flex items-start gap-3 p-4 rounded-lg border bg-card">
              <insight.icon className={`w-5 h-5 mt-0.5 ${
                insight.type === 'success' ? 'text-green-600' :
                insight.type === 'warning' ? 'text-yellow-600' :
                'text-blue-600'
              }`} />
              <div className="flex-1">
                <h4 className="font-semibold text-sm mb-1">{insight.title}</h4>
                <p className="text-sm text-muted-foreground mb-2">{insight.description}</p>
                <Badge variant="secondary" className="text-xs">
                  {insight.action}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Weekly AI Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            🎯 Weekly AI Next Steps
          </CardTitle>
          <CardDescription>Actionable recommendations to improve your finances</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {nextSteps.map((step, index) => (
            <div key={index} className="space-y-3 p-4 rounded-lg border bg-card">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm">{step.title}</h4>
                <Button size="sm" variant="outline">
                  {step.action}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">{step.description}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Progress</span>
                  <span>{step.progress}%</span>
                </div>
                <Progress value={step.progress} className="h-2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Emergency Fund Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            🚨 Emergency Fund Goal
          </CardTitle>
          <CardDescription>
            You're {emergencyFundProgress.toFixed(0)}% to your 6-month emergency fund goal!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-2xl font-bold text-green-600">
                  ₹{financialProfile.savings_balance.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Current savings</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold">
                  ₹{emergencyFundGoal.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Goal amount</p>
              </div>
            </div>
            <Progress value={emergencyFundProgress} className="h-3" />
            <div className="flex justify-between text-sm">
              <span>₹{(emergencyFundGoal - financialProfile.savings_balance).toLocaleString()} to go</span>
              <span className="font-semibold">{emergencyFundProgress.toFixed(1)}% complete</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalizedInsights;