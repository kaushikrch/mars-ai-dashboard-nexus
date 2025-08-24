'use client';

import React, { useEffect, useMemo, useState } from 'react';
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
  PieChart, Pie, Cell, BarChart, Bar, ComposedChart
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

// ---------- Personas (KAM & others unchanged; Brand view is overridden below) ----------
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
      working: 'Exceptional business momentum with growth ahead of plan.',
      action: 'Accelerate initiatives; focus Amazon velocity recovery.',
      narrative: 'Digital-first execution is compounding market share gains.'
    }
  },
  'Brand/Category Manager': {
    title: 'Brand/Category Manager',
    description: 'Brand portfolio performance and category insights',
    icon: Crown,
    color: 'hsl(var(--success))',
    // metrics here are unused; the Brand view renders a custom layout below
    metrics: [
      { label: '—', value: '—', change: '—', status: 'neutral', target: '—' },
      { label: '—', value: '—', change: '—', status: 'neutral', target: '—' },
      { label: '—', value: '—', change: '—', status: 'neutral', target: '—' },
      { label: '—', value: '—', change: '—', status: 'neutral', target: '—' }
    ],
    chartData: [
      { month: 'Jul', performance: 88, target: 85 },
      { month: 'Aug', performance: 91, target: 86 },
      { month: 'Sep', performance: 93, target: 87 },
      { month: 'Oct', performance: 95, target: 88 }
    ],
    aiSummary: {
      working: 'Gum momentum via microseason; strong innovation ROI.',
      action: 'Shift underperforming chocolate media to high-ROI gum.',
      narrative: 'Portfolio is healthy; accelerate seasonal innovations.'
    }
  },
  'Key Account Manager': {
    title: 'Key Account Manager',
    description: 'Retailer-focused performance and relationship management',
    icon: Building2,
    color: 'hsl(var(--primary))',
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
      working: 'Microseason keywords drive majority of SOS gains.',
      action: 'Shift to top 20 converting keywords; prune long tail.',
      narrative: 'Search hygiene + microseasoning compounding SOS.'
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
      action: 'Test creative variants to lift CTR by 8–10%.',
      narrative: 'Media cadence efficient; expand in winning placements.'
    }
  }
};

// ---------------- Brand/Category datasets (demo) -----------------
type BrandRow = { name: string; gsvM: number; yoyPct: number; dcomSharePct: number; shareChangePct: number };
type CatBlock = {
  brands: BrandRow[];
  gsvTargetM: number;
  marketSharePct: number;
  categoryGrowthPct: number;
  totalSharePct: number;        // used for "DCom Share" tile (demo)
  totalShareChangePct: number;  // used for tile below
};
type BrandData = Record<'Chocolate' | 'Fruity' | 'Gum' | 'Mint', CatBlock>;
type BrandPageData = Record<'2025 YTD' | '2024 YTD', BrandData>;

