'use client';

import React, { useMemo, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { SlidePreview } from '@/components/SlidePreview';
import { generateMarsSlideContent, DeckData } from '@/utils/slideGenerator';
import { useInsightsStore } from '@/state/useInsightsStore';
import PptxGenJS from 'pptxgenjs';
import {
  Presentation, Download, Share2, Edit3, ArrowUpDown, FileText, Sparkles,
  ScanLine, Wand2, ClipboardList, MessageSquarePlus, Upload, FileJson
} from 'lucide-react';

const slideTemplates = {
  'Executive Summary': [
    'YTD Performance Overview',
    'Category Share & Competitive Position',
    'Customer Performance Snapshot',
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

type AppendMode = 'bullets' | 'notes' | 'new-slide' | 'all';

export const SlideStudio = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof slideTemplates>('Executive Summary');
  const [selectedStyle, setSelectedStyle] = useState<keyof typeof narrativeStyles>('Crisp');
  const [selectedSlides, setSelectedSlides] = useState<number[]>([0, 1, 2, 3, 4]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [deckData, setDeckData] = useState<DeckData | null>(null);

  // NEW: insights inbox
  const { insights, removeInsight, clearInsights } = useInsightsStore();
  const [selectedInsightIds, setSelectedInsightIds] = useState<string[]>([]);

  // NEW: additional narratives + options
  const [additionalNarrative, setAdditionalNarrative] = useState<string>('');
  const [appendMode, setAppendMode] = useState<AppendMode>('bullets');
  const [audience, setAudience] = useState<'Executive' | 'KAM' | 'Brand' | 'Search' | 'Media'>('Executive');
  const [tone, setTone] = useState<'Confident' | 'Neutral' | 'Challenger'>('Confident');

  // import/export helpers
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const slides = slideTemplates[selectedTemplate];
  const toggleSlide = (i: number) =>
    setSelectedSlides(prev => (prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i].sort()));

  const genOptions = useMemo(
    () => ({ template: selectedTemplate, style: selectedStyle, additionalNarrative, appendMode, audience, tone, context: { timePeriod: '2025 YTD' } }),
    [selectedTemplate, selectedStyle, additionalNarrative, appendMode, audience, tone]
  );

  const appendFromInbox = (ids: string[] | 'all') => {
    const toAppend = (ids === 'all' ? insights : insights.filter(i => ids.includes(i.id)))
      .map(i => {
        const ctx = i.context ? ` (${Object.entries(i.context).map(([k,v]) => `${k}:${Array.isArray(v)?v.join('/') : v}`).join(', ')})` : '';
        return `${i.persona} — ${i.title}${ctx}: ${i.text}`;
      })
      .join('\n');
    setAdditionalNarrative(prev => (prev ? prev + '\n' : '') + toAppend);
  };

  const generateDeck = async () => {
    setIsGenerating(true);
    try {
      const deck = generateMarsSlideContent(selectedTemplate, selectedStyle, genOptions);
      deck.slides = deck.slides.filter((_, i) => selectedSlides.includes(i));
      setDeckData(deck); setIsGenerated(true);
    } catch (e) { console.error(e); }
    finally { setIsGenerating(false); }
  };

  const refineDeck = async (intent: 'tighten' | 'actionize' | 'notes' | 'exec') => {
    if (!deckData) return;
    setIsGenerating(true);
    try {
      const intentPrompt =
        intent === 'tighten' ? 'Tight, deduplicated bullets; remove fluff.'
        : intent === 'actionize' ? 'Make bullets action-oriented with owners, timelines, KPIs.'
        : intent === 'notes' ? 'Expand each slide into clear speaker notes (2–3 sentences).'
        : 'Summarize for executive readout: top-line wins, risks, next actions.';
      const deck = generateMarsSlideContent(selectedTemplate, selectedStyle, {
        ...genOptions, additionalNarrative: `${additionalNarrative}\n\n${intentPrompt}`, appendMode
      });
      deck.slides = deck.slides.filter((_, i) => selectedSlides.includes(i));
      setDeckData(deck); setIsGenerated(true);
    } catch (e) { console.error(e); }
    finally { setIsGenerating(false); }
  };

  const exportToPowerPoint = async () => {
    if (!deckData) return;
    try {
      const pptx = new PptxGenJS();
      pptx.defineLayout({ name: 'MARS_LAYOUT', width: 10, height: 5.625 });
      pptx.layout = 'MARS_LAYOUT';

      const title = pptx.addSlide();
      title.addText(deckData.title, { x: 1, y: 1.5, w: 8, h: 1, fontSize: 36, bold: true, color: '1f4788', align: 'center' });
      title.addText(deckData.subtitle, { x: 1, y: 2.5, w: 8, h: 0.5, fontSize: 18, color: '666666', align: 'center' });
      title.addText(`${deckData.author} | ${deckData.date}`, { x: 1, y: 4.5, w: 8, h: 0.5, fontSize: 14, color: '999999', align: 'center' });

      deckData.slides.forEach((slide, idx) => {
        const s = pptx.addSlide();
        s.addText(slide.title, { x: 0.5, y: 0.3, w: 9, h: 0.8, fontSize: 24, bold: true, color: '1f4788' });
        slide.content.forEach((t, bi) => s.addText(`• ${t}`, { x: 0.8, y: 1.5 + bi * 0.5, w: 8.5, h: 0.4, fontSize: 16, color: '333333' }));
        if (slide.notes) s.addText(slide.notes, { x: 0.8, y: 4.5, w: 8.5, h: 0.8, fontSize: 12, color: '666666', italic: true });
        s.addText('M', { x: 9.2, y: 0.1, w: 0.6, h: 0.6, fontSize: 18, bold: true, color: 'FFFFFF', fill: { color: 'f1c40f' }, align: 'center' });
        s.addText(`${idx + 1}`, { x: 9.2, y: 5, w: 0.6, h: 0.3, fontSize: 10, color: '999999', align: 'center' });
      });

      await pptx.writeFile({ fileName: `Mars-DCom-${selectedTemplate.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pptx` });
    } catch (e) { console.error('PPT export error', e); downloadJSON(); }
  };

  const exportToGoogleSlides = async () => {
    if (!deckData) return;
    try {
      const slidesText = deckData.slides.map((s, i) =>
        `Slide ${i + 1}: ${s.title}\n\n${s.content.join('\n')}\n\n${s.notes ? 'Speaker Notes: ' + s.notes : ''}`
      ).join('\n\n---\n\n');
      const full = `${deckData.title}\n${deckData.subtitle}\n\nPresentation Content:\n\n${slidesText}`;
      await navigator.clipboard.writeText(full);
      window.open('https://docs.google.com/presentation/create', '_blank');
      alert('Presentation content copied to clipboard! Paste it into the new Google Slides deck.');
    } catch { window.open('https://docs.google.com/presentation/', '_blank'); }
  };

  const downloadJSON = () => {
    if (!deckData) return;
    const blob = new Blob([JSON.stringify(deckData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), { href: url, download: `Mars-DCom-Deck.json` });
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  };
  const importJSON = (file: File) => {
    const fr = new FileReader();
    fr.onload = () => { try { setDeckData(JSON.parse(String(fr.result))); setIsGenerated(true); } catch {} };
    fr.readAsText(file);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
        <div className="flex items-center gap-4">
          <Presentation className="h-8 w-8" />
          <div>
            <h2 className="text-xl font-bold">Slide Studio — Agentic Deck Builder</h2>
            <p className="opacity-90">Create persona-based decks, inject narratives, refine with AI, and collaborate.</p>
          </div>
        </div>
      </Card>

      {/* Config + Agent Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Template */}
        <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /> Deck Template</h3>
          <Select value={selectedTemplate} onValueChange={(v) => setSelectedTemplate(v as keyof typeof slideTemplates)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{Object.keys(slideTemplates).map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select>
          <div className="mt-3 text-sm text-muted-foreground">
            {slideTemplates[selectedTemplate].length} slides • {selectedSlides.length} selected
          </div>
        </Card>

        {/* Narrative Style & Audience */}
        <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> AI Narrative</h3>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Style</p>
              <Select value={selectedStyle} onValueChange={(v) => setSelectedStyle(v as keyof typeof narrativeStyles)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{Object.keys(narrativeStyles).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
              <div className="mt-2 text-xs text-muted-foreground">{narrativeStyles[selectedStyle]}</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Audience</p>
                <Select value={audience} onValueChange={(v) => setAudience(v as any)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{['Executive','KAM','Brand','Search','Media'].map(a => <SelectItem key={a} value={a as any}>{a}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Tone</p>
                <Select value={tone} onValueChange={(v) => setTone(v as any)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{['Confident','Neutral','Challenger'].map(t => <SelectItem key={t} value={t as any}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>

        {/* Additional Narratives */}
        <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card xl:col-span-2">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><MessageSquarePlus className="h-5 w-5 text-primary" /> Additional Narratives</h3>
          <textarea rows={6} value={additionalNarrative} onChange={(e) => setAdditionalNarrative(e.target.value)}
                    className="w-full rounded-md border bg-background p-3 text-sm"
                    placeholder="Paste extra storylines, hypotheses, talking points. These will be appended to slides." />
          <div className="mt-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="opacity-80">Append as:</span>
              <Select value={appendMode} onValueChange={(v) => setAppendMode(v as AppendMode)}>
                <SelectTrigger className="h-8 w-[160px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="bullets">Bullets (slides)</SelectItem>
                  <SelectItem value="notes">Speaker notes</SelectItem>
                  <SelectItem value="new-slide">New "Narratives" slide</SelectItem>
                  <SelectItem value="all">All of the above</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-xs text-muted-foreground">{additionalNarrative.length} chars</div>
          </div>
        </Card>
      </div>

      {/* Slide Selection */}
      <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><ArrowUpDown className="h-5 w-5 text-primary" /> Slide Selection & Reordering</h3>
        <div className="space-y-2">
          {slides.map((slide, index) => (
            <div key={index}
                 className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                   selectedSlides.includes(index) ? 'border-primary bg-primary/10' : 'border-mars-blue-secondary bg-muted/30'
                 }`}
                 onClick={() => toggleSlide(index)}>
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded border-2 flex items-center justify-center text-xs font-medium ${
                  selectedSlides.includes(index) ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground'
                }`}>{selectedSlides.includes(index) ? '✓' : index + 1}</div>
                <span className="font-medium">{slide}</span>
              </div>
              <Button variant="ghost" size="sm"><Edit3 className="h-4 w-4" /></Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Insights Inbox */}
      <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><Share2 className="h-5 w-5 text-primary" /> Insights Inbox</h3>
        {insights.length === 0 ? (
          <p className="text-sm text-muted-foreground">No saved insights yet. Use "Save insights to Slide Studio" on persona pages.</p>
        ) : (
          <>
            <div className="space-y-2 max-h-72 overflow-auto pr-2">
              {insights.map(i => (
                <label key={i.id} className="flex items-start gap-3 p-2 rounded-lg bg-muted/30">
                  <input
                    type="checkbox"
                    checked={selectedInsightIds.includes(i.id)}
                    onChange={(e) =>
                      setSelectedInsightIds(prev =>
                        e.target.checked ? [...prev, i.id] : prev.filter(x => x !== i.id)
                      )
                    }
                  />
                  <div className="text-sm">
                    <div className="font-medium">{i.persona} — {i.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(i.timestamp).toLocaleString()} {i.context ? '• ' + Object.entries(i.context).map(([k,v]) => `${k}:${Array.isArray(v)?v.join('/') : v}`).join(' • ') : ''}
                    </div>
                    <div className="mt-1">{i.text}</div>
                  </div>
                  <Button variant="ghost" size="sm" className="ml-auto" onClick={() => removeInsight(i.id)}>Remove</Button>
                </label>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => appendFromInbox(selectedInsightIds)}>Append Selected</Button>
              <Button variant="secondary" onClick={() => appendFromInbox('all')}>Append All</Button>
              <Button variant="ghost" onClick={() => setSelectedInsightIds([])}>Clear Selection</Button>
              <Button variant="ghost" onClick={() => clearInsights()}>Clear Inbox</Button>
            </div>
          </>
        )}
      </Card>

      {/* Agent Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Button onClick={generateDeck} className="h-12 flex items-center gap-2"><ScanLine className="h-4 w-4" /> Generate Deck</Button>
        <Button variant="secondary" onClick={() => refineDeck('tighten')} className="h-12 flex items-center gap-2"><Wand2 className="h-4 w-4" /> Tighten Narrative</Button>
        <Button variant="secondary" onClick={() => refineDeck('actionize')} className="h-12 flex items-center gap-2"><ClipboardList className="h-4 w-4" /> Add Actions & Owners</Button>
        <Button variant="secondary" onClick={() => refineDeck('notes')} className="h-12 flex items-center gap-2"><MessageSquarePlus className="h-4 w-4" /> Generate Speaker Notes</Button>
      </div>

      {/* Status */}
      <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
        <h3 className="font-semibold mb-3">Generation Status</h3>
        {isGenerating ? (
          <div className="space-y-3">
            <Progress value={66} className="h-2" />
            <p className="text-sm text-muted-foreground">Working on your slides…</p>
          </div>
        ) : isGenerated ? (
          <div className="space-y-3">
            <Badge className="bg-success/20 text-success">✓ Ready</Badge>
            <p className="text-sm text-muted-foreground">Deck generated successfully.</p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Choose template, add narratives, then Generate.</p>
        )}
      </Card>

      {/* Preview & Export */}
      {isGenerated && deckData && (
        <SlidePreview deck={deckData} onExportToPowerPoint={exportToPowerPoint} onExportToGoogleSlides={exportToGoogleSlides} />
      )}

      {/* Collaboration */}
      <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><Share2 className="h-5 w-5 text-primary" /> Share & Collaborate</h3>
        <div className="flex flex-wrap gap-3">
          <Button onClick={exportToPowerPoint} className="flex items-center gap-2"><Download className="h-4 w-4" /> Download PPTX</Button>
          <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={(e) => e.target.files?.[0] && importJSON(e.target.files[0])} />
          <Button variant="secondary" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2"><Upload className="h-4 w-4" /> Import Deck (.json)</Button>
          <Button variant="secondary" onClick={() => { if (!deckData) return; const blob = new Blob([JSON.stringify(deckData, null, 2)], { type:'application/json' }); const url = URL.createObjectURL(blob); const a = Object.assign(document.createElement('a'), { href:url, download:'Mars-DCom-Deck.json' }); document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); }} className="flex items-center gap-2">
            <FileJson className="h-4 w-4" /> Download Deck (.json)
          </Button>
        </div>
      </Card>
    </div>
  );
};