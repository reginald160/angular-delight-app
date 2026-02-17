import { Check, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useSubscription } from '@/hooks/useSubscription';
import { authApi } from '@/services/AuthService';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// const plans = [
//   {
//     name: 'Bronze',
//     price: '300',
//     tier: 'bronze',
//     description: 'Essential visa guidance to get you started.',
//     features: ['Visa Document Checklist', 'Email Support', 'Basic Guides'],
//   },
//   {
//     name: 'Silver',
//     price: '600',
//     tier: 'silver',
//     description: 'Full support from application to arrival.',
//     features: ['Priority Visa Processing', 'Job Placement Workshop', 'Accommodation Search', 'Direct Chat Support'],
//     popular: true,
//   },
//   {
//     name: 'Gold',
//     price: '1000',
//     tier: 'gold',
//     description: 'Comprehensive package including family and housing.',
//     features: ['Family Visa Support', 'NI Number Assistance', '1-on-1 Legal Consultation', 'Relocation Package', 'VIP Support'],
//   },
// ];

export function PricingSection() {
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const {products, setProducts} = useSubscription();
    const navigate = useNavigate();
  const plans = products;
  const handleCheckout = async (productId: string) => {
    setLoadingTier(productId);

    try {
      const { data, error } = await authApi.getGetPaymentSession(productId)
      
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
        // window.open(data.url, '_blank');
      }
    } catch (error: unknown) {
      console.error('Checkout error:', error);
      toast.error('Failed to start checkout');
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-hero/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-serif text-4xl font-bold text-foreground mb-4">Subscription Pricing</h2>
          <p className="text-muted-foreground text-lg">Choose the plan that fits your UK journey goals.</p>

        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`relative p-8 rounded-2xl border transition-all duration-300 hover:shadow-xl ${
                plan.popular ? 'border-gold bg-card scale-105 z-20' : 'border-border bg-background'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold px-4 py-1 rounded-full text-xs font-bold text-secondary-foreground flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> MOST POPULAR
                </div>
              )}

              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold">£{plan.price}</span>
                <span className="text-muted-foreground text-sm">/one-time</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6 min-h-[40px]">{plan.description}</p>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="w-5 h-5 text-gold shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                variant={plan.popular ? 'default' : 'outline'} 
                className="w-full h-12"
                onClick={() => handleCheckout(plan.id)}
                disabled={loadingTier !== null}
              >
                {loadingTier === plan.tier ? <Loader2 className="animate-spin" /> : 'Get Started'}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

//http://localhost:8081/payment-success?session_id=cs_test_a1vniArd0hrndOWizlk0iDUNoHra2FNV41jGyZbN8TSkV7JwXqmVOnl5P5