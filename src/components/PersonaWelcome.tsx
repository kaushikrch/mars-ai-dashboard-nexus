'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { KPICard } from './KPICard';
import {
  User, Users, Building2, Crown, TrendingUp, Sparkles,
  Search as SearchIcon, Megaphone, BarChart3, Target, ArrowLeft
} from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';

const EXEC_DASHBOARD_ROUTE = '/dashboard/executive'; // adjust if your route differs

type Metric = { label: string; value: string; change: string; status: 'success' | 'warning' | 'neutral'; target: string };
type PersonaDef = {
  title: string;
  description: string;
  icon: any;
  color: string;
  metrics: Metric[];
  chartData: Array<Record<string, number | string>>;
  aiSummary: { working: string; action: string; narrative: string };
};

// --- Personas to show on the Welcome page ---
const personas: Record<string, PersonaDef> = {
  'Executive Leadership': {
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
      { month: 'Jul', performance: 89, target: 85 },
      { month: 'Aug', performance: 92, target: 86 },
      { month: 'Sep', performance: 94, target: 87 },
      { month: 'Oct', performance: 96, target: 88 }
    ],
    aiSummary: {
      working: 'Exceptional business momentum with growth significantly ahead of plan.',
      action: 'Accelerate strategic initiatives while focusing on Amazon velocity recovery.',
      narrative: 'Digital-first execution is driving market share gains and revenue growth.'
    }
  },
  'Brand/Category Manager': {
    title: 'Brand/Category Manager',
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
      { month: 'Jul', performance: 88, target: 85 },
      { month: 'Aug', performance: 91, target: 86 },
      { month: 'Sep', performance: 93, target: 87 },
      { month: 'Oct', performance: 95, target: 88 }
    ],
    aiSummary: {
      working: 'Gum category momentum accelerating with microseason strategy.',
      action: 'Reallocate underperforming chocolate media to high-ROI gum.',
      narrative: 'Portfolio strategy is working; accelerate seasonal innovations.'
    }
  },
  'Key Account Manager': {
    title: 'Key Account Manager',
    description: 'Retailer-focused performance and relationship management',
    icon: Building2,
    color: 'hsl(var(--primary))',
    // ---- UPDATED TILES ----
    metrics: [
      { label: 'Customer GSV YTD', value: '$12.3M', change: 'vs LY', status: 'success', target: '$11.8M' },
      { label: 'GSV % Change YoY', value: '+24%', change: 'Target: +20%', status: 'success', target: '+20%' },
      { label: 'Online Share', value: '23%', change: '+2.3 pts', status: 'success', target: '≥22%' },
      { label: 'Customer Market Share', value: '18.2%', change: '+0.8 pts', status: 'success', target: '19.0%' }
    ],
    chartData: [
      { month: 'Jul', performance: 82, target: 85 },
      { month: 'Aug', performance: 85, target: 86 },
      { month: 'Sep', performance: 87, target: 87 },
      { month: 'Oct', performance: 89, target: 88 }
    ],
    aiSummary: {
      working: 'Walmart partnership showing strong velocity & GSV growth.',
      action: 'Amazon recovery: fix availability & search placement.',
      narrative: 'Retailer execution strong; Amazon is priority action.'
    }
  },
  'Search Manager': {
    title: 'Search Manager',
    description: 'SOS, keyword strategy, and retail search performance',
    icon: SearchIcon,
    color: 'hsl(var(--warning))',
    metrics: [
      { label: 'Share of Search', value: '62%', change: '+2.1pts', status: 'success', target: '60%' },
      { label: 'Top KW ROAS', value: '$4.2', change: '+18%', status: 'success', target: '$3.6' },
      { label: 'Voice Search Share', value: '45%', change: '+12%', status: 'success', target: '40%' },
      { label: 'PDP Traffic QoQ', value: '+18%', change: 'QoQ', status: 'success', target: '+12%' }
    ],
    chartData: [
      { month: 'Jul', performance: 84, target: 82 },
      { month: 'Aug', performance: 87, target: 84 },
      { month: 'Sep', performance: 89, target: 85 },
      { month: 'Oct', performance: 90, target: 86 }
    ],
    aiSummary: {
      working: 'Microseason keywords drive majority of incremental SOS gains.',
      action: 'Shift budget to top 20 converting keywords; prune low-ROAS tail.',
      narrative: 'Search hygiene and microseasoning are compounding SOS.'
    }
  },
  'Media Manager': {
    title: 'Media Manager',
    description: 'Paid media efficiency and mix optimization',
    icon: Megaphone,
    color: 'hsl(var(--mars-blue-primary))',
    metrics: [
      { label: 'Shopper Media ROAS', value: '$4.2', change: '+35%', status: 'success', target: '$3.1' },
      { label: 'Spend YTD', value: '$11.8M', change: '+9%', status: 'success', target: '$11.5M' },
      { label: 'Upper/Mid/Lower Mix', value: '20/35/45', change: 'within guardrail', status: 'success', target: '20/35/45' },
      { label: 'Frequency (Retail Media)', value: '3.4', change: '+0.4', status: 'success', target: '3.0' }
    ],
    chartData: [
      { month: 'Jul', performance: 83, target: 80 },
      { month: 'Aug', performance: 86, target: 82 },
      { month: 'Sep', performance: 90, target: 84 },
      { month: 'Oct', performance: 92, target: 86 }
    ],
    aiSummary: {
      working: 'Retail media ROAS ahead of plan with optimized lower-funnel.',
      action: 'Test creative variants on top SKUs to lift CTR by 8–10%.',
      narrative: 'Media cadence is efficient; expand in winning placements.'
    }
  }
};

