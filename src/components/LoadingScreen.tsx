import { useEffect, useState } from 'react';
import { MarsLogo } from './MarsLogo';
import { Progress } from '@/components/ui/progress';

export const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('Initializing Mars DCom Intelligence...');

  const steps = [
    'Initializing Mars DCom Intelligence...',
    'Loading performance data...',
    'Connecting to AI assistant...',
    'Preparing dashboard insights...',
    'Ready for launch! 🚀'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 2;
        
        // Update step based on progress
        if (newProgress >= 20 && newProgress < 40) {
          setCurrentStep(steps[1]);
        } else if (newProgress >= 40 && newProgress < 60) {
          setCurrentStep(steps[2]);
        } else if (newProgress >= 60 && newProgress < 80) {
          setCurrentStep(steps[3]);
        } else if (newProgress >= 80) {
          setCurrentStep(steps[4]);
        }

        if (newProgress >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 1000);
          return 100;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="text-center space-y-8 max-w-md">
        <div className="animate-float">
          <img 
            src="/lovable-uploads/9b606a20-8647-456c-aed4-cb342066e1b6.png" 
            alt="Mars Logo" 
            className="h-20 w-20 mx-auto animate-pulse-glow object-contain"
          />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-3xl font-bold bg-gradient-performance bg-clip-text text-transparent">
            Mars DCom Intelligence
          </h1>
          <p className="text-muted-foreground animate-shimmer">
            {currentStep}
          </p>
        </div>

        <div className="space-y-2">
          <Progress value={progress} className="h-2 mars-shimmer" />
          <p className="text-sm text-muted-foreground">{progress}%</p>
        </div>

        <div className="grid grid-cols-3 gap-4 opacity-60">
          <div className="space-y-1">
            <div className="w-full h-2 bg-primary/20 rounded animate-pulse"></div>
            <div className="w-3/4 h-2 bg-primary/20 rounded animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <div className="space-y-1">
            <div className="w-full h-2 bg-primary/20 rounded animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            <div className="w-2/3 h-2 bg-primary/20 rounded animate-pulse" style={{ animationDelay: '0.6s' }}></div>
          </div>
          <div className="space-y-1">
            <div className="w-full h-2 bg-primary/20 rounded animate-pulse" style={{ animationDelay: '0.8s' }}></div>
            <div className="w-4/5 h-2 bg-primary/20 rounded animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};