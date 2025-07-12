import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Database, AlertTriangle, CheckCircle, Clock, RefreshCw, FileX, TrendingUp, Download } from 'lucide-react';

const dataQualityMetrics = {
  overall: 87,
  completeness: 92,
  accuracy: 85,
  timeliness: 89,
  consistency: 84
};

const dataSourceHealth = [
  { source: 'Amazon', health: 95, issues: 2, lastUpdate: '2 hours ago', status: 'healthy' },
  { source: 'Walmart', health: 88, issues: 5, lastUpdate: '1 hour ago', status: 'healthy' },
  { source: 'Target', health: 72, issues: 12, lastUpdate: '4 hours ago', status: 'warning' },
  { source: 'Sam\'s Club', health: 91, issues: 3, lastUpdate: '1 hour ago', status: 'healthy' },
  { source: 'DDaaS', health: 96, issues: 1, lastUpdate: '30 mins ago', status: 'healthy' },
  { source: 'Snack Cloud', health: 78, issues: 8, lastUpdate: '6 hours ago', status: 'warning' },
  { source: 'Manual Uploads', health: 65, issues: 15, lastUpdate: '12 hours ago', status: 'error' }
];

const issueBreakdown = [
  { category: 'Missing Data', count: 23, severity: 'high' },
  { category: 'Format Issues', count: 15, severity: 'medium' },
  { category: 'Duplicate Records', count: 8, severity: 'low' },
  { category: 'Outdated Values', count: 12, severity: 'medium' },
  { category: 'Validation Errors', count: 6, severity: 'high' }
];

const trendData = [
  { week: 'W40', quality: 82, issues: 67 },
  { week: 'W41', quality: 85, issues: 58 },
  { week: 'W42', quality: 83, issues: 62 },
  { week: 'W43', quality: 87, issues: 46 },
  { week: 'W44', quality: 89, issues: 41 },
  { week: 'W45', quality: 87, issues: 46 }
];

const pieData = [
  { name: 'Healthy', value: 65, color: 'hsl(var(--success))' },
  { name: 'Warning', value: 25, color: 'hsl(var(--warning))' },
  { name: 'Critical', value: 10, color: 'hsl(var(--danger))' }
];

