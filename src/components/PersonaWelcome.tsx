'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
    name: 'Ferraro',
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

// ---- KAM Data by Customer and Time Period ----
const KAM_DATA = {
  'All Customers': {
    '2025 YTD': {
      metrics: [
        { label: 'Customer GSV YTD', value: '$12.3M', change: 'vs LY', status: 'success', target: '$11.8M' },
        { label: 'GSV % Change YoY', value: '+24%', change: 'Target: +20%', status: 'success', target: '+20%' },
        { label: 'Online Share', value: '23%', change: '+2.3 pts', status: 'success', target: '≥22%' },
        { label: 'Customer Market Share', value: '18.2%', change: '+0.8 pts', status: 'success', target: '19.0%' }
      ],
      categoryMix: [
        { name: 'Chocolate', value: 42, yoy: 14, rank: 1 },
        { name: 'Fruity', value: 25, yoy: 9, rank: 2 },
        { name: 'Gum', value: 18, yoy: 4, rank: 3 },
        { name: 'Mint', value: 15, yoy: 7, rank: 4 },
      ],
      customerShare: [
        { customer: 'Amazon', Chocolate: 48, Fruity: 22, Gum: 12, Mint: 18 },
        { customer: 'Walmart', Chocolate: 38, Fruity: 28, Gum: 19, Mint: 15 },
        { customer: 'Target', Chocolate: 44, Fruity: 26, Gum: 18, Mint: 12 },
        { customer: 'Kroger', Chocolate: 38, Fruity: 24, Gum: 22, Mint: 16 },
      ]
    },
    '2024 YTD': {
      metrics: [
        { label: 'Customer GSV YTD', value: '$11.8M', change: 'vs LY', status: 'success', target: '$11.0M' },
        { label: 'GSV % Change YoY', value: '+18%', change: 'Target: +15%', status: 'success', target: '+15%' },
        { label: 'Online Share', value: '21%', change: '+1.8 pts', status: 'success', target: '≥20%' },
        { label: 'Customer Market Share', value: '17.4%', change: '+0.6 pts', status: 'success', target: '18.0%' }
      ],
      categoryMix: [
        { name: 'Chocolate', value: 45, yoy: 12, rank: 1 },
        { name: 'Fruity', value: 23, yoy: 8, rank: 2 },
        { name: 'Gum', value: 17, yoy: 3, rank: 3 },
        { name: 'Mint', value: 15, yoy: 5, rank: 4 },
      ],
      customerShare: [
        { customer: 'Amazon', Chocolate: 46, Fruity: 20, Gum: 14, Mint: 20 },
        { customer: 'Walmart', Chocolate: 42, Fruity: 25, Gum: 18, Mint: 15 },
        { customer: 'Target', Chocolate: 48, Fruity: 24, Gum: 16, Mint: 12 },
        { customer: 'Kroger', Chocolate: 44, Fruity: 23, Gum: 19, Mint: 14 },
      ]
    }
  },
  'Amazon': {
    '2025 YTD': {
      metrics: [
        { label: 'Customer GSV YTD', value: '$3.8M', change: 'vs LY', status: 'warning', target: '$4.2M' },
        { label: 'GSV % Change YoY', value: '+8%', change: 'Target: +20%', status: 'warning', target: '+20%' },
        { label: 'Online Share', value: '56%', change: '+1.2 pts', status: 'success', target: '≥55%' },
        { label: 'Customer Market Share', value: '16.5%', change: '-0.3 pts', status: 'warning', target: '17.0%' }
      ],
      categoryMix: [
        { name: 'Chocolate', value: 48, yoy: 6, rank: 1 },
        { name: 'Fruity', value: 22, yoy: 12, rank: 2 },
        { name: 'Gum', value: 12, yoy: -2, rank: 4 },
        { name: 'Mint', value: 18, yoy: 8, rank: 3 },
      ],
      customerShare: [
        { customer: 'Amazon', Chocolate: 48, Fruity: 22, Gum: 12, Mint: 18 },
      ]
    }
  },
  'Walmart': {
    '2025 YTD': {
      metrics: [
        { label: 'Customer GSV YTD', value: '$4.2M', change: 'vs LY', status: 'success', target: '$3.8M' },
        { label: 'GSV % Change YoY', value: '+32%', change: 'Target: +20%', status: 'success', target: '+20%' },
        { label: 'Online Share', value: '18%', change: '+3.2 pts', status: 'success', target: '≥15%' },
        { label: 'Customer Market Share', value: '19.8%', change: '+1.4 pts', status: 'success', target: '19.0%' }
      ],
      categoryMix: [
        { name: 'Chocolate', value: 38, yoy: 18, rank: 1 },
        { name: 'Fruity', value: 28, yoy: 15, rank: 2 },
        { name: 'Gum', value: 19, yoy: 8, rank: 3 },
        { name: 'Mint', value: 15, yoy: 12, rank: 4 },
      ],
      customerShare: [
        { customer: 'Walmart', Chocolate: 38, Fruity: 28, Gum: 19, Mint: 15 },
      ]
    }
  }
};

