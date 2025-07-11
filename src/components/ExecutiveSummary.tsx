import { KPICard } from './KPICard';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle, AlertCircle, Clock } from 'lucide-react';

export const ExecutiveSummary = () => {
  const planItems = [
    { title: "Q3 Media Optimization", status: "completed", progress: 100 },
    { title: "Amazon Velocity Recovery", status: "in-progress", progress: 65 },
    { title: "Halloween Campaign Launch", status: "upcoming", progress: 20 },
    { title: "Category Share Growth", status: "in-progress", progress: 80 }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-warning" />;
      default: return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success/20 text-success';
      case 'in-progress': return 'bg-warning/20 text-warning';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Hero KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Digital Sales YTD"
          value="$47.2M"
          change="+16.3%"
          changeType="positive"
          icon="dollar"
          subtitle="vs $40.6M LY"
        />
        <KPICard
          title="Category Share YoY"
          value="18.2%"
          change="+1.4 pts"
          changeType="positive"
          icon="target"
          subtitle="Gained from Competitor A"
        />
        <KPICard
          title="On-Demand Delivery"
          value="31%"
          change="+8%"
          changeType="positive"
          icon="cart"
          subtitle="Penetration Rate"
        />
        <KPICard
          title="Shopper Media ROI"
          value="$4.2"
          change="+35%"
          changeType="positive"
          icon="dollar"
          subtitle="ROAS vs $3.1 avg"
        />
      </div>

      {/* Channel Performance */}
      <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Channel Performance Snapshot
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">Walmart</span>
              <span className="text-success font-semibold">+24%</span>
            </div>
            <Progress value={85} className="h-2" />
            <p className="text-sm text-muted-foreground">$12.3M GSV • #1 Performer</p>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">Target</span>
              <span className="text-success font-semibold">+19%</span>
            </div>
            <Progress value={72} className="h-2" />
            <p className="text-sm text-muted-foreground">$8.7M GSV • Strong Growth</p>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">Amazon</span>
              <span className="text-danger font-semibold">-8%</span>
            </div>
            <Progress value={45} className="h-2" />
            <p className="text-sm text-muted-foreground">$6.2M GSV • Needs Focus</p>
          </div>
        </div>
      </Card>

      {/* 30/60/90 Day Tracker */}
      <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
        <h3 className="text-lg font-semibold mb-4">30/60/90-Day Plan Tracker</h3>
        <div className="space-y-4">
          {planItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                {getStatusIcon(item.status)}
                <span className="font-medium">{item.title}</span>
                <Badge className={getStatusColor(item.status)}>
                  {item.status.replace('-', ' ')}
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <Progress value={item.progress} className="w-20 h-2" />
                <span className="text-sm font-medium w-10">{item.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Search Strategy Impact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-gradient-performance border-mars-blue-secondary shadow-card">
          <h3 className="text-lg font-semibold mb-4 text-primary-foreground">Search Strategy Impact</h3>
          <div className="space-y-3 text-primary-foreground">
            <div className="flex justify-between">
              <span>PDP Traffic</span>
              <span className="font-bold">+18% QoQ</span>
            </div>
            <div className="flex justify-between">
              <span>Keyword ROI</span>
              <span className="font-bold">$4.2 ROAS</span>
            </div>
            <div className="flex justify-between">
              <span>Voice Search</span>
              <span className="font-bold">+45% queries</span>
            </div>
            <div className="text-sm opacity-90 mt-4">
              Microseason campaigns driving 67% of incremental growth
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
          <h3 className="text-lg font-semibold mb-4">Top Brand Performers</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Skittles</p>
                <p className="text-sm text-muted-foreground">Search ranking #3 ↑5</p>
              </div>
              <span className="text-success font-bold">+34%</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Snickers</p>
                <p className="text-sm text-muted-foreground">89% voice share</p>
              </div>
              <span className="text-success font-bold">+21%</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">M&M</p>
                <p className="text-sm text-muted-foreground">Movie vertical leader</p>
              </div>
              <span className="text-warning font-bold">+7%</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};