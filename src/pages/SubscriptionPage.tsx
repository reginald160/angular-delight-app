import { useState, useEffect, useCallback } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Loader2, Shield, Sparkles, Calendar, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'react-router-dom';

const PLANS = [
  {
    id: 'bronze',
    name: 'Bronze',
    price: 300,
    duration: '1 Month',
    priceId: 'price_1T36v92x6R10KRrhII9lCZOF',
    productId: 'prod_U19Ds7BBtbRWNl',
    features: ['Visa Document Checklist', 'Job Listings Access', 'Email Support', 'Basic Housing Guidance'],
    icon: Shield,
    color: 'from-amber-600 to-amber-800',
  },
  {
    id: 'silver',
    name: 'Silver',
    price: 600,
    duration: '3 Months',
    priceId: 'price_1T36v62x6R10KRrhijF8rrZB',
    productId: 'prod_U19D7NrmrZrDIp',
    popular: true,
    features: ['Everything in Bronze', 'Priority Visa Processing', 'Job Placement Support', 'Accommodation Search', 'Direct Chat Support'],
    icon: Sparkles,
    color: 'from-slate-400 to-slate-600',
  },
  {
    id: 'gold',
    name: 'Gold',
    price: 1000,
    duration: '6 Months',
    priceId: 'price_1T36v32x6R10KRrhS8qPpK1J',
    productId: 'prod_U19DDqsJdQEP0u',
    features: ['Everything in Silver', 'Family Visa Support', 'NI Number Assistance', '1-on-1 Legal Consultation', 'Relocation Package', 'Dedicated Account Manager'],
    icon: Crown,
    color: 'from-yellow-500 to-amber-500',
  },
];

interface SubscriptionStatus {
  subscribed: boolean;
  tier: string | null;
  product_id: string | null;
  subscription_end: string | null;
  purchase_date: string | null;
}

export default function SubscriptionPage() {
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  const checkSubscription = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      if (error) throw error;
      setStatus(data);
    } catch (err: any) {
      console.error('Check subscription error:', err);
      setStatus({ subscribed: false, tier: null, product_id: null, subscription_end: null, purchase_date: null });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSubscription();
  }, [checkSubscription]);

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      toast({ title: 'Payment Successful!', description: 'Your subscription is now active. Welcome aboard!' });
      // Re-check after a moment to allow Stripe to process
      setTimeout(checkSubscription, 2000);
    }
    if (searchParams.get('canceled') === 'true') {
      toast({ title: 'Payment Canceled', description: 'You can try again whenever you\'re ready.', variant: 'destructive' });
    }
  }, [searchParams, toast, checkSubscription]);

  const handleCheckout = async (priceId: string) => {
    setCheckoutLoading(priceId);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId },
      });
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (err: any) {
      toast({ title: 'Checkout Error', description: err.message, variant: 'destructive' });
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handleManageSubscription = async () => {
    setPortalLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setPortalLoading(false);
    }
  };

  const activePlan = PLANS.find(p => p.productId === status?.product_id);
  const daysRemaining = status?.subscription_end
    ? Math.max(0, Math.ceil((new Date(status.subscription_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Subscription</h1>
          <p className="text-muted-foreground mt-1">Manage your plan and billing</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Current Plan Status */}
            {status?.subscribed && activePlan && (
              <Card className="border-primary/30 bg-primary/5">
                <CardHeader>
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${activePlan.color} flex items-center justify-center`}>
                        <activePlan.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{activePlan.name} Plan</CardTitle>
                        <CardDescription>Active subscription</CardDescription>
                      </div>
                    </div>
                    <Badge variant="default" className="bg-green-600 text-white">Active</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Started:</span>
                      <span className="font-medium">{status.purchase_date ? new Date(status.purchase_date).toLocaleDateString() : '—'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Expires:</span>
                      <span className="font-medium">{status.subscription_end ? new Date(status.subscription_end).toLocaleDateString() : '—'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Remaining:</span>
                      <span className={`font-bold ${daysRemaining <= 7 ? 'text-destructive' : 'text-foreground'}`}>{daysRemaining} days</span>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-3 flex-wrap">
                    <Button variant="outline" size="sm" onClick={handleManageSubscription} disabled={portalLoading}>
                      {portalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Manage Billing'}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={checkSubscription}>
                      <RefreshCw className="w-4 h-4 mr-1" /> Refresh Status
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {!status?.subscribed && (
              <Card className="border-destructive/30 bg-destructive/5">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <p className="font-semibold text-foreground">No Active Subscription</p>
                      <p className="text-sm text-muted-foreground">Choose a plan below to get started</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={checkSubscription}>
                      <RefreshCw className="w-4 h-4 mr-1" /> Refresh
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Plan Cards */}
            <div>
              <h2 className="text-xl font-semibold mb-4">{status?.subscribed ? 'Upgrade or Change Plan' : 'Choose Your Plan'}</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {PLANS.map((plan) => {
                  const isCurrentPlan = plan.productId === status?.product_id && status?.subscribed;
                  const PlanIcon = plan.icon;
                  return (
                    <Card
                      key={plan.id}
                      className={`relative transition-all duration-300 hover:shadow-lg ${
                        plan.popular ? 'border-primary scale-[1.02] z-10' : 'border-border'
                      } ${isCurrentPlan ? 'ring-2 ring-primary' : ''}`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary px-4 py-1 rounded-full text-xs font-bold text-primary-foreground flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> BEST VALUE
                        </div>
                      )}
                      {isCurrentPlan && (
                        <div className="absolute -top-3 right-4 bg-green-600 px-3 py-1 rounded-full text-xs font-bold text-white">
                          YOUR PLAN
                        </div>
                      )}

                      <CardHeader className="text-center pb-2">
                        <div className={`w-14 h-14 mx-auto mb-3 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center`}>
                          <PlanIcon className="w-7 h-7 text-white" />
                        </div>
                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                        <div className="flex items-baseline justify-center gap-1 mt-2">
                          <span className="text-4xl font-bold">£{plan.price}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{plan.duration} access</p>
                      </CardHeader>

                      <CardContent className="pt-4">
                        <ul className="space-y-3 mb-6">
                          {plan.features.map((feature) => (
                            <li key={feature} className="flex items-start gap-2 text-sm">
                              <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>

                        <Button
                          className="w-full"
                          variant={isCurrentPlan ? 'outline' : plan.popular ? 'default' : 'outline'}
                          disabled={isCurrentPlan || checkoutLoading !== null}
                          onClick={() => handleCheckout(plan.priceId)}
                        >
                          {checkoutLoading === plan.priceId ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : isCurrentPlan ? (
                            'Current Plan'
                          ) : status?.subscribed ? (
                            'Switch Plan'
                          ) : (
                            'Get Started'
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
