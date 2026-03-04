import { ArrowRight, CheckCircle, Shield, Users } from 'lucide-react';
import { Button, LinkButton } from '@/components/ui/button';

const highlights = [
  'Career Support Services',
  'Managed Job Applications',
  'Interview Preparation',
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen bg-hero overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-foreground rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold rounded-full blur-3xl" />
      </div>
      
      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container mx-auto px-4 lg:px-8 pt-32 pb-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-8rem)]">
          {/* Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 mb-8 animate-fade-in">
              <Shield className="w-4 h-4 text-gold" />
              <span className="text-sm font-medium text-primary-foreground">Trusted by 15,000+ Migrants</span>
            </div>

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6 animate-fade-in [animation-delay:100ms] opacity-0">
              Land Your Next Opportunity with Expert{' '}
              <span className="text-gradient-gold">Job Application Support</span>
            </h1>

            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-xl mx-auto lg:mx-0 animate-fade-in [animation-delay:200ms] opacity-0">
              From visa applications to job placement, Interview Preparation to settlement — we simplify every step of your UK journey.
            </p>

            {/* Highlights */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-10 animate-fade-in [animation-delay:300ms] opacity-0">
              {highlights.map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-gold" />
                  <span className="text-sm text-primary-foreground/90">{item}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in [animation-delay:400ms] opacity-0">
             <LinkButton 
                  to="/dashboard" 
                  variant="hero" 
                  size="xl" 
                  className="group"
                >
                  Start Your Career Journey
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </LinkButton>
              {/* <LinkButton to ="/#services" variant="heroOutline"   className="group" size="xl">
                Explore Services
              </LinkButton> */}
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex items-center gap-6 justify-center lg:justify-start animate-fade-in [animation-delay:500ms] opacity-0">
              <div className="flex -space-x-3">
                {['PS', 'AH', 'MS', 'JD'].map((initials, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-xs font-bold text-secondary-foreground border-2 border-primary"
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-4 h-4 text-gold fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <p className="text-xs text-primary-foreground/70">4.9/5 from 2,500+ reviews</p>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="hidden lg:flex justify-center items-center animate-fade-in [animation-delay:300ms] opacity-0">
            <div className="relative">
              {/* Main Card */}
              <div className="relative w-80 h-96 bg-card rounded-2xl shadow-card overflow-hidden transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="absolute top-0 left-0 right-0 h-24 bg-hero" />
                <div className="absolute top-16 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-gold flex items-center justify-center text-2xl font-bold text-secondary-foreground border-4 border-card">
                  Career
                </div>
                <div className="pt-28 px-6 text-center">
                  <h3 className="font-serif text-xl font-bold text-foreground mb-1">Your UK Journey</h3>
                  <p className="text-sm text-muted-foreground mb-4">Professional job search made simple</p>
                  <div className="space-y-3">
                    {['Applications Submitted', 'Interviews Secured', 'Progress Tracked'].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-sm font-medium text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -left-16 top-8 w-48 p-4 bg-card rounded-xl shadow-card animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <p className="text-sm font-semibold text-foreground">Congratulations!</p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-12 bottom-16 w-44 p-4 bg-card rounded-xl shadow-card animate-float [animation-delay:1s]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-gold-dark" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Active Users</p>
                    <p className="text-sm font-semibold text-foreground">15,000+</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
}
