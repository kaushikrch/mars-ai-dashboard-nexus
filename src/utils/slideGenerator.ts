// Legacy compatibility
export interface SlideData {
  title: string;
  content: string[];
  chartData?: any;
  notes?: string;
}

// types used by SlideStudio
export type DeckSlide = { title: string; content: string[]; notes?: string };
export type DeckData = {
  title: string;
  subtitle: string;
  author: string;
  date: string;
  slides: DeckSlide[];
};

type GenerateOptions = {
  template?: string;
  style?: string;
  additionalNarrative?: string;
  appendMode?: 'bullets' | 'notes' | 'new-slide' | 'all';
  audience?: 'Executive' | 'KAM' | 'Brand' | 'Search' | 'Media';
  tone?: 'Confident' | 'Neutral' | 'Challenger';
  context?: Record<string, any>;
};

const narrativeToBullets = (txt?: string): string[] =>
  (txt || '')
    .split(/[\n•\-]+/g)
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => s.replace(/^\u2022\s*/, ''));

export function generateMarsSlideContent(
  template: string,
  style: string,
  options: GenerateOptions = {}
): DeckData {
  const baseSlides: DeckSlide[] =
    template === 'Executive Summary'
      ? [
          { 
            title: 'YTD Performance Overview', 
            content: [
              'GSV +16.3% vs LY',
              'GSV YTD $47.2M', 
              'Ahead of plan YoY'
            ]
          },
          { 
            title: 'EXECUTIVE SUMMARY',
            content: [
              'DIGITAL PERFORMANCE YTD P6',
              '• YTD P6 GSV +21.1% YoY, Q2 higher due to easter shift',
              '• YTD +21.1% GSV growth reflects restated baseline (Dcom and Uber), 2025 plan remains at $727M;',
              '• Restatements adjusted growth target upward to +14.3%. Upcoming Kroger restatement expected to further impact numbers positively.',
              '',
              'CATEGORY SHARE YTD P5',
              '• Mars DCOM Share: 24.9% P5 YTD, down (-.9 pts)',
              '• YTD P5 Digital Share 24.9% > Total Share 24.2%',
              '• Drivers: Chocolate, Fruity & Mint faced losses; Gum strong Growth',
              '• Supply gaps on Amazon contributing to share loss',
              '',
              'CHANNEL HIGHLIGHTS YTD P6',
              '• AMZ: +11.1% GSV YoY; Fruity & Gum strong, Post Price increase building back volume',
              '• Walmart: +26% GSV; All Subcat growing',
              '• Sam\'s Club: +24% GSV; Chocolate +26.2% & Gum +86.7% gains',
              '• Target: +22.8% GSV; strong in Fruity, Gum & Mint'
            ]
          },
          { 
            title: 'KEY DRIVERS',
            content: [
              'DIGITAL PERFORMANCE YTD P6',
              '• YTD P6 GSV +21% YoY, Q2 higher due to easter shift',
              '• Across Many Top Customers, Digital sales drove more Abs $ Growth in Retail Sales than In-Store',
              '',
              'CATEGORY SHARE YTD P5',
              '• Mars DCOM Share: 24.9% P5 YTD, down -.9 pts.',
              '• YTD P5:Digital Share 24.9% > Total Share 24.2%',
              '• Drivers: Chocolate, Fruity & Mint faced losses; Gum strong Growth',
              '• Supply gaps on Amazon contributing to share loss',
              '',
              'Walmart',
              'Drivers:',
              '• Variety Bags +45% due to improved findability on walmart.com v LY (inclusion in VB WMC Evergreen campaign & Must Win Items), 85% of growth sourced online L4W.',
              '• M&M\'s +21% with 100% of the growth sourcing online (inclusion in M&M\'s WMC Evergreen campaign & Must Win Items)',
              '• 42% of digital fruity growth driven by Skittles Pop\'d',
              '',
              'Target',
              'Drivers:',
              '• YTD M&M\'s assortment gains, RWB LTO, Crispy Marshmallow Exclusive; Plus Up promo on M&M\'s Family Size and Party Size vs. YA',
              '• Starburst Minis Candy Salad Activation in-store and online',
              '• Skittles Pop\'d Highlights for National Ice Cream Month',
              '',
              'ON DEMAND DELIVERY',
              '• ODD $36.5M +22.4% YTD* driven by DoorDash rapid organic growth into grocery verticals and Instacart latest paid search infusion.',
              '• Instacart $17.9M GSV YTD+6.3%, P6 $3.1M +23% gaining share on Fruity with additional gummiies spend in Q2. We will likely go backwards to share loss in Q3 when comp investment without infusions.',
              '• DoorDash $14.1M GSV YTD+34% driven primarily by organic traffic, continue to lag behind category growth led by over 100 bps.',
              '• Uber : Data now Updated! $3.8M +35% driven by organic traffic infusion.'
            ]
          },
          { 
            title: 'BIGGEST OPPORTUNITIES ACROSS CELL & CUSTOMER INCLUDE CHOCOLATE SEARCH GAPS AT KROGER, AMAZON & SAM\'S CLUB. FRUITY ONLINE GAPS AT AMAZON GUM AT AMAZON. MINTS IS SHOWING GOOD IMPROVEMENTS',
            content: [
              'Chocolate',
              'Timing: P6 Ytd, P6 Ytd, P5 Ytd, P5 Ytd, P5 Ytd, P5 Ytd',
              'Retailer: RSV, Growth (YoY), Online Share, Share Chg, Total Share, Gap/Ahead',
              'Amazon: $29.9M, 15.2%, 25.1%, -2.11 Pts, 23.0%, 200 Bps',
              'DoorDash: $13.4M, 28.1%, -, -, 23.0%, -2902 Bps',
              'Walmart: $35.0M, 29.5%, 29.9%, 0.42 Pts, 21.8%, 800 Bps',
              'Sam\'s Club: $37.2M, 26.8%, 40.7%, 1.49 Pts, 34.5%, 638 Bps',
              'Target: $16.9M, 20.8%, 21.8%, 0.30 Pts, 19.6%, 216 Bps',
              'Kroger: $6.6M, 20.8%, 23.7%, 0.24 Pts, 25.3%, -164 Bps',
              '',
              'Gum',
              'P6 Ytd, P6 Ytd, P5 Ytd, P5 Ytd, P5 Ytd, P5 Ytd',
              'Amazon: $30.2M, 24.1%, 36.3%, -2.24 Pts, 59.3%, -2302 Bps',
              'Uber: $1.8M, 51.5%, -, -, 59.3%, -950 Bps',
              'Walmart: $15.1M, 21.2%, 62.8%, 5.08 Pts, 61.1%, 168 Bps'
            ]
          }
        ]
      : template === 'Brand Review'
      ? [
          { title: 'Brand Portfolio Performance', content: ['Gum +34% vs chocolate', 'Skittles voice share 89%'] },
          { title: 'Category Deep Dive', content: ['Chocolate flat to plan', 'Fruity +9% YoY'] },
          { title: 'Innovation Pipeline', content: ['Halloween launch on track', 'Q4 seasonal push'] },
          { title: 'Consumer Insights', content: ['Occasion-led growth', 'Voice queries +45%'] },
          { title: 'Seasonal Strategy', content: ['Microseason plans per account'] },
          { title: 'Media Performance', content: ['ROAS $4.2; expand lower-funnel'] },
          { title: 'Competitive Analysis', content: ['Hershey SOS 31%', 'Ferrero Fruity +1.4pts'] },
          { title: 'Growth Opportunities', content: ['Reallocate from underperforming chocolate'] },
          { title: 'Investment Recommendations', content: ['+10% spend to top 20 KWs'] },
          { title: 'Next Steps & Timeline', content: ['Q4 checkpoints and owners'] }
        ]
      : template === 'Monthly Business Review'
      ? [
          { title: 'Executive Summary', content: ['Digital performance YTD P6 +21% GSV YoY', 'On demand delivery +2% YoY', 'Shopper media ROAS strong'] },
          { title: 'Key Drivers', content: ['Digital performance +21% GSV YTD', 'Category share 24.9% YTD P6', 'Amazon velocity lagging', 'Walmart & Target growth leads'] },
          { title: 'GSV YoY Growth', content: ['Q1 +15% (+$20.5M)', 'Q2 +27.7% (+$34.9M)', 'Q3 +19.1% (+$23.5M)', 'Q4 +41.8% (+$91.2M forecast)'] },
          { title: 'Cell & Customer Opportunities', content: ['Chocolate search gaps at Kroger/Amazon/Sam\'s Club', 'Fruity online gaps at Amazon', 'Gum share opportunity at Amazon', 'Mints trending upward'] },
          { title: 'DCOM Financials', content: ['GSV YoY growth +2110bps vs Target', 'NSV 3rd pty -1162bps vs plan', 'COGS improvement 1238bps', 'MAC decrease 750bps'] },
          { title: 'Target Share Snapshot', content: ['Total: Hershey 43.4% share (+1pt)', 'Chocolate: Hershey 41.1% share (+0.4pt)', 'Fruity: Ferrero 24.9% share (+0.5pt)', 'Gum: Mars 52.8% share (+0.8pt)'] }
        ]
      : [
          { title: 'Retailer Performance Overview', content: ['Walmart +24% GSV', 'Amazon -8% velocity'] },
          { title: 'Category Growth Drivers', content: ['Gum +15% YoY in on-demand'] },
          { title: 'Digital Strategy Impact', content: ['SOS 62% (+2.1pts)'] },
          { title: 'Action Plan & Follow-up', content: ['Owners, dates, KPIs'] }
        ];

  const deck: DeckData = {
    title: template === 'Executive Summary' ? 'MARS Snacking' : `Mars DCom — ${template}`,
    subtitle: template === 'Executive Summary' ? 'Executive Summary 2025 YTD' : `${options.context?.timePeriod || '2025 YTD'} • ${options.audience || 'Executive'} • ${style}`,
    author: 'Mars DCom AI Generated',
    date: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
    slides: baseSlides
  };

  // Merge Additional Narrative
  const bullets = narrativeToBullets(options.additionalNarrative);
  const applyBullets = options.appendMode === 'bullets' || options.appendMode === 'all';
  const applyNotes   = options.appendMode === 'notes'   || options.appendMode === 'all';
  const addNewSlide  = options.appendMode === 'new-slide' || options.appendMode === 'all';

  if (bullets.length) {
    if (applyBullets) {
      const targets = Math.min(deck.slides.length, 4);
      bullets.forEach((b, i) => deck.slides[i % targets].content.push(b));
    }
    if (applyNotes) {
      deck.slides = deck.slides.map(s => ({ ...s, notes: (s.notes ? s.notes + '\n' : '') + bullets.join('\n') }));
    }
    if (addNewSlide) deck.slides.push({ title: 'Additional Narratives', content: bullets, notes: options.tone ? `Tone: ${options.tone}` : undefined });
  }

  // Tiny stylistic tweaks
  if (options.audience === 'Executive') deck.slides.forEach(s => (s.content = s.content.map(b => b.replace(/(increase|grow)/gi, 'accelerate'))));
  if (options.tone === 'Challenger') deck.slides.forEach(s => s.content.unshift('Challenge: Focus on biggest deltas vs plan.'));

  return deck;
}