const BRAND_PAGE: BrandPageData = {
  '2025 YTD': {
    Chocolate: {
      brands: [
        { name: 'Brand 1', gsvM: 82, yoyPct: 5,  dcomSharePct: 12, shareChangePct: 0.6 },
        { name: 'Brand 2', gsvM: 31, yoyPct: 18, dcomSharePct: 8,  shareChangePct: 0.4 },
        { name: 'Brand 3', gsvM: 25, yoyPct: -7, dcomSharePct: 5,  shareChangePct: -0.3 },
        { name: 'Brand 4', gsvM: 74, yoyPct: 12, dcomSharePct: 10, shareChangePct: 0.5 }
      ],
      gsvTargetM: 200,
      marketSharePct: 22.1,
      categoryGrowthPct: 8.4,
      totalSharePct: 18.2,
      totalShareChangePct: 1.4
    },
    Fruity: {
      brands: [
        { name: 'Brand A', gsvM: 34, yoyPct: 9,  dcomSharePct: 10, shareChangePct: 0.5 },
        { name: 'Brand B', gsvM: 22, yoyPct: 6,  dcomSharePct: 7,  shareChangePct: 0.2 },
        { name: 'Brand C', gsvM: 18, yoyPct: -2, dcomSharePct: 5,  shareChangePct: -0.1 },
        { name: 'Brand D', gsvM: 26, yoyPct: 11, dcomSharePct: 8,  shareChangePct: 0.6 }
      ],
      gsvTargetM: 120,
      marketSharePct: 14.0,
      categoryGrowthPct: 6.1,
      totalSharePct: 12.4,
      totalShareChangePct: 0.7
    },
    Gum: {
      brands: [
        { name: 'FreshCo', gsvM: 28, yoyPct: 15, dcomSharePct: 16, shareChangePct: 1.2 },
        { name: 'ChewMax', gsvM: 19, yoyPct: 12, dcomSharePct: 12, shareChangePct: 0.9 },
        { name: 'PopMint', gsvM: 14, yoyPct: 6,  dcomSharePct: 9,  shareChangePct: 0.3 },
        { name: 'ZapGum',  gsvM: 11, yoyPct: -3, dcomSharePct: 7,  shareChangePct: -0.2 }
      ],
      gsvTargetM: 90,
      marketSharePct: 20.5,
      categoryGrowthPct: 9.0,
      totalSharePct: 15.9,
      totalShareChangePct: 0.9
    },
    Mint: {
      brands: [
        { name: 'CoolMint',  gsvM: 21, yoyPct: 7,  dcomSharePct: 11, shareChangePct: 0.6 },
        { name: 'Breeze',    gsvM: 16, yoyPct: 5,  dcomSharePct: 8,  shareChangePct: 0.3 },
        { name: 'IcyBlast',  gsvM: 12, yoyPct: -4, dcomSharePct: 6,  shareChangePct: -0.2 },
        { name: 'FreshMint', gsvM: 25, yoyPct: 10, dcomSharePct: 12, shareChangePct: 0.4 }
      ],
      gsvTargetM: 75,
      marketSharePct: 16.4,
      categoryGrowthPct: 5.2,
      totalSharePct: 13.9,
      totalShareChangePct: 0.8
    }
  },
  '2024 YTD': {
    Chocolate: {
      brands: [
        { name: 'Brand 1', gsvM: 75, yoyPct: 3,  dcomSharePct: 11, shareChangePct: 0.3 },
        { name: 'Brand 2', gsvM: 28, yoyPct: 10, dcomSharePct: 7,  shareChangePct: 0.2 },
        { name: 'Brand 3', gsvM: 24, yoyPct: -4, dcomSharePct: 5,  shareChangePct: -0.1 },
        { name: 'Brand 4', gsvM: 66, yoyPct: 9,  dcomSharePct: 9,  shareChangePct: 0.3 }
      ],
      gsvTargetM: 185,
      marketSharePct: 21.0,
      categoryGrowthPct: 5.0,
      totalSharePct: 17.2,
      totalShareChangePct: 0.5
    },
    Fruity: {
      brands: [
        { name: 'Brand A', gsvM: 30, yoyPct: 5,  dcomSharePct: 9, shareChangePct: 0.3 },
        { name: 'Brand B', gsvM: 20, yoyPct: 4,  dcomSharePct: 6, shareChangePct: 0.1 },
        { name: 'Brand C', gsvM: 17, yoyPct: -1, dcomSharePct: 5, shareChangePct: -0.1 },
        { name: 'Brand D', gsvM: 22, yoyPct: 8,  dcomSharePct: 7, shareChangePct: 0.4 }
      ],
      gsvTargetM: 110,
      marketSharePct: 13.2,
      categoryGrowthPct: 4.0,
      totalSharePct: 11.6,
      totalShareChangePct: 0.3
    },
    Gum: {
      brands: [
        { name: 'FreshCo', gsvM: 24, yoyPct: 8,  dcomSharePct: 14, shareChangePct: 0.5 },
        { name: 'ChewMax', gsvM: 18, yoyPct: 6,  dcomSharePct: 11, shareChangePct: 0.4 },
        { name: 'PopMint', gsvM: 13, yoyPct: 2,  dcomSharePct: 8,  shareChangePct: 0.1 },
        { name: 'ZapGum',  gsvM: 12, yoyPct: -2, dcomSharePct: 7,  shareChangePct: -0.1 }
      ],
      gsvTargetM: 80,
      marketSharePct: 19.1,
      categoryGrowthPct: 3.5,
      totalSharePct: 14.8,
      totalShareChangePct: 0.3
    },
    Mint: {
      brands: [
        { name: 'CoolMint',  gsvM: 19, yoyPct: 3,  dcomSharePct: 10, shareChangePct: 0.2 },
        { name: 'Breeze',    gsvM: 15, yoyPct: 3,  dcomSharePct: 7,  shareChangePct: 0.1 },
        { name: 'IcyBlast',  gsvM: 12, yoyPct: -3, dcomSharePct: 6,  shareChangePct: -0.1 },
        { name: 'FreshMint', gsvM: 22, yoyPct: 6,  dcomSharePct: 10, shareChangePct: 0.2 }
      ],
      gsvTargetM: 70,
      marketSharePct: 15.6,
      categoryGrowthPct: 2.8,
      totalSharePct: 12.9,
      totalShareChangePct: 0.2
    }
  }
};

