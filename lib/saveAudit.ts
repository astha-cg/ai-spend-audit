import { supabase } from "@/lib/supabase";

type SaveAuditInput = {
  email: string;
  currentTools: any[];
  recommendations: any[];
  monthlySpend: number;
  estimatedSavings: number;
  pricingSnapshot: any;
};

export async function saveAudit(
  input: SaveAuditInput
) {
  const {
    email,
    currentTools,
    recommendations,
    monthlySpend,
    estimatedSavings,
    pricingSnapshot,
  } = input;

  const { data, error } =
    await supabase.from("audits").insert([
      {
        user_email: email,
        current_tools: currentTools,
        recommendations: recommendations,
        monthly_spend: monthlySpend,
        estimated_savings: estimatedSavings,
        pricing_snapshot: pricingSnapshot,
      },
    ]);

  if (error) {
    console.error(
      "Error saving audit:",
      error
    );
  }

  return data;
}