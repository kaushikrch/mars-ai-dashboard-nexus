'use client';

import React, { useMemo, useState } from 'react';
import { KPICard } from './KPICard';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle, AlertCircle, Clock } from 'lucide-react';

// If your project already has shadcn Select, use it; otherwise keep native <select>.
/* shadcn version (uncomment if available)
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem
} from '@/components/ui/select';
*/

import {
  ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList,
} from 'recharts';

type PlanStatus = 'completed' | 'in-progress' | 'upcoming';
type Rag = 'Ahead' | 'Flat' | 'Behind';

const planItems: { title: string; status: PlanStatus; progress: number }[] = [
  { title: 'Q3 Media Optimization', status: 'completed', progress: 100 },
  { title: 'Amazon Velocity Recovery', status: 'in-progress', progress: 65 },
  { title: 'Halloween Campaign Launch', status: 'upcoming', progress: 20 },
  { title: 'Category Share Growth', status: 'in-progress', progress: 80 },
];

// ------- Mock data keyed by Country and Time Period -------
const TIME_PERIODS = ['FY2025 YTD', 'FY2024 YTD'] as const;
const COUNTRIES = ['USA', 'UK', 'India'] as const;

type TimePeriod = typeof TIME_PERIODS[number];
type Country = typeof COUNTRIES[number];

type CustomerRow = {
  name: string;
  gsvM: number;       // absolute GSV (in $M)
  growthPct: number;  // YoY %
  progress: number;   // 0..100
  badge: string;      // status label
};

type CategoryRow = {
  name: string;
  gsvM: number;
  growthPct: number;
  progress: number;
  badge: string;
};

type QuarterRow = { q: string; gsvM: number; yoyPct: number; rag: Rag };

type PageData = {
  kpis: {
    gsvYtdM: number;
    gsvGrowthPct: number;

    annualGsvPlanM: number;
    yoyGrowthPlanPct: number;

    sosPct: number;
    sosDeltaPts: number;

    shopperRoas: number;
    mediaSpendYtdM: number;
  };
  customers: CustomerRow[];
  categories: CategoryRow[];
  quarters: QuarterRow[];
};

