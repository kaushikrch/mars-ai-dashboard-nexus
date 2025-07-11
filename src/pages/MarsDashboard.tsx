import { useState, useEffect } from 'react';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MarsHeaderNav } from '@/components/MarsHeaderNav';
import { OpenAIChat } from '@/components/OpenAIChat';
import { ExecutiveSummary } from '@/components/ExecutiveSummary';
import { PersonaInsights } from '@/components/PersonaInsights';
import { ChannelDeepDive } from '@/components/ChannelDeepDive';
import { SlideStudio } from '@/components/SlideStudio';
import { BarChart3, Users, Search, Presentation } from 'lucide-react';

export const MarsDashboard = () => {
  const [isChatCollapsed, setIsChatCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('executive');
  const [isLoading, setIsLoading] = useState(true);

  const tabContextMap: Record<string, string> = {
    executive: 'Executive Summary - YTD Performance Overview',
    persona: 'Persona Insights - Role-based Dashboard',
    channel: 'Channel & Search Deep Dive - Performance Analysis',
    slides: 'Slide Studio - Presentation Generation'
  };

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <MarsHeaderNav />
      
      <div className={`transition-all duration-300 ${isChatCollapsed ? 'mr-0' : 'mr-[400px]'}`}>
        <main className="container mx-auto p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-mars-blue-secondary">
              <TabsTrigger 
                value="executive" 
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <BarChart3 className="h-4 w-4" />
                Executive Summary
              </TabsTrigger>
              <TabsTrigger 
                value="persona" 
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Users className="h-4 w-4" />
                Persona Insights
              </TabsTrigger>
              <TabsTrigger 
                value="channel" 
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Search className="h-4 w-4" />
                Channel & Search
              </TabsTrigger>
              <TabsTrigger 
                value="slides" 
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Presentation className="h-4 w-4" />
                Slide Studio
              </TabsTrigger>
            </TabsList>

            <TabsContent value="executive" className="space-y-6">
              <ExecutiveSummary />
            </TabsContent>

            <TabsContent value="persona" className="space-y-6">
              <PersonaInsights />
            </TabsContent>

            <TabsContent value="channel" className="space-y-6">
              <ChannelDeepDive />
            </TabsContent>

            <TabsContent value="slides" className="space-y-6">
              <SlideStudio />
            </TabsContent>
          </Tabs>
        </main>
      </div>

      <OpenAIChat
        isCollapsed={isChatCollapsed}
        onToggle={() => setIsChatCollapsed(!isChatCollapsed)}
        currentContext={tabContextMap[activeTab]}
      />
    </div>
  );
};