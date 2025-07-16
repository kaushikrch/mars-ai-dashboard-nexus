import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { User, Users, Building2, Crown, Target, BarChart3, TrendingUp, Sparkles } from 'lucide-react';

const personas = {
  'KAM': {
    title: 'Key Account Manager',
    description: 'Retailer-focused performance and relationship management',
    icon: Building2,
    color: 'hsl(var(--primary))',
    metrics: [
      { label: 'Account GSV YTD', value: '$12.3M', change: '+24%', status: 'success', target: '$11.8M' },
      { label: 'Velocity Index', value: '87', change: '+12%', status: 'success', target: '85' },
      { label: 'Share of Shelf', value: '34%', change: '-2%', status: 'warning', target: '36%' },
      { label: 'Promo Compliance', value: '92%', change: '+5%', status: 'success', target: '90%' }
    ],
    chartData: [
      { month: 'Jul', performance: 82, target: 85, walmart: 89, target_wmt: 88, amazon: 75, target_amz: 80 },
      { month: 'Aug', performance: 85, target: 86, walmart: 92, target_wmt: 89, amazon: 78, target_amz: 82 },
      { month: 'Sep', performance: 87, target: 87, walmart: 95, target_wmt: 90, amazon: 79, target_amz: 84 },
      { month: 'Oct', performance: 89, target: 88, walmart: 97, target_wmt: 91, amazon: 81, target_amz: 85 }
    ],
    aiSummary: {
      working: "Walmart partnership showing exceptional growth (+24% GSV) with strong velocity momentum. Promo execution excellence driving incremental lift.",
      action: "Amazon relationship requires immediate attention - velocity declining and shelf presence below target. Focus on search optimization.",
      narrative: "KAM performance demonstrates strong retailer partnership execution, particularly with Walmart. Amazon recovery initiative is critical priority."
    }
  },
  'Brand Manager': {
    title: 'Brand Manager',
    description: 'Brand portfolio performance and category insights',
    icon: Crown,
    color: 'hsl(var(--success))',
    metrics: [
      { label: 'Brand Share', value: '18.2%', change: '+1.4pts', status: 'success', target: '17.5%' },
      { label: 'Innovation Revenue', value: '$2.8M', change: '+45%', status: 'success', target: '$2.5M' },
      { label: 'Media Efficiency', value: '4.2x', change: '+35%', status: 'success', target: '3.8x' },
      { label: 'Consumer Sentiment', value: '89%', change: '+3%', status: 'success', target: '87%' }
    ],
    chartData: [
      { month: 'Jul', performance: 88, target: 85, snickers: 92, skittles: 89, mm: 83, gum: 94 },
      { month: 'Aug', performance: 91, target: 86, snickers: 95, skittles: 92, mm: 85, gum: 97 },
      { month: 'Sep', performance: 93, target: 87, snickers: 97, skittles: 94, mm: 88, gum: 99 },
      { month: 'Oct', performance: 95, target: 88, snickers: 99, skittles: 96, mm: 90, gum: 101 }
    ],
    aiSummary: {
      working: "Gum category massively outperforming (+34% vs chocolate) with superior microseason execution. Innovation pipeline delivering strong ROI.",
      action: "Reallocate media investment from underperforming chocolate campaigns to high-momentum gum initiatives. Accelerate innovation rollout.",
      narrative: "Brand portfolio showing differentiated performance with gum category leading growth. Strategic reallocation opportunity identified."
    }
  },
  'Commercial Lead': {
    title: 'Commercial Lead',
    description: 'Revenue optimization and commercial strategy',
    icon: Target,
    color: 'hsl(var(--warning))',
    metrics: [
      { label: 'Revenue YTD', value: '$47.2M', change: '+16.3%', status: 'success', target: '$45.8M' },
      { label: 'Margin Improvement', value: '2.1%', change: '+0.8pts', status: 'success', target: '1.8%' },
      { label: 'Pricing Realization', value: '94%', change: '+2%', status: 'success', target: '92%' },
      { label: 'Trade Efficiency', value: '87%', change: '-3%', status: 'warning', target: '90%' }
    ],
    chartData: [
      { month: 'Jul', performance: 85, target: 88, revenue: 86, margin: 89, pricing: 84, trade: 81 },
      { month: 'Aug', performance: 88, target: 89, revenue: 89, margin: 91, pricing: 87, trade: 85 },
      { month: 'Sep', performance: 91, target: 90, revenue: 93, margin: 94, pricing: 89, trade: 88 },
      { month: 'Oct', performance: 94, target: 91, revenue: 96, margin: 97, pricing: 92, trade: 91 }
    ],
    aiSummary: {
      working: "Revenue momentum strong with margin expansion ahead of target. Pricing strategy execution delivering premium realization.",
      action: "Trade spending optimization required - efficiency declining vs plan. Review promotional calendar and fund allocation.",
      narrative: "Commercial execution driving strong financial performance with opportunity to optimize trade investment for maximum ROI."
    }
  },
  'Executive': {
    title: 'Executive Leadership',
    description: 'Strategic overview and business performance',
    icon: Users,
    color: 'hsl(var(--danger))',
    metrics: [
      { label: 'Business Growth', value: '+16.3%', change: 'vs LY', status: 'success', target: '+12%' },
      { label: 'Market Share', value: '18.2%', change: '+1.4pts', status: 'success', target: '17.8%' },
      { label: 'Digital Penetration', value: '31%', change: '+8pts', status: 'success', target: '28%' },
      { label: 'Strategic Initiatives', value: '78%', change: 'On Track', status: 'success', target: '80%' }
    ],
    chartData: [
      { month: 'Jul', performance: 89, target: 85, growth: 91, share: 88, digital: 87, initiatives: 85 },
      { month: 'Aug', performance: 92, target: 86, growth: 94, share: 91, digital: 90, initiatives: 88 },
      { month: 'Sep', performance: 94, target: 87, growth: 96, share: 93, digital: 93, initiatives: 91 },
      { month: 'Oct', performance: 96, target: 88, growth: 98, share: 95, digital: 96, initiatives: 94 }
    ],
    aiSummary: {
      working: "Exceptional business momentum with growth significantly ahead of plan. Digital transformation delivering competitive advantage.",
      action: "Amazon velocity recovery critical for sustained growth. Accelerate strategic initiatives to maintain leadership position.",
      narrative: "Business demonstrating strong strategic execution with digital-first approach driving market share gains and revenue growth."
    }
  }
};

