import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { cvText, jobDescription, jobSkills, jobTitle } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert CV analyst and career advisor. Analyze the provided CV against the job description and skills required. Provide actionable feedback.

Your analysis should include:
1. CV Strength Score (0-100): Based on clarity, formatting, achievements, and overall quality
2. Skills Match Score (0-100): How well the candidate's skills match the job requirements
3. Profile Completion Score (0-100): How complete and professional the CV appears
4. Key Strengths: List 3-5 main strengths from the CV
5. Areas for Improvement: List 3-5 specific, actionable improvements
6. Missing Skills: List skills from the job requirements that are not evident in the CV
7. Recommendations: 3-5 specific actions to improve chances for this role

Be specific and actionable in your feedback.`;

    const userPrompt = `
Analyze this CV for the "${jobTitle}" position:

CV Content:
${cvText}

Job Description:
${jobDescription || "Not provided"}

Required Skills:
${jobSkills?.join(", ") || "Not specified"}

Provide a comprehensive analysis in JSON format.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "cv_analysis",
              description: "Structured CV analysis results",
              parameters: {
                type: "object",
                properties: {
                  cvStrength: {
                    type: "number",
                    description: "CV quality score 0-100"
                  },
                  skillsMatch: {
                    type: "number",
                    description: "Skills match score 0-100"
                  },
                  profileCompletion: {
                    type: "number",
                    description: "Profile completeness score 0-100"
                  },
                  keyStrengths: {
                    type: "array",
                    items: { type: "string" },
                    description: "List of key strengths"
                  },
                  areasForImprovement: {
                    type: "array",
                    items: { type: "string" },
                    description: "Specific areas to improve"
                  },
                  missingSkills: {
                    type: "array",
                    items: { type: "string" },
                    description: "Skills missing from CV"
                  },
                  recommendations: {
                    type: "array",
                    items: { type: "string" },
                    description: "Actionable recommendations"
                  },
                  overallSummary: {
                    type: "string",
                    description: "Brief overall assessment"
                  }
                },
                required: ["cvStrength", "skillsMatch", "profileCompletion", "keyStrengths", "areasForImprovement", "recommendations", "overallSummary"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "cv_analysis" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to analyze CV");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (toolCall?.function?.arguments) {
      const analysis = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify({ analysis }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    throw new Error("Invalid response from AI");
  } catch (error) {
    console.error("Error in analyze-cv:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

import Stripe from "npm:stripe@11.14.0";
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
      cancel_url: `${origin}/pricing`,
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
