"use client";

import { useEffect, useState } from "react";
import { generateAudit } from "@/lib/auditEngine";

export default function ResultsPage() {

  const [result, setResult] = useState<any>(null);
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {

    const savedData = localStorage.getItem("audit-data");

    if (savedData) {

      const parsedData = JSON.parse(savedData);

      setFormData(parsedData);

      const auditResult = generateAudit({
        tool: parsedData.tool,
        plan: parsedData.plan,
        monthlySpend: Number(parsedData.monthlySpend),
        teamSize: Number(parsedData.teamSize),
        useCase: parsedData.useCase,
      });

      setResult(auditResult);
    }

  }, []);

  if (!result || !formData) {
    return (
      <main className="min-h-screen bg-black text-white p-10">
        Loading...
      </main>
    );
  }
  const yearlySavings = result.estimatedSavings * 12;

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-[#090e1f] to-[#050816] text-white px-4 py-12 md:px-6 md:py-16">

      <div className="mx-auto max-w-5xl">

        <h1 className="text-5xl font-bold">
          Audit Results
        </h1>

        <p className="mt-4 text-gray-400">
          Personalized AI spend optimization report.
        </p>

        {/* Results Card */}
        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-300 hover:border-purple-500/30 hover:bg-white/[0.07]">

          <div className="grid gap-6 md:grid-cols-2">

            <div className=" rounded-2xl bg-black/20 p-5 transition-all duration-300 hover:bg-black/40 hover:scale-[1.02]">
              <p className="text-sm text-gray-400">
                Current Tool
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                {formData.tool}
              </h2>
            </div>

            <div className=" rounded-2xl bg-black/20 p-5 transition-all duration-300 hover:bg-black/40 hover:scale-[1.02]">
              <p className="text-sm text-gray-400">
                Current Plan
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                {formData.plan}
              </h2>
            </div>

            <div className=" rounded-2xl bg-black/20 p-5 transition-all duration-300 hover:bg-black/40 hover:scale-[1.02]">
              <p className="text-sm text-gray-400">
                Recommended Plan
              </p>

              <h2 className="mt-2 text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
                {result.recommendedPlan}
              </h2>
            </div>

            <div className=" rounded-2xl bg-black/20 p-5 transition-all duration-300 hover:bg-black/40 hover:scale-[1.02]">
              <p className="text-sm text-gray-400">
                Estimated Monthly Savings
              </p>

              <h2 className="mt-2 text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
                ${result.estimatedSavings}
              </h2>
            </div>
            {result.estimatedSavings > 50 && (
            <div className="mt-8 rounded-2xl bg-purple-500/10 border border-purple-500/20 p-6">

            <h3 className="text-2xl font-bold">
                Large Savings Opportunity Detected
            </h3>

            <p className="mt-3 text-gray-300">
                Your organization may benefit from a deeper AI infrastructure optimization consultation.
            </p>

        </div>
        )}
        {result.estimatedSavings === 0 && (
        <div className="mt-8 rounded-2xl border border-green-500/20 bg-green-500/10 p-6">

        <h3 className="text-2xl font-bold text-green-400">
        Your AI Spending Looks Optimized
        </h3>

        <p className="mt-3 text-gray-300">
      Based on current analysis, your organization is already using a cost-efficient AI setup.
        </p>

        </div>
        )}
        
            <div className="mt-8 rounded-2xl bg-green-500/10 border border-green-500/20 p-6">

            <p className="text-sm text-green-300">
                 Estimated Annual Savings
            </p>

            <h2 className="mt-2 text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
                    ${yearlySavings}
                </h2>

            </div>

          </div>

          {/* Recommendation */}
          <div className="fade-in mt-10 rounded-2xl bg-black/30 p-6">

            <h3 className="text-xl font-semibold">
              Recommendation
            </h3>

            <p className="mt-4 text-gray-300">
              {result.reason}
            </p>

          </div>

        </div>

      </div>

    </main>
  );
}