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
      description: 'Get personalized financial advice based on your credit score, income, and spending habits.',
      color: 'text-primary'
    },
    {
      icon: DollarSign,
      title: '"Can I Buy This?" Advisor',
      description: 'Make informed purchase decisions with AI that considers your financial health.',
      color: 'text-secondary'
    },
    {
      icon: TrendingUp,
      title: 'Smart Budget Planner',
      description: 'Automatically categorize expenses and optimize your monthly budget allocation.',
      color: 'text-accent'
    },
    {
      icon: CreditCard,
      title: 'Debt & Subscription Manager',
      description: 'Track EMIs, credit cards, and subscriptions with smart optimization tips.',
      color: 'text-primary'
    },
    {
      icon: Shield,
      title: 'Credit Score Improvement',
      description: 'Get actionable plans to boost your credit score with clear explanations.',
      color: 'text-secondary'
    },
    {
      icon: Target,
      title: 'Goal-Based Saving',
      description: 'Set and achieve financial goals for gadgets, travel, education, and more.',
      color: 'text-accent'
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
      title: 'Share Your Financial Info',
      description: 'Securely input your credit score, income, expenses, and financial goals.'
    },
    {
      step: '02',
      title: 'Get AI-Powered Insights',
      description: 'Our AI analyzes your data and provides personalized recommendations.'
    },
    {
      step: '03',
      title: 'Take Action & Track Progress',
      description: 'Follow actionable advice and watch your financial health improve.'
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
                Your AI-Powered{' '}
                <span className="hero-gradient bg-clip-text text-transparent">
                  Financial Advisor
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
                Get personalized, explainable financial guidance that helps you improve your credit score, 
                manage budgets, and make smarter purchase decisions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button size="lg" asChild className="btn-hero">
                  <Link to="/auth">
                    Start Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/features">
                    Check If You Can Afford It
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
              Powerful Features for Your Financial Success
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our AI-powered platform provides comprehensive financial guidance tailored to your unique situation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="feature-card animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-primary-light flex items-center justify-center mb-4`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
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
              How FinanceAI Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Get started with personalized financial guidance in just three simple steps.
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
                Why Choose FinanceAI?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mt-1">
                    <CheckCircle className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Personalized for You</h3>
                    <p className="text-muted-foreground">Every recommendation is tailored to your specific financial situation and goals.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center mt-1">
                    <BookOpen className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Easy to Understand</h3>
                    <p className="text-muted-foreground">Complex financial concepts explained in simple, actionable terms.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center mt-1">
                    <Shield className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Secure & Private</h3>
                    <p className="text-muted-foreground">Your financial data is encrypted and never shared with third parties.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mt-1">
                    <TrendingUp className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Proven Results</h3>
                    <p className="text-muted-foreground">Users see average credit score improvements of 50+ points within 3 months.</p>
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
            Ready to Transform Your Financial Future?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join our beta program and get early access to personalized AI financial guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="btn-hero">
              <Link to="/auth">
                Start Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/features">
                Explore Features
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