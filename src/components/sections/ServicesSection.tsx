import { useEffect, useState } from 'react';
import { GraduationCap, Briefcase, Plane, Home, Car, Users, ArrowRight } from 'lucide-react';
import { api, ServiceModule } from '@/services/api';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  GraduationCap,
  Briefcase,
  Plane,
  Home,
  Car,
  Users,
};

export function ServicesSection() {
  const [services, setServices] = useState<ServiceModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      const data = await api.getServiceModules();
      setServices(data);
      setLoading(false);
    };
    fetchServices();
  }, []);

  if (loading) {
    return (
      <section id="services" className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-8 w-48 mx-auto bg-muted rounded animate-pulse mb-4" />
            <div className="h-4 w-96 mx-auto bg-muted rounded animate-pulse" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-72 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 bg-royal/10 text-royal rounded-full text-sm font-medium mb-4">
            Our Services
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Comprehensive UK Migration Solutions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From your first step to full settlement, we provide end-to-end support for your UK journey.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon] || Users;
            const isHovered = hoveredId === service.id;

            return (
              <div
                key={service.id}
                className={cn(
                  'group relative bg-card rounded-2xl p-8 border border-border shadow-card transition-all duration-500 cursor-pointer animate-fade-in opacity-0',
                  isHovered && 'shadow-card-hover border-royal/30 -translate-y-2'
                )}
                style={{ animationDelay: `${index * 100}ms` }}
                onMouseEnter={() => setHoveredId(service.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Icon */}
                <div
                  className={cn(
                    'w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-all duration-300',
                    isHovered ? 'bg-hero' : 'bg-royal/10'
                  )}
                >
                  <Icon
                    className={cn(
                      'w-7 h-7 transition-colors duration-300',
                      isHovered ? 'text-primary-foreground' : 'text-royal'
                    )}
                  />
                </div>

                {/* Content */}
                <h3 className="font-serif text-xl font-bold text-foreground mb-3 group-hover:text-royal transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground mb-6 line-clamp-2">{service.description}</p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {service.features.slice(0, 3).map((feature) => (
                    <span
                      key={feature}
                      className="px-3 py-1 bg-muted text-xs font-medium text-muted-foreground rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex items-center text-royal font-medium">
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                </div>

                {/* Decorative Corner */}
                <div
                  className={cn(
                    'absolute top-0 right-0 w-24 h-24 rounded-bl-[100px] transition-all duration-500',
                    isHovered ? 'bg-gold/20' : 'bg-transparent'
                  )}
                />
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Button variant="royal" size="lg">
            View All Services
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}
