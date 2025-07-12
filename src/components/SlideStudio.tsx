import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { SlidePreview } from '@/components/SlidePreview';
import { generateMarsSlideContent, DeckData } from '@/utils/slideGenerator';
import PptxGenJS from 'pptxgenjs';
import { Presentation, Download, Share2, Eye, Edit3, ArrowUpDown, FileText, Sparkles } from 'lucide-react';

const slideTemplates = {
  'Executive Summary': [
    'YTD Performance Overview',
    'Category Share & Competitive Position', 
    'Channel Performance Snapshot',
    'Key Strategic Initiatives',
    'Investment ROI Summary'
  ],
  'Brand Review': [
    'Brand Portfolio Performance',
    'Category Deep Dive',
    'Innovation Pipeline',
    'Consumer Insights',
    'Seasonal Strategy',
    'Media Performance',
    'Competitive Analysis',
    'Growth Opportunities',
    'Investment Recommendations',
    'Next Steps & Timeline'
  ],
  'Account Specific': [
    'Retailer Performance Overview',
    'Category Growth Drivers',
    'Promotion Calendar Review',
    'Shelf Optimization',
    'Digital Strategy Impact',
    'Inventory & Forecasting',
    'Joint Business Planning',
    'Innovation Roadmap',
    'Partnership Opportunities',
    'Investment Priorities',
    'Action Plan & Follow-up'
  ]
};

const narrativeStyles = {
  'Crisp': 'Data-driven, bullet points, executive summary style',
  'Formal': 'Professional presentation format with detailed explanations',
  'Punchy': 'Bold statements, key insights highlighted, action-oriented'
};

