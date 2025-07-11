import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Minimize2, Maximize2, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface OpenAIChatProps {
  isCollapsed: boolean;
  onToggle: () => void;
  currentContext?: string;
}

export const OpenAIChat = ({ isCollapsed, onToggle, currentContext }: OpenAIChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `👋 Hi! I'm your Mars DCom AI Assistant. I can help you interpret metrics, generate insights, create slide narratives, and answer questions about your performance data.

Try asking me:
• "Why is Gum performing better than Chocolate?"
• "Summarize Walmart performance this quarter"
• "Generate a deck for my brand review"
• "What's driving the search ranking improvement?"`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const mockAIResponse = (userMessage: string): string => {
    const lowerMsg = userMessage.toLowerCase();
    
    if (lowerMsg.includes('gum') && lowerMsg.includes('chocolate')) {
      return `📊 **Gum vs Chocolate Performance Analysis**

**Gum Outperformance Drivers:**
• **Search Strategy**: 34% increase in PDP traffic from microseason campaigns
• **Retailer Mix**: Strong Walmart (+28% GSV) and Target (+19% GSV) performance
• **Media Timing**: Q2 investment aligned with back-to-school prep
• **Promo Calendar**: Better shelf space during key periods

**Chocolate Challenges:**
• Amazon velocity down 12% due to inventory gaps
• Premium segments underperforming in inflationary environment
• Media ROI 23% lower than category average

**Recommendation**: Reallocate 15% of Chocolate media budget to Gum microseasons in Q3.`;
    }
    
    if (lowerMsg.includes('walmart')) {
      return `🏪 **Walmart Performance Summary**

**YTD Performance:**
• GSV: +24% vs LY ($12.3M vs $9.9M)
• Category Share: 18.2% (+1.4 pts)
      
**Key Drivers:**
• Skittles search ranking improved from #8 to #3
• Snickers promotion execution 98% vs 85% industry avg
• On-demand delivery penetration: 31% (+8% vs LY)

**Opportunities:**
• M&M premium segments still lagging (-5%)
• Q3 Halloween prep starting early this year`;
    }
    
    if (lowerMsg.includes('deck') || lowerMsg.includes('slide')) {
      return `📋 **Slide Generation Ready**

I can create persona-based decks for you:

**Quick Options:**
• 5-slide Executive Summary
• 10-slide Business Review  
• 30-slide Deep Dive

**Custom Options:**
• Walmart-specific MBR deck
• Category performance analysis
• Media ROI optimization story

Would you like me to generate a specific deck? Just tell me the audience and key focus areas!`;
    }
    
    if (lowerMsg.includes('search') || lowerMsg.includes('ranking')) {
      return `🔍 **Search Performance Insights**

**Overall Search Impact:**
• PDP Traffic: +18% QoQ
• Keyword ROI: $4.2 ROAS (vs $3.1 category avg)
• Voice search queries: +45% for Mars brands

**Top Performers:**
• Skittles: #3 ranking for "fruit candy" (+5 positions)
• Snickers: 89% share of "satisfying snack" searches
• M&M: Strong in "movie candy" vertical

**Microseason Success:**
• Back-to-school: 67% lift in relevant categories
• Halloween prep: Early signals showing 23% increase`;
    }

    // Default response
    return `🤖 I understand you're asking about "${userMessage}". Based on your current Mars DCom data:

**Quick Insights:**
• YTD Digital Sales are tracking +16% vs LY
• Top performing channel: Walmart (+24% GSV)
• Biggest opportunity: Amazon optimization (-8% velocity)
• Next recommended action: Review Q3 media allocation

**How can I help you dive deeper?** I can analyze specific metrics, generate narratives, or create presentation slides for any stakeholder.`;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: mockAIResponse(input),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const toggleVoice = () => {
    setIsListening(!isListening);
    // Voice recognition would be implemented here
  };

  if (isCollapsed) {
    return (
      <div className="fixed right-4 bottom-4 z-50">
        <Button
          onClick={onToggle}
          className="rounded-full w-14 h-14 bg-primary hover:bg-primary/90 shadow-glow animate-pulse-glow"
        >
          <Bot className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <Card className="fixed right-4 top-4 bottom-4 w-96 z-40 bg-card border-mars-blue-secondary shadow-mars flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-mars-blue-secondary">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <span className="font-semibold">Mars AI Assistant</span>
        </div>
        <Button variant="ghost" size="sm" onClick={onToggle}>
          <Minimize2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
              <div
                className={`max-w-[280px] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                <div className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-mars-blue-secondary flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="bg-muted rounded-lg p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-mars-blue-secondary">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your Mars performance..."
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleVoice}
            className={isListening ? 'text-primary' : ''}
          >
            {isListening ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
          </Button>
          <Button onClick={handleSend} disabled={!input.trim() || isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
        {currentContext && (
          <div className="text-xs text-muted-foreground mt-2">
            Context: {currentContext}
          </div>
        )}
      </div>
    </Card>
  );
};