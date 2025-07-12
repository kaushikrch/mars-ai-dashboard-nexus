import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Zap, Target, AlertTriangle, Play, RotateCcw } from 'lucide-react';

const forecastData = [
  { month: 'Oct', baseline: 12.5, optimistic: 14.2, pessimistic: 11.8, actual: 12.3 },
  { month: 'Nov', baseline: 13.1, optimistic: 15.8, pessimistic: 12.2, actual: null },
  { month: 'Dec', baseline: 15.8, optimistic: 18.9, pessimistic: 14.1, actual: null },
  { month: 'Jan', baseline: 11.2, optimistic: 13.5, pessimistic: 10.1, actual: null },
  { month: 'Feb', baseline: 12.8, optimistic: 15.2, pessimistic: 11.4, actual: null },
  { month: 'Mar', baseline: 14.5, optimistic: 17.1, pessimistic: 13.2, actual: null },
];

const driversData = [
  { category: 'Seasonal Demand', impact: 85, type: 'driver' },
  { category: 'Media Investment', impact: 72, type: 'driver' },
  { category: 'New Product Launch', impact: 45, type: 'driver' },
  { category: 'Competition Pressure', impact: -38, type: 'drainer' },
  { category: 'Supply Constraints', impact: -22, type: 'drainer' },
  { category: 'Price Increases', impact: -15, type: 'drainer' },
];