export const SlideStudio = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof slideTemplates>('Executive Summary');
  const [selectedStyle, setSelectedStyle] = useState<keyof typeof narrativeStyles>('Crisp');
  const [selectedSlides, setSelectedSlides] = useState<number[]>([0, 1, 2, 3, 4]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  const slides = slideTemplates[selectedTemplate];

  const toggleSlide = (index: number) => {
    setSelectedSlides(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index].sort()
    );
  };

  const [deckData, setDeckData] = useState<DeckData | null>(null);

  const generateDeck = async () => {
    setIsGenerating(true);
    try {
      // Generate actual deck content
      const deck = generateMarsSlideContent(selectedTemplate, selectedStyle);
      setDeckData(deck);
      setIsGenerating(false);
      setIsGenerated(true);
    } catch (error) {
      console.error('Error generating deck:', error);
      setIsGenerating(false);
    }
  };

  const exportToPowerPoint = async () => {
    if (!deckData) return;
    
    try {
      const pptx = new PptxGenJS();
      
      // Set slide master properties
      pptx.defineLayout({ name: 'MARS_LAYOUT', width: 10, height: 5.625 });
      pptx.layout = 'MARS_LAYOUT';
      
      // Title slide
      const titleSlide = pptx.addSlide();
      titleSlide.addText(deckData.title, {
        x: 1, y: 1.5, w: 8, h: 1,
        fontSize: 36, bold: true, color: '1f4788', align: 'center'
      });
      titleSlide.addText(deckData.subtitle, {
        x: 1, y: 2.5, w: 8, h: 0.5,
        fontSize: 18, color: '666666', align: 'center'
      });
      titleSlide.addText(`${deckData.author} | ${deckData.date}`, {
        x: 1, y: 4.5, w: 8, h: 0.5,
        fontSize: 14, color: '999999', align: 'center'
      });

      // Add content slides
      deckData.slides.forEach((slide, index) => {
        const contentSlide = pptx.addSlide();
        
        // Title
        contentSlide.addText(slide.title, {
          x: 0.5, y: 0.3, w: 9, h: 0.8,
          fontSize: 24, bold: true, color: '1f4788'
        });
        
        // Content bullets
        slide.content.forEach((item, bulletIndex) => {
          contentSlide.addText(`• ${item}`, {
            x: 0.8, y: 1.5 + (bulletIndex * 0.5), w: 8.5, h: 0.4,
            fontSize: 16, color: '333333'
          });
        });
        
        // Notes (if any)
        if (slide.notes) {
          contentSlide.addText(slide.notes, {
            x: 0.8, y: 4.5, w: 8.5, h: 0.8,
            fontSize: 12, color: '666666', italic: true
          });
        }
        
        // Mars branding
        contentSlide.addText('M', {
          x: 9.2, y: 0.1, w: 0.6, h: 0.6,
          fontSize: 18, bold: true, color: 'FFFFFF',
          fill: { color: 'f1c40f' }, align: 'center'
        });
        
        // Slide number
        contentSlide.addText(`${index + 1}`, {
          x: 9.2, y: 5, w: 0.6, h: 0.3,
          fontSize: 10, color: '999999', align: 'center'
        });
      });

      // Save the presentation
      await pptx.writeFile({ fileName: `Mars-DCom-${selectedTemplate.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pptx` });
      
    } catch (error) {
      console.error('PowerPoint export error:', error);
      // Fallback to text download
      const textContent = createPowerPointContent(deckData);
      const blob = new Blob([textContent], { type: 'text/plain' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `Mars-DCom-${selectedTemplate.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.txt`;
      link.click();
      URL.revokeObjectURL(link.href);
    }
  };

  const exportToGoogleSlides = async () => {
    if (!deckData) return;
    
    try {
      // Create presentation data in a format that can be imported
      const slidesText = deckData.slides.map((slide, index) => 
        `Slide ${index + 1}: ${slide.title}\n\n${slide.content.join('\n')}\n\n${slide.notes ? 'Speaker Notes: ' + slide.notes : ''}`
      ).join('\n\n---\n\n');
      
      const fullContent = `${deckData.title}\n${deckData.subtitle}\n\nPresentation Content:\n\n${slidesText}`;
      
      // Copy to clipboard for easy paste into Google Slides
      navigator.clipboard.writeText(fullContent);
      
      // Open Google Slides
      const googleSlidesUrl = 'https://docs.google.com/presentation/create';
      window.open(googleSlidesUrl, '_blank');
      
      // Show instruction to user
      alert('Presentation content copied to clipboard! Paste it into your new Google Slides presentation.');
      
    } catch (error) {
      console.error('Google Slides export error:', error);
      window.open('https://docs.google.com/presentation/', '_blank');
    }
  };

  // Helper function to create PowerPoint content
  const createPowerPointContent = (deck: DeckData): string => {
    const slides = deck.slides.map((slide, index) => 
      `Slide ${index + 1}: ${slide.title}\n${slide.content.join('\n')}\n${slide.notes ? 'Notes: ' + slide.notes : ''}\n\n`
    ).join('');
    
    return `Mars DCom Presentation: ${deck.title}\n${deck.subtitle}\nAuthor: ${deck.author}\nDate: ${deck.date}\n\n${slides}`;
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <Card className="p-6 bg-gradient-performance border-mars-blue-secondary shadow-card">
        <div className="flex items-center gap-4 text-primary-foreground">
          <Presentation className="h-8 w-8" />
          <div>
            <h2 className="text-xl font-bold">Slide Studio + Export Manager</h2>
            <p className="opacity-90">Create persona-based decks with AI-generated narratives</p>
          </div>
        </div>
      </Card>

      {/* Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Deck Template
          </h3>
          <Select value={selectedTemplate} onValueChange={(value) => setSelectedTemplate(value as keyof typeof slideTemplates)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(slideTemplates).map(template => (
                <SelectItem key={template} value={template}>
                  {template}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="mt-3 text-sm text-muted-foreground">
            {slides.length} slides • {selectedSlides.length} selected
          </div>
        </Card>

        <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Narrative Style
          </h3>
          <Select value={selectedStyle} onValueChange={(value) => setSelectedStyle(value as keyof typeof narrativeStyles)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(narrativeStyles).map(style => (
                <SelectItem key={style} value={style}>
                  {style}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="mt-3 text-xs text-muted-foreground">
            {narrativeStyles[selectedStyle]}
          </div>
        </Card>

        <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
          <h3 className="font-semibold mb-4">Generation Progress</h3>
          {isGenerating ? (
            <div className="space-y-3">
              <Progress value={66} className="h-2" />
              <p className="text-sm text-muted-foreground">Generating AI narratives...</p>
            </div>
          ) : isGenerated ? (
            <div className="space-y-3">
              <Badge className="bg-success/20 text-success">✓ Ready for Export</Badge>
              <p className="text-sm text-muted-foreground">Deck generated successfully</p>
            </div>
          ) : (
            <Button onClick={generateDeck} className="w-full">
              Generate Deck
            </Button>
          )}
        </Card>
      </div>

      {/* Slide Selection */}
      <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <ArrowUpDown className="h-5 w-5 text-primary" />
          Slide Selection & Reordering
        </h3>
        <div className="space-y-2">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                selectedSlides.includes(index)
                  ? 'border-primary bg-primary/10'
                  : 'border-mars-blue-secondary bg-muted/30'
              }`}
              onClick={() => toggleSlide(index)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded border-2 flex items-center justify-center text-xs font-medium ${
                  selectedSlides.includes(index)
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-muted-foreground'
                }`}>
                  {selectedSlides.includes(index) ? '✓' : index + 1}
                </div>
                <span className="font-medium">{slide}</span>
              </div>
              <div className="flex items-center gap-2">
                {selectedSlides.includes(index) && (
                  <Badge className="bg-primary/20 text-primary">
                    Position {selectedSlides.indexOf(index) + 1}
                  </Badge>
                )}
                <Button variant="ghost" size="sm">
                  <Edit3 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Preview & Export */}
      {isGenerated && deckData && (
        <SlidePreview 
          deck={deckData}
          onExportToPowerPoint={exportToPowerPoint}
          onExportToGoogleSlides={exportToGoogleSlides}
        />
      )}

      {/* Quick Deck Options */}
      <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
        <h3 className="font-semibold mb-4">Quick Deck Generation</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => {
              setSelectedTemplate('Executive Summary');
              setSelectedSlides([0, 1, 2, 3, 4]);
              generateDeck();
            }}
            className="p-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-left"
          >
            <p className="font-medium">5-Slide Executive</p>
            <p className="text-xs opacity-90">Quick performance overview</p>
          </button>
          <button 
            onClick={() => {
              setSelectedTemplate('Brand Review');
              setSelectedSlides([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
              generateDeck();
            }}
            className="p-4 rounded-lg bg-mars-blue-secondary hover:bg-mars-blue-secondary/90 transition-colors text-left"
          >
            <p className="font-medium">10-Slide Business Review</p>
            <p className="text-xs opacity-90">Comprehensive brand analysis</p>
          </button>
          <button 
            onClick={() => {
              setSelectedTemplate('Account Specific');
              setSelectedSlides(Array.from({length: slideTemplates['Account Specific'].length}, (_, i) => i));
              generateDeck();
            }}
            className="p-4 rounded-lg bg-mars-blue-secondary hover:bg-mars-blue-secondary/90 transition-colors text-left"
          >
            <p className="font-medium">Full Deep Dive</p>
            <p className="text-xs opacity-90">Complete account review</p>
          </button>
        </div>
      </Card>
    </div>
  );
};