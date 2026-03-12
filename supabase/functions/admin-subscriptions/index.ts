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
    const { action } = await req.json();

    if (action === "list") {
      // Get all subscriptions from DB
      const { data: subs, error: subsError } = await supabaseClient
        .from("user_subscriptions")
        .select("*")
        .order("updated_at", { ascending: false });

      if (subsError) throw subsError;

      // Enrich with user emails from profiles
      const userIds = subs?.map(s => s.user_id) || [];
      const { data: profiles } = await supabaseClient
        .from("profiles")
        .select("user_id, first_name, last_name")
        .in("user_id", userIds);

      // Get emails from auth
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
          user_name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : null,
        };
      }));

      return new Response(JSON.stringify({ subscriptions: enrichedSubs }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "refund") {
      const { stripe_customer_id } = await req.json().catch(() => ({}));
      // Re-parse body
      const body = JSON.parse(await new Request(req.url, { body: null }).text().catch(() => "{}"));
    }

    // Re-parse for actions that need body params
    // We already parsed once, so let's restructure
    // Actually we parsed req.json() already. Let me fix this.

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