const PIE_COLORS = ['#7c3aed', '#f59e0b', '#10b981', '#0ea5e9'];
const asMoneyM = (v: number) => `$${v.toLocaleString(undefined, { maximumFractionDigits: 1 })}M`;
const trendType = (v: number): 'positive' | 'negative' | 'neutral' => (v > 0 ? 'positive' : v < 0 ? 'negative' : 'neutral');

// ---- KAM-only helpers/data (from prior step) ----
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
const DCOM_COMP = [
  { name: 'Hershey', Total:  { share: 28.7, change: +0.1, growth: 21.49 }, Chocolate: { share: 41.1, change: +0.7, growth: 23.97 }, Fruity: { share: 10.6, change: -1.0, growth: 12.14 }, Gum: { share: 14.6, change: -1.1, growth: 0.14 }, Mint: { share: 20.4, change: +2.2, growth: 14.73 } },
  { name: 'Ferrero/Ferrara', Total:  { share: 10.2, change: +0.1, growth: 16.27 }, Chocolate: { share: 5.5, change: -0.7, growth: 8.06 }, Fruity: { share: 19.2, change: +1.4, growth: 32.77 }, Gum: { share: 11.7, change: -6.4, growth: -30.30 }, Mint: { share: 11.8, change: -6.9, growth: -35.42 } },
  { name: 'Lindt', Total:  { share: 9.4, change: -0.3, growth: 16.75 }, Chocolate: { share: 16.2, change: -0.7, growth: 19.06 }, Fruity: { share: 7.7, change: -0.7, growth: 13.39 }, Gum: { share: 4.0, change: -1.7, growth: -24.18 }, Mint: { share: 4.8, change: -2.9, growth: -36.07 } }
];

const changeColor = (v: number) => (v >= 0 ? 'text-success' : 'text-danger');

// ----------------------------------------------------------------

