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
          { title: 'YTD Performance Overview', content: ['GSV +16.3% vs LY', 'GSV YTD $47.2M', 'Ahead of plan YoY'] },
          { title: 'Category Share & Competitive Position', content: ['DCom Share 18.2% (+1.4pts)', 'Leader gap -3.4pts'] },
          { title: 'Customer Performance Snapshot', content: ['Walmart +24%', 'Target +19%', 'Amazon -8%'] },
          { title: 'Key Strategic Initiatives', content: ['Amazon velocity recovery', 'Microseason search + media', 'Innovation pipeline acceleration'] },
          { title: 'Investment ROI Summary', content: ['Shopper Media ROAS $4.2 (+35%)', 'Reinvest in top converting KWs'] }
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
      : [
          { title: 'Retailer Performance Overview', content: ['Walmart +24% GSV', 'Amazon -8% velocity'] },
          { title: 'Category Growth Drivers', content: ['Gum +15% YoY in on-demand'] },
          { title: 'Digital Strategy Impact', content: ['SOS 62% (+2.1pts)'] },
          { title: 'Action Plan & Follow-up', content: ['Owners, dates, KPIs'] }
        ];

  const deck: DeckData = {
    title: `Mars DCom — ${template}`,
    subtitle: `${options.context?.timePeriod || '2025 YTD'} • ${options.audience || 'Executive'} • ${style}`,
    author: 'Mars DCom Assistant',
    date: new Date().toLocaleDateString(),
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