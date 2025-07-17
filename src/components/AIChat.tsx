import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Send,
  Bot,
  User,
  Loader2,
  TrendingUp,
  CreditCard,
  PiggyBank,
  Target,
  Mic,
  MicOff,
} from "lucide-react";
import { formatAIContent } from "./ai-format";

interface AIChatProps {
  userId?: string;
}

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  conversationType?: string;
}

const emojiMap: Record<string, string> = {
  save: "💰",
  goal: "🎯",
  credit: "💳",
  debt: "",
  emergency: "🚨",
  income: "💵",
  expense: "💸",
  subscription: "🔔",
  tip: "💡",
  congrats: "🎉",
  good: "✅",
  warning: "⚠️",
  invest: "📈",
  bill: "🧾",
  track: "📊",
  plan: "📝",
  budget: "📅",
  check: "✔️",
  star: "⭐",
  fire: "🔥",
  calendar: "📆",
  shopping: "🛒",
  food: "🍽️",
  travel: "✈️",
  home: "🏠",
  health: "🏥",
  car: "🚗",
  phone: "📱",
  education: "🎓",
  energy: "⚡",
  smile: "😃",
  rocket: "🚀",
};

function addEmojis(text: string) {
  let result = text;
  Object.entries(emojiMap).forEach(([word, emoji]) => {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    result = result.replace(regex, `${emoji} ${word}`);
  });
  return result;
}

const OPENAI_FALLBACK_KEY = "sk-..."; // TODO: Replace with your OpenAI API key (never expose in production)

const AIChat = ({ userId }: AIChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Hello! I'm your personal finance AI advisor. I can help you with budgeting, credit improvement, purchase decisions, and more. What would you like to know about your finances today?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load past conversation on mount for contextual memory
  useEffect(() => {
    const loadHistory = async () => {
      if (!userId) return;
      try {
        const { data } = await supabase
          .from("ai_conversations")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: true })
          .limit(20);

        if (data) {
          const historyMsgs: Message[] = [];
          data.forEach((row: any, idx: number) => {
            historyMsgs.push({
              id: `u-${idx}`,
              type: "user",
              content: row.user_message,
              timestamp: new Date(row.created_at),
              conversationType: row.conversation_type,
            });
            historyMsgs.push({
              id: `a-${idx}`,
              type: "ai",
              content: row.ai_response,
              timestamp: new Date(row.created_at),
              conversationType: row.conversation_type,
            });
          });
          // prepend after welcome message
          setMessages((prev) => {
            const welcome = prev[0];
            return [welcome, ...historyMsgs];
          });
        }
      } catch (err) {
        console.error("Error loading history", err);
      }
    };
    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const quickQuestions = [
    {
      icon: TrendingUp,
      text: "How can I improve my credit score?",
      type: "credit_improvement",
    },
    {
      icon: PiggyBank,
      text: "Help me create a budget plan",
      type: "budget_help",
    },
    {
      icon: CreditCard,
      text: "Should I pay off debt or save money?",
      type: "debt_advice",
    },
    {
      icon: Target,
      text: "How much should I save for emergencies?",
      type: "savings_advice",
    },
  ];

  const sendMessage = async (message: string, type: string = "chat") => {
    if (!message.trim() || !userId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Build last few messages for context (exclude the new one)
      const lastHistory = messages.slice(-10).map((m) => ({
        role: m.type === "user" ? "user" : "assistant",
        content: m.content,
      }));

      const { data, error } = await supabase.functions.invoke(
        "financial-ai-advisor",
        {
          body: {
            message,
            type,
            userId,
            history: lastHistory,
          },
        }
      );

      if (error || !data?.response) {
        // Fallback to OpenAI directly
        const openaiRes = await fetch(
          "https://api.openai.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${OPENAI_FALLBACK_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "gpt-4o-mini",
              messages: [
                {
                  role: "system",
                  content:
                    "You are FinanceAI, a helpful financial advisor for young professionals. Be concise and practical.",
                },
                ...lastHistory,
                { role: "user", content: message },
              ],
              temperature: 0.7,
              max_tokens: 1000,
            }),
          }
        );
        const openaiData = await openaiRes.json();
        if (openaiData.choices && openaiData.choices[0]?.message?.content) {
          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            type: "ai",
            content: openaiData.choices[0].message.content,
            timestamp: new Date(),
            conversationType: type,
          };
          setMessages((prev) => [...prev, aiMessage]);
        } else {
          toast({
            title: "Error getting AI response",
            description: "AI is currently unavailable. Please try again later.",
            variant: "destructive",
          });
        }
      } else {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content: data.response,
          timestamp: new Date(),
          conversationType: type,
        };
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (error: any) {
      // Fallback to OpenAI directly if Supabase call throws
      try {
        const lastHistory = messages.slice(-10).map((m) => ({
          role: m.type === "user" ? "user" : "assistant",
          content: m.content,
        }));
        const openaiRes = await fetch(
          "https://api.openai.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${OPENAI_FALLBACK_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "gpt-4o-mini",
              messages: [
                {
                  role: "system",
                  content:
                    "You are FinanceAI, a helpful financial advisor for young professionals. Be concise and practical.",
                },
                ...lastHistory,
                { role: "user", content: message },
              ],
              temperature: 0.7,
              max_tokens: 1000,
            }),
          }
        );
        const openaiData = await openaiRes.json();
        if (openaiData.choices && openaiData.choices[0]?.message?.content) {
          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            type: "ai",
            content: openaiData.choices[0].message.content,
            timestamp: new Date(),
            conversationType: type,
          };
          setMessages((prev) => [...prev, aiMessage]);
        } else {
          toast({
            title: "Error getting AI response",
            description: "AI is currently unavailable. Please try again later.",
            variant: "destructive",
          });
        }
      } catch (err) {
        toast({
          title: "Error getting AI response",
          description: "AI is currently unavailable. Please try again later.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputMessage);
  };

  // Voice input using Web Speech API
  useEffect(() => {
    let recognition: any;
    if (isListening) {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        toast({
          title: "Voice input not supported",
          description: "Your browser does not support speech recognition.",
        });
        setIsListening(false);
        return;
      }
      recognition = new SpeechRecognition();
      recognition.lang = "en-IN";
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.start();
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage((prev) =>
          prev ? prev + " " + transcript : transcript
        );
      };
      recognition.onend = () => {
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
    }
    return () => {
      if (recognition) recognition.stop();
    };
  }, [isListening, toast]);

  const handleQuickQuestion = (question: string, type: string) => {
    sendMessage(question, type);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            AI Financial Advisor Chat
          </CardTitle>
          <CardDescription>
            Get personalized financial advice based on your profile and goals
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Quick Questions */}
          <div className="mb-6">
            <p className="text-sm font-medium mb-3">
              Quick questions to get started:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="justify-start h-auto p-3 text-left"
                  onClick={() =>
                    handleQuickQuestion(question.text, question.type)
                  }
                >
                  <question.icon className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="text-sm">{question.text}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Chat Messages */}
          <div className="border rounded-lg">
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.type === "ai" && (
                    <div className="w-8 h-8 bg-primary-light rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}

                  <div
                    className={`max-w-[70%] ${
                      message.type === "user" ? "order-2" : ""
                    }`}
                  >
                    <div
                      className={`rounded-lg p-3 ${
                        message.type === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
            <Input
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !inputMessage.trim()}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIChat;
