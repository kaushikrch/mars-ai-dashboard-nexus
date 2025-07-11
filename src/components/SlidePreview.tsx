import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Download, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { DeckData, SlideData } from '@/utils/slideGenerator';

interface SlidePreviewProps {
  deck: DeckData;
  onExportToPowerPoint: () => void;
  onExportToGoogleSlides: () => void;
}

export const SlidePreview = ({ deck, onExportToPowerPoint, onExportToGoogleSlides }: SlidePreviewProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % deck.slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + deck.slides.length) % deck.slides.length);
  };

  const slide = deck.slides[currentSlide];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Slide Preview */}
      <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Eye className="h-5 w-5 text-primary" />
          Slide Preview
        </h3>
        
        {/* Slide Display */}
        <div className="aspect-video bg-white rounded-lg p-6 text-mars-blue-primary relative overflow-hidden">
          {/* Mars Logo/Branding */}
          <div className="absolute top-4 right-4">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-xs font-bold text-primary-foreground">
              M
            </div>
          </div>
          
          {/* Slide Content */}
          <div className="h-full flex flex-col">
            <div className="mb-4">
              <h1 className="text-xl font-bold text-mars-blue-primary mb-2">{slide.title}</h1>
              <div className="w-full h-1 bg-primary rounded"></div>
            </div>
            
            <div className="flex-1 space-y-3">
              {slide.content.map((item, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-mars-blue-primary">{item}</p>
                </div>
              ))}
            </div>
            
            {slide.notes && (
              <div className="mt-4 p-3 bg-mars-blue-light/10 rounded text-xs text-mars-blue-primary/70">
                <strong>Notes:</strong> {slide.notes}
              </div>
            )}
            
            {/* Footer */}
            <div className="mt-4 flex justify-between items-center text-xs text-mars-blue-primary/50">
              <span>Mars DCom Intelligence</span>
              <span>{currentSlide + 1} / {deck.slides.length}</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-4">
          <Button variant="outline" size="sm" onClick={prevSlide} disabled={currentSlide === 0}>
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          <div className="flex items-center gap-2">
            <Badge className="bg-primary/20 text-primary">
              Slide {currentSlide + 1} of {deck.slides.length}
            </Badge>
          </div>
          
          <Button variant="outline" size="sm" onClick={nextSlide} disabled={currentSlide === deck.slides.length - 1}>
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      {/* Export Options */}
      <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Share2 className="h-5 w-5 text-primary" />
          Export & Share
        </h3>
        
        <div className="space-y-4">
          {/* Deck Info */}
          <div className="p-4 bg-muted/30 rounded-lg">
            <h4 className="font-medium">{deck.title}</h4>
            <p className="text-sm text-muted-foreground">{deck.subtitle}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span>Author: {deck.author}</span>
              <span>Date: {deck.date}</span>
            </div>
          </div>

          {/* Export Buttons */}
          <div className="space-y-3">
            <Button onClick={onExportToPowerPoint} className="w-full justify-start">
              <Download className="h-4 w-4 mr-2" />
              Download as PowerPoint (.pptx)
            </Button>
            <Button onClick={onExportToGoogleSlides} variant="outline" className="w-full justify-start">
              <Share2 className="h-4 w-4 mr-2" />
              Export to Google Slides
            </Button>
          </div>

          {/* Additional Options */}
          <div className="pt-4 border-t border-mars-blue-secondary">
            <h5 className="font-medium mb-3">Additional Options</h5>
            <div className="space-y-2">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                📧 Email to Stakeholders
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                🔗 Generate Shareable Link
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                📱 Create Mobile Summary
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};