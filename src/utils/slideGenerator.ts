export interface SlideData {
  title: string;
  content: string[];
  chartData?: any;
  notes?: string;
}

export interface DeckData {
  title: string;
  subtitle: string;
  author: string;
  date: string;
  slides: SlideData[];
}

export const generateMarsSlideContent = (template: string, style: string): DeckData => {
  const author = "Mars DCom Intelligence";
  const date = new Date().toLocaleDateString();

  const baseSlides: Record<string, SlideData[]> = {
    'Executive Summary': [
      {
        title: "Mars DCom Performance Overview",
        content: [
          "Digital Sales YTD: $47.2M (+16.3% vs LY)",
          "Category Share: 18.2% (+1.4 pts YoY)",
          "On-Demand Delivery: 31% penetration (+8% vs LY)",
          "Shopper Media ROI: $4.2 ROAS (+35% improvement)"
        ],
        notes: "Strong performance across all key metrics with double-digit growth"
      },
      {
        title: "Channel Performance Snapshot",
        content: [
          "Walmart: $12.3M GSV (+24% growth) - Top Performer",
          "Target: $8.7M GSV (+19% growth) - Strong Growth",
          "Amazon: $6.2M GSV (-8% decline) - Needs Focus",
          "Sam's Club: $4.1M GSV (+12% growth) - Consistent"
        ],
        notes: "Walmart driving majority of growth while Amazon requires immediate attention"
      },
      {
        title: "Search Strategy Impact",
        content: [
          "PDP Traffic Growth: +18% Quarter over Quarter",
          "Average Keyword ROI: $4.2 ROAS vs $3.1 category average",
          "Voice Search Queries: +45% Year over Year",
          "Microseason Campaigns: 67% of incremental growth"
        ],
        notes: "Search optimization delivering significant ROI above category benchmarks"
      },
      {
        title: "Key Strategic Initiatives Progress",
        content: [
          "Q3 Media Optimization: 100% Complete ✓",
          "Amazon Velocity Recovery: 65% Progress",
          "Halloween Campaign Launch: 20% Progress", 
          "Category Share Growth: 80% Progress"
        ],
        notes: "Most initiatives on track with Amazon recovery requiring acceleration"
      },
      {
        title: "Investment ROI & Next Steps",
        content: [
          "Media Spend Efficiency: $4.2 ROAS (+35% vs benchmark)",
          "Innovation Pipeline: $2.8M potential revenue",
          "Q4 Forecast: +31% lift vs +24% Q2 actual",
          "Recommended Actions: Accelerate Amazon recovery, expand Gum investment"
        ],
        notes: "Strong ROI trends support increased investment in winning strategies"
      }
    ],
    'Brand Review': [
      {
        title: "Brand Portfolio Performance",
        content: [
          "Skittles: +34% growth, #3 search ranking (↑5 positions)",
          "Snickers: +21% growth, 89% voice share leadership",
          "M&M: +7% growth, movie vertical dominance",
          "Gum Category: +34% vs Chocolate category performance"
        ],
        notes: "Portfolio showing strong differentiation with Gum significantly outperforming"
      },
      {
        title: "Category Deep Dive - Gum vs Chocolate",
        content: [
          "Gum Outperformance Drivers:",
          "• 34% increase in PDP traffic from microseason campaigns",
          "• Strong Walmart (+28%) and Target (+19%) velocity",
          "• Q2 media timing aligned with back-to-school preparation",
          "• Superior shelf space execution during key periods"
        ],
        notes: "Gum category momentum suggests reallocation opportunity from Chocolate"
      },
      {
        title: "Innovation Pipeline & Consumer Insights",
        content: [
          "New Product Launches: $2.8M revenue potential",
          "Consumer Trend Alignment: Premiumization (+2.1% margin)",
          "Seasonal Innovation: Halloween prep showing early signals",
          "Voice of Customer: 92% satisfaction on new formats"
        ],
        notes: "Innovation strategy aligned with consumer premiumization trends"
      }
    ]
  };

  const slides = baseSlides[template] || baseSlides['Executive Summary'];
  
  // Apply style formatting
  const formattedSlides = slides.map(slide => ({
    ...slide,
    content: style === 'Punchy' 
      ? slide.content.map(item => `🎯 ${item}`)
      : style === 'Formal'
      ? slide.content.map(item => `• ${item}`)
      : slide.content
  }));

  return {
    title: `Mars DCom ${template}`,
    subtitle: `Performance Intelligence Dashboard - ${style} Format`,
    author,
    date,
    slides: formattedSlides
  };
};