const PIE_COLORS = ['hsl(var(--primary))', 'hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--danger))'];

const changeColor = (v: number) => (v >= 0 ? 'text-success' : 'text-danger');

export const PersonaWelcome = () => {
  const navigate = useNavigate();
  const [selectedPersona, setSelectedPersona] = useState<keyof typeof personas | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState('All Customers');
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('2025 YTD');

  // Get dynamic data based on filters
  const getKAMData = () => {
    const customerData = KAM_DATA[selectedCustomer as keyof typeof KAM_DATA];
    if (!customerData) return KAM_DATA['All Customers']['2025 YTD'];
    
    const timeData = customerData[selectedTimePeriod as keyof typeof customerData];
    return timeData || customerData['2025 YTD'] || KAM_DATA['All Customers']['2025 YTD'];
  };

  const kamData = getKAMData();

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

      {/* KAM-only: Filters */}
      {persona.title === 'Key Account Manager' && (
        <Card className="p-4 bg-gradient-glow border-mars-blue-secondary shadow-card">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Customer:</label>
              <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                <SelectTrigger className="w-[180px] bg-card border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border z-50">
                  <SelectItem value="All Customers">All Customers</SelectItem>
                  <SelectItem value="Amazon">Amazon</SelectItem>
                  <SelectItem value="Walmart">Walmart</SelectItem>
                  <SelectItem value="Target">Target</SelectItem>
                  <SelectItem value="Kroger">Kroger</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Time Period:</label>
              <Select value={selectedTimePeriod} onValueChange={setSelectedTimePeriod}>
                <SelectTrigger className="w-[160px] bg-card border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border z-50">
                  <SelectItem value="2025 YTD">2025 YTD</SelectItem>
                  <SelectItem value="2024 YTD">2024 YTD</SelectItem>
                  <SelectItem value="Q4 2024">Q4 2024</SelectItem>
                  <SelectItem value="Q3 2024">Q3 2024</SelectItem>
                  <SelectItem value="Q2 2024">Q2 2024</SelectItem>
                  <SelectItem value="Q1 2024">Q1 2024</SelectItem>
                  <SelectItem value="Full Year 2023">Full Year 2023</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      )}

      {/* KPI Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {(persona.title === 'Key Account Manager' ? kamData.metrics : persona.metrics).map((metric, index) => (
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
                  <Pie dataKey="value" data={kamData.categoryMix} innerRadius={48} outerRadius={90} paddingAngle={2}>
                    {kamData.categoryMix.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: any) => [`${v}%`, '% of Business']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {kamData.categoryMix.map((c) => (
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

      {/* Chart: Market Share by Retailer across Categories */}
      <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Market Share by Retailer
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={kamData.customerShare} barGap={6}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="customer" />
              <YAxis tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(v: any) => [`${v}%`, 'Market Share']} />
              <Legend />
              <Bar dataKey="Chocolate" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Fruity" fill="hsl(var(--success))" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Gum" fill="hsl(var(--warning))" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Mint" fill="hsl(var(--danger))" radius={[6, 6, 0, 0]} />
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