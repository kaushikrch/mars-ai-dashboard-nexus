import { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { Plus, X, BarChart3, TrendingUp, PieChart as PieIcon, Activity, Download, Save, RefreshCw } from 'lucide-react';

const availableMetrics = [
  { id: 'gsv', name: 'GSV ($M)', category: 'Sales' },
  { id: 'units', name: 'Units Sold (K)', category: 'Sales' },
  { id: 'aov', name: 'Average Order Value', category: 'Sales' },
  { id: 'share', name: 'Category Share (%)', category: 'Market' },
  { id: 'roi', name: 'Media ROI', category: 'Marketing' },
  { id: 'spend', name: 'Media Spend ($K)', category: 'Marketing' },
  { id: 'traffic', name: 'PDP Traffic', category: 'Digital' },
  { id: 'ranking', name: 'Search Ranking', category: 'Digital' },
  { id: 'inventory', name: 'Inventory Level', category: 'Operations' },
  { id: 'velocity', name: 'Velocity Index', category: 'Operations' }
];

const availableDimensions = [
  { id: 'time', name: 'Time Period', type: 'temporal' },
  { id: 'retailer', name: 'Retailer', type: 'categorical' },
  { id: 'brand', name: 'Brand', type: 'categorical' },
  { id: 'category', name: 'Category', type: 'categorical' },
  { id: 'channel', name: 'Channel', type: 'categorical' },
  { id: 'region', name: 'Region', type: 'categorical' }
];

const chartTypes = [
  { id: 'line', name: 'Line Chart', icon: TrendingUp, component: LineChart },
  { id: 'bar', name: 'Bar Chart', icon: BarChart3, component: BarChart },
  { id: 'area', name: 'Area Chart', icon: Activity, component: AreaChart },
  { id: 'pie', name: 'Pie Chart', icon: PieIcon, component: PieChart }
];

// Mock data generator
const generateMockData = (metrics: string[], dimensions: string[]) => {
  const baseData = [
    { time: 'Jan', retailer: 'Walmart', brand: 'Snickers', category: 'Chocolate', gsv: 12.5, units: 450, roi: 4.2, share: 18.5 },
    { time: 'Feb', retailer: 'Amazon', brand: 'M&M', category: 'Chocolate', gsv: 8.3, units: 320, roi: 3.8, share: 15.2 },
    { time: 'Mar', retailer: 'Target', brand: 'Skittles', category: 'Gum', gsv: 6.7, units: 280, roi: 5.1, share: 22.3 },
    { time: 'Apr', retailer: 'Walmart', brand: 'Snickers', category: 'Chocolate', gsv: 14.2, units: 520, roi: 4.5, share: 19.1 },
    { time: 'May', retailer: 'Amazon', brand: 'M&M', category: 'Chocolate', gsv: 9.1, units: 380, roi: 4.0, share: 16.8 },
    { time: 'Jun', retailer: 'Target', brand: 'Skittles', category: 'Gum', gsv: 8.9, units: 340, roi: 5.4, share: 24.7 }
  ];
  
  return baseData;
};

export const ChartBuilder = () => {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['gsv']);
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>(['time']);
  const [chartType, setChartType] = useState('line');
  const [chartTitle, setChartTitle] = useState('Custom Analysis');
  const [savedCharts, setSavedCharts] = useState<Array<{id: string, title: string, config: any}>>([]);

  const addMetric = (metricId: string) => {
    if (!selectedMetrics.includes(metricId)) {
      setSelectedMetrics([...selectedMetrics, metricId]);
    }
  };

  const removeMetric = (metricId: string) => {
    setSelectedMetrics(selectedMetrics.filter(id => id !== metricId));
  };

  const addDimension = (dimensionId: string) => {
    if (!selectedDimensions.includes(dimensionId)) {
      setSelectedDimensions([...selectedDimensions, dimensionId]);
    }
  };

  const removeDimension = (dimensionId: string) => {
    setSelectedDimensions(selectedDimensions.filter(id => id !== dimensionId));
  };

  const data = generateMockData(selectedMetrics, selectedDimensions);

  const saveChart = () => {
    const newChart = {
      id: Date.now().toString(),
      title: chartTitle,
      config: {
        metrics: selectedMetrics,
        dimensions: selectedDimensions,
        chartType,
        title: chartTitle
      }
    };
    setSavedCharts([...savedCharts, newChart]);
  };

  const loadChart = (chart: any) => {
    setSelectedMetrics(chart.config.metrics);
    setSelectedDimensions(chart.config.dimensions);
    setChartType(chart.config.chartType);
    setChartTitle(chart.config.title);
  };

  const renderChart = () => {
    const ChartComponent = chartTypes.find(type => type.id === chartType)?.component || LineChart;

    if (chartType === 'pie') {
      const pieData = selectedMetrics.map(metric => ({
        name: availableMetrics.find(m => m.id === metric)?.name || metric,
        value: data.reduce((sum, item) => sum + (item[metric as keyof typeof item] as number), 0),
        color: `hsl(${Math.random() * 360}, 70%, 50%)`
      }));

      return (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={400}>
        <ChartComponent data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey={selectedDimensions[0]} 
            stroke="hsl(var(--foreground))" 
          />
          <YAxis stroke="hsl(var(--foreground))" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))', 
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px'
            }} 
          />
          <Legend />
          {selectedMetrics.map((metric, index) => {
            const metricName = availableMetrics.find(m => m.id === metric)?.name || metric;
            const color = `hsl(${(index * 137.5) % 360}, 70%, 50%)`;
            
            if (chartType === 'area') {
              return (
                <Area
                  key={metric}
                  type="monotone"
                  dataKey={metric}
                  stroke={color}
                  fill={color}
                  fillOpacity={0.3}
                  name={metricName}
                />
              );
            } else if (chartType === 'bar') {
              return (
                <Bar
                  key={metric}
                  dataKey={metric}
                  fill={color}
                  name={metricName}
                  radius={[4, 4, 0, 0]}
                />
              );
            } else {
              return (
                <Line
                  key={metric}
                  type="monotone"
                  dataKey={metric}
                  stroke={color}
                  strokeWidth={2}
                  name={metricName}
                />
              );
            }
          })}
        </ChartComponent>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
        <div className="flex items-center gap-4">
          <BarChart3 className="h-8 w-8" />
          <div>
            <h2 className="text-xl font-bold">Build Your Own View</h2>
            <p className="opacity-90">Drag, drop, and customize your data visualizations</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Configuration Panel */}
        <Card className="lg:col-span-1 p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
          <h3 className="font-semibold mb-4">Chart Configuration</h3>
          
          {/* Chart Type */}
          <div className="mb-6">
            <label className="text-sm font-medium mb-2 block">Chart Type</label>
            <div className="grid grid-cols-2 gap-2">
              {chartTypes.map(type => (
                <Button
                  key={type.id}
                  variant={chartType === type.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setChartType(type.id)}
                  className="flex flex-col items-center gap-1 h-auto py-2"
                >
                  <type.icon className="h-4 w-4" />
                  <span className="text-xs">{type.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Metrics */}
          <div className="mb-6">
            <label className="text-sm font-medium mb-2 block">Metrics</label>
            <div className="space-y-2 mb-3">
              {selectedMetrics.map(metricId => {
                const metric = availableMetrics.find(m => m.id === metricId);
                return (
                  <Badge key={metricId} className="flex items-center justify-between w-full">
                    <span className="text-xs">{metric?.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMetric(metricId)}
                      className="h-4 w-4 p-0 ml-2"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                );
              })}
            </div>
            <Select onValueChange={addMetric}>
              <SelectTrigger>
                <SelectValue placeholder="Add metric..." />
              </SelectTrigger>
              <SelectContent>
                {availableMetrics
                  .filter(metric => !selectedMetrics.includes(metric.id))
                  .map(metric => (
                    <SelectItem key={metric.id} value={metric.id}>
                      {metric.name} ({metric.category})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Dimensions */}
          <div className="mb-6">
            <label className="text-sm font-medium mb-2 block">Dimensions</label>
            <div className="space-y-2 mb-3">
              {selectedDimensions.map(dimensionId => {
                const dimension = availableDimensions.find(d => d.id === dimensionId);
                return (
                  <Badge key={dimensionId} className="flex items-center justify-between w-full">
                    <span className="text-xs">{dimension?.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDimension(dimensionId)}
                      className="h-4 w-4 p-0 ml-2"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                );
              })}
            </div>
            <Select onValueChange={addDimension}>
              <SelectTrigger>
                <SelectValue placeholder="Add dimension..." />
              </SelectTrigger>
              <SelectContent>
                {availableDimensions
                  .filter(dimension => !selectedDimensions.includes(dimension.id))
                  .map(dimension => (
                    <SelectItem key={dimension.id} value={dimension.id}>
                      {dimension.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Chart Title */}
          <div className="mb-6">
            <label className="text-sm font-medium mb-2 block">Chart Title</label>
            <input
              type="text"
              value={chartTitle}
              onChange={(e) => setChartTitle(e.target.value)}
              className="w-full p-2 rounded border border-mars-blue-secondary bg-background text-foreground text-sm"
              placeholder="Enter chart title..."
            />
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <Button onClick={saveChart} size="sm" className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Save Chart
            </Button>
            <Button variant="outline" size="sm" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </Card>

        {/* Chart Display */}
        <Card className="lg:col-span-3 p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold">{chartTitle}</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Data
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Chart
              </Button>
            </div>
          </div>

          {selectedMetrics.length > 0 ? (
            <div className="bg-white rounded-lg p-4 relative group">
              {renderChart()}
              
              {/* Interactive Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" className="bg-white/90 hover:bg-white">
                    Drill Down
                  </Button>
                  <Button variant="secondary" size="sm" className="bg-white/90 hover:bg-white">
                    Add Filter
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-96 bg-muted/30 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Select metrics to start building your chart</p>
              </div>
            </div>
          )}

          {/* Data Summary */}
          {selectedMetrics.length > 0 && (
            <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
              {selectedMetrics.slice(0, 4).map(metricId => {
                const metric = availableMetrics.find(m => m.id === metricId);
                const total = data.reduce((sum, item) => sum + (item[metricId as keyof typeof item] as number), 0);
                const avg = total / data.length;
                
                return (
                  <div key={metricId} className="p-3 bg-muted/30 rounded-lg text-center">
                    <p className="text-sm font-medium">{metric?.name}</p>
                    <p className="text-lg font-bold text-primary">{avg.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground">Average</p>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Saved Charts */}
      {savedCharts.length > 0 && (
        <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
          <h3 className="font-semibold mb-4">Saved Charts</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {savedCharts.map(chart => (
              <div
                key={chart.id}
                className="p-4 bg-muted/30 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => loadChart(chart)}
              >
                <h4 className="font-medium text-sm mb-2">{chart.title}</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Metrics: {chart.config.metrics.length}</p>
                  <p>Type: {chartTypes.find(t => t.id === chart.config.chartType)?.name}</p>
                </div>
                <Button size="sm" className="w-full mt-3">
                  Load Chart
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};