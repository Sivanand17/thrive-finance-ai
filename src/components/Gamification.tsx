import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Trophy, 
  Star, 
  Target, 
  Flame,
  Gift,
  Crown,
  Zap,
  CheckCircle,
  Calendar,
  TrendingUp,
  Award,
  Medal
} from 'lucide-react';

interface GamificationProps {
  financialProfile: any;
}

const Gamification = ({ financialProfile }: GamificationProps) => {
  const [showConfetti, setShowConfetti] = useState(false);

  const achievements = [
    {
      id: 1,
      title: '🎯 First Goal Crusher',
      description: 'Completed your first financial goal',
      icon: Target,
      earned: true,
      rarity: 'common',
      date: '2024-01-15'
    },
    {
      id: 2,
      title: '💰 Savings Superstar',
      description: 'Saved ₹10,000 in a single month',
      icon: Star,
      earned: true,
      rarity: 'rare',
      date: '2024-01-20'
    },
    {
      id: 3,
      title: '📅 Payment Perfectionist',
      description: '3 months of on-time payments',
      icon: CheckCircle,
      earned: true,
      rarity: 'epic',
      date: '2024-01-25'
    },
    {
      id: 4,
      title: '🔥 Budget Boss',
      description: 'Stayed within budget for 30 days',
      icon: Flame,
      earned: false,
      rarity: 'legendary',
      progress: 87
    },
    {
      id: 5,
      title: '👑 Credit King/Queen',
      description: 'Achieved credit score of 750+',
      icon: Crown,
      earned: false,
      rarity: 'legendary',
      progress: 96
    },
    {
      id: 6,
      title: '⚡ Emergency Ready',
      description: 'Built 6-month emergency fund',
      icon: Zap,
      earned: false,
      rarity: 'epic',
      progress: 65
    }
  ];

  const streaks = [
    {
      title: '📱 Daily Check-in',
      description: 'Consecutive days logging into the app',
      current: 7,
      best: 15,
      icon: Calendar,
      color: 'text-blue-600'
    },
    {
      title: '💰 Budget Tracking',
      description: 'Days staying within budget',
      current: 12,
      best: 25,
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: '🎯 Goal Progress',
      description: 'Days making progress on goals',
      current: 5,
      best: 18,
      icon: Target,
      color: 'text-purple-600'
    }
  ];

  const levelInfo = {
    current: 8,
    name: 'Financial Warrior',
    nextLevel: 'Money Master',
    xp: 1250,
    xpToNext: 1500,
    totalEarned: 3750
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100';
      case 'rare': return 'text-blue-600 bg-blue-100';
      case 'epic': return 'text-purple-600 bg-purple-100';
      case 'legendary': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleAchievementClick = (achievement: any) => {
    if (achievement.earned) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl animate-bounce">🎉</div>
          </div>
        </div>
      )}

      {/* Level Progress */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-purple-600" />
            👑 Level {levelInfo.current} - {levelInfo.name}
          </CardTitle>
          <CardDescription>
            {levelInfo.xpToNext - levelInfo.xp} XP to reach {levelInfo.nextLevel}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-2xl font-bold text-purple-600">
                  {levelInfo.xp} XP
                </p>
                <p className="text-sm text-muted-foreground">Current level</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold">
                  {levelInfo.totalEarned} XP
                </p>
                <p className="text-sm text-muted-foreground">Total earned</p>
              </div>
            </div>
            <Progress 
              value={(levelInfo.xp / levelInfo.xpToNext) * 100} 
              className="h-3" 
            />
            <div className="flex justify-between text-sm">
              <span>{levelInfo.xpToNext - levelInfo.xp} XP to next level</span>
              <span className="font-semibold">
                {((levelInfo.xp / levelInfo.xpToNext) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Streaks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-600" />
            🔥 Active Streaks
          </CardTitle>
          <CardDescription>Keep the momentum going!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {streaks.map((streak, index) => (
              <div key={index} className="text-center p-4 rounded-lg border bg-card">
                <streak.icon className={`w-8 h-8 mx-auto mb-2 ${streak.color}`} />
                <h4 className="font-semibold text-sm mb-1">{streak.title}</h4>
                <p className="text-xs text-muted-foreground mb-3">
                  {streak.description}
                </p>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-primary">
                    {streak.current}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Best: {streak.best} days
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements & Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            🏆 Achievements & Badges
          </CardTitle>
          <CardDescription>
            {achievements.filter(a => a.earned).length} of {achievements.length} earned
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all hover:scale-105 ${
                  achievement.earned 
                    ? 'bg-card border-primary/20 shadow-sm' 
                    : 'bg-muted/30 border-muted'
                }`}
                onClick={() => handleAchievementClick(achievement)}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${
                    achievement.earned ? 'bg-primary/10' : 'bg-muted'
                  }`}>
                    <achievement.icon className={`w-5 h-5 ${
                      achievement.earned ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`font-semibold text-sm ${
                        achievement.earned ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {achievement.title}
                      </h4>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${getRarityColor(achievement.rarity)}`}
                      >
                        {achievement.rarity}
                      </Badge>
                    </div>
                    <p className={`text-xs mb-2 ${
                      achievement.earned ? 'text-muted-foreground' : 'text-muted-foreground/60'
                    }`}>
                      {achievement.description}
                    </p>
                    
                    {achievement.earned ? (
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <CheckCircle className="w-3 h-3" />
                        Earned {achievement.date}
                      </div>
                    ) : achievement.progress ? (
                      <div className="space-y-1">
                        <Progress value={achievement.progress} className="h-1" />
                        <p className="text-xs text-muted-foreground">
                          {achievement.progress}% complete
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">Not earned yet</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Challenges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-pink-600" />
            🎁 Weekly Challenges
          </CardTitle>
          <CardDescription>Complete challenges to earn bonus XP</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                title: '📊 Track 5 expenses this week',
                description: 'Log at least 5 different expenses',
                progress: 60,
                reward: '100 XP',
                deadline: '3 days left'
              },
              {
                title: '💰 Save ₹2,000 this week',
                description: 'Put aside extra money for your goals',
                progress: 35,
                reward: '150 XP',
                deadline: '5 days left'
              },
              {
                title: '🎯 Update 3 financial goals',
                description: 'Review and update your goal progress',
                progress: 100,
                reward: '200 XP',
                deadline: 'Completed!'
              }
            ].map((challenge, index) => (
              <div key={index} className="p-4 rounded-lg border bg-card">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-sm">{challenge.title}</h4>
                    <p className="text-xs text-muted-foreground">{challenge.description}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="text-xs">
                      {challenge.reward}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {challenge.deadline}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <Progress value={challenge.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {challenge.progress}% complete
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Gamification;