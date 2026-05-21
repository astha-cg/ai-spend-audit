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
  input: AuditInput,
  latestPricing: Record<string, number> // 🚀 INJECT LIVE METADATA PRICING DIRECTLY HERE
): AuditResult {
  const { tool, plan, monthlySpend, teamSize } = input;

  // 1. Safely parse dynamic fallback prices from our live system parameters
  const getToolPrice = (toolKey: string, fallbackPrice: number): number => {
    return latestPricing[toolKey] !== undefined ? Number(latestPricing[toolKey]) : fallbackPrice;
  };

  // 2. Map incoming parameters to our live tool IDs
  const chatGptTeamPrice = getToolPrice("openai_gpt4", 25); // Standardized pricing mapping
  const cursorProPrice = getToolPrice("claude_pro", 20);    // Fallback defaults if unavailable
  
  // Dynamic lookup default mapping fallback logic
  let planCost = latestPricing[tool] || 0;

  // Calculate base current cost estimation
  let newCost = Number(teamSize) * Number(planCost);

  // Initial target states
  let recommendedPlan = plan;
  let recommendedTool = tool;
  let currentCost = monthlySpend;

  // --- RE-BUILT RECOMMENDATION ENGINE LOGIC MATRIX ---

  // ChatGPT Enterprise downgrade rules for small teams
  if (
    tool === "ChatGPT" &&
    plan === "enterprise" &&
    teamSize < 10
  ) {
    newCost = Number(teamSize) * chatGptTeamPrice;
    const estimatedSavings = Math.max(0, monthlySpend - newCost);
    return {
      currentCost,
      newCost,
      recommendedTool: "openai_gpt4",
      recommendedPlan: "team",
      estimatedSavings,
      reason: "Enterprise plans are generally an unnecessary overhead cost for teams under 10 seats. Downgrading saves money instantly.",
    };
  }

  // ChatGPT Standard Enterprise optimizations
  if (tool === "ChatGPT" && plan === "enterprise") {
    recommendedTool = "openai_gpt4";
    recommendedPlan = "team";
    newCost = Number(teamSize) * chatGptTeamPrice;
  }

  // Cursor Business optimizations shifting towards open source / Claude alternatives
  if (tool === "Cursor" && plan === "business") {
    recommendedTool = "claude_pro";
    recommendedPlan = "pro";
    newCost = Number(teamSize) * cursorProPrice;
  }

  // Multi-Tool Arbitrage Logic: 
  // If the user's running tool is more expensive than live market alternatives (like Gemini or Llama), offer it!
  const marketCheapestPrice = getToolPrice("llama_3_70b", 1);
  if (newCost > (Number(teamSize) * marketCheapestPrice) && monthlySpend > 100) {
    // If they are spending too much, recommend a high-intelligence alternative model tier drop
    if (recommendedTool === "ChatGPT") {
      recommendedTool = "gemini_1_5_pro";
      recommendedPlan = "standard";
      newCost = Number(teamSize) * getToolPrice("gemini_1_5_pro", 7);
    }
  }

  // Savings Formula Execution
  const estimatedSavings = currentCost - newCost;

  return {
    currentCost,
    newCost,
    estimatedSavings: estimatedSavings > 0 ? estimatedSavings : 0,
    recommendedTool,
    recommendedPlan,
    reason:
      estimatedSavings > 0
        ? `Switching to ${recommendedPlan} via ${recommendedTool} matches performance targets while actively minimizing your software footprint.`
        : "Your organization infrastructure and asset expenses are currently optimized for the market.",
  };
}