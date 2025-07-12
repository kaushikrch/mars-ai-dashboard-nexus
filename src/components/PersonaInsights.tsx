import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { User, Users, TrendingUp, Target, ShoppingBag, BarChart3 } from 'lucide-react';

const personas = {
  'KAM': {
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
      working: "Walmart partnership is delivering exceptional results with 24% GSV growth driven by optimized shelf placement and promotional timing. Target relationship strengthening with 19% growth.",
      action: "Focus Amazon recovery plan - address inventory gaps and renegotiate search placement. Sam's Club presents untapped opportunity for bulk formats.",
      narrative: "Our strategic account management is paying dividends, with top retailers driving category share gains. Immediate action needed on Amazon to prevent Q4 risks."
    }
  },
  'Brand Manager': {
    icon: Target,
    title: 'Brand Manager', 
    description: 'Brand and category performance analysis',
    metrics: [
      { label: 'Top Subcategory', value: 'Gum', detail: '+34% growth vs Chocolate', status: 'success' },
      { label: 'Brand Velocity', value: 'Skittles', detail: 'Search ranking #3 ↑5', status: 'success' },
      { label: 'Share Growth', value: '+1.4 pts', detail: 'Category leadership', status: 'success' },
      { label: 'Innovation ROI', value: '$2.8M', detail: 'New product launches', status: 'warning' }
    ],
    aiSummary: {
      working: "Gum category momentum accelerating with 34% growth driven by microseason strategy. Skittles search optimization delivering 89% voice share in target queries.",
      action: "Reallocate 15% Chocolate media budget to Gum expansion. Launch Halloween innovation earlier to capture pre-season demand.",
      narrative: "Our portfolio strategy is working - premiumization in Gum offsetting Chocolate pressures. Innovation pipeline needs acceleration for Q4 seasonal capture."
    }
  },
  'Commercial Lead': {
    icon: BarChart3,
    title: 'Commercial Lead',
    description: 'Revenue optimization and channel strategy',
    metrics: [
      { label: 'Revenue YTD', value: '$47.2M', detail: '+16.3% vs LY', status: 'success' },
      { label: 'Channel Mix', value: '65% Retail', detail: '35% E-commerce growing', status: 'success' },
      { label: 'Margin Expansion', value: '+2.1%', detail: 'Premiumization impact', status: 'success' },
      { label: 'Forecast Accuracy', value: '94%', detail: 'Demand planning', status: 'success' }
    ],
    aiSummary: {
      working: "Revenue growth outpacing category at 16.3% with margin expansion from premiumization strategy. E-commerce channel growing 31% with strong on-demand penetration.",
      action: "Optimize pricing architecture for Q4 seasonal demand. Expand high-margin SKUs in growth channels while protecting volume in core retail.",
      narrative: "Commercial strategy delivering balanced growth across revenue and margin metrics. Strong foundation for Q4 seasonal uplift and annual planning."
    }
  },
  'Executive': {
    icon: Users,
    title: 'Executive',
    description: 'Strategic overview and competitive positioning',
    metrics: [
      { label: 'Market Position', value: '#2 Player', detail: 'Category share 18.2%', status: 'success' },
      { label: 'Competitive Gap', value: '-3.4 pts', detail: 'vs Category Leader', status: 'warning' },
      { label: 'Strategic Initiatives', value: '4/5 On Track', detail: '90-day plan progress', status: 'success' },
      { label: 'Investment ROI', value: '$4.2', detail: 'Media spend efficiency', status: 'success' }
    ],
    aiSummary: {
      working: "Strong market position with category share gains and superior ROI metrics. Digital transformation initiatives delivering measurable results across all channels.",
      action: "Accelerate share gain momentum through increased investment in winning strategies. Consider strategic acquisition to close competitive gap.",
      narrative: "Mars DCom is executing a winning strategy with clear competitive advantages. Ready to scale investments that are delivering outsized returns."
    }
  }
};

export const PersonaInsights = () => {
  const [selectedPersona, setSelectedPersona] = useState<keyof typeof personas>('KAM');
  const persona = personas[selectedPersona];
  const IconComponent = persona.icon;

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Persona Selector */}
      <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
        <div className="flex items-center gap-4 mb-4">
          <User className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold">Persona-Based Dashboard</h2>
        </div>
        <Select value={selectedPersona} onValueChange={(value) => setSelectedPersona(value as keyof typeof personas)}>
          <SelectTrigger className="w-full md:w-[300px]">
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
      <Card className="p-6 bg-gradient-performance border-mars-blue-secondary shadow-card">
        <div className="flex items-center gap-4 text-primary-foreground">
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