export const DataQuality = () => {
  const [selectedSource, setSelectedSource] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 3000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'error': return <FileX className="h-4 w-4 text-danger" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-success/20 text-success';
      case 'warning': return 'bg-warning/20 text-warning';
      case 'error': return 'bg-danger/20 text-danger';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-danger/20 text-danger';
      case 'medium': return 'bg-warning/20 text-warning';
      case 'low': return 'bg-success/20 text-success';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <Card className="p-6 bg-gradient-performance border-mars-blue-secondary shadow-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-primary-foreground">
            <Database className="h-8 w-8" />
            <div>
              <h2 className="text-xl font-bold">Data Quality Dashboard</h2>
              <p className="opacity-90">Monitor data health, identify issues, and track improvements</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={refreshData} disabled={isRefreshing} variant="secondary" size="sm">
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Button variant="secondary" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </Card>

      {/* Overall Quality Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4 bg-gradient-glow border-mars-blue-secondary shadow-card text-center">
          <div className="text-2xl font-bold text-primary mb-1">{dataQualityMetrics.overall}%</div>
          <div className="text-sm text-muted-foreground">Overall Quality</div>
          <Progress value={dataQualityMetrics.overall} className="mt-2 h-2" />
        </Card>
        <Card className="p-4 bg-gradient-glow border-mars-blue-secondary shadow-card text-center">
          <div className="text-2xl font-bold text-success mb-1">{dataQualityMetrics.completeness}%</div>
          <div className="text-sm text-muted-foreground">Completeness</div>
          <Progress value={dataQualityMetrics.completeness} className="mt-2 h-2" />
        </Card>
        <Card className="p-4 bg-gradient-glow border-mars-blue-secondary shadow-card text-center">
          <div className="text-2xl font-bold text-warning mb-1">{dataQualityMetrics.accuracy}%</div>
          <div className="text-sm text-muted-foreground">Accuracy</div>
          <Progress value={dataQualityMetrics.accuracy} className="mt-2 h-2" />
        </Card>
        <Card className="p-4 bg-gradient-glow border-mars-blue-secondary shadow-card text-center">
          <div className="text-2xl font-bold text-primary mb-1">{dataQualityMetrics.timeliness}%</div>
          <div className="text-sm text-muted-foreground">Timeliness</div>
          <Progress value={dataQualityMetrics.timeliness} className="mt-2 h-2" />
        </Card>
        <Card className="p-4 bg-gradient-glow border-mars-blue-secondary shadow-card text-center">
          <div className="text-2xl font-bold text-mars-blue-primary mb-1">{dataQualityMetrics.consistency}%</div>
          <div className="text-sm text-muted-foreground">Consistency</div>
          <Progress value={dataQualityMetrics.consistency} className="mt-2 h-2" />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Data Source Health */}
        <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Data Source Health</h3>
            <Select value={selectedSource} onValueChange={setSelectedSource}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                {dataSourceHealth.map(source => (
                  <SelectItem key={source.source} value={source.source}>
                    {source.source}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-3">
            {dataSourceHealth.map((source, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(source.status)}
                  <div>
                    <p className="font-medium text-sm">{source.source}</p>
                    <p className="text-xs text-muted-foreground">Updated {source.lastUpdate}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{source.health}%</span>
                    <Badge className={getStatusColor(source.status)}>
                      {source.issues} issues
                    </Badge>
                  </div>
                  <Progress value={source.health} className="mt-1 h-1 w-16" />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quality Trends */}
        <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Quality Trends (6 Weeks)
          </h3>
          
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="week" stroke="hsl(var(--foreground))" />
              <YAxis stroke="hsl(var(--foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }} 
              />
              <Bar dataKey="quality" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Quality Score %" />
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-success/10 rounded-lg">
              <p className="text-sm font-medium text-success">Avg Quality</p>
              <p className="text-lg font-bold">85.7%</p>
              <p className="text-xs text-muted-foreground">+3.2% vs last month</p>
            </div>
            <div className="text-center p-3 bg-primary/10 rounded-lg">
              <p className="text-sm font-medium text-primary">Avg Issues</p>
              <p className="text-lg font-bold">53</p>
              <p className="text-xs text-muted-foreground">-8 vs last month</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Issue Breakdown */}
        <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
          <h3 className="font-semibold mb-4">Current Issues Breakdown</h3>
          
          <div className="space-y-3">
            {issueBreakdown.map((issue, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium text-sm">{issue.category}</p>
                  <Badge className={`mt-1 ${getSeverityColor(issue.severity)}`}>
                    {issue.severity} severity
                  </Badge>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold">{issue.count}</span>
                  <p className="text-xs text-muted-foreground">issues</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-warning/10 rounded-lg border border-warning/20">
            <h4 className="font-medium mb-2 flex items-center gap-2 text-warning">
              <AlertTriangle className="h-4 w-4" />
              Priority Actions Required
            </h4>
            <div className="space-y-1 text-sm">
              <p>• Fix 29 high-severity data issues</p>
              <p>• Update Manual Upload validation rules</p>
              <p>• Resolve Target data feed delays</p>
            </div>
          </div>
        </Card>

        {/* Data Distribution */}
        <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
          <h3 className="font-semibold mb-4">Data Health Distribution</h3>
          
          <div className="h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="text-center p-2 bg-success/10 rounded">
              <p className="text-sm font-medium text-success">Healthy</p>
              <p className="text-lg font-bold">65%</p>
            </div>
            <div className="text-center p-2 bg-warning/10 rounded">
              <p className="text-sm font-medium text-warning">Warning</p>
              <p className="text-lg font-bold">25%</p>
            </div>
            <div className="text-center p-2 bg-danger/10 rounded">
              <p className="text-sm font-medium text-danger">Critical</p>
              <p className="text-lg font-bold">10%</p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-primary/10 rounded-lg">
            <h4 className="font-medium mb-2">Improvement Recommendations</h4>
            <div className="space-y-1 text-sm">
              <p>• Implement automated data validation</p>
              <p>• Set up real-time monitoring alerts</p>
              <p>• Establish data governance standards</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};