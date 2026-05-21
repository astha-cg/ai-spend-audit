import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {

  // Example simulated live pricing
  // Later you can replace this with:
  // OpenAI API
  // scraping
  // external pricing APIs

  const latestPricing = [
    {
      provider: "openai_gpt4",
      monthly_price: 25,
    },
    {
      provider: "claude_pro",
      monthly_price: 30,
    },
    {
      provider: "notion_ai",
      monthly_price: 12,
    },
    {
      provider: "perplexity_pro",
      monthly_price: 20,
    },
  ];

  for (const item of latestPricing) {

    await supabase
      .from("pricing_data")
      .upsert({
        provider: item.provider,
        monthly_price:
          item.monthly_price,
        updated_at: new Date(),
      });
  }

  return NextResponse.json({
    success: true,
    updated: latestPricing.length,
  });
}