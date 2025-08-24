'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  User, Users, TrendingUp, Target, ShoppingBag, BarChart3,
  Search as SearchIcon, Megaphone, ArrowLeft
} from 'lucide-react';

const PERSONA_WELCOME_ROUTE = '/personas';

const personas = {
  'Key Account Manager': {
    icon: ShoppingBag,
    title: 'Key Account Manager',
    description: 'Retailer-focused performance and relationship insights',
    metrics: [
      { label: 'Top Retailer', value: 'Walmart', detail: '+24% GSV growth', status: 'success' },
      { label: 'Biggest Opportunity', value: 'Amazon', detail: '-8% velocity decline', status: 'warning' },
      { label: 'MBR Score', value: '92/100', detail: 'Walmart partnership', status: 'success' },
      { label: 'Promotion ROI', value: '$3.2', detail: 'Average ROAS', status: 'success' }
    ],
    aiSummary: {
      working: 'Walmart partnership is delivering exceptional results with 24% GSV growth.',
      action: "Focus Amazon recovery plan—address inventory gaps and renegotiate search placement.",
      narrative: 'Top retailers are driving share gains; Amazon requires near-term action.'
    }
  },
  'Brand/Category Manager': {
    icon: Target,
    title: 'Brand/Category Manager',
    description: 'Brand and category performance analysis',
    metrics: [
      { label: 'Top Subcategory', value: 'Gum', detail: '+34% vs Chocolate', status: 'success' },
      { label: 'Brand Velocity', value: 'Skittles', detail: 'Search ranking #3 ↑5', status: 'success' },
      { label: 'Share Growth', value: '+1.4 pts', detail: 'Category leadership', status: 'success' },
      { label: 'Innovation ROI', value: '$2.8M', detail: 'New launches', status: 'warning' }
    ],
    aiSummary: {
      working: 'Gum momentum accelerating via microseason strategy; Skittles voice share at 89%.',
      action: 'Reallocate 15% chocolate media to gum; bring Halloween innovation forward.',
      narrative: 'Portfolio is healthy; accelerate innovations to capture seasonal demand.'
    }
  },
  'Search Manager': {
    icon: SearchIcon,
    title: 'Search Manager',
    description: 'SOS, keyword strategy, and retail search performance',
    metrics: [
      { label: 'Share of Search', value: '62%', detail: '+2.1 pts YoY', status: 'success' },
      { label: 'Top KW ROAS', value: '$4.2', detail: '+18% vs LY', status: 'success' },
      { label: 'Voice Queries', value: '+45%', detail: 'YoY', status: 'success' },
      { label: 'PDP Traffic', value: '+18%', detail: 'QoQ', status: 'success' }
    ],
    aiSummary: {
      working: 'Microseason keywords driving majority of incremental growth.',
      action: 'Shift budget to top-converting KWs; prune long tail.',
      narrative: 'Search hygiene + microseasoning compounding SOS.'
    }
  },
  'Media Manager': {
    icon: Megaphone,
    title: 'Media Manager',
    description: 'Paid media efficiency and mix optimization',
    metrics: [
      { label: 'Shopper Media ROAS', value: '$4.2', detail: '+35% vs LY', status: 'success' },
      { label: 'Spend YTD', value: '$11.8M', detail: '+9% vs LY', status: 'success' },
      { label: 'Upper/Mid/Lower Mix', value: '20/35/45', detail: 'Within guardrail', status: 'success' },
      { label: 'Frequency (Retail Media)', value: '3.4', detail: '+0.4 vs plan', status: 'success' }
    ],
    aiSummary: {
      working: 'Lower-funnel placements returning strong ROAS.',
      action: 'Test creatives on top SKUs to lift CTR.',
      narrative: 'Cadence is efficient; expand in winning placements.'
    }
  },
  'Executive Leadership': {
    icon: Users,
    title: 'Executive Leadership',
    description: 'Strategic overview and competitive positioning',
    metrics: [
      { label: 'Market Position', value: '#2 Player', detail: 'Category share 18.2%', status: 'success' },
      { label: 'Competitive Gap', value: '-3.4 pts', detail: 'vs Leader', status: 'warning' },
      { label: 'Strategic Initiatives', value: '4/5 On Track', detail: '90-day plan', status: 'success' },
      { label: 'Investment ROI', value: '$4.2', detail: 'Media spend efficiency', status: 'success' }
    ],
    aiSummary: {
      working: 'Share gains with superior ROI; digital initiatives delivering results.',
      action: 'Accelerate winning strategies; evaluate selective M&A.',
      narrative: 'Ready to scale investments with outsized returns.'
    }
  }
};