// ---- KAM-only mock datasets ----
const KAM_CATEGORY_MIX = [
  { name: 'Chocolate', value: 52, yoy: 14, rank: 1 },
  { name: 'Fruity', value: 26, yoy: 9,  rank: 2 },
  { name: 'Gum',      value: 15, yoy: 4,  rank: 3 },
  { name: 'Mint',     value: 7,  yoy: 7,  rank: 4 },
];

const KAM_CUSTOMER_CATEGORY_SHARE = [
  { category: 'Chocolate', Walmart: 22, Target: 18, Amazon: 16, Kroger: 12 },
  { category: 'Fruity',    Walmart: 19, Target: 17, Amazon: 14, Kroger: 10 },
  { category: 'Gum',       Walmart: 11, Target: 9,  Amazon: 7,  Kroger: 6  },
  { category: 'Mint',      Walmart: 13, Target: 10, Amazon: 8,  Kroger: 7  },
];

// Competitor DCom share grid values (example demo data)
const DCOM_COMP = [
  {
    name: 'Hershey',
    Total:  { share: 28.7, change: +0.1, growth: 21.49 },
    Chocolate: { share: 41.1, change: +0.7, growth: 23.97 },
    Fruity: { share: 10.6, change: -1.0, growth: 12.14 },
    Gum: { share: 14.6, change: -1.1, growth: 0.14 },
    Mint: { share: 20.4, change: +2.2, growth: 14.73 }
  },
  {
    name: 'Ferrero/Ferrara',
    Total:  { share: 10.2, change: +0.1, growth: 16.27 },
    Chocolate: { share: 5.5, change: -0.7, growth: 8.06 },
    Fruity: { share: 19.2, change: +1.4, growth: 32.77 },
    Gum: { share: 11.7, change: -6.4, growth: -30.30 },
    Mint: { share: 11.8, change: -6.9, growth: -35.42 }
  },
  {
    name: 'Lindt',
    Total:  { share: 9.4, change: -0.3, growth: 16.75 },
    Chocolate: { share: 16.2, change: -0.7, growth: 19.06 },
    Fruity: { share: 7.7, change: -0.7, growth: 13.39 },
    Gum: { share: 4.0, change: -1.7, growth: -24.18 },
    Mint: { share: 4.8, change: -2.9, growth: -36.07 }
  }
];

const PIE_COLORS = ['#7c3aed', '#f59e0b', '#10b981', '#0ea5e9'];

const pct = (v: number) => `${v}%`;
const changeColor = (v: number) => (v >= 0 ? 'text-success' : 'text-danger');

