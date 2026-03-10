import { ArrowRight, Link, MessageCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function CTASection() {
 const navigate = useNavigate();
  return (
    <section id="contact" className="py-24 bg-hero relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 w-64 h-64 bg-gold rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-primary-foreground rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Ready to Accelerate{' '}
            <span className="text-gradient-gold">Your Career?</span>
          </h2>
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
            Join thousands of professionals who trust UK Pathway to support their job search journey.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button variant="hero" size="xl" className="group" onClick={()=> navigate("/auth")}>
              Book a Consultation
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="heroOutline" size="xl" onClick={()=> navigate("/auth")}>
              
              <MessageCircle className="w-5 h-5" />
              Talk to an Advisor

            </Button>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-primary-foreground/80">
            <a
              href="tel:+442012345678"
              className="flex items-center gap-2 hover:text-primary-foreground transition-colors"
            >
              <Phone className="w-5 h-5" />
              +44 7919 785 936            </a>
            <span className="hidden sm:block text-primary-foreground/40">|</span>
            <p>Available Mon-Fri, 9am-6pm GMT</p>
          </div>
        </div>
      </div>
    </section>
  );
}
