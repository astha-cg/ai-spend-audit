"use client";

import { useState } from "react";
import { aiTools } from "@/data/tools";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuditPage() {
    const router = useRouter();
     // Form State Variables
  const [tool, setTool] = useState("");
  const [plan, setPlan] = useState("");
  const [monthlySpend, setMonthlySpend] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [useCase, setUseCase] = useState("");

  useEffect(() => {
  const formData = {
    tool,
    plan,
    monthlySpend,
    teamSize,
    useCase,
  };

  localStorage.setItem(
    "audit-form",
    JSON.stringify(formData)
  );
}, [tool, plan, monthlySpend, teamSize, useCase]);

useEffect(() => {
  const savedData = localStorage.getItem("audit-form");

  if (savedData) {
    const parsed = JSON.parse(savedData);

    setTool(parsed.tool || "");
    setPlan(parsed.plan || "");
    setMonthlySpend(parsed.monthlySpend || "");
    setTeamSize(parsed.teamSize || "");
    setUseCase(parsed.useCase || "");
  }
}, []);

  return (

   <div className=" min-h-screen bg-gradient-to-br from-purple-900 via-[#090e1f] to-[#050816] text-blue px-6 py-12">

  <div className="rounded-xl bg-white text-black p-8 max-w-3xl mx-auto">

    {/* Tool Selection */}
    <div>
      <label className="mb-2 block text-sm font-medium font-semibold">
        AI Tool
      </label>

      <select
        value={tool}
        onChange={(e) => setTool(e.target.value)}
        className="w-full rounded-xl bg-black/40 border border-white/10 p-4"
      >
        <option value="">Select a tool</option>

        {aiTools.map((item) => (
          <option key={item.name} value={item.name}>
            {item.name}
          </option>
        ))}
      </select>
    </div>

    {/* Plan */}
    <div>
      <label className="mb-2 block text-sm font-medium font-semibold">
        Plan
      </label>

      <input
        type="text"
        value={plan}
        onChange={(e) => setPlan(e.target.value)}
        placeholder="e.g. Team"
        className="w-full rounded-xl bg-black/40 border border-white/10 p-4"
      />
    </div>

    {/* Monthly Spend */}
    <div>
      <label className="mb-2 block text-sm font-medium font-semibold">
        Monthly Spend ($)
      </label>

      <input
        type="number"
        value={monthlySpend}
        onChange={(e) => setMonthlySpend(e.target.value)}
        placeholder="100"
        className="w-full rounded-xl bg-black/40 border border-white/10 p-4"
      />
    </div>

    {/* Team Size */}
    <div>
      <label className="mb-2 block text-sm font-medium font-semibold">
        Team Size
      </label>

      <input
        type="number"
        value={teamSize}
        onChange={(e) => setTeamSize(e.target.value)}
        placeholder="5"
        className="w-full rounded-xl bg-black/40 p-4 outline-none transition-all duration-300 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
      />
    </div>

    {/* Use Case */}
    <div>
      <label className="mb-2 block text-sm font-medium font-semibold">
        Primary Use Case
      </label>

      <textarea
        value={useCase}
        onChange={(e) => setUseCase(e.target.value)}
        placeholder="Coding, writing, research, customer support..."
        className="min-h-[120px] w-full rounded-xl bg-black/40 border border-white/10 p-4"
      />
    </div>

    {/* Submit Button */}
    <button
       onClick={() => {

    if (!tool || !monthlySpend || !teamSize) {
        alert("Please fill all required fields");
        return;
    }

    const auditData = {
        tool,
        plan,
        monthlySpend,
        teamSize,
        useCase,
    };

    localStorage.setItem(
        "audit-data",
        JSON.stringify(auditData)
    );

    router.push("/results");
    }}
        className=" rounded-xl bg-white px-8 py-4 text-lg font-semibold text-black transition-all duration-300 hover:scale-[1.02] hover:bg-gray-200 active:scale-[0.98]">
    Analyze My AI Spend
    </button>

  </div>
</div>
  );
}
