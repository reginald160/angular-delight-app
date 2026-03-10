import { useEffect, useState } from 'react';
import { Quote } from 'lucide-react';
import { api, Testimonial } from '@/services/api';
import { cn } from '@/lib/utils';

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const data = await api.getTestimonials();
      setTestimonials(data);
      setLoading(false);
    };
    fetchTestimonials();
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 bg-royal/10 text-royal rounded-full text-sm font-medium mb-4">
            Success Stories
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Hear From Our Community
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Thousands of professionals have improved their job prospects with our structured application support.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={cn(
                'relative bg-card rounded-2xl p-8 border border-border shadow-card animate-fade-in opacity-0 hover:shadow-card-hover transition-shadow duration-300'
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Quote Icon */}
              <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center mb-6">
                <Quote className="w-6 h-6 text-gold-dark" />
              </div>

              {/* Message */}
              <p className="text-foreground mb-6 leading-relaxed">"{testimonial.message}"</p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-hero flex items-center justify-center text-primary-foreground font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role} • {testimonial.country}
                  </p>
                </div>
              </div>

              {/* Decorative */}
              <div className="absolute bottom-0 right-0 w-32 h-32 rounded-tl-[100px] bg-muted/50" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
