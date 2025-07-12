import { useState, useEffect } from 'react';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MarsHeaderNav } from '@/components/MarsHeaderNav';
import { OpenAIChat } from '@/components/OpenAIChat';
import { ExecutiveSummary } from '@/components/ExecutiveSummary';
import { PersonaWelcome } from '@/components/PersonaWelcome';
import { ChannelDeepDive } from '@/components/ChannelDeepDive';
import { SlideStudio } from '@/components/SlideStudio';
import { PredictivePerformance } from '@/components/PredictivePerformance';
import { AIInsights } from '@/components/AIInsights';
import { DataQuality } from '@/components/DataQuality';
import { ChartBuilder } from '@/components/ChartBuilder';
import { BarChart3, Users, Search, Presentation, TrendingUp, Brain, Database, PlusCircle } from 'lucide-react';

export const MarsDashboard = () => {
  const [isChatCollapsed, setIsChatCollapsed] = useState(false);
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
    <div className="min-h-screen bg-background">
      <MarsHeaderNav />
      
      <div className={`transition-all duration-300 ${isChatCollapsed ? 'mr-0' : 'mr-[400px]'}`}>
        <main className="container mx-auto p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="overflow-x-auto">
              <TabsList className="grid w-full grid-cols-8 bg-mars-blue-secondary min-w-[800px] text-primary-foreground">
                <TabsTrigger 
                  value="executive" 
                  className="flex items-center gap-2 text-primary-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <BarChart3 className="h-4 w-4" />
                  Executive
                </TabsTrigger>
                <TabsTrigger 
                  value="persona" 
                  className="flex items-center gap-2 text-primary-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Users className="h-4 w-4" />
                  Persona
                </TabsTrigger>
                <TabsTrigger 
                  value="channel" 
                  className="flex items-center gap-2 text-primary-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Search className="h-4 w-4" />
                  Channel
                </TabsTrigger>
                <TabsTrigger 
                  value="predictive" 
                  className="flex items-center gap-2 text-primary-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <TrendingUp className="h-4 w-4" />
                  Predictive
                </TabsTrigger>
                <TabsTrigger 
                  value="insights" 
                  className="flex items-center gap-2 text-primary-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Brain className="h-4 w-4" />
                  AI Insights
                </TabsTrigger>
                <TabsTrigger 
                  value="slides" 
                  className="flex items-center gap-2 text-primary-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Presentation className="h-4 w-4" />
                  Slides
                </TabsTrigger>
                <TabsTrigger 
                  value="quality" 
                  className="flex items-center gap-2 text-primary-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Database className="h-4 w-4" />
                  Quality
                </TabsTrigger>
                <TabsTrigger 
                  value="builder" 
                  className="flex items-center gap-2 text-primary-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <PlusCircle className="h-4 w-4" />
                  Builder
                </TabsTrigger>
              </TabsList>
            </div>

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
      </div>

      <OpenAIChat
        isCollapsed={isChatCollapsed}
        onToggle={() => setIsChatCollapsed(!isChatCollapsed)}
        currentContext={tabContextMap[activeTab]}
      />
    </div>
  );
};