import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Lightbulb, Target, TrendingUp, AlertTriangle, CheckCircle, Clock, Zap } from 'lucide-react';

const aiInsights = {
  reasoning: [
    {
      title: "Gum Category Outperformance Analysis",
      insight: "Gum category is outperforming chocolate by 34% due to strategic microseason campaign timing aligned with back-to-school preparation, superior shelf execution during key periods, and strong velocity in Walmart (+28%) and Target (+19%).",
      confidence: 92,
      impact: "High",
      reasoning: [
        "Media timing optimization captured 85% of back-to-school traffic surge",
        "Shelf space execution improved 23% vs previous quarter",
        "Retailer velocity correlation shows 0.89 coefficient with media spend timing"
      ],
      actions: ["Replicate timing strategy for Halloween campaign", "Expand shelf optimization to underperforming retailers", "Increase Gum investment allocation by 15%"],
      type: "insight"
    },
    {
      title: "Amazon Velocity Decline Root Cause",
      insight: "Amazon's 8% GSV decline is primarily driven by search ranking deterioration (-5 positions for key SKUs), increased competitive pressure from private label alternatives, and suboptimal media mix allocation.",
      confidence: 87,
      impact: "Critical",
      reasoning: [
        "Search ranking dropped from position 3 to 8 for 'chocolate snacks' keyword",
        "Private label alternatives gained 12% share in candy category",
        "Media mix analysis shows 60% budget allocated to low-converting placements"
      ],
      actions: ["Immediate search optimization campaign", "Reassess media placement strategy", "Competitive pricing analysis and adjustment"],
      type: "concern"
    },
    {
      title: "Q4 Forecast Opportunity",
      insight: "Halloween and holiday seasonality presents 31% lift opportunity vs Q2 actual performance, driven by early consumer sentiment analysis showing 78% higher purchase intent for premium candy.",
      confidence: 84,
      impact: "High",
      reasoning: [
        "Consumer sentiment tracking shows 78% YoY increase in premium candy interest",
        "Historical Halloween performance averaged 2.3x normal velocity",
        "Current inventory levels support 40% volume increase"
      ],
      actions: ["Accelerate Halloween campaign launch", "Secure additional premium inventory", "Optimize pricing strategy for holiday period"],
      type: "opportunity"
    }
  ],
  recommendations: [
    {
      priority: "Immediate",
      title: "Amazon Recovery Initiative",
      description: "Launch comprehensive Amazon velocity recovery program targeting search optimization and media reallocation",
      timeline: "2 weeks",
      effort: "High",
      impact: "$1.2M GSV recovery potential",
      owner: "Digital Commerce Team"
    },
    {
      priority: "Q4 2024",
      title: "Gum Category Investment Reallocation",
      description: "Shift 15% media budget from underperforming chocolate campaigns to high-performing gum initiatives",
      timeline: "4 weeks",
      effort: "Medium",
      impact: "$800K incremental revenue",
      owner: "Brand Management"
    },
    {
      priority: "Q1 2025",
      title: "Predictive Analytics Enhancement",
      description: "Implement advanced forecasting models to improve campaign timing and inventory planning",
      timeline: "12 weeks",
      effort: "High",
      impact: "15% efficiency improvement",
      owner: "Analytics Team"
    }
  ],
  plans: [
    {
      title: "30-Day Sprint Plan",
      status: "In Progress",
      completion: 65,
      items: [
        { task: "Amazon search optimization", status: "completed", owner: "Digital Team" },
        { task: "Halloween campaign launch", status: "in-progress", owner: "Brand Team" },
        { task: "Media reallocation execution", status: "pending", owner: "Media Team" },
        { task: "Competitive pricing analysis", status: "pending", owner: "Commercial Team" }
      ]
    },
    {
      title: "60-Day Strategic Initiatives",
      status: "Planning",
      completion: 20,
      items: [
        { task: "Gum category expansion", status: "planning", owner: "Brand Team" },
        { task: "Retail partnership optimization", status: "planning", owner: "KAM Team" },
        { task: "Innovation pipeline review", status: "not-started", owner: "R&D Team" },
        { task: "Q1 budget planning", status: "not-started", owner: "Finance Team" }
      ]
    },
    {
      title: "90-Day Transformation",
      status: "Scoping",
      completion: 5,
      items: [
        { task: "Predictive analytics implementation", status: "scoping", owner: "Analytics Team" },
        { task: "Omnichannel strategy development", status: "not-started", owner: "Strategy Team" },
        { task: "Consumer insights platform", status: "not-started", owner: "Insights Team" },
        { task: "Performance measurement framework", status: "not-started", owner: "Analytics Team" }
      ]
    }
  ]
};

