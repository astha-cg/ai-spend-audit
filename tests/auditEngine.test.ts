import { generateAudit } from "@/lib/auditEngine";

test("detects ChatGPT enterprise overspending", () => {

  const result = generateAudit({
    tool: "ChatGPT",
    plan: "Enterprise",
    monthlySpend: 60,
    teamSize: 3,
    useCase: "writing",
  });

  expect(result.recommendedPlan).toBe("Team");
});