// Example dataset – adjust values later as needed
const DATA: Record<Country, Record<TimePeriod, PageData>> = {
  USA: {
    'FY2025 YTD': {
      kpis: {
        gsvYtdM: 47.2,
        gsvGrowthPct: 16.3,
        annualGsvPlanM: 185.0,
        yoyGrowthPlanPct: 8.0,
        sosPct: 62,
        sosDeltaPts: 2.1,
        shopperRoas: 4.2,
        mediaSpendYtdM: 11.8,
      },
      customers: [
        { name: 'Walmart',   gsvM: 12.3, growthPct: 24,  progress: 85, badge: '#1 Performer' },
        { name: 'Target',    gsvM: 8.7,  growthPct: 19,  progress: 72, badge: 'Strong Growth' },
        { name: 'Amazon',    gsvM: 6.2,  growthPct: -8,  progress: 45, badge: 'Needs Focus' },
        { name: "Sam's Club", gsvM: 4.1,  growthPct: 12,  progress: 68, badge: 'Improving' },
        { name: 'Kroger',    gsvM: 3.6,  growthPct: 7,   progress: 60, badge: 'Steady' },
        { name: 'DoorDash',  gsvM: 1.9,  growthPct: 28,  progress: 70, badge: 'On-Demand' },
        { name: 'Instacart', gsvM: 2.3,  growthPct: 22,  progress: 66, badge: 'On-Demand' },
        { name: 'Uber',      gsvM: 1.2,  growthPct: 15,  progress: 58, badge: 'On-Demand' },
      ],
      categories: [
        { name: 'Chocolate', gsvM: 18.4, growthPct: 14, progress: 78, badge: 'Leader' },
        { name: 'Fruity',    gsvM: 9.1,  growthPct: 9,  progress: 62, badge: 'Solid' },
        { name: 'Gum',       gsvM: 6.7,  growthPct: 4,  progress: 55, badge: 'Flat' },
        { name: 'Mint',      gsvM: 4.8,  growthPct: 7,  progress: 59, badge: 'Building' },
      ],
      quarters: [
        { q: 'Q1', gsvM: 11.2, yoyPct: 9,  rag: 'Ahead' },
        { q: 'Q2', gsvM: 12.6, yoyPct: 12, rag: 'Ahead' },
        { q: 'Q3', gsvM: 13.1, yoyPct: 5,  rag: 'Flat'  },
        { q: 'Q4', gsvM: 10.3, yoyPct: -1, rag: 'Behind'},
      ],
    },
    'FY2024 YTD': {
      kpis: {
        gsvYtdM: 40.6,
        gsvGrowthPct: 6.8,
        annualGsvPlanM: 170.0,
        yoyGrowthPlanPct: 5.0,
        sosPct: 60,
        sosDeltaPts: 0.8,
        shopperRoas: 3.1,
        mediaSpendYtdM: 10.5,
      },
      customers: [
        { name: 'Walmart',   gsvM: 10.7, growthPct: 14, progress: 75, badge: 'Leader' },
        { name: 'Target',    gsvM: 7.3,  growthPct: 12, progress: 63, badge: 'Growing' },
        { name: 'Amazon',    gsvM: 6.7,  growthPct: -2, progress: 50, badge: 'Mixed' },
        { name: "Sam's Club", gsvM: 3.5,  growthPct: 8,  progress: 58, badge: 'Stable' },
        { name: 'Kroger',    gsvM: 3.1,  growthPct: 5,  progress: 54, badge: 'Stable' },
        { name: 'DoorDash',  gsvM: 1.3,  growthPct: 18, progress: 55, badge: 'On-Demand' },
        { name: 'Instacart', gsvM: 1.8,  growthPct: 15, progress: 57, badge: 'On-Demand' },
        { name: 'Uber',      gsvM: 0.9,  growthPct: 10, progress: 48, badge: 'On-Demand' },
      ],
      categories: [
        { name: 'Chocolate', gsvM: 15.9, growthPct: 8,  progress: 70, badge: 'Leader' },
        { name: 'Fruity',    gsvM: 8.5,  growthPct: 6,  progress: 58, badge: 'Solid' },
        { name: 'Gum',       gsvM: 6.2,  growthPct: 2,  progress: 51, badge: 'Flat' },
        { name: 'Mint',      gsvM: 4.3,  growthPct: 3,  progress: 50, badge: 'Flat' },
      ],
      quarters: [
        { q: 'Q1', gsvM: 9.6,  yoyPct: 3,  rag: 'Flat'   },
        { q: 'Q2', gsvM: 10.5, yoyPct: 5,  rag: 'Flat'   },
        { q: 'Q3', gsvM: 10.2, yoyPct: 1,  rag: 'Flat'   },
        { q: 'Q4', gsvM: 10.3, yoyPct: -2, rag: 'Behind' },
      ],
    },
  },
  UK: {
    'FY2025 YTD': {
      kpis: { gsvYtdM: 21.4, gsvGrowthPct: 9.2, annualGsvPlanM: 92.0, yoyGrowthPlanPct: 6.0, sosPct: 58, sosDeltaPts: 1.2, shopperRoas: 3.9, mediaSpendYtdM: 6.1 },
      customers: [
        { name: 'Tesco', gsvM: 6.8, growthPct: 11, progress: 68, badge: 'Strong' },
        { name: "Sainsbury's", gsvM: 4.9, growthPct: 8, progress: 61, badge: 'Solid' },
        { name: 'Amazon', gsvM: 3.1, growthPct: -4, progress: 46, badge: 'Needs Focus' },
        { name: 'DoorDash', gsvM: 0.7, growthPct: 14, progress: 52, badge: 'On-Demand' },
        { name: 'Instacart', gsvM: 0.5, growthPct: 9, progress: 49, badge: 'On-Demand' },
        { name: 'Uber', gsvM: 0.6, growthPct: 12, progress: 50, badge: 'On-Demand' },
      ],
      categories: [
        { name: 'Chocolate', gsvM: 8.9, growthPct: 9, progress: 66, badge: 'Leader' },
        { name: 'Fruity', gsvM: 5.2, growthPct: 6, progress: 58, badge: 'Solid' },
        { name: 'Gum', gsvM: 3.6, growthPct: 3, progress: 52, badge: 'Flat' },
        { name: 'Mint', gsvM: 2.7, growthPct: 5, progress: 55, badge: 'Stable' },
      ],
      quarters: [
        { q: 'Q1', gsvM: 5.1, yoyPct: 6, rag: 'Flat' },
        { q: 'Q2', gsvM: 5.5, yoyPct: 8, rag: 'Ahead' },
        { q: 'Q3', gsvM: 5.4, yoyPct: 5, rag: 'Flat' },
        { q: 'Q4', gsvM: 5.4, yoyPct: 3, rag: 'Flat' },
      ],
    },
    'FY2024 YTD': {
      kpis: { gsvYtdM: 19.6, gsvGrowthPct: 4.0, annualGsvPlanM: 86.0, yoyGrowthPlanPct: 4.0, sosPct: 56, sosDeltaPts: 0.6, shopperRoas: 3.4, mediaSpendYtdM: 5.7 },
      customers: [
        { name: 'Tesco', gsvM: 6.2, growthPct: 7, progress: 64, badge: 'Strong' },
        { name: "Sainsbury's", gsvM: 4.5, growthPct: 5, progress: 58, badge: 'Solid' },
        { name: 'Amazon', gsvM: 3.2, growthPct: -1, progress: 49, badge: 'Mixed' },
        { name: 'DoorDash', gsvM: 0.5, growthPct: 10, progress: 50, badge: 'On-Demand' },
        { name: 'Instacart', gsvM: 0.4, growthPct: 8, progress: 48, badge: 'On-Demand' },
        { name: 'Uber', gsvM: 0.4, growthPct: 9, progress: 48, badge: 'On-Demand' },
      ],
      categories: [
        { name: 'Chocolate', gsvM: 8.1, growthPct: 5, progress: 61, badge: 'Leader' },
        { name: 'Fruity', gsvM: 4.9, growthPct: 4, progress: 56, badge: 'Solid' },
        { name: 'Gum', gsvM: 3.3, growthPct: 2, progress: 50, badge: 'Flat' },
        { name: 'Mint', gsvM: 2.5, growthPct: 3, progress: 52, badge: 'Stable' },
      ],
      quarters: [
        { q: 'Q1', gsvM: 4.6, yoyPct: 2, rag: 'Flat' },
        { q: 'Q2', gsvM: 5.0, yoyPct: 4, rag: 'Flat' },
        { q: 'Q3', gsvM: 5.0, yoyPct: 3, rag: 'Flat' },
        { q: 'Q4', gsvM: 5.0, yoyPct: 1, rag: 'Flat' },
      ],
    },
  },
  India: {
    'FY2025 YTD': {
      kpis: { gsvYtdM: 13.2, gsvGrowthPct: 18.1, annualGsvPlanM: 54.0, yoyGrowthPlanPct: 9.0, sosPct: 49, sosDeltaPts: 1.8, shopperRoas: 3.6, mediaSpendYtdM: 3.2 },
      customers: [
        { name: 'Amazon', gsvM: 3.7, growthPct: 16, progress: 70, badge: 'Strong' },
        { name: 'Flipkart', gsvM: 2.9, growthPct: 14, progress: 66, badge: 'Solid' },
        { name: 'Blinkit', gsvM: 1.6, growthPct: 22, progress: 72, badge: 'Quick Commerce' },
        { name: 'Instamart', gsvM: 1.9, growthPct: 19, progress: 69, badge: 'Quick Commerce' },
        { name: 'Zepto', gsvM: 1.1, growthPct: 17, progress: 64, badge: 'Quick Commerce' },
      ],
      categories: [
        { name: 'Chocolate', gsvM: 5.4, growthPct: 19, progress: 73, badge: 'Leader' },
        { name: 'Fruity', gsvM: 3.1, growthPct: 14, progress: 66, badge: 'Solid' },
        { name: 'Gum', gsvM: 2.2, growthPct: 7, progress: 57, badge: 'Flat' },
        { name: 'Mint', gsvM: 1.6, growthPct: 8, progress: 59, badge: 'Building' },
      ],
      quarters: [
        { q: 'Q1', gsvM: 3.1, yoyPct: 14, rag: 'Ahead' },
        { q: 'Q2', gsvM: 3.3, yoyPct: 16, rag: 'Ahead' },
        { q: 'Q3', gsvM: 3.5, yoyPct: 18, rag: 'Ahead' },
        { q: 'Q4', gsvM: 3.3, yoyPct: 12, rag: 'Flat' },
      ],
    },
    'FY2024 YTD': {
      kpis: { gsvYtdM: 11.2, gsvGrowthPct: 9.5, annualGsvPlanM: 48.0, yoyGrowthPlanPct: 6.0, sosPct: 47, sosDeltaPts: 0.9, shopperRoas: 3.2, mediaSpendYtdM: 2.8 },
      customers: [
        { name: 'Amazon', gsvM: 3.1, growthPct: 9, progress: 62, badge: 'Solid' },
        { name: 'Flipkart', gsvM: 2.6, growthPct: 8, progress: 60, badge: 'Solid' },
        { name: 'Blinkit', gsvM: 1.1, growthPct: 13, progress: 58, badge: 'Quick Commerce' },
        { name: 'Instamart', gsvM: 1.5, growthPct: 11, progress: 57, badge: 'Quick Commerce' },
        { name: 'Zepto', gsvM: 0.9, growthPct: 10, progress: 55, badge: 'Quick Commerce' },
      ],
      categories: [
        { name: 'Chocolate', gsvM: 4.6, growthPct: 12, progress: 66, badge: 'Leader' },
        { name: 'Fruity', gsvM: 2.8, growthPct: 9, progress: 61, badge: 'Solid' },
        { name: 'Gum', gsvM: 2.0, growthPct: 5, progress: 53, badge: 'Flat' },
        { name: 'Mint', gsvM: 1.4, growthPct: 6, progress: 54, badge: 'Stable' },
      ],
      quarters: [
        { q: 'Q1', gsvM: 2.7, yoyPct: 7, rag: 'Flat' },
        { q: 'Q2', gsvM: 2.8, yoyPct: 9, rag: 'Flat' },
        { q: 'Q3', gsvM: 2.9, yoyPct: 10, rag: 'Ahead' },
        { q: 'Q4', gsvM: 2.8, yoyPct: 7, rag: 'Flat' },
      ],
    },
  },
};

