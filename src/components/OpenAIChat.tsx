import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Minimize2, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { OpenAIConfig } from './OpenAIConfig';

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
      content: `👋 Hi! I'm your Mars DCom AI Assistant powered by GPT-4. I can help you interpret metrics, generate insights, create slide narratives, and answer questions about your performance data.

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
  const [apiKey, setApiKey] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize API key from localStorage on component mount
  useEffect(() => {
    const storedKey = localStorage.getItem('openai_api_key');
    if (storedKey && storedKey.trim()) {
      setApiKey(storedKey.trim());
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleApiKeySet = (key: string) => {
    const trimmedKey = key.trim();
    setApiKey(trimmedKey);
    localStorage.setItem('openai_api_key', trimmedKey);
  };

  const clearApiKey = () => {
    setApiKey('');
    localStorage.removeItem('openai_api_key');
  };

  const callOpenAI = async (userMessage: string): Promise<string> => {
    const currentApiKey = apiKey.trim();
    
    if (!currentApiKey || currentApiKey.length < 10) {
      return "❗ **API Key Required**: Please configure your OpenAI API key above to enable real AI insights. The key should start with 'sk-proj-' or 'sk-'.";
    }

    try {
      console.log('Making OpenAI request with API key length:', currentApiKey.length);
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `You are an AI assistant for Mars DCom Performance Intelligence. You help analyze digital commerce metrics, provide insights, and generate business narratives. 

Current context: ${currentContext || 'General dashboard'}

Available data includes:
- Digital Sales YTD: $47.2M (+16.3% vs LY)
- Category Share: 18.2% (+1.4 pts YoY)  
- Top Retailers: Walmart (+24%), Target (+19%), Amazon (-8%)
- Top Brands: Skittles (+34%), Snickers (+21%), M&M (+7%)
- Search Performance: +18% PDP traffic, $4.2 ROAS
- Categories: Gum outperforming Chocolate significantly

Provide actionable insights in a professional but accessible tone. Use data from the context above to support your responses.`
            },
            {
              role: 'user',
              content: userMessage
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        }),
      });

      console.log('OpenAI response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('OpenAI API error:', errorData);
        
        if (response.status === 401) {
          // Clear invalid API key
          clearApiKey();
          return "❌ **Invalid API Key**: Your OpenAI API key is invalid or expired. Please enter a new API key above. You can get one from https://platform.openai.com/api-keys";
        }
        
        throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('OpenAI response received successfully');
      return data.choices[0]?.message?.content || "I couldn't generate a response. Please try again.";
    } catch (error) {
      console.error('OpenAI API error:', error);
      if (error instanceof Error && error.message.includes('401')) {
        clearApiKey();
        return "❌ **Authentication Error**: Please check your OpenAI API key and try again.";
      }
      return `🔧 **Connection Error**: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your API key and internet connection.`;
    }
  };

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
    
    return `🤖 Based on your Mars DCom data: YTD Digital Sales are tracking +16% vs LY. Top performing channel: Walmart (+24% GSV). Biggest opportunity: Amazon optimization (-8% velocity). Next recommended action: Review Q3 media allocation.`;
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

    try {
      const response = apiKey.trim() 
        ? await callOpenAI(input)
        : mockAIResponse(input);

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error getting AI response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVoice = () => {
    setIsListening(!isListening);
    // Voice recognition would be implemented here
  };

  if (isCollapsed) {
    return (
      <div className="fixed left-4 bottom-4 z-50">
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
    <Card className="fixed left-4 top-4 bottom-4 w-96 z-40 bg-card border-mars-blue-secondary shadow-mars flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-mars-blue-secondary">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <span className="font-semibold">Mars AI Assistant</span>
          {apiKey.trim() ? (
            <span className="text-xs text-success">● Connected</span>
          ) : (
            <span className="text-xs text-warning">● API Key Required</span>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={onToggle}>
          <Minimize2 className="h-4 w-4" />
        </Button>
      </div>

      {/* API Key Configuration */}
      {!apiKey.trim() && (
        <div className="p-4 border-b border-mars-blue-secondary">
          <OpenAIConfig 
            onApiKeySet={handleApiKeySet}
            hasApiKey={!!apiKey.trim()}
          />
        </div>
      )}

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
            placeholder="Ask about Mars performance or @mention colleagues..."
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleVoice}
            className={isListening ? 'text-primary' : ''}
            title="Voice Input"
          >
            {isListening ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
          </Button>
          <Button onClick={handleSend} disabled={!input.trim() || isLoading} title="Send Message">
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Collaboration Features */}
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-6 px-2"
            onClick={() => setInput(input + '@stakeholder ')}
          >
            @Stakeholder
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-6 px-2"
            onClick={() => setInput(input + '@manager ')}
          >
            @Manager
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-6 px-2"
            onClick={() => setInput(input + '#action-required ')}
          >
            #ActionRequired
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-6 px-2"
            onClick={() => setInput(input + '#insights ')}
          >
            #Insights
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