import { TrendingUp, TrendingDown, DollarSign, Target, Users, ShoppingCart } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon?: 'dollar' | 'target' | 'users' | 'cart';
  subtitle?: string;
  isAnimated?: boolean;
}

const iconMap = {
  dollar: DollarSign,
  target: Target,
  users: Users,
  cart: ShoppingCart
};

export const KPICard = ({ 
  title, 
  value, 
  change, 
  changeType, 
  icon = 'target',
  subtitle,
  isAnimated = true 
}: KPICardProps) => {
  const IconComponent = iconMap[icon];
  const TrendIcon = changeType === 'positive' ? TrendingUp : TrendingDown;
  
  const changeColor = {
    positive: 'text-success',
    negative: 'text-danger', 
    neutral: 'text-muted-foreground'
  }[changeType];

  return (
    <Card className={`p-6 bg-card border-border/50 shadow-card hover:shadow-glow transition-all duration-300 ${isAnimated ? 'animate-slide-up' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className="flex flex-col items-end space-y-1">
          <IconComponent className="h-5 w-5 text-primary" />
          <div className={`flex items-center text-sm font-medium ${changeColor}`}>
            <TrendIcon className="h-3 w-3 mr-1" />
            {change}
          </div>
        </div>
      </div>
    </Card>
  );
};