// ------- Helpers -------
const asMoneyM = (v: number) =>
  `$${v.toLocaleString(undefined, { maximumFractionDigits: 1 })}M`;

const trendType = (v: number): 'positive' | 'negative' | 'neutral' =>
  v > 0 ? 'positive' : v < 0 ? 'negative' : 'neutral';

const statusIcon = (status: PlanStatus) => {
  switch (status) {
    case 'completed': return <CheckCircle className="h-4 w-4 text-success" />;
    case 'in-progress': return <Clock className="h-4 w-4 text-warning" />;
    default: return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
  }
};

const statusColor = (status: PlanStatus) => {
  switch (status) {
    case 'completed': return 'bg-success/20 text-success';
    case 'in-progress': return 'bg-warning/20 text-warning';
    default: return 'bg-muted text-muted-foreground';
  }
};

// RAG label renderer (SVG) for the chart
const renderRagLabel = (props: any) => {
  const { x, width, y, value } = props; // value = 'Ahead' | 'Flat' | 'Behind'
  const cx = x + width / 2;
  const pill = value === 'Ahead' ? 'Ahead of plan' : value === 'Flat' ? 'Flat to plan' : 'Behind plan';
  const color = value === 'Ahead' ? '#16a34a' : value === 'Flat' ? '#f59e0b' : '#ef4444';
  return (
    <g>
      <rect x={cx - 38} y={y - 24} rx={8} ry={8} width={76} height={18} fill={color} opacity={0.12} />
      <text x={cx} y={y - 12} textAnchor="middle" fontSize="10" fill={color}>{pill}</text>
    </g>
  );
};

