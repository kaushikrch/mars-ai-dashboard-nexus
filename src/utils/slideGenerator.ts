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
            title: 'Executive Performance Summary', 
            content: [
              'GSV YTD $47.2M (+16.3% vs LY)',
              'Digital GSV +21.1% YoY', 
              'Category Share 24.9% YTD',
              'Key Growth Drivers: Gum, Walmart, Target'
            ]
          },
          { 
            title: 'Category Performance',
            content: [
              'Gum: $24.6M (+34% YoY)',
              'Chocolate: $18.4M (+15% YoY)',
              'Fruity: $16.8M (+18% YoY)',
              'Mint: $12.2M (+22% YoY)'
            ]
          },
          { 
            title: 'Channel Highlights',
            content: [
              'Walmart: +26% GSV growth',
              'Target: +22.8% GSV growth',
              'Sam\'s Club: +24% GSV growth',
              'Amazon: Velocity challenges'
            ]
          },
          { 
            title: 'Key Opportunities',
            content: [
              'Chocolate search gaps: Amazon, Kroger',
              'Gum share opportunity: Amazon',
              'Supply chain optimization',
              'Digital acceleration initiatives'
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