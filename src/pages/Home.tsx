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
  Users,
  Star,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import heroImage from '@/assets/hero-image.jpg';
import aiAdvisorImage from '@/assets/ai-advisor.jpg';
import dashboardImage from '@/assets/dashboard.jpg';

const Home = () => {
  const features = [
    {
      icon: Bot,
      title: 'Credit-Aware AI Chatbot',
      description: 'Ask me if you can afford your next purchase, and I\'ll consider your credit score, income, and debts. Get instant answers to questions like "Should I buy this laptop?" or "How will this purchase affect my credit?"',
      microcopy: 'Try asking: "Can I afford a ₹50,000 laptop?"',
      cta: 'Chat with AI Now',
      color: 'text-primary',
      examples: ['Can I afford this iPhone?', 'Should I take this personal loan?', 'How to improve my credit score?']
    },
    {
      icon: DollarSign,
      title: '"Can I Buy This?" Purchase Advisor',
      description: 'Make smart purchase decisions with real-time affordability analysis. Our AI considers your entire financial picture before you swipe.',
      microcopy: 'Example: "₹30K gaming console vs saving for emergency fund"',
      cta: 'Check Affordability',
      color: 'text-secondary',
      examples: ['₹25K smartphone upgrade', '₹1L vacation to Europe', '₹15K course investment']
    },
    {
      icon: TrendingUp,
      title: 'Smart Budget Planner',
      description: 'Automatically categorize your spending and get personalized budget recommendations. Track where your money goes and stick to your financial plan with smart alerts.',
      microcopy: 'Set budgets for food, entertainment, and savings goals',
      cta: 'Create Budget Plan',
      color: 'text-accent',
      examples: ['Food & Dining: ₹8K/month', 'Entertainment: ₹3K/month', 'Emergency Fund: ₹5K/month']
    },
    {
      icon: CreditCard,
      title: 'Debt & Subscription Manager',
      description: 'Avoid late fees, clear debts faster, and remove unwanted subscriptions. Track all your EMIs, credit cards, and recurring payments in one place.',
      microcopy: 'Never miss a payment, save on unnecessary subscriptions',
      cta: 'Manage Debts',
      color: 'text-primary',
      examples: ['Credit Card: ₹25K due 15th', 'Netflix: ₹649/month', 'Home Loan EMI: ₹18K/month']
    },
    {
      icon: Target,
      title: 'Financial Goal Tracker',
      description: 'Your dream laptop, vacation, or emergency fund - fully planned and tracked. Set realistic timelines and get motivation to achieve your financial dreams.',
      microcopy: 'Turn dreams into achievable financial milestones',
      cta: 'Set Your Goals',
      color: 'text-secondary',
      examples: ['MacBook Pro in 8 months', 'Emergency fund in 1 year', 'Europe trip in 18 months']
    },
    {
      icon: Bell,
      title: 'Utility Bill Optimizer',
      description: 'Discover how to save on electricity, gas, and other utility bills. Get personalized tips to reduce your monthly expenses without sacrificing comfort.',
      microcopy: 'Save ₹500-2000 monthly on utilities with smart tips',
      cta: 'Optimize Bills',
      color: 'text-accent',
      examples: ['Switch to LED bulbs', 'Optimize AC usage', 'Choose better electricity plan']
    }
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Software Engineer',
      content: 'FinanceAI helped me improve my credit score by 80 points in just 3 months!',
      rating: 5
    },
    {
      name: 'Raj Patel',
      role: 'Marketing Professional',
      content: 'The "Can I Buy This?" feature saved me from overspending on unnecessary gadgets.',
      rating: 5
    },
    {
      name: 'Ananya Singh',
      role: 'Design Lead',
      content: 'Finally, a financial app that explains everything in simple terms I can understand.',
      rating: 5
    }
  ];

  const steps = [
    {
      step: '01',
      title: 'Quick Financial Setup',
      description: 'Share your credit score, monthly income, and major expenses. Takes 2 minutes, keeps you secure.'
    },
    {
      step: '02',
      title: 'AI Analyzes Your Situation',
      description: 'Our AI instantly creates your personalized financial profile and spending analysis.'
    },
    {
      step: '03',
      title: 'Make Confident Decisions',
      description: 'Ask "Can I buy this?" and get instant, personalized advice. Track progress with motivational updates.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <Badge className="mb-4 bg-primary-light text-primary">
                <Sparkles className="w-4 h-4 mr-1" />
                Beta Launch
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Make Every Rupee{' '}
                <span className="hero-gradient bg-clip-text text-transparent">
                  Count Smarter
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
                Your personal AI financial advisor that analyzes your credit score, income, and spending to help you make confident money decisions. No more financial guesswork.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button size="lg" asChild className="btn-hero">
                  <Link to="/auth">
                    Start Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/auth">
                    Try "Can I Buy This?" →
                  </Link>
                </Button>
              </div>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span>Free Beta Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>Secure & Private</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span>Trusted by 1000+ Users</span>
                </div>
              </div>
            </div>
            <div className="animate-scale-in">
              <img 
                src={heroImage} 
                alt="Financial AI Dashboard" 
                className="rounded-2xl shadow-2xl w-full animate-float"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Your Complete Financial Command Center
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to take control of your money, understand your financial health, and make smarter decisions - all powered by AI.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="feature-card animate-fade-in-up hover:shadow-lg transition-shadow" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-primary-light flex items-center justify-center mb-4`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                  <p className="text-sm text-muted-foreground font-medium">{feature.microcopy}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                  
                  {feature.examples && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground">Try these examples:</p>
                      <div className="space-y-1">
                        {feature.examples.map((example, i) => (
                          <div key={i} className="text-xs bg-muted p-2 rounded text-muted-foreground">
                            {example}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <Button size="sm" variant="outline" className="w-full mt-4" asChild>
                    <Link to="/auth">{feature.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              From Confused to Confident in 3 Steps
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Transform your financial decision-making with our AI advisor. Setup takes just 2 minutes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center animate-fade-in-up" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-primary-foreground">{step.step}</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 transform translate-x-8 w-24 h-0.5 bg-border"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Why 1000+ Users Trust FinanceAI
            </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mt-1">
                    <CheckCircle className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">AI That Knows Your Money</h3>
                    <p className="text-muted-foreground">Every recommendation considers your credit score, income, debts, and goals. No generic advice here.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center mt-1">
                    <BookOpen className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Plain English Explanations</h3>
                    <p className="text-muted-foreground">No confusing financial jargon. Get clear, actionable advice you can actually understand and follow.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center mt-1">
                    <Shield className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Bank-Level Security</h3>
                    <p className="text-muted-foreground">Your financial data is encrypted and never shared. We protect your privacy like your bank does.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mt-1">
                    <TrendingUp className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Real Progress Tracking</h3>
                    <p className="text-muted-foreground">Watch your credit score improve, debts decrease, and savings grow with motivational progress updates.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="animate-scale-in">
              <img 
                src={dashboardImage} 
                alt="Financial Dashboard" 
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join thousands of users who have transformed their financial lives with FinanceAI.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="feature-card animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <CardDescription className="text-base italic">
                    "{testimonial.content}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Stop Guessing. Start Knowing.
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join 1000+ users making smarter money decisions with AI guidance. Your financial confidence starts today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="btn-hero">
              <Link to="/auth">
                Start Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/auth">
                See Live Demo
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;