export const PredictivePerformance = () => {
  const [selectedLever, setSelectedLever] = useState('media');
  const [mediaSpend, setMediaSpend] = useState([100]);
  const [priceAdjustment, setPriceAdjustment] = useState([0]);
  const [promoIntensity, setPromoIntensity] = useState([50]);
  const [isSimulating, setIsSimulating] = useState(false);

  const runSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => setIsSimulating(false), 2000);
  };

  const resetLevers = () => {
    setMediaSpend([100]);
    setPriceAdjustment([0]);
    setPromoIntensity([50]);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <Card className="p-6 bg-gradient-performance border-mars-blue-secondary shadow-card">
        <div className="flex items-center gap-4 text-primary-foreground">
          <TrendingUp className="h-8 w-8" />
          <div>
            <h2 className="text-xl font-bold">Predictive Performance Intelligence</h2>
            <p className="opacity-90">Forecast scenarios, identify drivers, and simulate strategic levers</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Forecast Chart */}
        <Card className="lg:col-span-2 p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            6-Month GSV Forecast ($M)
          </h3>
          
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--foreground))" />
              <YAxis stroke="hsl(var(--foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }} 
              />
              <Legend />
              <Line type="monotone" dataKey="baseline" stroke="hsl(var(--primary))" strokeWidth={3} name="Baseline Forecast" />
              <Line type="monotone" dataKey="optimistic" stroke="hsl(var(--success))" strokeWidth={2} strokeDasharray="5 5" name="Optimistic" />
              <Line type="monotone" dataKey="pessimistic" stroke="hsl(var(--danger))" strokeWidth={2} strokeDasharray="5 5" name="Pessimistic" />
              <Line type="monotone" dataKey="actual" stroke="hsl(var(--mars-yellow))" strokeWidth={3} name="Actual" />
            </LineChart>
          </ResponsiveContainer>

          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center p-3 bg-success/10 rounded-lg">
              <p className="text-sm font-medium text-success">Optimistic Case</p>
              <p className="text-lg font-bold">$94.7M</p>
              <p className="text-xs text-muted-foreground">+18% vs baseline</p>
            </div>
            <div className="text-center p-3 bg-primary/10 rounded-lg">
              <p className="text-sm font-medium text-primary">Baseline</p>
              <p className="text-lg font-bold">$79.9M</p>
              <p className="text-xs text-muted-foreground">Current trajectory</p>
            </div>
            <div className="text-center p-3 bg-danger/10 rounded-lg">
              <p className="text-sm font-medium text-danger">Risk Case</p>
              <p className="text-lg font-bold">$72.8M</p>
              <p className="text-xs text-muted-foreground">-9% vs baseline</p>
            </div>
          </div>
        </Card>

        {/* Key Metrics */}
        <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
          <h3 className="font-semibold mb-4">Forecast Confidence</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Model Accuracy</span>
              <Badge className="bg-success/20 text-success">87%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Data Quality</span>
              <Badge className="bg-primary/20 text-primary">92%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Volatility Risk</span>
              <Badge className="bg-warning/20 text-warning">Medium</Badge>
            </div>
            
            <div className="pt-4 border-t border-mars-blue-secondary">
              <h4 className="font-medium mb-2">Next Review</h4>
              <p className="text-sm text-muted-foreground">Oct 28, 2024</p>
              <p className="text-xs text-muted-foreground">Weekly refresh cycle</p>
            </div>

            <div className="pt-4 border-t border-mars-blue-secondary">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                Risk Alerts
              </h4>
              <div className="space-y-2">
                <div className="text-xs p-2 bg-warning/10 rounded text-warning">
                  Amazon velocity declining 15% week-over-week
                </div>
                <div className="text-xs p-2 bg-danger/10 rounded text-danger">
                  Halloween inventory gap detected
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Drivers and Drainers - Waterfall Chart */}
      <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Performance Drivers & Drainers (Waterfall Analysis)
        </h3>
        
        <div className="h-64 relative">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={driversData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="category" stroke="hsl(var(--foreground))" angle={-45} textAnchor="end" height={100} />
              <YAxis stroke="hsl(var(--foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }} 
              />
              <Bar dataKey="impact" radius={[4, 4, 0, 0]}>
                {driversData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.impact > 0 ? 'hsl(var(--success))' : 'hsl(var(--danger))'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          
          {/* Waterfall connecting lines */}
          <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
            {driversData.map((item, index) => {
              if (index === driversData.length - 1) return null;
              const x1 = 60 + (index * 120) + 40;
              const x2 = 60 + ((index + 1) * 120) - 40;
              const y = 120;
              return (
                <line
                  key={index}
                  x1={x1}
                  y1={y}
                  x2={x2}
                  y2={y}
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  opacity="0.6"
                />
              );
            })}
          </svg>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2 text-success">
              <TrendingUp className="h-4 w-4" />
              Top Drivers
            </h4>
            <div className="space-y-1">
              {driversData.filter(d => d.type === 'driver').slice(0, 3).map((driver, index) => (
                <div key={index} className="text-sm flex justify-between">
                  <span>{driver.category}</span>
                  <span className="text-success">+{driver.impact}%</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2 text-danger">
              <TrendingDown className="h-4 w-4" />
              Key Drainers
            </h4>
            <div className="space-y-1">
              {driversData.filter(d => d.type === 'drainer').slice(0, 3).map((drainer, index) => (
                <div key={index} className="text-sm flex justify-between">
                  <span>{drainer.category}</span>
                  <span className="text-danger">{drainer.impact}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Simulation Levers */}
      <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Play className="h-5 w-5 text-primary" />
            Strategic Lever Simulation
          </h3>
          <div className="flex gap-2">
            <Button onClick={runSimulation} disabled={isSimulating} size="sm">
              {isSimulating ? 'Simulating...' : 'Run Simulation'}
            </Button>
            <Button onClick={resetLevers} variant="outline" size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Media Spend Lever */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Media Spend Adjustment</label>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs">-50%</span>
                <Slider
                  value={mediaSpend}
                  onValueChange={setMediaSpend}
                  max={200}
                  min={50}
                  step={10}
                  className="flex-1"
                />
                <span className="text-xs">+100%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Current: {mediaSpend[0]}% of baseline ({mediaSpend[0] > 100 ? '+' : ''}{mediaSpend[0] - 100}%)
              </p>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-sm font-medium">Projected Impact</p>
              <p className="text-lg font-bold text-primary">
                {mediaSpend[0] > 100 ? '+' : ''}{((mediaSpend[0] - 100) * 0.3).toFixed(1)}% GSV
              </p>
            </div>
          </div>

          {/* Price Lever */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Price Adjustment</label>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs">-10%</span>
                <Slider
                  value={priceAdjustment}
                  onValueChange={setPriceAdjustment}
                  max={10}
                  min={-10}
                  step={1}
                  className="flex-1"
                />
                <span className="text-xs">+10%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Current: {priceAdjustment[0] > 0 ? '+' : ''}{priceAdjustment[0]}%
              </p>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-sm font-medium">Projected Impact</p>
              <p className="text-lg font-bold text-primary">
                {priceAdjustment[0] > 0 ? '-' : '+'}{Math.abs(priceAdjustment[0] * 1.2).toFixed(1)}% Volume
              </p>
            </div>
          </div>

          {/* Promotion Lever */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Promotion Intensity</label>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs">Low</span>
                <Slider
                  value={promoIntensity}
                  onValueChange={setPromoIntensity}
                  max={100}
                  min={0}
                  step={10}
                  className="flex-1"
                />
                <span className="text-xs">High</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Current: {promoIntensity[0]}% intensity
              </p>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-sm font-medium">Projected Impact</p>
              <p className="text-lg font-bold text-primary">
                +{(promoIntensity[0] * 0.15).toFixed(1)}% Volume
              </p>
            </div>
          </div>
        </div>

        {/* Simulation Results */}
        {isSimulating && (
          <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
            <h4 className="font-medium mb-2">Simulation Results</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Estimated GSV Impact</p>
                <p className="text-lg font-bold text-success">+12.3%</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">ROI</p>
                <p className="text-lg font-bold text-primary">4.2x</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Confidence</p>
                <p className="text-lg font-bold text-mars-blue-primary">High</p>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};