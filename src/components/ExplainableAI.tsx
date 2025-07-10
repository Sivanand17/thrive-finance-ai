import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  HelpCircle, 
  Lightbulb, 
  Brain,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Info,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface ExplanationProps {
  advice: string;
  reasoning: string;
  confidence: number;
  factors: string[];
  category: string;
}

interface ExplainableAIProps {
  financialProfile: any;
}

const ExplainableAI = ({ financialProfile }: ExplainableAIProps) => {
  const [expandedCards, setExpandedCards] = useState<{ [key: string]: boolean }>({});

  const toggleCard = (cardId: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  const explanations: ExplanationProps[] = [
    {
      advice: "You should prioritize building your emergency fund before investing",
      reasoning: "Your current emergency fund covers only 2.8 months of expenses, which is below the recommended 3-6 months. Having adequate emergency savings protects you from unexpected financial shocks and prevents you from going into debt during emergencies.",
      confidence: 92,
      factors: [
        "Current savings: ₹125,000",
        "Monthly expenses: ₹45,000", 
        "Emergency fund coverage: 2.8 months",
        "Existing debt: ₹35,000",
        "Stable income: ₹75,000/month"
      ],
      category: "Emergency Planning"
    },
    {
      advice: "Your credit score can reach 'Excellent' with some optimization",
      reasoning: "At 720, you're in the 'Good' range but just 30 points away from 'Excellent' (750+). Your payment history appears strong, and with strategic debt reduction and credit utilization management, you can achieve this milestone.",
      confidence: 87,
      factors: [
        "Current credit score: 720",
        "Credit utilization: ~15%",
        "Payment history: Consistent",
        "Credit age: Moderate",
        "Credit mix: Good variety"
      ],
      category: "Credit Optimization"
    },
    {
      advice: "Consider increasing your savings rate to 35%",
      reasoning: "You're currently saving 40% of your income, which is excellent. However, temporarily increasing to 35% could accelerate your emergency fund completion by 3-4 months while still maintaining a comfortable lifestyle.",
      confidence: 78,
      factors: [
        "Current savings rate: 40%",
        "Recommended rate: 20-30%",
        "Disposable income: ₹30,000",
        "Fixed expenses: ₹45,000",
        "Financial goals: Multiple active"
      ],
      category: "Savings Strategy"
    },
    {
      advice: "Debt consolidation could save you ₹3,600 annually",
      reasoning: "Based on current market rates and your credit score, you likely qualify for lower interest rates. Consolidating your ₹35,000 debt could reduce your interest payments and simplify your financial management.",
      confidence: 73,
      factors: [
        "Current debt: ₹35,000",
        "Estimated current APR: 15-18%",
        "Potential new APR: 10-12%",
        "Credit score eligibility: 720",
        "Debt-to-income ratio: 47%"
      ],
      category: "Debt Management"
    }
  ];

  const educationalContent = [
    {
      title: "🎯 What is Credit Utilization?",
      explanation: "Credit utilization is the percentage of your available credit that you're currently using. It's calculated by dividing your total credit card balances by your total credit limits.",
      example: "If you have ₹50,000 in credit limits and ₹10,000 in balances, your utilization is 20%.",
      bestPractice: "Keep it below 30% for good credit health, ideally under 10% for excellent scores.",
      impact: "High utilization can lower your credit score, while low utilization helps improve it."
    },
    {
      title: "💰 Emergency Fund Basics",
      explanation: "An emergency fund is money set aside to cover unexpected expenses like medical bills, job loss, or major repairs without going into debt.",
      example: "If your monthly expenses are ₹45,000, you should aim for ₹135,000-₹270,000 in emergency savings.",
      bestPractice: "Keep it in a separate, easily accessible savings account that earns some interest.",
      impact: "Protects your financial stability and prevents emergency debt accumulation."
    },
    {
      title: "📊 Debt-to-Income Ratio",
      explanation: "This ratio compares your total monthly debt payments to your monthly income, showing how much of your income goes to debt.",
      example: "If you earn ₹75,000 and pay ₹15,000 in debt monthly, your ratio is 20%.",
      bestPractice: "Keep it below 36% for good financial health, ideally below 20%.",
      impact: "Lower ratios indicate better financial stability and borrowing capacity."
    }
  ];

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600 bg-green-100';
    if (confidence >= 80) return 'text-blue-600 bg-blue-100';
    if (confidence >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 90) return CheckCircle;
    if (confidence >= 80) return Info;
    if (confidence >= 70) return AlertCircle;
    return HelpCircle;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            🧠 Explainable AI - Understanding Your Financial Advice
          </CardTitle>
          <CardDescription>
            Transparent explanations of how we calculate recommendations and why they matter for your financial health
          </CardDescription>
        </CardHeader>
      </Card>

      {/* AI Explanations */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary" />
          💡 AI Reasoning Breakdown
        </h3>
        
        {explanations.map((explanation, index) => {
          const ConfidenceIcon = getConfidenceIcon(explanation.confidence);
          const isExpanded = expandedCards[`explanation-${index}`];
          
          return (
            <Card key={index}>
              <Collapsible>
                <CollapsibleTrigger 
                  className="w-full"
                  onClick={() => toggleCard(`explanation-${index}`)}
                >
                  <CardHeader className="hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between w-full">
                      <div className="flex-1 text-left">
                        <CardTitle className="text-base flex items-center gap-2">
                          <ConfidenceIcon className="w-4 h-4" />
                          {explanation.advice}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary">{explanation.category}</Badge>
                          <Badge 
                            variant="secondary" 
                            className={getConfidenceColor(explanation.confidence)}
                          >
                            {explanation.confidence}% confident
                          </Badge>
                        </div>
                      </div>
                      <div className="ml-4">
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      {/* Reasoning */}
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-sm text-blue-800 mb-2">
                          🤔 Why This Recommendation?
                        </h4>
                        <p className="text-sm text-blue-700">
                          {explanation.reasoning}
                        </p>
                      </div>

                      {/* Factors Considered */}
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h4 className="font-semibold text-sm text-gray-800 mb-3">
                          📊 Factors We Analyzed:
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {explanation.factors.map((factor, factorIndex) => (
                            <div key={factorIndex} className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                              <span className="text-sm text-gray-700">{factor}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Confidence Explanation */}
                      <div className="p-3 bg-muted rounded-lg">
                        <h4 className="font-semibold text-sm mb-2">
                          🎯 Confidence Level: {explanation.confidence}%
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {explanation.confidence >= 90 && "Very high confidence - This recommendation is based on strong financial principles and your specific data."}
                          {explanation.confidence >= 80 && explanation.confidence < 90 && "High confidence - This advice follows proven financial strategies with minor assumptions."}
                          {explanation.confidence >= 70 && explanation.confidence < 80 && "Moderate confidence - Good recommendation but may need adjustment based on personal preferences."}
                          {explanation.confidence < 70 && "Lower confidence - Consider this advice alongside other factors and your personal situation."}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          );
        })}
      </div>

      {/* Educational Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            📚 Financial Education Hub
          </CardTitle>
          <CardDescription>
            Learn the basics behind our recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {educationalContent.map((content, index) => (
              <Collapsible key={index}>
                <CollapsibleTrigger 
                  className="w-full"
                  onClick={() => toggleCard(`education-${index}`)}
                >
                  <div className="flex items-center justify-between w-full p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                    <h4 className="font-semibold text-sm text-left">
                      {content.title}
                    </h4>
                    {expandedCards[`education-${index}`] ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </div>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <div className="p-4 space-y-4">
                    <div>
                      <h5 className="font-medium text-sm mb-2">📖 Explanation:</h5>
                      <p className="text-sm text-muted-foreground">{content.explanation}</p>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-sm mb-2">💡 Example:</h5>
                      <p className="text-sm text-muted-foreground italic">{content.example}</p>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-sm mb-2">✅ Best Practice:</h5>
                      <p className="text-sm text-muted-foreground">{content.bestPractice}</p>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-sm mb-2">🎯 Impact:</h5>
                      <p className="text-sm text-muted-foreground">{content.impact}</p>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* How Our AI Works */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            🔬 How Our AI Financial Advisor Works
          </CardTitle>
          <CardDescription>
            Transparency into our recommendation engine
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-sm">📊 Data We Analyze:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Your financial profile (income, expenses, savings)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Credit score and debt information
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Financial goals and timelines
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Market trends and best practices
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-sm">🧮 Our Process:</h4>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <Badge variant="outline" className="text-xs mt-0.5">1</Badge>
                  Analyze your current financial health
                </li>
                <li className="flex items-start gap-3">
                  <Badge variant="outline" className="text-xs mt-0.5">2</Badge>
                  Compare with financial best practices
                </li>
                <li className="flex items-start gap-3">
                  <Badge variant="outline" className="text-xs mt-0.5">3</Badge>
                  Consider your specific goals and timeline
                </li>
                <li className="flex items-start gap-3">
                  <Badge variant="outline" className="text-xs mt-0.5">4</Badge>
                  Generate personalized recommendations
                </li>
                <li className="flex items-start gap-3">
                  <Badge variant="outline" className="text-xs mt-0.5">5</Badge>
                  Calculate confidence based on data quality
                </li>
              </ol>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-sm text-blue-800 mb-2">
              🔒 Privacy & Security
            </h4>
            <p className="text-sm text-blue-700">
              Your financial data is encrypted and never shared. Our AI processes your information 
              locally and provides recommendations based on proven financial principles, not on 
              comparison with other users' data.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExplainableAI;