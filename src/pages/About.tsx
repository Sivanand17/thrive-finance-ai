import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  Heart, 
  Globe, 
  Users, 
  TrendingUp, 
  Shield,
  ArrowRight,
  Sparkles,
  BookOpen,
  Lightbulb,
  Star,
  CheckCircle
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const About = () => {
  const values = [
    {
      icon: Heart,
      title: 'Empathy First',
      description: 'We understand that financial stress is real. Our AI is designed to be supportive, not judgmental.',
      color: 'text-red-500'
    },
    {
      icon: BookOpen,
      title: 'Education Over Sales',
      description: 'We believe in empowering users with knowledge rather than pushing financial products.',
      color: 'text-blue-500'
    },
    {
      icon: Globe,
      title: 'Accessible to All',
      description: 'Financial guidance should be available to everyone, regardless of their income or background.',
      color: 'text-green-500'
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'Your financial data is sacred. We use bank-level security and never share your information.',
      color: 'text-purple-500'
    }
  ];

  const stats = [
    {
      number: '10,000+',
      label: 'Beta Users',
      description: 'Early adopters trusting our platform'
    },
    {
      number: '50+',
      label: 'Avg Credit Score Improvement',
      description: 'Points improved in 3 months'
    },
    {
      number: '₹25,000',
      label: 'Average Monthly Savings',
      description: 'Helped users save per month'
    },
    {
      number: '95%',
      label: 'User Satisfaction',
      description: 'Would recommend to friends'
    }
  ];

  const team = [
    {
      name: 'The AI Team',
      role: 'Founders & Engineers',
      description: 'A passionate team of fintech experts, AI engineers, and financial advisors from top companies.',
      achievements: [
        'Former employees from Google, Microsoft, and Goldman Sachs',
        'Published research in AI and behavioral finance',
        'Advisors from RBI and leading Indian fintech companies'
      ]
    }
  ];

  const milestones = [
    {
      year: '2024',
      title: 'Beta Launch',
      description: 'Launched beta with 1,000 users across India and SEA'
    },
    {
      year: '2024',
      title: 'AI Model v2.0',
      description: 'Improved recommendation accuracy by 40%'
    },
    {
      year: '2024',
      title: 'Partnership Program',
      description: 'Collaborated with leading Indian banks and fintech companies'
    },
    {
      year: '2025',
      title: 'Public Launch',
      description: 'Full public launch planned for Q1 2025'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-primary-light text-primary">
            <Sparkles className="w-4 h-4 mr-1" />
            Our Mission
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Democratizing{' '}
            <span className="hero-gradient bg-clip-text text-transparent">
              Financial Confidence
            </span>
            {' '}with AI
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            We believe everyone deserves access to personalized financial guidance. 
            Our AI-powered platform makes expert financial advice accessible, 
            affordable, and actionable for young professionals everywhere.
          </p>
          <Button size="lg" asChild className="btn-hero">
            <Link to="/contact">
              Join Our Mission
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-destructive">
                The Problem We're Solving
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">
                    <strong>70% of young professionals</strong> in emerging markets have no access to financial advisors
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">
                    <strong>Traditional financial advice</strong> is expensive and often not personalized
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">
                    <strong>Complex financial products</strong> are confusing and intimidating
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">
                    <strong>Poor financial decisions</strong> lead to debt cycles and missed opportunities
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary">
                Our Solution
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    <strong>AI-powered personalization</strong> that understands your unique financial situation
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    <strong>Plain language explanations</strong> that make financial concepts easy to understand
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    <strong>Actionable recommendations</strong> with step-by-step guidance
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    <strong>24/7 availability</strong> whenever you need financial guidance
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              These principles guide everything we do and shape how we build our platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="feature-card animate-fade-in-up text-center" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary-light flex items-center justify-center mx-auto mb-4">
                    <value.icon className={`w-6 h-6 ${value.color}`} />
                  </div>
                  <CardTitle className="text-lg">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{value.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Impact So Far
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Real results from real users who trusted us with their financial journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-xl font-semibold mb-2">{stat.label}</div>
                <div className="text-muted-foreground">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A diverse group of experts passionate about financial empowerment.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {team.map((member, index) => (
              <Card key={index} className="feature-card animate-fade-in-up">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                      <Users className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{member.name}</CardTitle>
                      <CardDescription className="text-lg">{member.role}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{member.description}</p>
                  <ul className="space-y-2">
                    {member.achievements.map((achievement, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Key milestones in our mission to democratize financial guidance.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="text-center animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-lg font-bold text-primary-foreground">{milestone.year}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{milestone.title}</h3>
                <p className="text-muted-foreground">{milestone.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join Us in Building the Future of Finance
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Be part of a movement that's making financial guidance accessible to everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="btn-hero">
              <Link to="/contact">
                Join Beta Waitlist
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

export default About;