import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Test mode prices (created via Stripe MCP tools)
const testPrices: Record<string, string> = {
  gold: "price_1RX1WbRrMPBP9WvQ8DZPmPbB",
  silver: "price_1RX1WURrMPBP9WvQQJn6LBXK", 
  bronze: "price_1RX1WNRrMPBP9WvQUvG4CU5q",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tier } = await req.json();
    
    if (!tier || !testPrices[tier]) {
      throw new Error("Invalid tier. Choose: gold, silver, or bronze");
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    const origin = req.headers.get("origin") || "https://lovable.dev";

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: testPrices[tier],
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/payment-success`,
      cancel_url: `${origin}/payment-canceled`,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
