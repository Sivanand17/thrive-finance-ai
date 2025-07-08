import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle, 
  ArrowRight, 
  Users, 
  Sparkles,
  Calendar,
  Clock,
  Gift,
  Star
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    occupation: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Welcome to the Beta!",
        description: "We'll send you early access details soon.",
      });
      setIsSubmitting(false);
      setFormData({ name: '', email: '', phone: '', occupation: '', message: '' });
    }, 1000);
  };

  const benefits = [
    {
      icon: Gift,
      title: 'Free Beta Access',
      description: 'Get full access to all features at no cost during beta period'
    },
    {
      icon: Calendar,
      title: 'Priority Support',
      description: 'Direct access to our team for questions and feedback'
    },
    {
      icon: Star,
      title: 'Lifetime Discount',
      description: '50% off when we launch premium features'
    },
    {
      icon: Users,
      title: 'Community Access',
      description: 'Join our exclusive beta user community'
    }
  ];

  const faqs = [
    {
      question: 'When will I get access?',
      answer: 'Beta invites are sent out weekly. Early joiners get priority access.'
    },
    {
      question: 'Is the beta really free?',
      answer: 'Yes! All features are completely free during the beta period.'
    },
    {
      question: 'What data do I need to provide?',
      answer: 'Just basic info like credit score, income, and expenses. All data is encrypted.'
    },
    {
      question: 'Will my data be safe?',
      answer: 'Absolutely. We use bank-level encryption and never share your data.'
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
            Beta Waitlist
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Join the{' '}
            <span className="hero-gradient bg-clip-text text-transparent">
              Beta Waitlist
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Be among the first to experience AI-powered financial guidance. 
            Get early access to all features and help shape the future of personal finance.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>Free Beta Access</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span>Weekly Invites</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <span>1,000+ Already Joined</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Beta Signup Form */}
            <div>
              <Card className="feature-card">
                <CardHeader>
                  <CardTitle className="text-2xl">Join Beta Waitlist</CardTitle>
                  <CardDescription>
                    Fill out the form below to get early access to FinanceAI
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Enter your phone number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="occupation">Occupation</Label>
                        <Input
                          id="occupation"
                          name="occupation"
                          type="text"
                          value={formData.occupation}
                          onChange={handleInputChange}
                          placeholder="e.g., Software Engineer"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message">
                        What financial challenges are you facing? (Optional)
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell us about your financial goals or challenges..."
                        rows={4}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full btn-hero" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Joining...' : 'Join Beta Waitlist'}
                      <Send className="w-5 h-5 ml-2" />
                    </Button>
                    
                    <p className="text-sm text-muted-foreground text-center">
                      By joining, you agree to our{' '}
                      <a href="#" className="text-primary hover:underline">Terms of Service</a>
                      {' '}and{' '}
                      <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Beta Benefits */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Beta Program Benefits</h2>
              <div className="space-y-4 mb-8">
                {benefits.map((benefit, index) => (
                  <Card key={index} className="feature-card">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center flex-shrink-0">
                          <benefit.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">{benefit.title}</h3>
                          <p className="text-sm text-muted-foreground">{benefit.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Contact Info */}
              <Card className="feature-card">
                <CardHeader>
                  <CardTitle className="text-xl">Get in Touch</CardTitle>
                  <CardDescription>
                    Have questions? We'd love to hear from you.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-light rounded-lg flex items-center justify-center">
                      <Mail className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">hello@financeai.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-secondary-light rounded-lg flex items-center justify-center">
                      <Phone className="w-4 h-4 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Support</p>
                      <p className="font-medium">+91 9876543210</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-accent-light rounded-lg flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium">Bangalore, India</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about our beta program.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <Card key={index} className="feature-card">
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
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
            Don't wait - join thousands of others who are already improving their financial health.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="btn-hero">
              <Link to="#" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                Join Beta Waitlist
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/features">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;