import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  Shield, 
  Target, 
  Bell, 
  BookOpen,
  CheckCircle,
  Zap,
  PiggyBank,
  Calculator,
  BarChart3,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import aiAdvisorImage from '@/assets/ai-advisor.jpg';

const Features = () => {
  const mainFeatures = [
    {
      icon: Bot,
      title: 'Credit-Aware AI Chatbot',
      description: 'Get personalized financial advice based on your credit score, income, and spending patterns.',
      details: [
        'Analyzes your complete financial profile',
        'Provides context-aware recommendations',
        'Available 24/7 for instant guidance',
        'Learns from your financial behavior'
      ],
      badge: 'Core Feature'
    },
    {
      icon: DollarSign,
      title: '"Can I Buy This?" Advisor',
      description: 'Make informed purchase decisions with AI that considers your entire financial health.',
      details: [
        'Evaluates purchase against your budget',
        'Considers credit utilization impact',
        'Suggests better timing for purchases',
        'Recommends alternative options'
      ],
      badge: 'Popular'
    },
    {
      icon: Calculator,
      title: 'Smart Budget Planner',
      description: 'Automatically categorize expenses and optimize your monthly budget allocation.',
      details: [
        'AI-powered expense categorization',
        'Customizable budget categories',
        'Real-time spending alerts',
        'Monthly budget optimization'
      ],
      badge: 'Essential'
    },
    {
      icon: CreditCard,
      title: 'Debt & Subscription Manager',
      description: 'Track EMIs, credit cards, and subscriptions with smart optimization tips.',
      details: [
        'Centralized debt tracking',
        'Subscription audit and recommendations',
        'Payment reminder system',
        'Debt consolidation suggestions'
      ],
      badge: 'Money Saver'
    },
    {
      icon: TrendingUp,
      title: 'Credit Score Improvement',
      description: 'Get actionable plans to boost your credit score with clear explanations.',
      details: [
        'Personalized improvement roadmap',
        'Credit utilization optimization',
        'Payment history enhancement',
        'Credit mix recommendations'
      ],
      badge: 'Credit Booster'
    },
    {
      icon: Target,
      title: 'Goal-Based Saving',
      description: 'Set and achieve financial goals for gadgets, travel, education, and more.',
      details: [
        'Smart goal setting with timelines',
        'Automated savings recommendations',
        'Progress tracking and milestones',
        'Goal prioritization assistance'
      ],
      badge: 'Goal Oriented'
    }
  ];

  const additionalFeatures = [
    {
      icon: Zap,
      title: 'Utility Bill Optimizer',
      description: 'Get actionable tips to reduce your electricity and gas bills.',
      highlight: 'Save up to 30% on utilities'
    },
    {
      icon: BarChart3,
      title: 'Progress Dashboard',
      description: 'Visual tracking of credit improvement and debt repayment progress.',
      highlight: 'Real-time insights'
    },
    {
      icon: BookOpen,
      title: 'Financial Education',
      description: 'Bite-sized learning integrated with your financial context.',
      highlight: 'Learn as you go'
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Timely reminders for payments, goals, and financial opportunities.',
      highlight: 'Never miss a deadline'
    },
    {
      icon: Shield,
      title: 'Security First',
      description: 'Bank-level encryption and privacy protection for your data.',
      highlight: 'Your data is safe'
    },
    {
      icon: PiggyBank,
      title: 'Savings Optimizer',
      description: 'AI-powered recommendations for maximizing your savings potential.',
      highlight: 'Maximize returns'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-4 bg-primary-light text-primary">
            <Lightbulb className="w-4 h-4 mr-1" />
            Comprehensive Features
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Everything You Need for{' '}
            <span className="hero-gradient bg-clip-text text-transparent">
              Financial Success
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Our AI-powered platform provides comprehensive financial tools designed specifically 
            for young professionals in emerging markets.
          </p>
          <Button size="lg" asChild className="btn-hero">
            <Link to="/contact">
              Start Your Financial Journey
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Core Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Powerful tools that work together to transform your financial life.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {mainFeatures.map((feature, index) => (
              <Card key={index} className="feature-card animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary-light flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <Badge variant="secondary">{feature.badge}</Badge>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Additional Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Extra tools to enhance your financial management experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {additionalFeatures.map((feature, index) => (
              <Card key={index} className="feature-card animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-secondary-light flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-secondary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline" className="text-primary border-primary">
                    {feature.highlight}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It All Works Together */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                How Everything Works Together
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mt-1">
                    <span className="text-sm font-bold text-primary-foreground">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Comprehensive Analysis</h3>
                    <p className="text-muted-foreground">Our AI analyzes your complete financial profile to understand your unique situation.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center mt-1">
                    <span className="text-sm font-bold text-secondary-foreground">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Personalized Recommendations</h3>
                    <p className="text-muted-foreground">Get tailored advice that considers your goals, constraints, and preferences.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center mt-1">
                    <span className="text-sm font-bold text-accent-foreground">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Continuous Learning</h3>
                    <p className="text-muted-foreground">The system learns from your behavior and improves recommendations over time.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mt-1">
                    <span className="text-sm font-bold text-primary-foreground">4</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Real-Time Guidance</h3>
                    <p className="text-muted-foreground">Get instant advice when you need it most, whether it's a purchase decision or budget question.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="animate-scale-in">
              <img 
                src={aiAdvisorImage} 
                alt="AI Financial Advisor" 
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Experience All These Features?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join our beta program and get early access to the complete FinanceAI platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="btn-hero">
              <Link to="/contact">
                Join Beta Waitlist
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/about">
                Learn More About Us
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Features;