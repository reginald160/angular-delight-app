import { ClipboardCheck, UserCheck, Rocket, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
  {
    number: '01',
    icon: ClipboardCheck,
    title: 'Register & Choose Your Package',
    description: 'Create your profile and select the level of support you need.',
  },
  {
    number: '02',
    icon: UserCheck,
    title: 'Profile Review',
    description: 'Our advisors review your profile and match you with the right opportunities and resources.',
  },
  {
    number: '03',
    icon: Rocket,
    title: 'Track Progress',
    description: 'Monitor your applications, receive real-time updates, and communicate with your dedicated advisor.',
  },
  {
    number: '04',
    icon: Award,
    title: 'Interview & Career Support',
    description: 'Receive interview preparation and ongoing job search guidance.',
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-muted">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 bg-gold/20 text-gold-dark rounded-full text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Your Journey in 4 Simple Steps
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We've streamlined the entire process to make your career dream achievable.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-24 left-[12.5%] right-[12.5%] h-0.5 bg-border" />

          {steps.map((step, index) => (
            <div
              key={step.number}
              className={cn(
                'relative flex flex-col items-center text-center animate-fade-in-up opacity-0'
              )}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Step Number */}
              <div className="relative z-10 w-20 h-20 rounded-full bg-card border-4 border-gold flex items-center justify-center mb-6 shadow-gold">
                <step.icon className="w-8 h-8 text-royal" />
              </div>

              {/* Number Badge */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-8 h-8 rounded-full bg-hero flex items-center justify-center text-xs font-bold text-primary-foreground">
                {step.number}
              </div>

              {/* Content */}
              <h3 className="font-serif text-xl font-bold text-foreground mb-3">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