export const ExecutiveSummary = () => {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('FY2025 YTD');
  const [country, setCountry] = useState<Country>('USA');

  const page = useMemo<PageData>(() => DATA[country][timePeriod], [country, timePeriod]);

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header: Title + Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-semibold tracking-tight">Executive Performance Summary</h2>

        {/* Native selects (works everywhere). Replace with shadcn Select if desired. */}
        <div className="flex gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Time Period</span>
            <select
              className="h-9 rounded-md border bg-background px-3 text-sm"
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value as TimePeriod)}
            >
              {TIME_PERIODS.map(tp => <option key={tp} value={tp}>{tp}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Country</span>
            <select
              className="h-9 rounded-md border bg-background px-3 text-sm"
              value={country}
              onChange={(e) => setCountry(e.target.value as Country)}
            >
              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Hero KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="GSV YTD"
          value={asMoneyM(page.kpis.gsvYtdM)}
          change={`${page.kpis.gsvGrowthPct >= 0 ? '+' : ''}${page.kpis.gsvGrowthPct.toFixed(1)}% vs LY`}
          changeType={trendType(page.kpis.gsvGrowthPct)}
          icon="dollar"
          subtitle={`${asMoneyM(page.kpis.gsvYtdM)} GSV, ${page.kpis.gsvGrowthPct.toFixed(1)}% growth compared to LY`}
        />
        <KPICard
          title="Annual GSV Plan"
          value={asMoneyM(page.kpis.annualGsvPlanM)}
          change={`${page.kpis.yoyGrowthPlanPct >= 0 ? '+' : ''}${page.kpis.yoyGrowthPlanPct.toFixed(1)}% plan`}
          changeType={trendType(page.kpis.yoyGrowthPlanPct)}
          icon="target"
          subtitle={`Annual plan of ${asMoneyM(page.kpis.annualGsvPlanM)}, targeting ${page.kpis.yoyGrowthPlanPct.toFixed(1)}% YoY growth`}
        />
        <KPICard
          title="Share of Search (SOS)"
          value={`${page.kpis.sosPct.toFixed(0)}%`}
          change={`${page.kpis.sosDeltaPts >= 0 ? '+' : ''}${page.kpis.sosDeltaPts.toFixed(1)} pts vs LY`}
          changeType={trendType(page.kpis.sosDeltaPts)}
          icon="target"
          subtitle={`${page.kpis.sosPct}% share of search, ${page.kpis.sosDeltaPts >= 0 ? 'up' : 'down'} ${Math.abs(page.kpis.sosDeltaPts).toFixed(1)} points from last year`}
        />
        <KPICard
          title="Shopper Media ROAS"
          value={`$${page.kpis.shopperRoas.toFixed(1)}`}
          change={`${asMoneyM(page.kpis.mediaSpendYtdM)} spent YTD`}
          changeType="positive"
          icon="dollar"
          subtitle={`$${page.kpis.shopperRoas.toFixed(1)} return for every $1 spent on media (${asMoneyM(page.kpis.mediaSpendYtdM)} total spend YTD)`}
        />
      </div>

      {/* Customer Performance Snapshot */}
      <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Customer Performance Snapshot
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {page.customers.map((c) => (
            <div key={c.name} className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">{c.name}</span>
                <span className={`${c.growthPct >= 0 ? 'text-success' : 'text-danger'} font-semibold`}>
                  {c.growthPct >= 0 ? '+' : ''}{c.growthPct}%
                </span>
              </div>
              <Progress value={c.progress} className="h-2" />
              <p className="text-sm text-muted-foreground">
                {asMoneyM(c.gsvM)} GSV • {c.badge}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Category Performance Snapshot */}
      <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
        <h3 className="text-lg font-semibold mb-4">Category Performance Snapshot</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {page.categories.map((cat) => (
            <div key={cat.name} className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">{cat.name}</span>
                <span className={`${cat.growthPct >= 0 ? 'text-success' : 'text-danger'} font-semibold`}>
                  {cat.growthPct >= 0 ? '+' : ''}{cat.growthPct}%
                </span>
              </div>
              <Progress value={cat.progress} className="h-2" />
              <p className="text-sm text-muted-foreground">
                {asMoneyM(cat.gsvM)} GSV • {cat.badge}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* GSV Growth by Quarter (before 30/60/90) */}
      <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
        <h3 className="text-lg font-semibold mb-4">GSV Growth by Quarter</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={page.quarters} barGap={6} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="q" />
              <YAxis yAxisId="left" tickFormatter={(v) => `$${v}M`} />
              <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(val: any, name: string) => name.includes('YoY') ? [`${val}%`, name] : [`$${val}M`, name]} />
              <Legend />
              {/* Absolute GSV */}
              <Bar yAxisId="left" dataKey="gsvM" name="GSV (M)" radius={[6, 6, 0, 0]} fill="hsl(var(--primary))">
                <LabelList dataKey="rag" content={renderRagLabel} />
              </Bar>
              {/* YoY % Growth as Line */}
              <Line yAxisId="right" type="monotone" dataKey="yoyPct" stroke="hsl(var(--mars-orange))" strokeWidth={3} name="YoY % Growth" dot={{ fill: "hsl(var(--mars-orange))", strokeWidth: 2, r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 30/60/90-Day Plan Tracker */}
      <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
        <h3 className="text-lg font-semibold mb-4">30/60/90-Day Plan Tracker</h3>
        <div className="space-y-4">
          {planItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                {statusIcon(item.status)}
                <span className="font-medium">{item.title}</span>
                <Badge className={statusColor(item.status)}>
                  {item.status.replace('-', ' ')}
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <Progress value={item.progress} className="w-20 h-2" />
                <span className="text-sm font-medium w-10">{item.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