export const PersonaInsights = () => {
  const navigate = useNavigate();
  const [selectedPersona, setSelectedPersona] = useState<keyof typeof personas>('Key Account Manager');
  const persona = personas[selectedPersona];
  const IconComponent = persona.icon;

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Persona Selector + Back */}
      <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <User className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">Persona-Based Dashboard</h2>
          </div>
          <button
            className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-md border hover:bg-muted/50"
            onClick={() => navigate(PERSONA_WELCOME_ROUTE)}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Personas
          </button>
        </div>
        <Select value={selectedPersona} onValueChange={(value) => setSelectedPersona(value as keyof typeof personas)}>
          <SelectTrigger className="w-full md:w-[320px]">
            <SelectValue placeholder="Select your role..." />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(personas).map(([key, p]) => (
              <SelectItem key={key} value={key}>
                <div className="flex items-center gap-2">
                  <p.icon className="h-4 w-4" />
                  {p.title}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Card>

      {/* Persona Header */}
      <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
        <div className="flex items-center gap-4">
          <IconComponent className="h-8 w-8" />
          <div>
            <h3 className="text-xl font-bold">{persona.title}</h3>
            <p className="opacity-90">{persona.description}</p>
          </div>
        </div>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {persona.metrics.map((metric, index) => (
          <Card key={index} className="p-4 bg-gradient-glow border-mars-blue-secondary shadow-card">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{metric.label}</p>
              <p className="text-2xl font-bold">{metric.value}</p>
              <div className="flex items-center gap-2">
                <Badge className={
                  metric.status === 'success' ? 'bg-success/20 text-success' : 
                  metric.status === 'warning' ? 'bg-warning/20 text-warning' : 
                  'bg-muted text-muted-foreground'
                }>
                  {metric.status}
                </Badge>
                <p className="text-xs text-muted-foreground">{metric.detail}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* AI Generated Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
          <h4 className="font-semibold mb-3 text-success flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            What's Working?
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {persona.aiSummary.working}
          </p>
        </Card>

        <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
          <h4 className="font-semibold mb-3 text-warning flex items-center gap-2">
            <Target className="h-4 w-4" />
            Where to Act?
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {persona.aiSummary.action}
          </p>
        </Card>

        <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
          <h4 className="font-semibold mb-3 text-primary flex items-center gap-2">
            <Users className="h-4 w-4" />
            Narrative for Deck
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {persona.aiSummary.narrative}
          </p>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
        <h4 className="font-semibold mb-4">Quick Actions for {persona.title}</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-left">
            <p className="font-medium">Generate Deck</p>
            <p className="text-xs opacity-90">Create persona-specific slides</p>
          </button>
          <button className="p-3 rounded-lg bg-mars-blue-secondary text-primary-foreground hover:bg-mars-blue-secondary/90 transition-colors text-left">
            <p className="font-medium">Deep Dive Analysis</p>
            <p className="text-xs opacity-90">Detailed performance review</p>
          </button>
          <button className="p-3 rounded-lg bg-mars-blue-secondary text-primary-foreground hover:bg-mars-blue-secondary/90 transition-colors text-left">
            <p className="font-medium">Export Data</p>
            <p className="text-xs opacity-90">Download insights & metrics</p>
          </button>
        </div>
      </Card>
    </div>
  );
};