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
    const selectedTool = aiTools.find(
  (item) => item.name === tool
  );
  const [seats, setSeats] = useState("");
  const [email, setEmail] =
  useState("");


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

   <div className="relative min-h-screen overflow-hidden bg-[#f6f4ef] px-6 py-16 text-black">
    <div className="absolute inset-0 -z-10 overflow-hidden">

      <div className="absolute right-[-120px] top-[-100px] h-[500px] w-[500px] rounded-full bg-lime-300 blur-[120px] opacity-70" />

      <div className="absolute left-[20%] top-[120px] h-[350px] w-[350px] rounded-full bg-emerald-200 blur-[120px] opacity-50" />

    </div>

  <div className="mx-auto max-w-4xl rounded-[40px] border border-white/40 bg-white/70 p-10 shadow-[0_20px_80px_rgba(0,0,0,0.08)] backdrop-blur-2xl">

    {/* Tool Selection */}
    <div className="mb-12">
      <label className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-black/80">
        AI Tool
      </label>

      <select
        value={tool}
        onChange={(e) => setTool(e.target.value)}
        className="w-full rounded-2xl border border-black/10 bg-white/80 px-5 py-4 text-black shadow-sm outline-none transition focus:border-green-400 focus:ring-4 focus:ring-green-200"
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
      <label className="mb-3 block text-sm font-medium text-black/70">
        Plan
      </label>
        <select
        value={plan}
        onChange={(e) => setPlan(e.target.value)}
        className="w-full rounded-2xl border border-black/10 bg-white/80 px-5 py-4 text-black shadow-sm outline-none transition focus:border-green-400 focus:ring-4 focus:ring-green-200">
        <option value="">
        Select Plan
      </option>

      {selectedTool?.plans.map((p) => (
      <option key={p} value={p.toLowerCase()}>
      {p}
    </option>
       ))}
      </select>
    </div>
{/*className="w-full rounded-2xl border border-black/10 bg-white/80 px-5 py-4 text-black shadow-sm outline-none transition focus:border-green-400 focus:ring-4 focus:ring-green-200"
      */}
    {/* Monthly Spend */}
    <div>
      <label className="mb-3 block text-sm font-medium text-black/70">
        Monthly Spend ($)
      </label>

      <input
        type="number"
        value={monthlySpend}
        onChange={(e) => setMonthlySpend(e.target.value)}
        placeholder="100"
        className="w-full rounded-2xl border border-black/10 bg-white/80 px-5 py-4 text-black shadow-sm outline-none transition focus:border-green-400 focus:ring-4 focus:ring-green-200"
      />
    </div>
    

    {/* Team Size */}
    <div>
      <label className="mb-3 block text-sm font-medium text-black/70">
        Team Size
      </label>

      <input
        type="number"
        value={teamSize}
        onChange={(e) => setTeamSize(e.target.value)}
        placeholder="5"
        className="w-full rounded-2xl border border-black/10 bg-white/80 px-5 py-4 text-black shadow-sm outline-none transition focus:border-green-400 focus:ring-4 focus:ring-green-200"
      />
    </div>

    {/* Use Case */}
    <div> 
      <label className="mb-3 block text-sm font-medium text-black/70">
        Use Case
      </label>
    </div>
    <select
  value={useCase}
  onChange={(e) =>
    setUseCase(e.target.value)
  }
  className="w-full rounded-2xl border border-black/10 bg-white/80 px-5 py-4 text-black shadow-sm outline-none transition focus:border-green-400 focus:ring-4 focus:ring-green-200"
>

  <option value="">
    Select Use Case
  </option>

  <option value="coding">
    Coding
  </option>

  <option value="writing">
    Writing
  </option>

  <option value="data">
    Data
  </option>

  <option value="research">
    Research
  </option>

  <option value="mixed">
    Mixed
  </option>

</select>

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
    seats,
    teamSize,
    useCase,
    };

    localStorage.setItem(
        "audit-data",
        JSON.stringify(auditData)
    );

    router.push("/results");
    }}
        className="mt-6 rounded-full bg-green-400 px-10 py-5 text-lg font-medium text-black shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-green-300 active:scale-[0.98]">
    Analyze My AI Spend
    </button>

  </div>
</div>
  );
}