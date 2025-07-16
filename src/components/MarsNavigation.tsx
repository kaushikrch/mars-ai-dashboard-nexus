import { BarChart3, Users, Search, Presentation, TrendingUp, Brain, Database, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MarsNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navigationItems = [
  {
    id: 'executive',
    label: 'Executive',
    icon: BarChart3,
    description: 'YTD Performance Overview'
  },
  {
    id: 'persona',
    label: 'Persona',
    icon: Users,
    description: 'Role-based Dashboard'
  },
  {
    id: 'channel',
    label: 'Channel',
    icon: Search,
    description: 'Performance Analysis'
  },
  {
    id: 'predictive',
    label: 'Predictive',
    icon: TrendingUp,
    description: 'Forecasts & Simulation'
  },
  {
    id: 'insights',
    label: 'AI Insights',
    icon: Brain,
    description: 'Strategic Reasoning'
  },
  {
    id: 'slides',
    label: 'Slides',
    icon: Presentation,
    description: 'Presentation Generation'
  },
  {
    id: 'quality',
    label: 'Quality',
    icon: Database,
    description: 'Data Health & Monitoring'
  },
  {
    id: 'builder',
    label: 'Builder',
    icon: PlusCircle,
    description: 'Custom Visualizations'
  }
];

export const MarsNavigation = ({ activeTab, onTabChange }: MarsNavigationProps) => {
  return (
    <div className="w-72 bg-muted/30 border-l border-border min-h-screen p-4 space-y-1">
      <h2 className="text-sm font-semibold text-muted-foreground mb-4 px-3">Navigation</h2>
      
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        
        return (
          <Button
            key={item.id}
            variant={isActive ? "default" : "ghost"}
            className={`w-full justify-start h-auto p-3 ${
              isActive 
                ? "bg-primary text-primary-foreground shadow-sm" 
                : "hover:bg-muted"
            }`}
            onClick={() => onTabChange(item.id)}
          >
            <div className="flex items-center gap-3 w-full">
              <Icon className="h-4 w-4 shrink-0" />
              <div className="flex flex-col items-start text-left">
                <span className="text-sm font-medium">{item.label}</span>
                <span className={`text-xs ${
                  isActive 
                    ? "text-primary-foreground/70" 
                    : "text-muted-foreground"
                }`}>
                  {item.description}
                </span>
              </div>
            </div>
          </Button>
        );
      })}
    </div>
  );
};