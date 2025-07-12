import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Key, Eye, EyeOff } from 'lucide-react';

interface OpenAIConfigProps {
  onApiKeySet: (apiKey: string) => void;
  hasApiKey: boolean;
}

export const OpenAIConfig = ({ onApiKeySet, hasApiKey }: OpenAIConfigProps) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onApiKeySet(apiKey.trim());
    }
  };

  if (hasApiKey) {
    return (
      <Alert className="bg-success/20 border-success">
        <Key className="h-4 w-4" />
        <AlertDescription>
          OpenAI API configured successfully! The AI assistant is now powered by real GPT-4.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Key className="h-5 w-5 text-primary" />
        OpenAI API Configuration
      </h3>
      
      <Alert className="mb-4 bg-warning/20 border-warning">
        <AlertDescription>
          <strong>🔑 API Key Required:</strong> To enable real AI insights and slide generation, please provide your OpenAI API key. 
          <br /><br />
          <strong>⚠️ Security Note:</strong> For production use, we recommend connecting to Supabase for secure key management. 
          <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">Learn about Supabase integration</a>
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Input
            type={showKey ? 'text' : 'password'}
            placeholder="Enter your OpenAI API key (sk-proj-... or sk-...)"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="pr-10"
            autoComplete="off"
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        
        <Button type="submit" disabled={!apiKey.trim()} className="w-full">
          Configure AI Assistant
        </Button>
      </form>

      <div className="mt-4 text-xs text-muted-foreground">
        <p>✅ Your API key is stored locally and only sent to OpenAI's servers.</p>
        <p>🔗 Get your API key from: <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary underline">OpenAI Platform</a></p>
      </div>
    </Card>
  );
};