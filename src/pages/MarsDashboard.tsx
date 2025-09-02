import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { MarsHeaderNav } from '@/components/MarsHeaderNav';
import { MarsNavigation } from '@/components/MarsNavigation';
import { OpenAIChat } from '@/components/OpenAIChat';
import { ExecutiveSummary } from '@/components/ExecutiveSummary';
import { PersonaWelcome } from '@/components/PersonaWelcome';
import { ChannelDeepDive } from '@/components/ChannelDeepDive';
import { SlideStudio } from '@/components/SlideStudio';
import { PredictivePerformance } from '@/components/PredictivePerformance';
import { AIInsights } from '@/components/AIInsights';
import { DataQuality } from '@/components/DataQuality';
import { ChartBuilder } from '@/components/ChartBuilder';

export const MarsDashboard = () => {
  const [isChatCollapsed, setIsChatCollapsed] = useState(false);
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const [activeTab, setActiveTab] = useState('executive');
  const [isLoading, setIsLoading] = useState(true);

  const tabContextMap: Record<string, string> = {
    executive: 'Executive Summary - YTD Performance Overview',
    persona: 'Persona Insights - Role-based Dashboard',
    channel: 'Channel & Search Deep Dive - Performance Analysis',
    predictive: 'Predictive Performance - Forecasts & Simulation',
    insights: 'AI Insights - Strategic Reasoning & Plans',
    slides: 'Slide Studio - Presentation Generation',
    quality: 'Data Quality - Health & Monitoring',
    builder: 'Chart Builder - Custom Visualizations'
  };

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <MarsHeaderNav />
      
      <div className="flex w-full">
        {!isNavCollapsed && (
          <MarsNavigation 
            activeTab={activeTab} 
            onTabChange={setActiveTab}
            isCollapsed={isNavCollapsed}
            onToggle={() => setIsNavCollapsed(!isNavCollapsed)}
          />
        )}
        
        <main className={`flex-1 p-6 transition-all duration-300 min-w-0 ${
          isChatCollapsed ? '' : 'pr-0'
        }`}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsContent value="executive" className="space-y-6">
              <ExecutiveSummary />
            </TabsContent>

            <TabsContent value="persona" className="space-y-6">
              <PersonaWelcome />
            </TabsContent>

            <TabsContent value="channel" className="space-y-6">
              <ChannelDeepDive />
            </TabsContent>

            <TabsContent value="predictive" className="space-y-6">
              <PredictivePerformance />
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
              <AIInsights />
            </TabsContent>

            <TabsContent value="slides" className="space-y-6">
              <SlideStudio />
            </TabsContent>

            <TabsContent value="quality" className="space-y-6">
              <DataQuality />
            </TabsContent>

            <TabsContent value="builder" className="space-y-6">
              <ChartBuilder />
            </TabsContent>
          </Tabs>
        </main>

        {!isChatCollapsed && (
          <OpenAIChat
            isCollapsed={isChatCollapsed}
            onToggle={() => setIsChatCollapsed(!isChatCollapsed)}
            currentContext={tabContextMap[activeTab]}
          />
        )}
      </div>
      
      {/* Navigation toggle when collapsed */}
      {isNavCollapsed && (
        <MarsNavigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          isCollapsed={isNavCollapsed}
          onToggle={() => setIsNavCollapsed(!isNavCollapsed)}
        />
      )}
      
      {/* Chat toggle when collapsed */}
      {isChatCollapsed && (
        <div className="fixed right-4 bottom-4 z-10">
          <Button
            onClick={() => setIsChatCollapsed(false)}
            className="rounded-full w-14 h-14 bg-primary hover:bg-primary/90 shadow-glow animate-pulse-glow"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </div>
      )}
    </div>
  );
};