import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { FileSpreadsheet, Download, TrendingUp, DollarSign, Target, ShoppingCart, Filter, Calendar } from 'lucide-react';

const gpdData = {
  summary: {
    totalGSV: 47.2,
    growth: 16.3,
    categoryShare: 18.2,
    shareGain: 1.4,
    digitalPenetration: 31,
    mediaROI: 4.2
  },
  retailers: [
    { name: 'Walmart', gsv: 12.3, growth: 24, share: 26.1, velocity: 1.8, promo: 85 },
    { name: 'Amazon', gsv: 6.2, growth: -8, share: 13.1, velocity: 0.9, promo: 45 },
    { name: 'Target', gsv: 8.7, growth: 19, share: 18.4, velocity: 1.5, promo: 72 },
    { name: 'Kroger', gsv: 4.8, growth: 12, share: 10.2, velocity: 1.2, promo: 68 },
    { name: 'CVS', gsv: 3.9, growth: 7, share: 8.3, velocity: 1.1, promo: 55 }
  ],
  brands: [
    { name: 'Snickers', gsv: 18.5, growth: 21, share: 39.2, innovation: 2.1, media: 3.8 },
    { name: 'M&M', gsv: 15.2, growth: 7, share: 32.2, innovation: 1.8, media: 3.2 },
    { name: 'Skittles', gsv: 8.9, growth: 34, share: 18.9, innovation: 3.2, media: 5.4 },
    { name: 'Twix', gsv: 4.6, growth: 15, share: 9.7, innovation: 1.5, media: 2.9 }
  ],
  monthly: [
    { month: 'Jan', gsv: 3.8, units: 450, share: 17.2, media: 580 },
    { month: 'Feb', gsv: 3.9, units: 468, share: 17.5, media: 620 },
    { month: 'Mar', gsv: 4.1, units: 485, share: 17.8, media: 690 },
    { month: 'Apr', gsv: 4.0, units: 472, share: 18.0, media: 650 },
    { month: 'May', gsv: 4.3, units: 512, share: 18.4, media: 720 },
    { month: 'Jun', gsv: 4.5, units: 535, share: 18.7, media: 750 }
  ]
};

