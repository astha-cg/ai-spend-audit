import { pricingData } from "@/data/pricing";
type AuditInput = {
  tool: string;
  plan: string;
  monthlySpend: number;
  teamSize: number;
  useCase: string;
};

type AuditResult = {
  recommendedPlan: string;
  estimatedSavings: number;
  reason: string;
  currentCost?: number;
  newCost?: number;
  recommendedTool?: string;
};

export function generateAudit(
 
  input: AuditInput
): AuditResult {
  const { tool, plan, monthlySpend, teamSize } = input;
  //const newCost = teamSize * 30;
  const planCost =
    pricingData?.[tool as keyof typeof pricingData]?.[
      plan as keyof (typeof pricingData)[keyof typeof pricingData]
    ] || 0;


  // Calculate actual current cost
  let newCost = Number(teamSize) * Number(planCost);

  // Example recommendation logic
  let recommendedPlan = plan;
  let recommendedTool = tool;
  let currentCost = monthlySpend;



  // ChatGPT Enterprise downgrade
  if (
    tool === "ChatGPT" &&
    plan === "enterprise" &&
    teamSize < 10
  ) {
    return {
      recommendedPlan: "team",
      estimatedSavings: Math.max(0, monthlySpend - newCost),
      reason:
        "Enterprise plan may be unnecessary for small teams.",
    };
  }

  // Downgrade suggestions
  if (
    tool === "ChatGPT" &&
    plan === "enterprise"
  ) {
    recommendedPlan = "team";

    newCost =Number(teamSize) *pricingData["ChatGPT"]["team"];
  }

  if (
    tool === "Cursor" &&
    plan === "business"
  ) {
    recommendedPlan = "pro";

    newCost =Number(teamSize) *pricingData["Cursor"]["pro"];
  }

  // Savings Formula
  const estimatedSavings =
    currentCost - newCost;

  return {
    currentCost,
    newCost,
    estimatedSavings:
      estimatedSavings > 0
        ? estimatedSavings
        : 0,

    recommendedTool,
    recommendedPlan,

    reason:
      estimatedSavings > 0
        ? `Switching to ${recommendedPlan} can reduce your monthly AI spending.`
        : "Your current setup already looks optimized.",
  };}
