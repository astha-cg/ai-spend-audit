"use client";

import jsPDF from "jspdf";
import { useEffect, useState } from "react";
import { generateAudit } from "@/lib/auditEngine";
import { supabase } from "@/lib/supabase";

export default function ResultsPage() {

  const [result, setResult] = useState<any>(null);
  const [formData, setFormData] = useState<any>(null);
  const [summary, setSummary] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(true);
  const auditId =
      Math.random().toString(36).substring(2, 10);


useEffect(() => {

  async function fetchData() {

    const savedData = localStorage.getItem("audit-data");

    // No data found
    if (!savedData) {
      console.log("No audit data found");
      return;
    }

    const parsedData = JSON.parse(savedData);

    console.log(parsedData);

    // Extra safety check
    if (!parsedData) {
      console.log("Parsed data is null");
      return;
    }

    setFormData(parsedData);

    const auditResult = generateAudit({
      tool: parsedData.tool,
      plan: parsedData.plan,
      monthlySpend: Number(parsedData.monthlySpend),
      teamSize: Number(parsedData.teamSize),
      useCase: parsedData.useCase,
    });

    setResult(auditResult);

    try {

      // Generate AI Summary
      const response = await fetch(
        "/api/generate-summary",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...parsedData,
            recommendedPlan:
              auditResult.recommendedPlan,
            estimatedSavings:
              auditResult.estimatedSavings,
          }),
        }
      );
      

      const data = await response.json();

      setSummary(data.summary);

      // Save to Supabase
      await supabase.from("audits").insert([
        {
          company: parsedData.tool,
          team_size: Number(parsedData.teamSize),
          savings: auditResult.estimatedSavings,
        },
      ]);

    } catch (error) {

      console.error(error);

      setSummary(
        "Unable to generate AI summary."
      );

    } finally {

      setLoadingSummary(false);

    }
  }

  fetchData();

}, []);
    

  if (!result || !formData) {
    return (
      <main className="min-h-screen bg-black text-white p-10">
        Loading...
      </main>
    );
  }
  if (!formData) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black text-white">

      <div className="text-center">

        <h1 className="text-4xl font-bold">
          No Audit Data Found
        </h1>

        <p className="mt-4 text-gray-400">
          Please complete the audit form first.
        </p>

      </div>

    </main>
  );
}
  
  const yearlySavings = result.estimatedSavings * 12;
  function downloadPDF() {

  const doc = new jsPDF();

  doc.setFontSize(20);

  doc.text("AI Spend Audit Report", 20, 20);

  doc.setFontSize(12);

  doc.text(
    `Recommended Plan: ${result.recommendedPlan}`,
    20,
    50
  );

  doc.text(
    `Monthly Savings: $${result.estimatedSavings}`,
    20,
    70
  );

  doc.text(
    `Annual Savings: $${result.estimatedSavings * 12}`,
    20,
    90
  );

  doc.save("audit-report.pdf");
}

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f6f4ef] px-4 py-12 text-black md:px-6 md:py-16">
      <div className="absolute inset-0 -z-10 overflow-hidden">

      <div className="absolute right-[-120px] top-[-100px] h-[500px] w-[500px] rounded-full bg-lime-300 blur-[130px] opacity-70" />

      <div className="absolute left-[10%] top-[250px] h-[350px] w-[350px] rounded-full bg-emerald-200 blur-[120px] opacity-50" />

    </div>


      <div className="mx-auto max-w-6xl">

        <h1 className="text-5xl font-semibold leading-tight tracking-tight md:text-7xl">
          Audit Results
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-black/60">
          Personalized AI spend optimization report.
        </p>
        <div className="mt-14 grid gap-6 md:grid-cols-3">

        <div className="rounded-3xl border border-white/40 bg-white/70 p-8 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)] backdrop-blur-2xl transition hover:-translate-y-1">
        <p className="text-sm font-medium text-black/50">
          Monthly Savings
        </p>

        <h2 className="mt-5 text-5xl font-bold text-green-500">
          ${result.estimatedSavings}
        </h2>
        </div>

        <div className="rounded-[32px] border border-white/40 bg-white/70 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)] backdrop-blur-2xl transition hover:-translate-y-1">
        <p className="text-sm font-medium text-black/50">
          Annual Savings
        </p>

        <h2 className="mt-5 text-5xl font-bold text-green-500">
          ${result.estimatedSavings * 12}
        </h2>
        </div>

        <div className="rounded-[32px] border border-white/40 bg-white/70 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)] backdrop-blur-2xl transition hover:-translate-y-1">
        <p className="text-sm font-medium text-black/50">
          Optimization Score
        </p>

        <h2 className="mt-5 text-5xl font-bold text-purple-500">
           {result.estimatedSavings > 0 ? "72%" : "95%"}
        </h2>
      </div>

    </div>

        {/* Results Card */}
        <div className="mt-12 rounded-[40px] border border-white/40 bg-white/70 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.08)] backdrop-blur-2xl md:p-10">

          <div className="grid gap-6 md:grid-cols-2">

            <div className=" rounded-2xl bg-black/20 p-5 transition-all duration-300 hover:bg-black/40 hover:scale-[1.02]">
              <p className="text-sm font-medium text-black/50">
                Current Tool
              </p>

              <h2 className="mt-4 text-4xl font-bold tracking-tight">
                {formData.tool}
              </h2>
            </div>

            <div className=" rounded-3xl bg-white/80 p-6 shadow-sm transition hover:scale-[1.02]">
              <p className="text-sm font-medium text-black/50">
                Current Plan
              </p>

              <h2 className="mt-4 text-4xl font-bold tracking-tight">
                {formData.plan}
              </h2>
            </div>

            <div className=" rounded-3xl bg-white/80 p-6 shadow-sm transition hover:scale-[1.02]">
              <p className="text-sm font-medium text-black/50">
                Recommended Plan
              </p>

              <h2 className="mt-4 text-4xl font-bold tracking-tight bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
                {result.recommendedPlan}
              </h2>
            </div>

            <div className=" rounded-3xl bg-white/80 p-6 shadow-sm transition hover:scale-[1.02]">
              <p className="text-sm font-medium text-black/50">
                Estimated Monthly Savings
              </p>

              <h2 className="mt-4 bg-gradient-to-r from-green-500 to-emerald-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
                ${result.estimatedSavings}
              </h2>
            </div>
            {result.estimatedSavings > 50 && (
            <div className="mt-8 rounded-3xl border border-purple-200 bg-purple-100/70 p-8">

            <h3 className="text-2xl font-bold">
                Large Savings Opportunity Detected
            </h3>
            <a href="https://cal.com" target="_blank" className="mt-6 inline-block rounded-full bg-black px-8 py-4 text-white">
              Book Consultation
          </a>

            <p className="mt-4 max-w-2xl text-black/70">
                Your organization may benefit from a deeper AI infrastructure optimization consultation.
            </p>

        </div>
        )}
        {result.estimatedSavings === 0 && (
        <div className="mt-8 rounded-3xl border border-green-200 bg-green-100/70 p-8">

        <h3 className="text-2xl font-bold text-green-700">
        Your AI Spending Looks Optimized
        </h3>

        <p className="mt-4 max-w-2xl text-black/70">
          Based on current analysis, your organization is already using a cost-efficient AI setup.
        </p>

        </div>
        )}
        
            <div className="mt-8 rounded-3xl border border-green-200 bg-green-100/70 p-8">

            <p className="text-sm font-medium text-green-700">
                 Estimated Annual Savings
            </p>

            <h2 className="mt-4 bg-gradient-to-r from-green-500 to-emerald-400 bg-clip-text text-5xl font-bold text-transparent">
                    ${yearlySavings}
                </h2>

            </div>

          </div>

          {/* Recommendation */}
          <div className="mt-10 rounded-3xl bg-white/80 p-8 shadow-sm">

            <h3 className="text-2xl font-bold">
              Recommendation
            </h3>

            <p className="mt-5 text-lg leading-8 text-black/70">
              {result.reason}
            </p>

          </div>
          <div className="mt-10 rounded-3xl border border-purple-200 bg-purple-100/70 p-8">

          <h3 className="text-3xl font-bold">
            AI Generated Audit Summary
          </h3>

          {loadingSummary ? (
            <p className="mt-5 text-black/60">
              Generating AI insights...
            </p>
          ) : (
            <p className="mt-5 text-lg leading-9 text-black/70">
            {summary}
          </p>
          )}
          <button
           onClick={downloadPDF}
            className="mt-8 rounded-full bg-green-400 px-8 py-4 text-lg font-medium text-black shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-green-300 active:scale-[0.98]">
            Download PDF Report
          </button>
          <p className="mt-5 text-sm text-black/40">
          Audit ID: {auditId}
          </p>
          

        </div>

        </div>

      </div>
      <div className="mt-10 rounded-3xl bg-white/80 p-8 shadow-sm">

      <h3 className="text-3xl font-bold">
        Save Your Audit Report
      </h3>

      <p className="mt-4 text-black/60">
        Enter your email to save,
        download, and share your audit.
      </p>

      <input
      type="email"
      placeholder="Enter your email"
      className="mt-6 w-full rounded-2xl border border-black/10 bg-white px-5 py-4"
      />

      <button className="mt-8 rounded-full bg-green-400 px-8 py-4 text-lg font-medium text-black shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-green-300 active:scale-[0.98]">
      Save Report
      </button>

</div>

    </main>
  );
}