export const PersonaWelcome = () => {
  const navigate = useNavigate();
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {Object.entries(personas).map(([key, persona]) => (
            <Card
              key={key}
              className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card cursor-pointer hover:shadow-glow hover:scale-105 transition-all duration-300"
              onClick={() => {
                if (key === 'Executive Leadership') navigate(EXEC_DASHBOARD_ROUTE);
                else setSelectedPersona(key as keyof typeof personas);
              }}
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

        {/* Business Snapshot consistent with Executive page */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard title="GSV YTD" value="$47.2M" change="+16.3%" changeType="positive" icon="dollar" subtitle="GSV Growth" isAnimated={false}/>
          <KPICard title="Annual GSV Plan" value="$185.0M" change="+8.0%" changeType="positive" icon="target" subtitle="YoY Growth Plan" isAnimated={false}/>
          <KPICard title="Share of Search (SOS)" value="62%" change="+2.1 pts" changeType="positive" icon="target" subtitle="vs LY" isAnimated={false}/>
          <KPICard title="Shopper Media ROAS" value="$4.2" change="+35%" changeType="positive" icon="dollar" subtitle="vs Media Spend YTD" isAnimated={false}/>
        </div>
      </div>
    );
  }

  // ---------- Persona Dashboard ----------
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
          <Button variant="secondary" onClick={() => setSelectedPersona(null)} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Personas
          </Button>
        </div>
      </Card>

      {/* KPI Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {persona.metrics.map((metric, index) => (
          <Card key={index} className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{metric.label}</p>
              <p className="text-2xl font-bold">{metric.value}</p>
              <div className="flex items-center gap-2">
                <Badge
                  className={
                    metric.status === 'success'
                      ? 'bg-success/20 text-success'
                      : metric.status === 'warning'
                      ? 'bg-warning/20 text-warning'
                      : 'bg-muted text-muted-foreground'
                  }
                >
                  {metric.change}
                </Badge>
                <p className="text-xs text-muted-foreground">Target: {metric.target}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* KAM-only: Category Performance Snapshot (Pie) */}
      {persona.title === 'Key Account Manager' && (
        <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
          <h3 className="font-semibold mb-4">Category Performance Snapshot</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie dataKey="value" data={KAM_CATEGORY_MIX} innerRadius={48} outerRadius={90} paddingAngle={2}>
                    {KAM_CATEGORY_MIX.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: any) => [`${v}%`, '% of Business']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {KAM_CATEGORY_MIX.map((c) => (
                <div key={c.name} className="p-3 rounded-lg bg-muted/30">
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="text-xl font-bold">{c.value}%</p>
                  <p className={`text-xs ${c.yoy >= 0 ? 'text-success' : 'text-danger'}`}>YoY: {c.yoy >= 0 ? '+' : ''}{c.yoy}%</p>
                  <p className="text-xs text-muted-foreground">Rank: {c.rank}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Chart: Market/Total Share by Customer across Categories (Grouped Bars) */}
      <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Category Share by Customer (Market Total)
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={KAM_CUSTOMER_CATEGORY_SHARE} barGap={6}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(v: any) => [`${v}%`, 'Share']} />
              <Legend />
              <Bar dataKey="Walmart" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Target" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Amazon" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Kroger" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* DCom Share vs Competitors */}
      <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
        <h3 className="font-semibold mb-4">DCom Share — Top Competitors</h3>
        <div className="overflow-x-auto">
          <table className="min-w-[720px] w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="py-2 pr-4">Competitor</th>
                <th className="py-2 px-4">Total</th>
                <th className="py-2 px-4">Chocolate</th>
                <th className="py-2 px-4">Fruity</th>
                <th className="py-2 px-4">Gum</th>
                <th className="py-2 px-4">Mint</th>
              </tr>
            </thead>
            <tbody>
              {DCOM_COMP.map((r) => (
                <tr key={r.name} className="border-t">
                  <td className="py-3 pr-4 font-medium">{r.name}</td>
                  {(['Total','Chocolate','Fruity','Gum','Mint'] as const).map((k) => {
                    const cell = r[k];
                    return (
                      <td key={k} className="py-3 px-4 align-top">
                        <div className="font-semibold">{cell.share.toFixed(1)}%</div>
                        <div className={`${changeColor(cell.change)} text-xs`}>
                          {cell.change >= 0 ? '+' : ''}{cell.change.toFixed(1)} pts
                        </div>
                        <div className={`${changeColor(cell.growth)} text-xs`}>
                          Sales Gr: {cell.growth >= 0 ? '+' : ''}{cell.growth.toFixed(2)}%
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* AI Insights (unchanged) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
          <h4 className="font-semibold mb-3 text-success flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            What's Working?
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{persona.aiSummary.working}</p>
        </Card>

        <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
          <h4 className="font-semibold mb-3 text-warning flex items-center gap-2">
            <Target className="h-4 w-4" />
            Where to Act?
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{persona.aiSummary.action}</p>
        </Card>

        <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
          <h4 className="font-semibold mb-3 text-primary flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Executive Summary
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{persona.aiSummary.narrative}</p>
        </Card>
      </div>
    </div>
  );
};