export const PersonaWelcome = () => {
  const [selectedPersona, setSelectedPersona] = useState<keyof typeof personas | null>(null);

  if (!selectedPersona) {
    return (
      <div className="space-y-6 animate-slide-up">
        {/* Header */}
        <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
          <div className="flex items-center gap-4">
            <User className="h-8 w-8" />
            <div>
              <h2 className="text-xl font-bold">Choose Your Persona</h2>
              <p className="opacity-90">Select your role to see tailored insights and metrics</p>
            </div>
          </div>
        </Card>

        {/* Persona Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(personas).map(([key, persona]) => (
            <Card 
              key={key}
              className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card cursor-pointer hover:shadow-glow hover:scale-105 transition-all duration-300"
              onClick={() => setSelectedPersona(key as keyof typeof personas)}
            >
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: persona.color }}>
                  <persona.icon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{persona.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2">{persona.description}</p>
                </div>
                <Button className="w-full" style={{ backgroundColor: persona.color }}>
                  View Dashboard
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Stats */}
        <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
          <h3 className="font-semibold mb-4">Business Snapshot</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-2xl font-bold text-primary">$47.2M</p>
              <p className="text-sm text-muted-foreground">Total Revenue YTD</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-2xl font-bold text-success">+16.3%</p>
              <p className="text-sm text-muted-foreground">Growth vs LY</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-2xl font-bold text-warning">18.2%</p>
              <p className="text-sm text-muted-foreground">Market Share</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-2xl font-bold text-mars-blue-primary">4.2x</p>
              <p className="text-sm text-muted-foreground">Media ROI</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const persona = personas[selectedPersona];

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header with Back Button */}
      <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
              <persona.icon className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{persona.title} Dashboard</h2>
              <p className="opacity-90">{persona.description}</p>
            </div>
          </div>
          <Button 
            variant="secondary" 
            onClick={() => setSelectedPersona(null)}
            className="text-primary-foreground"
          >
            Change Persona
          </Button>
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {persona.metrics.map((metric, index) => (
          <Card key={index} className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{metric.label}</p>
              <p className="text-2xl font-bold">{metric.value}</p>
              <div className="flex items-center gap-2">
                <Badge className={
                  metric.status === 'success' ? 'bg-success/20 text-success' : 
                  metric.status === 'warning' ? 'bg-warning/20 text-warning' : 
                  'bg-muted text-muted-foreground'
                }>
                  {metric.change}
                </Badge>
                <p className="text-xs text-muted-foreground">Target: {metric.target}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Performance Chart */}
      <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Performance Trends - {persona.title}
        </h3>
        
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={persona.chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--foreground))" />
            <YAxis stroke="hsl(var(--foreground))" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }} 
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="performance" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              name="Performance Index"
            />
            <Line 
              type="monotone" 
              dataKey="target" 
              stroke="hsl(var(--success))" 
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Target"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* AI-Generated Insights */}
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
            <Sparkles className="h-4 w-4" />
            Executive Summary
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {persona.aiSummary.narrative}
          </p>
        </Card>
      </div>
    </div>
  );
};