export const AIInsights = () => {
  const [selectedInsight, setSelectedInsight] = useState(0);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-warning" />;
      case 'planning': return <Target className="h-4 w-4 text-primary" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success/20 text-success';
      case 'in-progress': return 'bg-warning/20 text-warning';
      case 'planning': return 'bg-primary/20 text-primary';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <Card className="p-6 bg-gradient-performance border-mars-blue-secondary shadow-card">
        <div className="flex items-center gap-4 text-primary-foreground">
          <Brain className="h-8 w-8" />
          <div>
            <h2 className="text-xl font-bold">AI-Powered Strategic Insights</h2>
            <p className="opacity-90">Deep reasoning, strategic recommendations, and action plans</p>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="reasoning" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-mars-blue-secondary">
          <TabsTrigger value="reasoning" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Reasoning
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Recommendations
          </TabsTrigger>
          <TabsTrigger value="plans" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Action Plans
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reasoning" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Insight List */}
            <Card className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
              <h3 className="font-semibold mb-4">Key Insights</h3>
              <div className="space-y-3">
                {aiInsights.reasoning.map((insight, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      selectedInsight === index
                        ? 'border-primary bg-primary/10'
                        : 'border-mars-blue-secondary bg-muted/30 hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedInsight(index)}
                  >
                    <div className="flex items-start gap-2">
                      {insight.type === 'insight' && <Lightbulb className="h-4 w-4 text-primary mt-1" />}
                      {insight.type === 'concern' && <AlertTriangle className="h-4 w-4 text-warning mt-1" />}
                      {insight.type === 'opportunity' && <TrendingUp className="h-4 w-4 text-success mt-1" />}
                      <div className="flex-1">
                        <p className="font-medium text-sm">{insight.title}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={`text-xs ${insight.impact === 'Critical' ? 'bg-danger/20 text-danger' : insight.impact === 'High' ? 'bg-success/20 text-success' : 'bg-primary/20 text-primary'}`}>
                            {insight.impact}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{insight.confidence}% confidence</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Detailed Analysis */}
            <Card className="lg:col-span-2 p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">{aiInsights.reasoning[selectedInsight].title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {aiInsights.reasoning[selectedInsight].insight}
                  </p>
                  <div className="flex items-center gap-4 mb-4">
                    <Badge className="bg-primary/20 text-primary">
                      {aiInsights.reasoning[selectedInsight].confidence}% Confidence
                    </Badge>
                    <Badge className={`${aiInsights.reasoning[selectedInsight].impact === 'Critical' ? 'bg-danger/20 text-danger' : 'bg-success/20 text-success'}`}>
                      {aiInsights.reasoning[selectedInsight].impact} Impact
                    </Badge>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">AI Reasoning Chain</h4>
                  <div className="space-y-2">
                    {aiInsights.reasoning[selectedInsight].reasoning.map((reason, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg">
                        <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-xs font-medium text-primary mt-1">
                          {index + 1}
                        </div>
                        <p className="text-sm">{reason}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Recommended Actions</h4>
                  <div className="space-y-2">
                    {aiInsights.reasoning[selectedInsight].actions.map((action, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-success/10 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <p className="text-sm">{action}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {aiInsights.recommendations.map((rec, index) => (
              <Card key={index} className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge className={`${rec.priority === 'Immediate' ? 'bg-danger/20 text-danger' : rec.priority === 'Q4 2024' ? 'bg-warning/20 text-warning' : 'bg-primary/20 text-primary'}`}>
                      {rec.priority}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{rec.timeline}</span>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">{rec.title}</h3>
                    <p className="text-sm text-muted-foreground">{rec.description}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Effort:</span>
                      <span className={`font-medium ${rec.effort === 'High' ? 'text-danger' : rec.effort === 'Medium' ? 'text-warning' : 'text-success'}`}>
                        {rec.effort}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Impact:</span>
                      <span className="font-medium text-success">{rec.impact}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Owner:</span>
                      <span className="font-medium">{rec.owner}</span>
                    </div>
                  </div>

                  <Button className="w-full" size="sm">
                    Implement Recommendation
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="plans" className="space-y-6">
          <div className="space-y-6">
            {aiInsights.plans.map((plan, index) => (
              <Card key={index} className="p-6 bg-gradient-glow border-mars-blue-secondary shadow-card">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{plan.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getStatusColor(plan.status.toLowerCase())}>
                          {plan.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{plan.completion}% complete</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="w-16 h-16 relative">
                        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="hsl(var(--muted))"
                            strokeWidth="2"
                          />
                          <path
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="hsl(var(--primary))"
                            strokeWidth="2"
                            strokeDasharray={`${plan.completion}, 100`}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-medium">{plan.completion}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {plan.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(item.status)}
                          <span className="text-sm font-medium">{item.task}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-muted-foreground">{item.owner}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};