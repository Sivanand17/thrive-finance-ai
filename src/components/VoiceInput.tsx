import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Square,
  Play,
  Pause,
  MessageCircle,
  Calculator
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VoiceInputProps {
  onVoiceCommand: (command: string, type: 'chat' | 'expense') => void;
}

const VoiceInput = ({ onVoiceCommand }: VoiceInputProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if speech recognition is supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
      
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setIsListening(true);
        toast({
          title: "🎙️ Listening...",
          description: "Speak your financial question or expense",
        });
      };
      
      recognition.onresult = (event) => {
        const current = event.resultIndex;
        const transcriptResult = event.results[current][0].transcript;
        const confidenceLevel = event.results[current][0].confidence;
        
        setTranscript(transcriptResult);
        setConfidence(confidenceLevel);
        
        if (event.results[current].isFinal) {
          processVoiceCommand(transcriptResult);
        }
      };
      
      recognition.onerror = (event) => {
        setIsListening(false);
        toast({
          title: "Voice input error",
          description: "Could not process voice input. Please try again.",
          variant: "destructive",
        });
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current = recognition;
    }
  }, []);

  const processVoiceCommand = (text: string) => {
    const lowerText = text.toLowerCase();
    
    // Check if it's an expense-related command
    const expenseKeywords = ['spent', 'paid', 'bought', 'cost', 'expense', 'purchase', 'bill'];
    const isExpense = expenseKeywords.some(keyword => lowerText.includes(keyword));
    
    if (isExpense) {
      onVoiceCommand(text, 'expense');
      toast({
        title: "💰 Expense Command Detected",
        description: "Processing your expense entry...",
      });
    } else {
      onVoiceCommand(text, 'chat');
      toast({
        title: "💬 Chat Command Detected",
        description: "Sending to AI advisor...",
      });
    }
    
    setTranscript('');
    setConfidence(0);
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const voiceCommands = [
    {
      category: '💰 Expense Tracking',
      examples: [
        '"I spent 500 rupees on groceries"',
        '"Paid 2000 for electricity bill"',
        '"Bought coffee for 150 rupees"'
      ]
    },
    {
      category: '💬 Financial Questions',
      examples: [
        '"How much should I save this month?"',
        '"What is my credit utilization?"',
        '"Should I pay off debt or invest?"'
      ]
    },
    {
      category: '🎯 Goal Tracking',
      examples: [
        '"Add 5000 to my emergency fund"',
        '"How close am I to my laptop goal?"',
        '"Create a new savings goal"'
      ]
    }
  ];

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MicOff className="w-5 h-5 text-muted-foreground" />
            🎙️ Voice Input
          </CardTitle>
          <CardDescription>
            Voice input is not supported in your browser
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Please use a modern browser like Chrome, Firefox, or Safari for voice features.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Voice Input Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-primary" />
            🎙️ Voice Input
          </CardTitle>
          <CardDescription>
            Ask questions or log expenses using your voice
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center space-y-4">
            {/* Voice Input Button */}
            <Button
              onClick={isListening ? stopListening : startListening}
              size="lg"
              className={`w-20 h-20 rounded-full ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                  : 'bg-primary hover:bg-primary/90'
              }`}
            >
              {isListening ? (
                <MicOff className="w-8 h-8" />
              ) : (
                <Mic className="w-8 h-8" />
              )}
            </Button>
            
            <div className="text-center">
              <p className="font-medium">
                {isListening ? '🎙️ Listening...' : '🎤 Tap to speak'}
              </p>
              <p className="text-sm text-muted-foreground">
                {isListening 
                  ? 'Speak clearly about your finances' 
                  : 'Voice commands for expenses and questions'
                }
              </p>
            </div>
          </div>

          {/* Real-time Transcript */}
          {transcript && (
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm">Live Transcript:</h4>
                <Badge variant="secondary">
                  {Math.round(confidence * 100)}% confident
                </Badge>
              </div>
              <p className="text-sm italic">"{transcript}"</p>
            </div>
          )}

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-auto p-3 flex-col gap-2"
              onClick={() => {
                toast({
                  title: "💬 Chat Mode Ready",
                  description: "Ask any financial question",
                });
                startListening();
              }}
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-xs">Ask AI</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-3 flex-col gap-2"
              onClick={() => {
                toast({
                  title: "💰 Expense Mode Ready",
                  description: "Log your expenses by voice",
                });
                startListening();
              }}
            >
              <Calculator className="w-5 h-5" />
              <span className="text-xs">Log Expense</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Voice Command Examples */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-primary" />
            📢 Voice Command Examples
          </CardTitle>
          <CardDescription>
            Try these voice commands to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {voiceCommands.map((category, index) => (
              <div key={index}>
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  {category.category}
                </h4>
                <div className="space-y-2">
                  {category.examples.map((example, exampleIndex) => (
                    <div 
                      key={exampleIndex}
                      className="p-3 bg-muted/50 rounded-lg border border-dashed"
                    >
                      <p className="text-sm italic text-muted-foreground">
                        {example}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tips for Better Voice Recognition */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">🎯 Tips for Better Voice Recognition</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">✅ Do:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Speak clearly and at normal speed</li>
                <li>• Use specific amounts and categories</li>
                <li>• Pause briefly before speaking</li>
                <li>• Use quiet environment</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm">❌ Avoid:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Speaking too fast or too slow</li>
                <li>• Background noise or music</li>
                <li>• Mumbling or unclear pronunciation</li>
                <li>• Very long sentences</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceInput;