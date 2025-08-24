'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInsightsStore } from '@/state/useInsightsStore';
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
  PieChart, Pie, Cell, BarChart, Bar, ComposedChart, LabelList
} from 'recharts';

const EXEC_DASHBOARD_ROUTE = '/dashboard/executive'; // adjust if needed

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
      working: 'Exceptional momentum; growth ahead of plan. Retail media & search synergy visible.',
      action: 'Accelerate Amazon velocity recovery; scale winning microseason programs.',
      narrative: 'Digital-first execution compounding share and revenue growth.'
    }
  },
  'Brand/Category Manager': {
    title: 'Brand/Category Manager',
    description: 'Brand portfolio performance and category insights',
    icon: Crown,
    color: 'hsl(var(--success))',
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
      working: 'Walmart strength; microseason execution driving lifts.',
      action: 'Amazon recovery: fix availability & search placement.',
      narrative: 'Retailer execution strong; protect mix while scaling winners.'
    }
  },
  'Search Manager': {
    title: 'Search Manager',
    description: 'SOS, organic/paid SOV, and retail search performance',
    icon: SearchIcon,
    color: 'hsl(var(--warning))',
    metrics: [
      { label: '—', value: '—', change: '—', status: 'neutral', target: '—' },
      { label: '—', value: '—', change: '—', status: 'neutral', target: '—' },
      { label: '—', value: '—', change: '—', status: 'neutral', target: '—' },
      { label: '—', value: '—', change: '—', status: 'neutral', target: '—' }
    ],
    chartData: [],
    aiSummary: {
      working: 'Microseason keywords drive most incremental SOS; strong synergy with retail media.',
      action: 'Shift budget to top converting KWs; prune low-ROAS tail; lift organic hygiene.',
      narrative: 'Search & media flywheel supports Executive growth narrative.'
    }
  },
  'Media Manager': {
    title: 'Media Manager',
    description: 'Paid media efficiency and mix optimization',
    icon: Megaphone,
    color: 'hsl(var(--mars-blue-primary))',
    metrics: [],
    chartData: [],
    aiSummary: {
      working: '',
      action: '',
      narrative: ''
    }
  }
};

/* ----------------------- KAM small datasets (from prior step) ---------------------- */
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

/* ----------------------- BRAND/CATEGORY demo data (kept from prior step) ---------------------- */
type BrandRow = { name: string; gsvM: number; yoyPct: number; dcomSharePct: number; shareChangePct: number };
type CatBlock = {
  brands: BrandRow[];
  gsvTargetM: number;
  marketSharePct: number;
  categoryGrowthPct: number;
  totalSharePct: number;
  totalShareChangePct: number;
};
type BrandData = Record<'Chocolate'|'Fruity'|'Gum'|'Mint', CatBlock>;
type BrandPageData = Record<'2025 YTD'|'2024 YTD', BrandData>;
const BRAND_PAGE: BrandPageData = {
  '2025 YTD': {
    Chocolate: { brands: [
      { name: 'Brand 1', gsvM: 82, yoyPct: 5, dcomSharePct: 12, shareChangePct: 0.6 },
      { name: 'Brand 2', gsvM: 31, yoyPct: 18, dcomSharePct: 8, shareChangePct: 0.4 },
      { name: 'Brand 3', gsvM: 25, yoyPct: -7, dcomSharePct: 5, shareChangePct: -0.3 },
      { name: 'Brand 4', gsvM: 74, yoyPct: 12, dcomSharePct: 10, shareChangePct: 0.5 }
    ], gsvTargetM: 200, marketSharePct: 22.1, categoryGrowthPct: 8.4, totalSharePct: 18.2, totalShareChangePct: 1.4 },
    Fruity: { brands: [
      { name: 'Brand A', gsvM: 34, yoyPct: 9, dcomSharePct: 10, shareChangePct: 0.5 },
      { name: 'Brand B', gsvM: 22, yoyPct: 6, dcomSharePct: 7, shareChangePct: 0.2 },
      { name: 'Brand C', gsvM: 18, yoyPct: -2, dcomSharePct: 5, shareChangePct: -0.1 },
      { name: 'Brand D', gsvM: 26, yoyPct: 11, dcomSharePct: 8, shareChangePct: 0.6 }
    ], gsvTargetM: 120, marketSharePct: 14.0, categoryGrowthPct: 6.1, totalSharePct: 12.4, totalShareChangePct: 0.7 },
    Gum: { brands: [
      { name: 'FreshCo', gsvM: 28, yoyPct: 15, dcomSharePct: 16, shareChangePct: 1.2 },
      { name: 'ChewMax', gsvM: 19, yoyPct: 12, dcomSharePct: 12, shareChangePct: 0.9 },
      { name: 'PopMint', gsvM: 14, yoyPct: 6, dcomSharePct: 9, shareChangePct: 0.3 },
      { name: 'ZapGum',  gsvM: 11, yoyPct: -3, dcomSharePct: 7, shareChangePct: -0.2 }
    ], gsvTargetM: 90, marketSharePct: 20.5, categoryGrowthPct: 9.0, totalSharePct: 15.9, totalShareChangePct: 0.9 },
    Mint: { brands: [
      { name: 'CoolMint', gsvM: 21, yoyPct: 7, dcomSharePct: 11, shareChangePct: 0.6 },
      { name: 'Breeze',   gsvM: 16, yoyPct: 5, dcomSharePct: 8,  shareChangePct: 0.3 },
      { name: 'IcyBlast', gsvM: 12, yoyPct: -4, dcomSharePct: 6,  shareChangePct: -0.2 },
      { name: 'FreshMint',gsvM: 25, yoyPct: 10, dcomSharePct: 12, shareChangePct: 0.4 }
    ], gsvTargetM: 75, marketSharePct: 16.4, categoryGrowthPct: 5.2, totalSharePct: 13.9, totalShareChangePct: 0.8 },
  },
  '2024 YTD': {
    Chocolate: { brands: [
      { name: 'Brand 1', gsvM: 75, yoyPct: 3, dcomSharePct: 11, shareChangePct: 0.3 },
      { name: 'Brand 2', gsvM: 28, yoyPct: 10, dcomSharePct: 7, shareChangePct: 0.2 },
      { name: 'Brand 3', gsvM: 24, yoyPct: -4, dcomSharePct: 5, shareChangePct: -0.1 },
      { name: 'Brand 4', gsvM: 66, yoyPct: 9, dcomSharePct: 9, shareChangePct: 0.3 }
    ], gsvTargetM: 185, marketSharePct: 21.0, categoryGrowthPct: 5.0, totalSharePct: 17.2, totalShareChangePct: 0.5 },
    Fruity: { brands: [
      { name: 'Brand A', gsvM: 30, yoyPct: 5, dcomSharePct: 9, shareChangePct: 0.3 },
      { name: 'Brand B', gsvM: 20, yoyPct: 4, dcomSharePct: 6, shareChangePct: 0.1 },
      { name: 'Brand C', gsvM: 17, yoyPct: -1, dcomSharePct: 5, shareChangePct: -0.1 },
      { name: 'Brand D', gsvM: 22, yoyPct: 8, dcomSharePct: 7, shareChangePct: 0.4 }
    ], gsvTargetM: 110, marketSharePct: 13.2, categoryGrowthPct: 4.0, totalSharePct: 11.6, totalShareChangePct: 0.3 },
    Gum: { brands: [
      { name: 'FreshCo', gsvM: 24, yoyPct: 8, dcomSharePct: 14, shareChangePct: 0.5 },
      { name: 'ChewMax', gsvM: 18, yoyPct: 6, dcomSharePct: 11, shareChangePct: 0.4 },
      { name: 'PopMint', gsvM: 13, yoyPct: 2, dcomSharePct: 8, shareChangePct: 0.1 },
      { name: 'ZapGum',  gsvM: 12, yoyPct: -2, dcomSharePct: 7, shareChangePct: -0.1 }
    ], gsvTargetM: 80, marketSharePct: 19.1, categoryGrowthPct: 3.5, totalSharePct: 14.8, totalShareChangePct: 0.3 },
    Mint: { brands: [
      { name: 'CoolMint', gsvM: 19, yoyPct: 3, dcomSharePct: 10, shareChangePct: 0.2 },
      { name: 'Breeze',   gsvM: 15, yoyPct: 3, dcomSharePct: 7, shareChangePct: 0.1 },
      { name: 'IcyBlast', gsvM: 12, yoyPct: -3, dcomSharePct: 6, shareChangePct: -0.1 },
      { name: 'FreshMint',gsvM: 22, yoyPct: 6, dcomSharePct: 10, shareChangePct: 0.2 }
    ], gsvTargetM: 70, marketSharePct: 15.6, categoryGrowthPct: 2.8, totalSharePct: 12.9, totalShareChangePct: 0.2 },
  }
};

/* ----------------------- SEARCH MANAGER demo data ---------------------- */
type SearchKpis = {
  sosPct: number; sosChangePts: number; sosYtdPct: number;
  orgSovPct: number; orgChangePts: number; orgTargetPct: number;
  paidSovPct: number; paidChangePts: number; paidTargetPct: number;
  spendYtdM: number; spendChangePct: number; spendTargetM: number;
};
type SearchCompRow = { name: string; orgSovPct: number; paidSovPct: number; sosPct: number };
type SearchTimeseriesRow = { period: string; spendM: number; iROASPct: number; cpc: number };

type SearchBlock = {
  kpis: SearchKpis;
  competitors: SearchCompRow[];    // Mars + competitors
  series: SearchTimeseriesRow[];   // periods for Spend/iROAS and CPC
};

type SearchData = Record<'Amazon'|'Walmart'|'Target'|'Instacart'|'DoorDash', Record<'2025 YTD'|'2024 YTD', SearchBlock>>;

