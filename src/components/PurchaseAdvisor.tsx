import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  ShoppingCart,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { formatAIContent } from "./ai-format";

// AI Response formatting function (same as AIChat component)
const formatAIResponse = (content: string) => {
  return (
    content
      // Add emojis to common financial terms
      .replace(/budget/gi, "💰 budget")
      .replace(/credit score/gi, "📊 credit score")
      .replace(/savings/gi, "🏦 savings")
      .replace(/debt/gi, "💳 debt")
      .replace(/investment/gi, "📈 investment")
      .replace(/emergency fund/gi, "🚨 emergency fund")
      .replace(/goal/gi, "🎯 goal")
      // Format headings with better typography
      .replace(
        /^### (.+)$/gm,
        '<h3 class="text-lg font-semibold text-primary mb-2 mt-4">💡 $1</h3>'
      )
      .replace(
        /^## (.+)$/gm,
        '<h2 class="text-xl font-bold text-primary mb-3 mt-4">✨ $1</h2>'
      )
      .replace(
        /^# (.+)$/gm,
        '<h1 class="text-2xl font-bold text-primary mb-4 mt-4">🌟 $1</h1>'
      )
      // Format bold text
      .replace(
        /\*\*(.+?)\*\*/g,
        '<strong class="font-semibold text-primary">$1</strong>'
      )
      // Format bullet points with emojis
      .replace(/^- (.+)$/gm, "• $1")
      .replace(/^• /gm, "✅ ")
      // Add line breaks for better readability
      .replace(/\n/g, "<br/>")
  );
};

interface PurchaseAdvisorProps {
  userId?: string;
}

interface PurchaseDecision {
  id: string;
  item_name: string;
  item_price: number;
  ai_recommendation: string;
  reasoning: string;
  created_at: string;
}

const PurchaseAdvisor = ({ userId }: PurchaseAdvisorProps) => {
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAdvice, setCurrentAdvice] = useState<string | null>(null);
  const [recentDecisions, setRecentDecisions] = useState<PurchaseDecision[]>(
    []
  );
  const { toast } = useToast();

  const loadRecentDecisions = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from("purchase_decisions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      setRecentDecisions(data || []);
    } catch (error: any) {
      console.error("Error loading recent decisions:", error);
    }
  };

  useState(() => {
    loadRecentDecisions();
  });

  const handleAnalyzePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim() || !itemPrice || !userId) return;

    setIsAnalyzing(true);
    setCurrentAdvice(null);

    try {
      const { data, error } = await supabase.functions.invoke(
        "financial-ai-advisor",
        {
          body: {
            message: `Should I buy ${itemName} for ₹${itemPrice}?`,
            type: "purchase_advice",
            context: {
              itemName,
              itemPrice: parseFloat(itemPrice),
            },
            userId,
          },
        }
      );

      if (error) throw error;

      setCurrentAdvice(data.response);
      setItemName("");
      setItemPrice("");

      // Reload recent decisions
      await loadRecentDecisions();

      toast({
        title: "Purchase analysis complete",
        description: "Check the recommendation below.",
      });
    } catch (error: any) {
      toast({
        title: "Error analyzing purchase",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case "approve":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "reject":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "wait":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case "approve":
        return "text-green-600 bg-green-50 border-green-200";
      case "reject":
        return "text-red-600 bg-red-50 border-red-200";
      case "wait":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const popularItems = [
    { name: "iPhone 15", price: "79900" },
    { name: "MacBook Air M2", price: "114900" },
    { name: "Sony WH-1000XM5", price: "29990" },
    { name: "iPad Air", price: "59900" },
    { name: "Gaming Chair", price: "15000" },
    { name: "Course Subscription", price: "4999" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            "Can I Buy This?" Advisor
          </CardTitle>
          <CardDescription>
            Get AI-powered recommendations on whether you can afford a purchase
            based on your financial health
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAnalyzePurchase} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="itemName">What do you want to buy?</Label>
                <Input
                  id="itemName"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="e.g., iPhone 15, MacBook, Course"
                  required
                />
              </div>
              <div>
                <Label htmlFor="itemPrice">Price (₹)</Label>
                <Input
                  id="itemPrice"
                  type="number"
                  min="1"
                  value={itemPrice}
                  onChange={(e) => setItemPrice(e.target.value)}
                  placeholder="e.g., 79900"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isAnalyzing}
              className="w-full btn-hero"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing your purchase...
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Analyze Purchase
                </>
              )}
            </Button>
          </form>

          {/* Quick Examples */}
          <div className="mt-6">
            <p className="text-sm font-medium mb-3">Quick examples:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {popularItems.map((item, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-left h-auto p-2"
                  onClick={() => {
                    setItemName(item.name);
                    setItemPrice(item.price);
                  }}
                >
                  <div>
                    <div className="font-medium text-xs">{item.name}</div>
                    <div className="text-xs text-muted-foreground">
                      ₹{item.price}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Advice */}
      {currentAdvice && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">AI Recommendation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/50 rounded-lg p-4">
              <div
                dangerouslySetInnerHTML={{
                  __html: formatAIResponse(currentAdvice),
                }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Decisions */}
      {recentDecisions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Purchase Decisions</CardTitle>
            <CardDescription>
              Your purchase history and AI recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDecisions.map((decision) => (
                <div
                  key={decision.id}
                  className="flex items-start justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{decision.item_name}</h4>
                      <Badge variant="secondary">
                        ₹{decision.item_price.toLocaleString()}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: formatAIResponse(decision.reasoning),
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(decision.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div
                    className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getRecommendationColor(
                      decision.ai_recommendation
                    )}`}
                  >
                    {getRecommendationIcon(decision.ai_recommendation)}
                    <span className="text-sm font-medium capitalize">
                      {decision.ai_recommendation}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PurchaseAdvisor;
