import OpenAI from "openai";
import { NextResponse } from "next/server";

// Ensure the API route doesn't hit serverless timeout ceilings
export const maxDuration = 15; 

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      tool,
      plan,
      monthlySpend,
      teamSize,
      useCase,
      recommendedPlan,
      estimatedSavings,
    } = body;

    // Define the fallback static text upfront in case OpenAI is slow or rate-limited
    const fallbackSummary = `Your organization is currently utilizing the ${plan} plan for ${tool}. Based on your monthly spend of $${monthlySpend} and team size of ${teamSize}, transitioning your operational profiles towards a ${recommendedPlan} tier strategy yields optimized utility execution. This structural adjustment generates an estimated savings of $${estimatedSavings}/mo, successfully lowering systemic workflow overhead.`;

    // Fail-safe protection: Check for API Key configuration before initiating remote calls
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.startsWith("your-")) {
      console.warn("Missing valid OPENAI_API_KEY environment variable. Executing structural fallback response.");
      return NextResponse.json({ summary: fallbackSummary });
    }

    const prompt = `
You are an expert enterprise AI cost optimization consultant.
Analyze this technical infrastructure setup and generate a concise, highly professional 2-3 sentence executive audit summary.

[Current Profile Context]
- Baseline Infrastructure Tool: ${tool}
- Current Contract Tier Plan: ${plan}
- User Stated Monthly Investment: $${monthlySpend}
- Active Team Size Allocation: ${teamSize} User Seats
- Core Workflow Target Profile: ${useCase}

[Algorithmic Recommendation Engine Results]
- Targeted Strategy Deployment Action: Migrate to ${recommendedPlan}
- Computed Financial Variance Matrix (Monthly Savings Target): $${estimatedSavings}
`;

    try {
      // Race OpenAI against a 6-second timeout so the API never hangs the application
      const response = await Promise.race([
        openai.chat.completions.create({
          model: "gpt-4o-mini", // Optimized for speed and cost over standard gpt-4o
          messages: [
            {
              role: "system",
              content: "You are a concise financial technology systems auditor. Deliver sharp, direct analysis sentences without conversational pleasantries or introductory fluff.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.3,
          max_tokens: 150,
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error("OpenAI Stalled")), 6000))
      ]) as any;

      const aiTextResult = response?.choices?.[0]?.message?.content?.trim();

      if (aiTextResult) {
        return NextResponse.json({ summary: aiTextResult });
      }

    } catch (apiTimeoutOrError) {
      console.warn("OpenAI optimization layer failed or timed out. Gracefully returning structural metrics fallback framework.", apiTimeoutOrError);
      return NextResponse.json({ summary: fallbackSummary });
    }

    // Secondary fallback execution bridge
    return NextResponse.json({ summary: fallbackSummary });

  } catch (error) {
    console.error("Critical Exception caught inside Generate Summary Route Handler:", error);
    return NextResponse.json(
      { error: "Internal operational exception processing audit aggregation metadata metrics." },
      { status: 500 }
    );
  }
}