const SEARCH_DATA: SearchData = {
  Amazon: {
    '2025 YTD': {
      kpis: { sosPct: 34, sosChangePts: 2.3, sosYtdPct: 33,
              orgSovPct: 18, orgChangePts: 1.1, orgTargetPct: 17,
              paidSovPct: 16, paidChangePts: 1.2, paidTargetPct: 15,
              spendYtdM: 6.2, spendChangePct: 9, spendTargetM: 6.0 },
      competitors: [
        { name: 'Mars', orgSovPct: 18, paidSovPct: 16, sosPct: 34 },
        { name: 'Hershey', orgSovPct: 14, paidSovPct: 17, sosPct: 31 },
        { name: 'Ferrero', orgSovPct: 10, paidSovPct: 13, sosPct: 23 },
        { name: 'Lindt', orgSovPct: 6, paidSovPct: 8, sosPct: 14 },
      ],
      series: [
        { period: 'P1', spendM: 0.9, iROASPct: 320, cpc: 0.92 },
        { period: 'P2', spendM: 1.3, iROASPct: 360, cpc: 0.88 },
        { period: 'P3', spendM: 1.6, iROASPct: 410, cpc: 0.85 },
        { period: 'P4', spendM: 1.2, iROASPct: 380, cpc: 0.87 },
        { period: 'P5', spendM: 1.2, iROASPct: 420, cpc: 0.83 },
      ]
    },
    '2024 YTD': {
      kpis: { sosPct: 31.9, sosChangePts: 0.8, sosYtdPct: 31,
              orgSovPct: 16.9, orgChangePts: 0.6, orgTargetPct: 16,
              paidSovPct: 15, paidChangePts: 0.2, paidTargetPct: 14.5,
              spendYtdM: 5.7, spendChangePct: 5, spendTargetM: 5.7 },
      competitors: [
        { name: 'Mars', orgSovPct: 16.9, paidSovPct: 15, sosPct: 31.9 },
        { name: 'Hershey', orgSovPct: 13, paidSovPct: 16, sosPct: 29 },
        { name: 'Ferrero', orgSovPct: 9, paidSovPct: 12, sosPct: 21 },
        { name: 'Lindt', orgSovPct: 6, paidSovPct: 7, sosPct: 13 },
      ],
      series: [
        { period: 'P1', spendM: 0.8, iROASPct: 300, cpc: 0.95 },
        { period: 'P2', spendM: 1.0, iROASPct: 320, cpc: 0.93 },
        { period: 'P3', spendM: 1.3, iROASPct: 340, cpc: 0.90 },
        { period: 'P4', spendM: 1.2, iROASPct: 330, cpc: 0.92 },
        { period: 'P5', spendM: 1.4, iROASPct: 350, cpc: 0.89 },
      ]
    }
  },
  Walmart: {
    '2025 YTD': {
      kpis: { sosPct: 29, sosChangePts: 1.7, sosYtdPct: 28,
              orgSovPct: 15, orgChangePts: 0.9, orgTargetPct: 15,
              paidSovPct: 14, paidChangePts: 0.8, paidTargetPct: 14,
              spendYtdM: 3.9, spendChangePct: 8, spendTargetM: 3.8 },
      competitors: [
        { name: 'Mars', orgSovPct: 15, paidSovPct: 14, sosPct: 29 },
        { name: 'Hershey', orgSovPct: 13, paidSovPct: 15, sosPct: 28 },
        { name: 'Ferrero', orgSovPct: 9,  paidSovPct: 10, sosPct: 19 },
        { name: 'Lindt', orgSovPct: 6,    paidSovPct: 7,  sosPct: 13 },
      ],
      series: [
        { period: 'P1', spendM: 0.6, iROASPct: 310, cpc: 0.70 },
        { period: 'P2', spendM: 0.8, iROASPct: 330, cpc: 0.68 },
        { period: 'P3', spendM: 1.0, iROASPct: 360, cpc: 0.65 },
        { period: 'P4', spendM: 0.7, iROASPct: 340, cpc: 0.66 },
        { period: 'P5', spendM: 0.8, iROASPct: 355, cpc: 0.64 },
      ]
    },
    '2024 YTD': {
      kpis: { sosPct: 27.3, sosChangePts: 1.0, sosYtdPct: 26.5,
              orgSovPct: 14.1, orgChangePts: 0.5, orgTargetPct: 14.5,
              paidSovPct: 13.2, paidChangePts: 0.5, paidTargetPct: 13.6,
              spendYtdM: 3.6, spendChangePct: 6, spendTargetM: 3.6 },
      competitors: [
        { name: 'Mars', orgSovPct: 14.1, paidSovPct: 13.2, sosPct: 27.3 },
        { name: 'Hershey', orgSovPct: 12.5, paidSovPct: 14.5, sosPct: 27 },
        { name: 'Ferrero', orgSovPct: 8.5, paidSovPct: 9.5, sosPct: 18 },
        { name: 'Lindt', orgSovPct: 5.5, paidSovPct: 6.5, sosPct: 12 },
      ],
      series: [
        { period: 'P1', spendM: 0.5, iROASPct: 290, cpc: 0.72 },
        { period: 'P2', spendM: 0.7, iROASPct: 310, cpc: 0.70 },
        { period: 'P3', spendM: 0.9, iROASPct: 340, cpc: 0.67 },
        { period: 'P4', spendM: 0.6, iROASPct: 320, cpc: 0.68 },
        { period: 'P5', spendM: 0.9, iROASPct: 335, cpc: 0.66 },
      ]
    }
  },
  Target: {
    '2025 YTD': {
      kpis: { sosPct: 26, sosChangePts: 1.5, sosYtdPct: 25.2,
              orgSovPct: 13, orgChangePts: 0.8, orgTargetPct: 12.5,
              paidSovPct: 13, paidChangePts: 0.7, paidTargetPct: 12.8,
              spendYtdM: 2.8, spendChangePct: 7, spendTargetM: 2.7 },
      competitors: [
        { name: 'Mars', orgSovPct: 13, paidSovPct: 13, sosPct: 26 },
        { name: 'Hershey', orgSovPct: 11, paidSovPct: 14, sosPct: 25 },
        { name: 'Ferrero', orgSovPct: 8, paidSovPct: 9, sosPct: 17 },
        { name: 'Lindt', orgSovPct: 5, paidSovPct: 6, sosPct: 11 },
      ],
      series: [
        { period: 'P1', spendM: 0.4, iROASPct: 280, cpc: 0.65 },
        { period: 'P2', spendM: 0.6, iROASPct: 300, cpc: 0.63 },
        { period: 'P3', spendM: 0.7, iROASPct: 330, cpc: 0.60 },
        { period: 'P4', spendM: 0.5, iROASPct: 310, cpc: 0.61 },
        { period: 'P5', spendM: 0.6, iROASPct: 325, cpc: 0.59 },
      ]
    },
    '2024 YTD': {
      kpis: { sosPct: 24.5, sosChangePts: 0.8, sosYtdPct: 23.7,
              orgSovPct: 12.2, orgChangePts: 0.5, orgTargetPct: 12,
              paidSovPct: 12.3, paidChangePts: 0.3, paidTargetPct: 12.5,
              spendYtdM: 2.6, spendChangePct: 4, spendTargetM: 2.6 },
      competitors: [
        { name: 'Mars', orgSovPct: 12.2, paidSovPct: 12.3, sosPct: 24.5 },
        { name: 'Hershey', orgSovPct: 10.5, paidSovPct: 13.5, sosPct: 24 },
        { name: 'Ferrero', orgSovPct: 7.5, paidSovPct: 8.5, sosPct: 16 },
        { name: 'Lindt', orgSovPct: 4.8, paidSovPct: 5.7, sosPct: 10.5 },
      ],
      series: [
        { period: 'P1', spendM: 0.4, iROASPct: 260, cpc: 0.67 },
        { period: 'P2', spendM: 0.5, iROASPct: 280, cpc: 0.65 },
        { period: 'P3', spendM: 0.6, iROASPct: 310, cpc: 0.62 },
        { period: 'P4', spendM: 0.5, iROASPct: 290, cpc: 0.63 },
        { period: 'P5', spendM: 0.6, iROASPct: 305, cpc: 0.61 },
      ]
    }
  },
  Instacart: {
    '2025 YTD': {
      kpis: { sosPct: 22, sosChangePts: 2.1, sosYtdPct: 21.3,
              orgSovPct: 11, orgChangePts: 1.2, orgTargetPct: 10.5,
              paidSovPct: 11, paidChangePts: 0.9, paidTargetPct: 10.8,
              spendYtdM: 1.8, spendChangePct: 12, spendTargetM: 1.6 },
      competitors: [
        { name: 'Mars', orgSovPct: 11, paidSovPct: 11, sosPct: 22 },
        { name: 'Hershey', orgSovPct: 9, paidSovPct: 12, sosPct: 21 },
        { name: 'Ferrero', orgSovPct: 7, paidSovPct: 8, sosPct: 15 },
        { name: 'Lindt', orgSovPct: 4, paidSovPct: 5, sosPct: 9 },
      ],
      series: [
        { period: 'P1', spendM: 0.3, iROASPct: 250, cpc: 0.58 },
        { period: 'P2', spendM: 0.4, iROASPct: 270, cpc: 0.56 },
        { period: 'P3', spendM: 0.5, iROASPct: 300, cpc: 0.53 },
        { period: 'P4', spendM: 0.3, iROASPct: 280, cpc: 0.54 },
        { period: 'P5', spendM: 0.3, iROASPct: 295, cpc: 0.52 },
      ]
    },
    '2024 YTD': {
      kpis: { sosPct: 19.9, sosChangePts: 1.2, sosYtdPct: 19.2,
              orgSovPct: 9.8, orgChangePts: 0.8, orgTargetPct: 9.7,
              paidSovPct: 10.1, paidChangePts: 0.4, paidTargetPct: 10.3,
              spendYtdM: 1.6, spendChangePct: 8, spendTargetM: 1.6 },
      competitors: [
        { name: 'Mars', orgSovPct: 9.8, paidSovPct: 10.1, sosPct: 19.9 },
        { name: 'Hershey', orgSovPct: 8.5, paidSovPct: 11.5, sosPct: 20 },
        { name: 'Ferrero', orgSovPct: 6.5, paidSovPct: 7.5, sosPct: 14 },
        { name: 'Lindt', orgSovPct: 3.8, paidSovPct: 4.7, sosPct: 8.5 },
      ],
      series: [
        { period: 'P1', spendM: 0.3, iROASPct: 230, cpc: 0.60 },
        { period: 'P2', spendM: 0.3, iROASPct: 250, cpc: 0.58 },
        { period: 'P3', spendM: 0.4, iROASPct: 280, cpc: 0.55 },
        { period: 'P4', spendM: 0.3, iROASPct: 260, cpc: 0.56 },
        { period: 'P5', spendM: 0.3, iROASPct: 275, cpc: 0.54 },
      ]
    }
  },
  DoorDash: {
    '2025 YTD': {
      kpis: { sosPct: 18, sosChangePts: 1.8, sosYtdPct: 17.5,
              orgSovPct: 9, orgChangePts: 1.0, orgTargetPct: 8.5,
              paidSovPct: 9, paidChangePts: 0.8, paidTargetPct: 8.8,
              spendYtdM: 1.2, spendChangePct: 15, spendTargetM: 1.0 },
      competitors: [
        { name: 'Mars', orgSovPct: 9, paidSovPct: 9, sosPct: 18 },
        { name: 'Hershey', orgSovPct: 7, paidSovPct: 10, sosPct: 17 },
        { name: 'Ferrero', orgSovPct: 5, paidSovPct: 6, sosPct: 11 },
        { name: 'Lindt', orgSovPct: 3, paidSovPct: 4, sosPct: 7 },
      ],
      series: [
        { period: 'P1', spendM: 0.2, iROASPct: 220, cpc: 0.48 },
        { period: 'P2', spendM: 0.3, iROASPct: 240, cpc: 0.46 },
        { period: 'P3', spendM: 0.3, iROASPct: 270, cpc: 0.43 },
        { period: 'P4', spendM: 0.2, iROASPct: 250, cpc: 0.44 },
        { period: 'P5', spendM: 0.2, iROASPct: 265, cpc: 0.42 },
      ]
    },
    '2024 YTD': {
      kpis: { sosPct: 16.2, sosChangePts: 1.0, sosYtdPct: 15.7,
              orgSovPct: 8, orgChangePts: 0.6, orgTargetPct: 8.1,
              paidSovPct: 8.2, paidChangePts: 0.4, paidTargetPct: 8.4,
              spendYtdM: 1.0, spendChangePct: 10, spendTargetM: 1.0 },
      competitors: [
        { name: 'Mars', orgSovPct: 8, paidSovPct: 8.2, sosPct: 16.2 },
        { name: 'Hershey', orgSovPct: 6.5, paidSovPct: 9.5, sosPct: 16 },
        { name: 'Ferrero', orgSovPct: 4.5, paidSovPct: 5.5, sosPct: 10 },
        { name: 'Lindt', orgSovPct: 2.8, paidSovPct: 3.7, sosPct: 6.5 },
      ],
      series: [
        { period: 'P1', spendM: 0.2, iROASPct: 200, cpc: 0.50 },
        { period: 'P2', spendM: 0.2, iROASPct: 220, cpc: 0.48 },
        { period: 'P3', spendM: 0.3, iROASPct: 250, cpc: 0.45 },
        { period: 'P4', spendM: 0.2, iROASPct: 230, cpc: 0.46 },
        { period: 'P5', spendM: 0.1, iROASPct: 245, cpc: 0.44 },
      ]
    }
  }
};

