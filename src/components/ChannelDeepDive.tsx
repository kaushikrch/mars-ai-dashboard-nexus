import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Search, TrendingUp, Zap, Calendar, DollarSign } from 'lucide-react';

export const ChannelDeepDive = () => {
  const searchPerformance = [
    { term: 'fruit candy', rank: 3, change: '+5', traffic: '34K', roi: '$4.8' },
    { term: 'satisfying snack', rank: 1, change: '=', traffic: '28K', roi: '$5.2' },
    { term: 'movie candy', rank: 4, change: '+2', traffic: '21K', roi: '$3.9' },
    { term: 'chocolate bar', rank: 6, change: '-1', traffic: '18K', roi: '$3.1' }
  ];

  const heatmapData = [
    { retailer: 'Walmart', weeks: [85, 92, 78, 95, 88, 90, 87, 93] },
    { retailer: 'Target', weeks: [72, 68, 75, 82, 79, 77, 81, 86] },
    { retailer: 'Amazon', weeks: [45, 42, 38, 51, 48, 44, 46, 49] },
    { retailer: "Sam's Club", weeks: [63, 67, 71, 69, 74, 70, 68, 72] }
  ];

  const getHeatmapColor = (value: number) => {
    if (value >= 85) return 'bg-success';
    if (value >= 70) return 'bg-warning';
    if (value >= 50) return 'bg-warning/50';
    return 'bg-danger/50';
  };

  const mediaImpact = [
    { timing: 'Week 1-2', investment: '$120K', lift: '+18%', incremental: '$2.4M' },
    { timing: 'Week 3-4', investment: '$150K', lift: '+24%', incremental: '$3.1M' },
    { timing: 'Week 5-6', investment: '$180K', lift: '+31%', incremental: '$4.2M' },
    { timing: 'Week 7-8', investment: '$200K', lift: '+28%', incremental: '$3.8M' }
  ];

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Search Performance Overview */}
      <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Search className="h-6 w-6 text-primary" />
          Search Performance Deep Dive
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">PDP Traffic Growth</p>
            <p className="text-3xl font-bold text-success">+18%</p>
            <p className="text-xs text-muted-foreground">Quarter over Quarter</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Average Keyword ROI</p>
            <p className="text-3xl font-bold text-primary">$4.2</p>
            <p className="text-xs text-muted-foreground">ROAS vs $3.1 category avg</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Voice Search Queries</p>
            <p className="text-3xl font-bold text-success">+45%</p>
            <p className="text-xs text-muted-foreground">Year over Year growth</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-mars-blue-secondary">
                <th className="text-left py-2">Keyword</th>
                <th className="text-left py-2">Rank</th>
                <th className="text-left py-2">Change</th>
                <th className="text-left py-2">Traffic</th>
                <th className="text-left py-2">ROI</th>
              </tr>
            </thead>
            <tbody>
              {searchPerformance.map((item, index) => (
                <tr key={index} className="border-b border-mars-blue-secondary/30">
                  <td className="py-3 font-medium">{item.term}</td>
                  <td className="py-3">
                    <Badge className="bg-primary/20 text-primary">#{item.rank}</Badge>
                  </td>
                  <td className="py-3">
                    <span className={item.change.includes('+') ? 'text-success' : item.change.includes('-') ? 'text-danger' : 'text-muted-foreground'}>
                      {item.change}
                    </span>
                  </td>
                  <td className="py-3">{item.traffic}</td>
                  <td className="py-3 font-semibold">{item.roi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Media Impact Timeline */}
      <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          Shopper Media Impact by Investment Timing
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mediaImpact.map((period, index) => (
            <div key={index} className="p-4 rounded-lg bg-muted/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">{period.timing}</span>
                <Badge className="bg-primary/20 text-primary">{period.lift}</Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Investment: {period.investment}</p>
                <p className="text-sm font-semibold">Incremental: {period.incremental}</p>
              </div>
              <Progress value={75 + index * 5} className="h-2" />
            </div>
          ))}
        </div>
      </Card>

      {/* Retailer Performance Heatmap */}
      <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Retailer × Week × Media Performance Heatmap
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-9 gap-2 text-sm">
            <div></div>
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="text-center text-muted-foreground">W{i + 1}</div>
            ))}
          </div>
          {heatmapData.map((retailer, rIndex) => (
            <div key={rIndex} className="grid grid-cols-9 gap-2 items-center">
              <div className="font-medium">{retailer.retailer}</div>
              {retailer.weeks.map((value, wIndex) => (
                <div
                  key={wIndex}
                  className={`h-8 rounded flex items-center justify-center text-xs font-medium ${getHeatmapColor(value)} text-white`}
                >
                  {value}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-4 text-xs">
          <span>Performance Score:</span>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-danger/50 rounded"></div>
            <span>0-49</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-warning/50 rounded"></div>
            <span>50-69</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-warning rounded"></div>
            <span>70-84</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-success rounded"></div>
            <span>85+</span>
          </div>
        </div>
      </Card>

      {/* AI Optimization Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5" />
            AI Optimization Insights
          </h4>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <p className="text-sm">Skittles microseason strategy driving 67% of incremental growth</p>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <p className="text-sm">Week 5-6 media timing optimal for seasonal uplift</p>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <p className="text-sm">Voice search optimization yielding 2.3x higher conversion</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
          <h4 className="font-semibold mb-4">Historical vs Forecast Lift</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Q2 Actual Lift</span>
              <span className="font-bold text-success">+24%</span>
            </div>
            <Progress value={80} className="h-2" />
            <div className="flex justify-between items-center">
              <span>Q3 Forecast Lift</span>
              <span className="font-bold text-primary">+31%</span>
            </div>
            <Progress value={95} className="h-2" />
            <div className="text-xs text-muted-foreground">
              Forecast based on Halloween seasonality and current momentum
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};