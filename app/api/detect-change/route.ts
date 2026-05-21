import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateAudit } from "@/lib/auditEngine"; // 🚀 Import your dynamic audit engine

export async function POST(request: Request) {
  try {
    const { origin } = new URL(request.url);

    // 1. Fetch real-time price sheets from registry
    const pricingResponse = await fetch("https://raw.githubusercontent.com/BerriAI/litellm/main/model_prices_and_context_window.json");
    
    if (!pricingResponse.ok) {
      throw new Error("Failed to pull live price feeds from the registry network");
    }
    
    const livePriceData = await pricingResponse.json();

    // 2. Parse the live data, round integers, and map all 8 custom tools
    const latestPricing = {
      openai_gpt4: Math.round((livePriceData["gpt-4o"]?.input_cost_per_token * 1000000)) || 25,
      claude_pro: Math.round((livePriceData["claude-3-5-sonnet"]?.input_cost_per_token * 1000000)) || 30,
      notion_ai: 12, 
      perplexity_pro: 20,
      gemini_1_5_pro: Math.round((livePriceData["gemini-1.5-pro"]?.input_cost_per_token * 1000000)) || 7,
      mistral_large: Math.round((livePriceData["mistral-large-2"]?.input_cost_per_token * 1000000)) || 4,
      cohere_command_r: Math.round((livePriceData["command-r-plus"]?.input_cost_per_token * 1000000)) || 3,
      llama_3_70b: Math.round((livePriceData["together_ai/meta-llama/Meta-Llama-3-70B-Instruct"]?.input_cost_per_token * 1000000)) || 1
    };

    // 3. Self-update the system master metadata table
    for (const [toolKey, realTimePrice] of Object.entries(latestPricing)) {
      await supabase
        .from("pricing_metadata")
        .update({ 
          current_price: realTimePrice,
          updated_at: new Date().toISOString()
        })
        .eq("id", toolKey);
    }

    // 4. Fetch historical audit records from Supabase
    // Expanded selection query to pull schema data required by the auditEngine input mapping
    const { data: audits, error: fetchError } = await supabase
      .from("audits")
      .select("id, email, current_tools, recommendations, pricing_snapshot, monthly_spend, team_size");

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    const consolidatedEmails: Record<string, string[]> = {};

    // 5. Single, clean iteration loop through all saved audits
    for (const audit of audits) {
      const snapshot = audit.pricing_snapshot;
      let pricingChanged = false;
      const individualAuditChanges: string[] = [];

      // A. Check for raw tool baseline market pricing deviations
      for (const key in latestPricing) {
        const pricingKey = key as keyof typeof latestPricing;
        
        const oldPrice = snapshot?.[pricingKey] !== undefined ? Number(snapshot[pricingKey]) : null;
        const newPrice = Number(latestPricing[pricingKey]);

        if (oldPrice !== null && oldPrice !== newPrice) {
          pricingChanged = true;
          individualAuditChanges.push(
            `${pricingKey} shifted from $${oldPrice} → $${newPrice}`
          );
        }
      }

      // B. Structure payload dynamically for your imported generateAudit Engine
      const auditInput = {
        tool: audit.current_tools?.[0] || "ChatGPT", 
        plan: audit.recommendations?.recommendedPlan || "enterprise", 
        monthlySpend: Number(audit.monthly_spend) || 100,
        teamSize: Number(audit.team_size) || 5,
        useCase: "development"
      };

      // 🚀 Run the calculations using your imported engine file logic
      const freshAuditResult = generateAudit(auditInput, latestPricing);
      
      // Look at changes by comparing recommendation records
      const originalRecTool = audit.recommendations?.recommendedTool || audit.recommendations?.recommended_tool;
      const recChanged = originalRecTool !== freshAuditResult.recommendedTool;

      if (recChanged) {
        individualAuditChanges.push(
          `Optimal platform strategy evolved from ${originalRecTool || "None"} → ${freshAuditResult.recommendedTool} (${freshAuditResult.recommendedPlan})`
        );
      }

      // C. Commit database alterations if changes were detected
      if (pricingChanged || recChanged) {
        await supabase
          .from("audits")
          .update({ 
            pricing_changed: pricingChanged,
            recommendation_changed: recChanged,
            estimated_savings: freshAuditResult.estimatedSavings,
            recommendations: freshAuditResult, // Update the cell with the full generated audit JSON
            last_checked: new Date().toISOString()
          })
          .eq("id", audit.id);

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

    // 6. Dispatch consolidated email notifications
    for (const [email, changesArray] of Object.entries(consolidatedEmails)) {
      await fetch(`${origin}/api/send-pricing-alert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          reportUrl: origin,
          changes: changesArray,
        }),
      });
    }

    return NextResponse.json({ 
      success: true, 
      livePricingPulled: latestPricing,
      processedCount: audits.length, 
      emailsDispatched: Object.keys(consolidatedEmails).length 
    });
    
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}