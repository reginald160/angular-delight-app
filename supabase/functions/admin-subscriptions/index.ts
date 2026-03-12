import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
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
    if (!user) throw new Error("Not authenticated");

    // Check admin role
    const { data: roleData } = await supabaseClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) throw new Error("Unauthorized: admin role required");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const body = await req.json();
    const { action } = body;

    if (action === "list") {
      const { data: subs, error: subsError } = await supabaseClient
        .from("user_subscriptions")
        .select("*")
        .order("updated_at", { ascending: false });

      if (subsError) throw subsError;

      const userIds = subs?.map(s => s.user_id) || [];
      const { data: profiles } = await supabaseClient
        .from("profiles")
        .select("user_id, first_name, last_name")
        .in("user_id", userIds.length > 0 ? userIds : ["none"]);

      const enrichedSubs = await Promise.all((subs || []).map(async (sub) => {
        const profile = profiles?.find(p => p.user_id === sub.user_id);
        let email = null;
        try {
          const { data: authUser } = await supabaseClient.auth.admin.getUserById(sub.user_id);
          email = authUser?.user?.email;
        } catch {}
        return {
          ...sub,
          user_email: email,
          user_name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unnamed' : 'Unnamed',
        };
      }));

      return new Response(JSON.stringify({ subscriptions: enrichedSubs }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "refund") {
      const { stripe_customer_id } = body;
      if (!stripe_customer_id) throw new Error("stripe_customer_id required");

      // Find the latest paid checkout session for this customer
      const sessions = await stripe.checkout.sessions.list({
        customer: stripe_customer_id,
        status: "complete",
        limit: 1,
      });

      if (sessions.data.length === 0) throw new Error("No completed sessions found");

      const session = sessions.data[0];
      if (!session.payment_intent) throw new Error("No payment intent found");

      const paymentIntentId = typeof session.payment_intent === "string" 
        ? session.payment_intent 
        : session.payment_intent.id;

      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
      });

      // Update subscription status in DB
      await supabaseClient
        .from("user_subscriptions")
        .update({ status: "refunded", tier: null, updated_at: new Date().toISOString() })
        .eq("stripe_customer_id", stripe_customer_id);

      return new Response(JSON.stringify({ success: true, refund_id: refund.id }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "cancel") {
      const { subscription_id, stripe_customer_id } = body;
      
      // Update status in DB
      await supabaseClient
        .from("user_subscriptions")
        .update({ status: "cancelled", tier: null, updated_at: new Date().toISOString() })
        .eq("stripe_customer_id", stripe_customer_id);

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
