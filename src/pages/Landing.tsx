import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BarChart3, Brain, Presentation, Users, Zap, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/mars-dashboard-hero.jpg';

// Import CSS modules
import '@/styles/custom_font_ts.css';
import '@/styles/layout.css';
import '@/styles/layout2.css';
import '@/styles/layout3.css';
import '@/styles/page.css';

const Landing = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Update document title and meta tags
    document.title = 'Mars Dashboard - AI-Powered Marketing Analytics & Reporting';
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Transform your marketing with AI-powered insights, GPD-equivalent reporting, and automated presentations. Get actionable analytics and persona-driven dashboards.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Transform your marketing with AI-powered insights, GPD-equivalent reporting, and automated presentations. Get actionable analytics and persona-driven dashboards.';
      document.head.appendChild(meta);
    }

    // Add Open Graph meta tags
    const ogTags = [
      { property: 'og:title', content: 'Mars Dashboard - AI-Powered Marketing Analytics' },
      { property: 'og:description', content: 'Transform your marketing with AI-powered insights, GPD-equivalent reporting, and automated presentations.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: window.location.href },
      { property: 'og:image', content: `${window.location.origin}${heroImage}` },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Mars Dashboard - AI-Powered Marketing Analytics' },
      { name: 'twitter:description', content: 'Transform your marketing with AI-powered insights and automated presentations.' },
      { name: 'twitter:image', content: `${window.location.origin}${heroImage}` }
    ];

    ogTags.forEach(tag => {
      const existing = document.querySelector(`meta[${tag.property ? 'property' : 'name'}="${tag.property || tag.name}"]`);
      if (existing) {
        existing.setAttribute('content', tag.content);
      } else {
        const meta = document.createElement('meta');
        if (tag.property) {
          meta.setAttribute('property', tag.property);
        } else {
          meta.setAttribute('name', tag.name);
        }
        meta.setAttribute('content', tag.content);
        document.head.appendChild(meta);
      }
    });

    return () => {
      // Cleanup: Reset title when component unmounts
      document.title = 'Mars Dashboard';
    };
  }, []);

  const handleGetStarted = () => {
    navigate('/dashboard');
  };

  const benefits = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-Powered Insights",
      description: "Get intelligent analysis of your marketing performance with GPD-equivalent reporting and real-time strategic recommendations."
    },
    {
      icon: <Presentation className="w-6 h-6" />,
      title: "Auto-Generated Presentations",
      description: "Create professional slide decks instantly with AI-generated narratives, charts, and executive summaries."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Persona-Based Dashboards",
      description: "Customize insights for different stakeholders with role-specific dashboards and personalized analytics."
    }
  ];

  const howItWorks = [
    {
      title: "Connect Your Data",
      description: "Seamlessly integrate your marketing data sources and campaigns for comprehensive analysis."
    },
    {
      title: "AI Analysis & Insights",
      description: "Our AI engine processes your data to provide actionable insights and performance recommendations."
    },
    {
      title: "Generate Reports",
      description: "Create stunning presentations and dashboards with one-click generation powered by advanced AI."
    },
    {
      title: "Take Action",
      description: "Implement AI-recommended strategies to optimize your marketing performance and ROI."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Director",
      company: "TechCorp",
      avatar: "/api/placeholder/48/48",
      quote: "Mars Dashboard transformed how we analyze campaign performance. The AI insights are incredibly accurate and actionable."
    },
    {
      name: "Mike Chen",
      role: "CMO",
      company: "GrowthLabs",
      avatar: "/api/placeholder/48/48",
      quote: "The presentation generation feature saves us hours every week. Professional reports in minutes, not days."
    },
    {
      name: "Lisa Rodriguez",
      role: "Data Analyst",
      company: "MediaFlow",
      avatar: "/api/placeholder/48/48",
      quote: "Finally, a dashboard that speaks our language. The GPD-equivalent reporting is exactly what we needed."
    }
  ];

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Hero Section */}
      <section className="py-20" style={{ margin: 'var(--container-margin)' }}>
        <div className="grid_g-lg-12__OJ9V7">
          <div className="grid_gc-lg-6__V4Tw8">
            <div className="space-y-6">
              <h1 className="text-5xl font-bold tracking-tight text-foreground leading-tight">
                Transform Your Marketing with{' '}
                <span className="text-primary">AI-Powered</span> Insights
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Get GPD-equivalent reporting, automated presentations, and persona-driven dashboards. 
                Make data-driven decisions with confidence using our intelligent marketing analytics platform.
              </p>
              <div className="flex gap-4 items-center">
                <button 
                  className="button-square_square__xjudy text-lg px-8 py-4"
                  onClick={handleGetStarted}
                >
                  Get Started <ArrowRight className="w-5 h-5" />
                </button>
                <Button variant="outline" size="lg" className="px-8 py-4">
                  Watch Demo
                </Button>
              </div>
              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span className="text-sm text-muted-foreground">No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span className="text-sm text-muted-foreground">5-minute setup</span>
                </div>
              </div>
            </div>
          </div>
          <div className="grid_gc-lg-6__V4Tw8">
            <div className="relative">
              <div 
                className="bg-card border shadow-card p-8 overflow-hidden"
                style={{ borderRadius: 'var(--border-radius-20)' }}
              >
                <img 
                  src={heroImage} 
                  alt="Mars Dashboard Screenshot" 
                  className="w-full h-auto rounded-lg shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/30">
        <div style={{ margin: 'var(--container-margin)' }}>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              Why Choose Mars Dashboard?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the future of marketing analytics with our comprehensive AI-powered platform
            </p>
          </div>
          
          <div className="grid_g-lg-3__K8Pw9">
            {benefits.map((benefit, index) => (
              <div key={index} className="tools-card_root__M7Qx9">
                <div className="tools-card_icon__P9Kw7">
                  {benefit.icon}
                </div>
                <h3 className="tools-card_title__L8Nx4">{benefit.title}</h3>
                <p className="tools-card_description__K9Mp5">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div style={{ margin: 'var(--container-margin)' }}>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get up and running in minutes with our intuitive four-step process
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            {howItWorks.map((step, index) => (
              <div key={index} className="list-item_row__Il_Rl">
                <div className="list-item_number__K7Qw9">
                  {index + 1}
                </div>
                <div className="list-item_content__M8Rx7">
                  <h3 className="list-item_title__N9Sy8">{step.title}</h3>
                  <p className="list-item_description__P0Tz9">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/30">
        <div style={{ margin: 'var(--container-margin)' }}>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              Trusted by Marketing Teams
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See what industry leaders are saying about Mars Dashboard
            </p>
          </div>
          
          <div className="grid_g-lg-3__K8Pw9">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="button-menu-item_root__lIIL2 flex-col items-start">
                <div className="flex items-center gap-4 mb-4">
                  <div className="avatar_root__Q1Uw0">
                    <div className="avatar_initials__S3Wy2">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role} at {testimonial.company}</div>
                  </div>
                </div>
                <p className="text-foreground leading-relaxed italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div style={{ margin: 'var(--container-margin)' }}>
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              Ready to Transform Your Marketing?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of marketers who trust Mars Dashboard for their analytics and reporting needs
            </p>
            
            <div className="flex justify-center">
              <button 
                className="floating-buttons_root__cgDUn text-lg px-12 py-6"
                onClick={handleGetStarted}
              >
                Start Your Free Trial <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
            
            <div className="flex justify-center gap-8 mt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>No setup fees</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;