const PIE_COLORS = ['#7c3aed', '#f59e0b', '#10b981', '#0ea5e9'];
const asMoneyM = (v: number) => `$${v.toLocaleString(undefined, { maximumFractionDigits: 1 })}M`;
const trendType = (v: number): 'positive' | 'negative' | 'neutral' => (v > 0 ? 'positive' : v < 0 ? 'negative' : 'neutral');
const changeColor = (v: number) => (v >= 0 ? 'text-success' : 'text-danger');

/* ----------------------- Component ---------------------- */
export const PersonaWelcome = () => {
  const navigate = useNavigate();
  const [selectedPersona, setSelectedPersona] = useState<keyof typeof personas | null>(null);
  const { addPersonaTriple } = useInsightsStore();

  // All hooks must be called before any conditional returns
  const TIME_PERIODS = ['2025 YTD', '2024 YTD'] as const;
  const CATS = ['Chocolate', 'Fruity', 'Gum', 'Mint'] as const;
  const SEARCH_CUSTOMERS = ['Amazon', 'Walmart', 'Target', 'Instacart', 'DoorDash'] as const;

  const [timePeriodB, setTimePeriodB] = useState<typeof TIME_PERIODS[number]>('2025 YTD');
  const [categoryB, setCategoryB] = useState<typeof CATS[number]>('Chocolate');
  const [searchCustomer, setSearchCustomer] = useState<typeof SEARCH_CUSTOMERS[number]>('Amazon');
  const [searchPeriod, setSearchPeriod] = useState<typeof TIME_PERIODS[number]>('2025 YTD');

  const brandOptions = useMemo(() => {
    if (!selectedPersona) return [];
    return BRAND_PAGE[timePeriodB][categoryB].brands.map(b => b.name);
  }, [timePeriodB, categoryB, selectedPersona]);

  const [brands, setBrands] = useState<string[]>([]);

  useEffect(() => { 
    // Debug: track persona and brand options
    console.log('[PersonaWelcome] render', { selectedPersona, timePeriodB, categoryB, brandOptionsLen: brandOptions.length });
    setBrands(brandOptions); 
  }, [brandOptions, selectedPersona, timePeriodB, categoryB]);

  /* ---------- Welcome Screen ---------- */
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
          {Object.entries(personas).map(([key, p]) => (
            <Card
              key={key}
              className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card cursor-pointer hover:shadow-glow hover:scale-105 transition-all duration-300"
              onClick={() => {
                if (key === 'Executive Leadership') navigate(EXEC_DASHBOARD_ROUTE);
                else setSelectedPersona(key as keyof typeof personas);
              }}
            >
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: p.color }}>
                  <p.icon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{p.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2">{p.description}</p>
                </div>
                <Button className="w-full" style={{ backgroundColor: p.color }}>
                  View Dashboard
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Business Snapshot aligned with Executive page */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard title="GSV YTD" value="$47.2M" change="+16.3%" changeType="positive" icon="dollar" subtitle="GSV Growth" isAnimated={false}/>
          <KPICard title="Annual GSV Plan" value="$185.0M" change="+8.0%" changeType="positive" icon="target" subtitle="YoY Growth Plan" isAnimated={false}/>
          <KPICard title="Share of Search (SOS)" value="62%" change="+2.1 pts" changeType="positive" icon="target" subtitle="vs LY" isAnimated={false}/>
          <KPICard title="Shopper Media ROAS" value="$4.2" change="+35%" changeType="positive" icon="dollar" subtitle="vs Media Spend YTD" isAnimated={false}/>
        </div>
      </div>
    );
  }

  /* ---------- Persona Dashboard ---------- */
  const persona = personas[selectedPersona];
  const PersonaIcon = persona.icon as React.ComponentType<any>;

  /* ----- Brand view: filters & derived KPIs from previous step ----- */
  const isBrandView = persona.title === 'Brand/Category Manager';

  const catBlock = BRAND_PAGE[timePeriodB][categoryB];
  const selectedRows = useMemo(() => catBlock.brands.filter(b => brands.includes(b.name)), [catBlock.brands, brands]);
  const gsvTotal = selectedRows.reduce((s, r) => s + r.gsvM, 0);
  const yoyWeighted = gsvTotal > 0 ? selectedRows.reduce((s, r) => s + r.yoyPct * r.gsvM, 0) / gsvTotal : 0;

  /* ----- Search view: filters, KPIs & charts ----- */
  const isSearchView = persona.title === 'Search Manager';

  const searchBlock: SearchBlock = (SEARCH_DATA as any)[searchCustomer]?.[searchPeriod] ?? SEARCH_DATA.Amazon['2025 YTD'];

  /* ----- Media Manager WIP ----- */
  const isMediaView = persona.title === 'Media Manager';

  /* ----- Save insights to store ----- */
  const saveInsightsToStore = () => {
    const ctx: Record<string, any> = { persona: persona.title };

    // If Brand view, include its filters
    if (persona.title === 'Brand/Category Manager') {
      ctx.timePeriod = timePeriodB;
      ctx.category = categoryB;
      ctx.brands = brands;
    }

    // If Search view, include its filters
    if (persona.title === 'Search Manager') {
      ctx.customer = searchCustomer;
      ctx.timePeriod = searchPeriod;
    }

    addPersonaTriple(
      persona.title,
      persona.aiSummary?.working || '',
      persona.aiSummary?.action || '',
      persona.aiSummary?.narrative || '',
      ctx
    );
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header with Back Button */}
      <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
              <PersonaIcon className="h-6 w-6" />
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

        {/* Brand filters */}
        {isBrandView && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Time Period</span>
              <select className="h-9 rounded-md border bg-background px-3 text-sm w-full" value={timePeriodB} onChange={(e) => setTimePeriodB(e.target.value as typeof TIME_PERIODS[number])}>
                {TIME_PERIODS.map(tp => <option key={tp} value={tp}>{tp}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Category</span>
              <select className="h-9 rounded-md border bg-background px-3 text-sm w-full" value={categoryB} onChange={(e) => setCategoryB(e.target.value as typeof CATS[number])}>
                {CATS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-sm text-muted-foreground min-w-[64px] mt-2">Brands</span>
              <select multiple className="rounded-md border bg-background p-2 text-sm w-full h-24" value={brands}
                      onChange={(e) => setBrands(Array.from(e.target.selectedOptions).map(o => o.value))}>
                {brandOptions.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* Search filters */}
        {isSearchView && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Customer</span>
              <select className="h-9 rounded-md border bg-background px-3 text-sm w-full" value={searchCustomer}
                      onChange={(e) => setSearchCustomer(e.target.value as typeof SEARCH_CUSTOMERS[number])}>
                {SEARCH_CUSTOMERS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Time Period</span>
              <select className="h-9 rounded-md border bg-background px-3 text-sm w-full" value={searchPeriod}
                      onChange={(e) => setSearchPeriod(e.target.value as typeof TIME_PERIODS[number])}>
                {TIME_PERIODS.map(tp => <option key={tp} value={tp}>{tp}</option>)}
              </select>
            </div>
          </div>
        )}
      </Card>

      {/* ----- MEDIA MANAGER WIP ----- */}
      {isMediaView && (
        <Card className="p-10 bg-gradient-glow border-mars-blue-secondary shadow-card text-center">
          <Megaphone className="h-10 w-10 mx-auto mb-3" />
          <h3 className="text-lg font-semibold mb-2">Media Manager</h3>
          <p className="text-sm text-muted-foreground mb-6">Available soon — this view is WIP.</p>
          <Button variant="secondary" onClick={() => setSelectedPersona(null)}>Back to Personas</Button>
        </Card>
      )}

      {/* ----- BRAND KPIs & Brand chart (from previous step) ----- */}
      {isBrandView && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard title="DCom Share" value={`${catBlock.totalSharePct.toFixed(1)}%`}
                     change={`${catBlock.totalShareChangePct >= 0 ? '+' : ''}${catBlock.totalShareChangePct.toFixed(1)}%`}
                     changeType={trendType(catBlock.totalShareChangePct)} icon="target"
                     subtitle={`Total Share`} />
            <KPICard title="GSV YTD" value={asMoneyM(gsvTotal)} change=" " changeType="neutral" icon="dollar"
                     subtitle={`Target: ${asMoneyM(catBlock.gsvTargetM)}`} />
            <KPICard title="GSV YoY% Change" value={`${yoyWeighted.toFixed(1)}%`} change="vs LY"
                     changeType={trendType(yoyWeighted)} icon="target" subtitle=" " />
            <KPICard title="Market Share" value={`${catBlock.marketSharePct.toFixed(1)}%`}
                     change={`${catBlock.categoryGrowthPct >= 0 ? '+' : ''}${catBlock.categoryGrowthPct.toFixed(1)}%`}
                     changeType={trendType(catBlock.categoryGrowthPct)} icon="users" subtitle="Category Growth Rate" />
          </div>

          <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
            <h3 className="font-semibold mb-4">Performance by Brands — {categoryB}</h3>
            <div className="h-80">
              {selectedRows.length === 0 ? (
                <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                  Select one or more brands to view performance.
                </div>
              ) : (
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
              )}
            </div>
          </Card>
        </>
      )}

      {/* ----- SEARCH MANAGER KPIs ----- */}
      {isSearchView && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <KPICard title="SOS %" value={`${searchBlock.kpis.sosPct.toFixed(1)}%`}
                     change={`${searchBlock.kpis.sosChangePts >= 0 ? '+' : ''}${searchBlock.kpis.sosChangePts.toFixed(1)} pts`}
                     changeType={trendType(searchBlock.kpis.sosChangePts)} icon="target"
                     subtitle={`YTD SOS: ${searchBlock.kpis.sosYtdPct.toFixed(1)}%`} />
            <KPICard title="Organic SOV %" value={`${searchBlock.kpis.orgSovPct.toFixed(1)}%`}
                     change={`${searchBlock.kpis.orgChangePts >= 0 ? '+' : ''}${searchBlock.kpis.orgChangePts.toFixed(1)} pts`}
                     changeType={trendType(searchBlock.kpis.orgChangePts)} icon="users"
                     subtitle={`Target: ${searchBlock.kpis.orgTargetPct.toFixed(1)}%`} />
            <KPICard title="Paid SOV %" value={`${searchBlock.kpis.paidSovPct.toFixed(1)}%`}
                     change={`${searchBlock.kpis.paidChangePts >= 0 ? '+' : ''}${searchBlock.kpis.paidChangePts.toFixed(1)} pts`}
                     changeType={trendType(searchBlock.kpis.paidChangePts)} icon="users"
                     subtitle={`Target: ${searchBlock.kpis.paidTargetPct.toFixed(1)}%`} />
            <KPICard title="Spend YTD" value={asMoneyM(searchBlock.kpis.spendYtdM)}
                     change={`${searchBlock.kpis.spendChangePct >= 0 ? '+' : ''}${searchBlock.kpis.spendChangePct.toFixed(0)}%`}
                     changeType={trendType(searchBlock.kpis.spendChangePct)} icon="dollar"
                     subtitle={`Target: ${asMoneyM(searchBlock.kpis.spendTargetM)}`} />
            <KPICard title="SOS (YTD)" value={`${searchBlock.kpis.sosYtdPct.toFixed(1)}%`}
                     change={`${(searchBlock.kpis.sosPct - searchBlock.kpis.sosYtdPct) >= 0 ? '+' : ''}${(searchBlock.kpis.sosPct - searchBlock.kpis.sosYtdPct).toFixed(1)} pts MTD`}
                     changeType={trendType(searchBlock.kpis.sosPct - searchBlock.kpis.sosYtdPct)} icon="target"
                     subtitle="MTD vs YTD" />
          </div>

          {/* Stacked SOV bars + SOS line for Mars & competitors */}
          <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
            <h3 className="font-semibold mb-4">YTD SOV & SOS — {searchCustomer}</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={searchBlock.competitors} barGap={6}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" tickFormatter={(v) => `${v}%`} />
                  <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `${v}%`} />
                  <Tooltip formatter={(v:any, n:string)=>[`${v}%`, n]} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="orgSovPct" name="Organic SOV" stackId="sov" radius={[6,6,0,0]} />
                  <Bar yAxisId="left" dataKey="paidSovPct" name="Paid SOV" stackId="sov" radius={[6,6,0,0]} />
                  <Line yAxisId="right" type="monotone" dataKey="sosPct" name="SOS %" strokeWidth={3} dot />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Spend vs iROAS */}
          <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
            <h3 className="font-semibold mb-4">Spend vs iROAS — {searchCustomer}</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={searchBlock.series}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis yAxisId="left" tickFormatter={(v)=>`$${v}M`} />
                  <YAxis yAxisId="right" orientation="right" tickFormatter={(v)=>`${v}%`} />
                  <Tooltip formatter={(v:any, n:string)=> n.includes('ROAS') ? [`${v}%`, n] : [`$${v}M`, n]} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="spendM" name="Spend (M)" radius={[6,6,0,0]} />
                  <Line yAxisId="right" type="monotone" dataKey="iROASPct" name="iROAS %" strokeWidth={3} dot />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* CPC Trend */}
          <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
            <h3 className="font-semibold mb-4">CPC Trend — {searchCustomer}</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={searchBlock.series}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis tickFormatter={(v)=>`$${v.toFixed ? v.toFixed(2) : v}`} />
                  <Tooltip formatter={(v:any)=>[`$${Number(v).toFixed(2)}`, 'CPC']} />
                  <Legend />
                  <Line type="monotone" dataKey="cpc" name="CPC" strokeWidth={3} dot />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </>
      )}

      {/* ----- Performance Trends (generic) ----- */}
      {!isMediaView && (
        <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Performance Trends — {persona.title}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={persona.chartData.length ? persona.chartData : [{month:'Jul',performance:88,target:85},{month:'Aug',performance:91,target:86},{month:'Sep',performance:93,target:87},{month:'Oct',performance:95,target:88}]}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--foreground))" />
              <YAxis stroke="hsl(var(--foreground))" />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              <Legend />
              <Line type="monotone" dataKey="performance" stroke="hsl(var(--primary))" strokeWidth={3} name="Performance Index" />
              <Line type="monotone" dataKey="target" stroke="hsl(var(--success))" strokeWidth={2} strokeDasharray="5 5" name="Target" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* ----- Aligned AI Insights ----- */}
      {!isMediaView && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
              <h4 className="font-semibold mb-3 text-success flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                What's Working?
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {persona.title === 'Search Manager'
                  ? 'Microseason keywords & retail media synergy driving SOS; organic hygiene lifts SOV efficiently.'
                  : persona.aiSummary.working}
              </p>
            </Card>
            <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
              <h4 className="font-semibold mb-3 text-warning flex items-center gap-2">
                <Target className="h-4 w-4" />
                Where to Act?
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {persona.title === 'Search Manager'
                  ? 'Shift budget to top-converting KWs; prune low-ROAS tail; raise organic coverage on hero SKUs.'
                  : persona.aiSummary.action}
              </p>
            </Card>
            <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
              <h4 className="font-semibold mb-3 text-primary flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Executive Summary
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {persona.title === 'Search Manager'
                  ? 'Search performance is reinforcing Executive growth: SOS up with balanced organic/paid SOV and improving CPC efficiency.'
                  : persona.aiSummary.narrative}
              </p>
            </Card>
          </div>
          
          {/* Save Insights Action */}
          <div className="flex justify-end">
            <Button variant="secondary" onClick={saveInsightsToStore} className="mt-[-8px]">
              Save insights to Slide Studio
            </Button>
          </div>
        </>
      )}

      {/* ----- KAM extras kept (pie & category share chart) ----- */}
      {persona.title === 'Key Account Manager' && (
        <>
          <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
            <h3 className="font-semibold mb-4">Category Performance Snapshot</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie dataKey="value" data={KAM_CATEGORY_MIX} innerRadius={48} outerRadius={90} paddingAngle={2}>
                      {KAM_CATEGORY_MIX.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v:any)=>[`${v}%`, '% of Business']} />
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
                  <Tooltip formatter={(v:any)=>[`${v}%`, 'Share']} />
                  <Legend />
                  <Bar dataKey="Walmart" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Target" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Amazon" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Kroger" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};