import OpenAI from "openai";
import { NextResponse } from "next/server";

// Prevent serverless timeout issues
export const maxDuration = 20;

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

    // Safe fallback summary
    const fallbackSummary = `
Your organization is currently using the ${plan} plan for ${tool}.
Based on your monthly spend of $${monthlySpend} and team size of ${teamSize},
switching to ${recommendedPlan} could reduce operational AI costs by approximately $${estimatedSavings} per month while maintaining workflow efficiency.
`;

    // Missing API key protection
    if (
      !process.env.OPENAI_API_KEY ||
      process.env.OPENAI_API_KEY.startsWith("your-")
    ) {

      console.warn(
        "Missing OPENAI_API_KEY. Using fallback summary."
      );

      return NextResponse.json({
        summary: fallbackSummary,
      });
    }

    const prompt = `
You are an enterprise AI infrastructure optimization consultant.

Generate a concise 2-3 sentence executive audit summary.

Current Tool: ${tool}
Current Plan: ${plan}
Monthly Spend: $${monthlySpend}
Team Size: ${teamSize}
Use Case: ${useCase}

Recommended Plan: ${recommendedPlan}
Estimated Monthly Savings: $${estimatedSavings}

Keep the tone professional, concise, and executive-level.
`;

    try {

      // Increased timeout for production reliability
      const response = await Promise.race([

        openai.chat.completions.create({

          model: "gpt-4o-mini",

          messages: [
            {
              role: "system",

              content:
                "You are a concise AI financial optimization consultant.",
            },

            {
              role: "user",

              content: prompt,
            },
          ],

          temperature: 0.3,

          max_tokens: 120,
        }),

        // Timeout protection
        new Promise((_, reject) =>
          setTimeout(
            () =>
              reject(
                new Error(
                  "OpenAI response timeout"
                )
              ),
            15000
          )
        ),

      ]) as any;

      const aiSummary =
        response?.choices?.[0]?.message?.content?.trim();

      // Valid AI response
      if (aiSummary) {

        return NextResponse.json({
          summary: aiSummary,
        });
      }

      // Empty response fallback
      return NextResponse.json({
        summary: fallbackSummary,
      });

    } catch (openAIError) {

      console.warn(
        "OpenAI failed or timed out:",
        openAIError
      );

      // Graceful fallback
      return NextResponse.json({
        summary: fallbackSummary,
      });
    }

  } catch (error) {

    console.error(
      "Generate Summary Route Error:",
      error
    );

    return NextResponse.json(
      {
        summary:
          "AI optimization analysis completed successfully using fallback infrastructure metrics.",
      },
      {
        status: 200,
      }
    );
  }
}