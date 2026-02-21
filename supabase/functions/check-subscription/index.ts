import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const TIERS: Record<string, { name: string; durationMonths: number }> = {
  "prod_U19DDqsJdQEP0u": { name: "Gold", durationMonths: 6 },
  "prod_U19D7NrmrZrDIp": { name: "Silver", durationMonths: 3 },
  "prod_U19Ds7BBtbRWNl": { name: "Bronze", durationMonths: 1 },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY not set");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Auth error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });

    if (customers.data.length === 0) {
      return new Response(JSON.stringify({ subscribed: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const customerId = customers.data[0].id;

    // Check for completed checkout sessions (one-time payments)
    const sessions = await stripe.checkout.sessions.list({
      customer: customerId,
      status: "complete",
      limit: 10,
    });

    let activeTier: string | null = null;
    let productId: string | null = null;
    let subscriptionEnd: string | null = null;
    let purchaseDate: string | null = null;

    for (const session of sessions.data) {
      if (session.payment_status !== "paid") continue;

      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 1 });
      if (lineItems.data.length === 0) continue;

      const priceObj = lineItems.data[0].price;
      const prodId = typeof priceObj?.product === "string" ? priceObj.product : priceObj?.product?.id;
      if (!prodId || !TIERS[prodId]) continue;

      const tier = TIERS[prodId];
      const created = new Date((session.created ?? 0) * 1000);
      const endDate = new Date(created);
      endDate.setMonth(endDate.getMonth() + tier.durationMonths);

      if (endDate > new Date()) {
        activeTier = tier.name;
        productId = prodId;
        subscriptionEnd = endDate.toISOString();
        purchaseDate = created.toISOString();
        break;
      }
    }

    // Upsert to user_subscriptions table
    const { error: upsertError } = await supabaseClient
      .from("user_subscriptions")
      .upsert({
        user_id: user.id,
        status: activeTier ? "active" : "inactive",
        tier: activeTier,
        product_id: productId,
        stripe_customer_id: customerId,
        current_period_start: purchaseDate,
        current_period_end: subscriptionEnd,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });

    if (upsertError) console.error("Upsert error:", upsertError);

    return new Response(JSON.stringify({
      subscribed: !!activeTier,
      tier: activeTier,
      product_id: productId,
      subscription_end: subscriptionEnd,
      purchase_date: purchaseDate,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
