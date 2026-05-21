import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// 1. Define your calculation logic locally or import your original function
function calculateRecommendation(currentTools: any, pricing: any) {
  // TODO: Replace this placeholder with your actual Round 1 logic.
  // It should look at the tools inside `current_tools` and evaluate against the new prices.
  // Example mock output format matching your 'recommendations' jsonb structure:
  return { recommended_tool: "openai_gpt4", expected_cost: 25 };
}

export async function POST(request: Request) {
  try {
    // Current live pricing state
    const latestPricing = {
      openai_gpt4: 25,
      claude_pro: 30,
      notion_ai: 12,
      perplexity_pro: 20,
    };

    // Dynamically captures localhost or your production URL domain
    const { origin } = new URL(request.url);

    // Fetch audits from Supabase matching your schema columns
    const { data: audits, error: fetchError } = await supabase
      .from("audits")
      .select("id, email, current_tools, recommendations, pricing_snapshot");

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    // Key value map to group multiple audit changes under a single email identifier
    const consolidatedEmails: Record<string, string[]> = {};

    for (const audit of audits) {
      const snapshot = audit.pricing_snapshot;
      let pricingChanged = false;
      const individualAuditChanges: string[] = [];

      // A. Check if explicit tool prices changed from the saved snapshot
      for (const key in latestPricing) {
        const pricingKey = key as keyof typeof latestPricing;
        const oldPrice = snapshot?.[pricingKey];
        const newPrice = latestPricing[pricingKey];

        if (oldPrice !== newPrice) {
          pricingChanged = true;
          individualAuditChanges.push(
            `${pricingKey} shifted from $${oldPrice ?? 0} → $${newPrice}`
          );
        }
      }

      // B. Check if your recommendation logic engine would now produce a different choice
      const freshRec = calculateRecommendation(audit.current_tools, latestPricing);
      
      // Checking if the new recommended tool string matches what was saved in the recommendations JSONB
      const originalRecTool = audit.recommendations?.recommended_tool;
      const recChanged = originalRecTool !== freshRec.recommended_tool;

      if (recChanged) {
        individualAuditChanges.push(
          `Optimal strategy shifted from ${originalRecTool || "None"} → ${freshRec.recommended_tool}`
        );
      }

      // If either check triggers true, update this specific row and track changes
      if (pricingChanged || recChanged) {
        await supabase
          .from("audits")
          .update({ 
            pricing_changed: pricingChanged,
            recommendation_changed: recChanged,
            last_checked: new Date().toISOString()
          })
          .eq("id", audit.id);

        // Fallback target: check 'email' first, then 'user_email' field
        const recipientEmail = audit.email; 
        
        if (recipientEmail) {
          if (!consolidatedEmails[recipientEmail]) {
            consolidatedEmails[recipientEmail] = [];
          }
          consolidatedEmails[recipientEmail].push(
            `Report (ID: ${audit.id}): ${individualAuditChanges.join(" | ")}`
          );
        }
      }
    }

    // Send exactly ONE consolidated alert per unique user
    for (const [email, changesArray] of Object.entries(consolidatedEmails)) {
      await fetch(`${origin}/api/send-pricing-alert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          reportUrl: `${origin}`,
          changes: changesArray,
        }),
      });
    }

    return NextResponse.json({ 
      success: true, 
      processedCount: audits.length, 
      emailsDispatched: Object.keys(consolidatedEmails).length 
    });
    
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}