export const PersonaWelcome = () => {
  const navigate = useNavigate();
  const [selectedPersona, setSelectedPersona] = useState<keyof typeof personas | null>(null);

  // ---------- Welcome Screen ----------
  if (!selectedPersona) {
    return (
      <div className="space-y-6 animate-slide-up">
        <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
          <div className="flex items-center gap-4">
            <User className="h-8 w-8" />
            <div>
              <h2 className="text-xl font-bold">Choose Your Persona</h2>
              <p className="opacity-90">Select your role to see tailored insights and metrics</p>
            </div>
          </div>
        </Card>

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

  // SPECIALIZED BRAND/CATEGORY VIEW
  const isBrandView = persona.title === 'Brand/Category Manager';

  // Brand filters & derived metrics
  const TIME_PERIODS = ['2025 YTD', '2024 YTD'] as const;
  const CATS = ['Chocolate', 'Fruity', 'Gum', 'Mint'] as const;

  const [timePeriod, setTimePeriod] = useState<typeof TIME_PERIODS[number]>('2025 YTD');
  const [category, setCategory] = useState<typeof CATS[number]>('Chocolate');
  const brandOptions = useMemo(() => BRAND_PAGE[timePeriod][category].brands.map(b => b.name), [timePeriod, category]);
  const [brands, setBrands] = useState<string[]>(brandOptions);

  useEffect(() => { setBrands(brandOptions); }, [brandOptions]);

  const catBlock = BRAND_PAGE[timePeriod][category];
  const selectedRows = useMemo(
    () => catBlock.brands.filter(b => brands.includes(b.name)),
    [catBlock.brands, brands]
  );

  const gsvTotal = selectedRows.reduce((s, r) => s + r.gsvM, 0);
  const yoyWeighted = gsvTotal > 0
    ? selectedRows.reduce((s, r) => s + r.yoyPct * r.gsvM, 0) / gsvTotal
    : 0;

  // For demo, DCom share tile uses category-level totals
  const dcomShare = catBlock.totalSharePct;
  const dcomShareChangePct = catBlock.totalShareChangePct;

  // Market share tile (category-level)
  const marketShare = catBlock.marketSharePct;
  const catGrowthRate = catBlock.categoryGrowthPct;

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

        {/* BRAND FILTERS */}
        {isBrandView && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Time Period</span>
              <select
                className="h-9 rounded-md border bg-background px-3 text-sm w-full"
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value as typeof TIME_PERIODS[number])}
              >
                {TIME_PERIODS.map(tp => <option key={tp} value={tp}>{tp}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Category</span>
              <select
                className="h-9 rounded-md border bg-background px-3 text-sm w-full"
                value={category}
                onChange={(e) => setCategory(e.target.value as typeof CATS[number])}
              >
                {CATS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-sm text-muted-foreground min-w-[64px] mt-2">Brands</span>
              <select
                multiple
                className="rounded-md border bg-background p-2 text-sm w-full h-24"
                value={brands}
                onChange={(e) => {
                  const opts = Array.from(e.target.selectedOptions).map(o => o.value);
                  setBrands(opts);
                }}
              >
                {brandOptions.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </div>
        )}
      </Card>

      {/* BRAND KPIs */}
      {isBrandView ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="DCom Share"
            value={`${dcomShare.toFixed(1)}%`}
            change={`${dcomShareChangePct >= 0 ? '+' : ''}${dcomShareChangePct.toFixed(1)}%`}
            changeType={trendType(dcomShareChangePct)}
            icon="target"
            subtitle={`Total Share: ${dcomShare.toFixed(1)}%`}
          />
          <KPICard
            title="GSV YTD"
            value={asMoneyM(gsvTotal)}
            change=" "
            changeType="neutral"
            icon="dollar"
            subtitle={`Target: ${asMoneyM(catBlock.gsvTargetM)}`}
          />
          <KPICard
            title="GSV YoY% Change"
            value={`${yoyWeighted.toFixed(1)}%`}
            change="vs LY"
            changeType={trendType(yoyWeighted)}
            icon="target"
            subtitle=" "
          />
          <KPICard
            title="Market Share"
            value={`${marketShare.toFixed(1)}%`}
            change={`${catGrowthRate >= 0 ? '+' : ''}${catGrowthRate.toFixed(1)}%`}
            changeType={trendType(catGrowthRate)}
            icon="users"
            subtitle="Category Growth Rate"
          />
        </div>
      ) : (
        // Non-brand personas keep their generic tiles
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
      )}

      {/* BRAND: Performance by Brands (GSV + YoY%) */}
      {isBrandView && (
        <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
          <h3 className="font-semibold mb-4">Performance by Brands — {category}</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={selectedRows}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" tickFormatter={(v) => `$${v}M`} />
                <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `${v}%`} />
                <Tooltip formatter={(val: any, name: string) => name.includes('YoY') ? [`${val}%`, name] : [`$${val}M`, name]} />
                <Legend />
                <Bar yAxisId="left" dataKey="gsvM" name="GSV (M)" radius={[6,6,0,0]} />
                <Line yAxisId="right" type="monotone" dataKey="yoyPct" name="YoY % Change" strokeWidth={3} dot />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* GENERIC: Performance Trends (kept after the brand chart) */}
      <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Performance Trends — {persona.title}
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
            <Line type="monotone" dataKey="performance" stroke="hsl(var(--primary))" strokeWidth={3} name="Performance Index" />
            <Line type="monotone" dataKey="target" stroke="hsl(var(--success))" strokeWidth={2} strokeDasharray="5 5" name="Target" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* KAM-only components retained from earlier step */}
      {persona.title === 'Key Account Manager' && (
        <>
          {/* Category Performance Snapshot (Pie) */}
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

          {/* Category Share by Customer */}
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

          {/* DCom Share — Competitors */}
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
                        const cell = (r as any)[k];
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
        </>
      )}

      {/* AI-Generated Insights */}
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
