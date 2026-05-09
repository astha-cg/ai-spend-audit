import OpenAI from "openai";
import { NextResponse } from "next/server";

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

    const prompt = `
You are an AI cost optimization consultant.

Analyze this AI setup:

Tool: ${tool}
Plan: ${plan}
Monthly Spend: $${monthlySpend}
Team Size: ${teamSize}
Use Case: ${useCase}

Recommended Plan: ${recommendedPlan}
Estimated Savings: $${estimatedSavings}

Generate a short professional audit summary.
`;

   const fallbackSummary = `
Your organization is currently using the ${plan} plan for ${tool}.

Based on your current spending and team size, switching to the ${recommendedPlan} plan may reduce unnecessary AI expenses.

Estimated monthly savings are approximately $${estimatedSavings}, which can significantly reduce annual operational costs.

This recommendation is based on current pricing structures and common startup usage patterns.
`;

return NextResponse.json({
  summary: fallbackSummary,
});

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return NextResponse.json({
      summary: response.choices[0].message.content,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to generate summary",
      },
      {
        status: 500,
      }
    );
  }
}