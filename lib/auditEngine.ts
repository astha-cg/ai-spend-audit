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
};

export function generateAudit(
 
  input: AuditInput
): AuditResult {
   

  const { tool, plan, monthlySpend, teamSize, useCase } = input;
  

  // ChatGPT Enterprise downgrade
  if (
    tool === "ChatGPT" &&
    plan === "enterprise" &&
    teamSize < 10
  ) {
    return {
      recommendedPlan: "Team",
      estimatedSavings: monthlySpend - 30,
      reason:
        "Enterprise plan may be unnecessary for small teams.",
    };
  }

  // Cursor Business downgrade
  if (
    tool === "Cursor" &&
    plan === "business" &&
    teamSize <= 5
  ) {
    return {
      recommendedPlan: "Pro",
      estimatedSavings: monthlySpend - 20,
      reason:
        "Cursor Pro is sufficient for smaller engineering teams.",
    };
  }

  // Claude Max optimization
  if (
    tool === "Claude" &&
    plan === "Max"
  ) {
    return {
      recommendedPlan: "Pro",
      estimatedSavings: monthlySpend - 20,
      reason:
        "Claude Pro can handle most general writing and research workflows.",
    };
  }

  // Default response
  return {
    recommendedPlan: plan,
    estimatedSavings: 0,
    reason:
      "Your current setup already appears cost optimized.",
  };
}