export const GPDReporting = () => {
  const [selectedView, setSelectedView] = useState('overview');
  const [selectedRetailer, setSelectedRetailer] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('ytd');

  const exportToExcel = () => {
    // Create CSV content for GPD export
    const csvContent = [
      ['Mars DCom GPD Report', new Date().toLocaleDateString()],
      [''],
      ['SUMMARY METRICS'],
      ['Total GSV ($M)', gpdData.summary.totalGSV],
      ['YoY Growth (%)', gpdData.summary.growth],
      ['Category Share (%)', gpdData.summary.categoryShare],
      ['Share Gain (pts)', gpdData.summary.shareGain],
      [''],
      ['RETAILER PERFORMANCE'],
      ['Retailer', 'GSV ($M)', 'Growth (%)', 'Share (%)', 'Velocity', 'Promo (%)'],
      ...gpdData.retailers.map(r => [r.name, r.gsv, r.growth, r.share, r.velocity, r.promo]),
      [''],
      ['BRAND PERFORMANCE'],
      ['Brand', 'GSV ($M)', 'Growth (%)', 'Share (%)', 'Innovation ($M)', 'Media ROI'],
      ...gpdData.brands.map(b => [b.name, b.gsv, b.growth, b.share, b.innovation, b.media])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Mars-DCom-GPD-Report-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const getStatusColor = (value: number, threshold: number = 0) => {
    if (value > threshold + 10) return 'text-success';
    if (value > threshold) return 'text-warning';
    return 'text-danger';
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <Card className="p-6 bg-gradient-performance border-mars-blue-secondary shadow-card">
        <div className="flex items-center justify-between text-primary-foreground">
          <div className="flex items-center gap-4">
            <FileSpreadsheet className="h-8 w-8" />
            <div>
              <h2 className="text-xl font-bold">GPD Equivalent Reporting</h2>
              <p className="opacity-90">Comprehensive performance analysis with drill-down capabilities</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={exportToExcel} 
              variant="secondary" 
              className="bg-white/20 hover:bg-white/30 text-primary-foreground"
            >
              <Download className="h-4 w-4 mr-2" />
              Export GPD
            </Button>
          </div>
        </div>
      </Card>

      {/* Filters */}
      <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-primary" />
            <span className="font-medium">Filters:</span>
          </div>
          
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ytd">YTD</SelectItem>
              <SelectItem value="q2">Q2 2024</SelectItem>
              <SelectItem value="q1">Q1 2024</SelectItem>
              <SelectItem value="ly">Last Year</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedRetailer} onValueChange={setSelectedRetailer}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Retailers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Retailers</SelectItem>
              {gpdData.retailers.map(retailer => (
                <SelectItem key={retailer.name} value={retailer.name.toLowerCase()}>
                  {retailer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedBrand} onValueChange={setSelectedBrand}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="All Brands" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              {gpdData.brands.map(brand => (
                <SelectItem key={brand.name} value={brand.name.toLowerCase()}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="p-4 bg-gradient-glow border-mars-blue-secondary shadow-card">
          <div className="flex items-center gap-3">
            <DollarSign className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total GSV</p>
              <p className="text-2xl font-bold">${gpdData.summary.totalGSV}M</p>
              <p className={`text-sm font-medium ${getStatusColor(gpdData.summary.growth)}`}>
                +{gpdData.summary.growth}% YoY
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-glow border-mars-blue-secondary shadow-card">
          <div className="flex items-center gap-3">
            <Target className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Category Share</p>
              <p className="text-2xl font-bold">{gpdData.summary.categoryShare}%</p>
              <p className="text-sm font-medium text-success">+{gpdData.summary.shareGain} pts</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-glow border-mars-blue-secondary shadow-card">
          <div className="flex items-center gap-3">
            <ShoppingCart className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Digital Penetration</p>
              <p className="text-2xl font-bold">{gpdData.summary.digitalPenetration}%</p>
              <p className="text-sm font-medium text-success">+8% YoY</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-glow border-mars-blue-secondary shadow-card">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Media ROI</p>
              <p className="text-2xl font-bold">${gpdData.summary.mediaROI}</p>
              <p className="text-sm font-medium text-success">vs $3.1 avg</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-glow border-mars-blue-secondary shadow-card">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Data Quality</p>
              <p className="text-2xl font-bold">94%</p>
              <p className="text-sm font-medium text-success">Complete</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-glow border-mars-blue-secondary shadow-card">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="text-lg font-bold">Today</p>
              <p className="text-sm font-medium text-muted-foreground">8:30 AM</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Views */}
      <Tabs value={selectedView} onValueChange={setSelectedView}>
        <TabsList className="grid w-full grid-cols-4 bg-mars-blue-secondary text-white">
          <TabsTrigger value="overview" className="text-white data-[state=active]:bg-primary data-[state=active]:text-white">
            Overview
          </TabsTrigger>
          <TabsTrigger value="retailers" className="text-white data-[state=active]:bg-primary data-[state=active]:text-white">
            Retailers
          </TabsTrigger>
          <TabsTrigger value="brands" className="text-white data-[state=active]:bg-primary data-[state=active]:text-white">
            Brands
          </TabsTrigger>
          <TabsTrigger value="trends" className="text-white data-[state=active]:bg-primary data-[state=active]:text-white">
            Trends
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
              <h3 className="font-semibold mb-4">Performance Trends</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={gpdData.monthly}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="gsv" stroke="hsl(var(--primary))" name="GSV ($M)" />
                    <Line type="monotone" dataKey="share" stroke="hsl(var(--mars-yellow))" name="Share (%)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
              <h3 className="font-semibold mb-4">Channel Mix</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Retail</span>
                  <div className="flex items-center gap-2">
                    <Progress value={65} className="w-20 h-2" />
                    <span className="font-medium">65%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>E-commerce</span>
                  <div className="flex items-center gap-2">
                    <Progress value={35} className="w-20 h-2" />
                    <span className="font-medium">35%</span>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground mt-4">
                  E-commerce growing 31% YoY with strong on-demand penetration
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="retailers" className="space-y-6">
          <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
            <h3 className="font-semibold mb-4">Retailer Performance Deep Dive</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-mars-blue-secondary">
                    <th className="text-left p-2">Retailer</th>
                    <th className="text-right p-2">GSV ($M)</th>
                    <th className="text-right p-2">Growth (%)</th>
                    <th className="text-right p-2">Share (%)</th>
                    <th className="text-right p-2">Velocity</th>
                    <th className="text-right p-2">Promo (%)</th>
                    <th className="text-center p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {gpdData.retailers.map((retailer, index) => (
                    <tr key={index} className="border-b border-muted hover:bg-muted/20 cursor-pointer">
                      <td className="p-2 font-medium">{retailer.name}</td>
                      <td className="text-right p-2">${retailer.gsv}</td>
                      <td className={`text-right p-2 font-medium ${getStatusColor(retailer.growth)}`}>
                        {retailer.growth > 0 ? '+' : ''}{retailer.growth}%
                      </td>
                      <td className="text-right p-2">{retailer.share}%</td>
                      <td className="text-right p-2">{retailer.velocity}</td>
                      <td className="text-right p-2">{retailer.promo}%</td>
                      <td className="text-center p-2">
                        <Button variant="ghost" size="sm">Drill Down</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="brands" className="space-y-6">
          <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
            <h3 className="font-semibold mb-4">Brand Portfolio Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Performance Overview</h4>
                <div className="space-y-3">
                  {gpdData.brands.map((brand, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 cursor-pointer">
                      <div>
                        <p className="font-medium">{brand.name}</p>
                        <p className="text-sm text-muted-foreground">${brand.gsv}M GSV</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${getStatusColor(brand.growth)}`}>
                          {brand.growth > 0 ? '+' : ''}{brand.growth}%
                        </p>
                        <p className="text-sm text-muted-foreground">{brand.share}% share</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Investment Analysis</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={gpdData.brands}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="media" fill="hsl(var(--primary))" name="Media ROI" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
            <h3 className="font-semibold mb-4">Trend Analysis & Forecasting</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={gpdData.monthly}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="gsv" stroke="hsl(var(--primary))" name="GSV ($M)" strokeWidth={3} />
                  <Line type="monotone" dataKey="units" stroke="hsl(var(--mars-yellow))" name="Units (K)" strokeWidth={2} />
                  <Line type="monotone" dataKey="media" stroke="hsl(var(--success))" name="Media Spend ($K)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};