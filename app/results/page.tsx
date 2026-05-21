"use client";

import jsPDF from "jspdf";
import { useEffect, useState } from "react";
import { generateAudit } from "@/lib/auditEngine";
import { supabase } from "@/lib/supabase";
import { saveAudit } from "@/lib/saveAudit";

export default function ResultsPage() {
  const [user, setUser] = useState<any>(null);
  const [result, setResult] = useState<any>(null);
  const [formData, setFormData] = useState<any>(null);
  
  // Historical Snapshot States for the Diff View
  const [previousAudit, setPreviousAudit] = useState<any>(null);
  const [hideIdenticalRows, setHideIdenticalRows] = useState(false);

  const [summary, setSummary] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [email, setEmail] = useState("");
  const [auditId] = useState(() => Math.random().toString(36).substring(2, 10));
  const [networkTimeout, setNetworkTimeout] = useState(false);

  useEffect(() => {
    async function executeAuditPipeline() {
      try {
        // 1. Instantly extract current active audit cache to prevent page hanging
        const savedData = localStorage.getItem("audit-data");
        if (!savedData) {
          console.log("No audit data found");
          setLoadingSummary(false);
          return;
        }
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);

        // 2. Extract Historical Run for the Comparison Matrix
        const historicalData = localStorage.getItem("previous-audit-data");
        let parsedHistorical: any = null;
        if (historicalData) {
          try {
            parsedHistorical = JSON.parse(historicalData);
            setPreviousAudit(parsedHistorical);
          } catch (e) {
            console.error("Error reading historical audit logs:", e);
          }
        }

        // Cycle the current cache onward into the history slot for subsequent re-runs
        localStorage.setItem("previous-audit-data", JSON.stringify(parsedData));

        // 3. Resolve Auth Context (Non-blocking background pass)
        supabase.auth.getUser().then(({ data }) => {
          if (data?.user) setUser(data.user);
        });

        // 4. Pull Dynamic Market Rates with a 3-second fail-safe network race timeout
        let latestPricing: Record<string, number> = {
          openai_gpt4: 25,
          claude_pro: 30,
        };

        try {
          const metadataResponse = await Promise.race([
            supabase.from("pricing_metadata").select("id, current_price"),
            new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 3000))
          ]) as any;

          if (metadataResponse?.data && metadataResponse.data.length > 0) {
            metadataResponse.data.forEach((row: any) => {
              latestPricing[row.id] = Number(row.current_price);
            });
          }
        } catch (e) {
          console.warn("Database pricing fetch timed out or failed. Using fast-cache defaults.");
          setNetworkTimeout(true);
        }

        // 5. Compute Active Optimization Metrics instantly
        const auditResult = generateAudit(
          {
            tool: parsedData.tool,
            plan: parsedData.plan,
            monthlySpend: Number(parsedData.monthlySpend),
            teamSize: Number(parsedData.teamSize),
            useCase: parsedData.useCase,
          },
          latestPricing
        );
        setResult(auditResult);

        // Build historical calculation metrics branch if history is present
        if (parsedHistorical) {
          const pastResult = generateAudit(
            {
              tool: parsedHistorical.tool,
              plan: parsedHistorical.plan,
              monthlySpend: Number(parsedHistorical.monthlySpend),
              teamSize: Number(parsedHistorical.teamSize),
              useCase: parsedHistorical.useCase,
            },
            latestPricing
          );
          setPreviousAudit((prev: any) => ({ ...prev, calculatedResult: pastResult }));
        }

        // 6. Decoupled AI Generation Request (Asynchronous background thread operation)
        fetch("/api/generate-summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...parsedData,
            recommendedPlan: auditResult.recommendedPlan,
            estimatedSavings: auditResult.estimatedSavings,
          }),
        })
          .then((res) => res.json())
          .then((summaryData) => {
            setSummary(summaryData.summary || "Audit optimization analysis completed successfully.");
            
            // Persist parameters safely after rendering frames decouple
            saveAudit({
              email: user?.email || summaryData.user?.email || "anonymous@example.com",
              currentTools: [{ tool: parsedData.tool, plan: parsedData.plan }],
              recommendations: [{
                recommendedTool: auditResult.recommendedTool,
                recommendedPlan: auditResult.recommendedPlan,
                reason: auditResult.reason,
              }],
              monthlySpend: Number(parsedData.monthlySpend),
              estimatedSavings: auditResult.estimatedSavings,
              pricingSnapshot: latestPricing,
            });
          })
          .catch(() => {
            setSummary("Completed using baseline structural tracking rules.");
          })
          .finally(() => setLoadingSummary(false));

      } catch (error) {
        console.error("Audit Pipeline Critical Exception:", error);
        setSummary("Unable to generate dynamic AI summary insights at this time.");
        setLoadingSummary(false);
      }
    }

    executeAuditPipeline();
  }, []);

  if (!formData || !result) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-400 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-400 font-medium">Assembling optimization profile...</p>
          {networkTimeout && (
            <p className="text-xs text-amber-400 mt-2">Connecting via fallback parameters...</p>
          )}
        </div>
      </main>
    );
  }

  const yearlySavings = result.estimatedSavings * 12;
  const recommendedTotalCost = Number(formData.monthlySpend) - Number(result.estimatedSavings);
  const triggerConsultation = Number(formData.monthlySpend) > Number(result.estimatedSavings);

  // Side-by-Side Mathematical Delta Calculations
  const originalSavingsAmount = previousAudit?.calculatedResult?.estimatedSavings || 0;
  const savingsDelta = result.estimatedSavings - originalSavingsAmount;
  const isSavingsDeltaPositive = savingsDelta >= 0;

  // Evaluation parameters for row grouping collapse actions
  const isToolUnchanged = formData.tool === previousAudit?.tool;
  const isPlanUnchanged = formData.plan === previousAudit?.plan;

  function downloadPDF() {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("AI Spend Audit Report", 20, 20);
    doc.setFontSize(12);
    doc.text(`Current Platform Target: ${formData.tool} (${formData.plan})`, 20, 40);
    doc.text(`Recommended Strategy: ${result.recommendedTool} (${result.recommendedPlan})`, 20, 50);
    doc.text(`Monthly Savings: $${result.estimatedSavings}`, 20, 70);
    doc.text(`Annualized Cost Avoidance: $${yearlySavings}`, 20, 80);
    doc.save(`audit-report-${auditId}.pdf`);
  }

  async function sendReport() {
    if (!email) {
      alert("Please enter email");
      return;
    }
    try {
      await fetch("/api/send-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, reportUrl: window.location.href }),
      });
      alert("Report sent successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to send report");
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f6f4ef] px-4 py-12 text-black md:px-6 md:py-16">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute right-[-120px] top-[-100px] h-[500px] w-[500px] rounded-full bg-lime-300 blur-[130px] opacity-70" />
        <div className="absolute left-[10%] top-[250px] h-[350px] w-[350px] rounded-full bg-emerald-200 blur-[120px] opacity-50" />
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="text-5xl font-semibold leading-tight tracking-tight md:text-7xl">
              Audit Results
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-black/60">
              Personalized Real-Time AI spend optimization report.
            </p>
          </div>

          {/* Headline Savings Delta Alert Badge */}
          {previousAudit && (
            <div className={`rounded-2xl border px-6 py-4 backdrop-blur-md text-right shadow-sm transition-all ${
              isSavingsDeltaPositive ? "border-green-200 bg-green-50/90" : "border-amber-200 bg-amber-50/90"
            }`}>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block">Total Savings Delta</span>
              <h3 className={`text-2xl font-black mt-1 ${isSavingsDeltaPositive ? "text-green-600" : "text-amber-600"}`}>
                {isSavingsDeltaPositive ? `+$${savingsDelta}` : `-$${Math.abs(savingsDelta)}`}/mo shift
              </h3>
            </div>
          )}
        </div>

        {/* Top Analytics Cards Grid */}
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-white/40 bg-white/70 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)] backdrop-blur-2xl transition hover:-translate-y-1">
            <p className="text-sm font-medium text-black/50">Monthly Savings</p>
            <h2 className="mt-5 text-5xl font-bold text-green-600">${result.estimatedSavings}</h2>
          </div>
          <div className="rounded-3xl border border-white/40 bg-white/70 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)] backdrop-blur-2xl transition hover:-translate-y-1">
            <p className="text-sm font-medium text-black/50">Annual Savings</p>
            <h2 className="mt-5 text-5xl font-bold text-green-600">${yearlySavings}</h2>
          </div>
          <div className="rounded-3xl border border-white/40 bg-white/70 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)] backdrop-blur-2xl transition hover:-translate-y-1">
            <p className="text-sm font-medium text-black/50">Optimization Score</p>
            <h2 className="mt-5 text-5xl font-bold text-purple-600">
              {result.estimatedSavings > 0 ? "72%" : "95%"}
            </h2>
          </div>
        </div>

        {/* Muted Row Folding Configuration Control Bar */}
        {previousAudit && (
          <div className="mt-12 flex items-center justify-between bg-white/50 border border-black/5 px-6 py-3 rounded-2xl backdrop-blur-sm">
            <span className="text-xs font-medium text-neutral-600">Historical comparison grid enabled</span>
            <button 
              onClick={() => setHideIdenticalRows(!hideIdenticalRows)}
              className="text-xs font-semibold bg-neutral-900 text-white rounded-xl px-4 py-2 hover:bg-black transition active:scale-[0.98]"
            >
              {hideIdenticalRows ? "Show Matching Rows" : "Collapse Same-Recommendation Rows"}
            </button>
          </div>
        )}

        {/* Detailed Comparison Side-by-Side Component Matrix */}
        <div className="mt-6 rounded-[40px] border border-white/40 bg-white/70 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.08)] backdrop-blur-2xl md:p-10">
          <div className="grid gap-6">
            
            {/* Row Item 1: Target Operating Engine Engine */}
            {(!hideIdenticalRows || !isToolUnchanged) && (
              <div className="grid gap-4 md:grid-cols-2">
                {previousAudit && (
                  <div className="rounded-3xl bg-neutral-200/50 p-6 border border-black/5 transition opacity-60">
                    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Original Tool</p>
                    <h2 className="mt-3 text-3xl font-bold text-neutral-500 line-through">{previousAudit.tool}</h2>
                  </div>
                )}
                <div className={`rounded-3xl p-6 border transition ${previousAudit ? "bg-white border-green-200 shadow-sm col-span-1" : "bg-black/5 border-black/5 md:col-span-1"}`}>
                  <p className="text-xs font-semibold text-black/50 uppercase tracking-wider">{previousAudit ? "New Audit Tool" : "Current Tool"}</p>
                  <h2 className="mt-3 text-3xl font-bold text-neutral-800">{formData.tool}</h2>
                </div>
              </div>
            )}

            {/* Row Item 2: Active Workspace Operations Tier */}
            {(!hideIdenticalRows || !isPlanUnchanged) && (
              <div className="grid gap-4 md:grid-cols-2">
                {previousAudit && (
                  <div className="rounded-3xl bg-neutral-200/50 p-6 border border-black/5 transition opacity-60">
                    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Original Plan Configuration</p>
                    <h2 className="mt-3 text-3xl font-bold text-neutral-500 line-through capitalize">{previousAudit.plan}</h2>
                  </div>
                )}
                <div className={`rounded-3xl p-6 border transition ${previousAudit ? "bg-white border-green-200 shadow-sm col-span-1" : "bg-white/80 border-black/5 shadow-sm md:col-span-1"}`}>
                  <p className="text-xs font-semibold text-black/50 uppercase tracking-wider">{previousAudit ? "New Plan Configuration" : "Current Plan Configuration"}</p>
                  <h2 className="mt-3 text-3xl font-bold text-neutral-700 capitalize">{formData.plan}</h2>
                </div>
              </div>
            )}

            {/* Row Item 3: Recommended Alternative Transformation Target */}
            <div className="grid gap-4 md:grid-cols-2">
              {previousAudit && (
                <div className="rounded-3xl bg-neutral-100 p-6 border border-black/5 opacity-80">
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Original Recommended System</p>
                  <h2 className="mt-3 text-2xl font-bold text-neutral-600 capitalize">
                    {previousAudit.calculatedResult?.recommendedTool} ({previousAudit.calculatedResult?.recommendedPlan})
                  </h2>
                </div>
              )}
              <div className={`rounded-3xl bg-white/80 p-6 border transition shadow-sm ${previousAudit ? "border-green-300" : "border-black/5 md:col-span-1"}`}>
                <p className="text-xs font-semibold text-black/50 uppercase tracking-wider">Recommended Alternative System</p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent capitalize">
                  {result.recommendedTool} ({result.recommendedPlan})
                </h2>
              </div>
            </div>

            {/* Row Item 4: Financial Overhead Deployment Outlay */}
            <div className="grid gap-4 md:grid-cols-2">
              {previousAudit && (
                <div className="rounded-3xl bg-neutral-100 p-6 border border-black/5 opacity-80">
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Original Plan Cost Target</p>
                  <h2 className="mt-3 text-2xl font-bold text-neutral-600">
                    ${Number(previousAudit.monthlySpend) - Number(previousAudit.calculatedResult?.estimatedSavings || 0)}/mo
                  </h2>
                </div>
              )}
              <div className={`rounded-3xl bg-white/80 p-6 border transition shadow-sm ${previousAudit ? "border-green-300" : "border-black/5 md:col-span-1"}`}>
                <p className="text-sm font-medium text-black/50">Recommended Plan Amount</p>
                <h2 className="mt-3 text-4xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
                  ${recommendedTotalCost} <span className="text-sm font-normal text-black/40">/mo</span>
                </h2>
              </div>
            </div>

          </div>
          
          {/* Context Advisory Dynamic Banners */}
          {triggerConsultation ? (
            <div className="mt-8 rounded-3xl border border-purple-200 bg-purple-100/70 p-8">
              <h3 className="text-2xl font-bold text-purple-900">Large Savings Opportunity Detected</h3>
              <p className="mt-2 text-black/70">Your organization configuration may benefit significantly from a custom enterprise architecture deployment framework.</p>
              <a href="https://credextechnology.com/" target="_blank" rel="noreferrer" className="mt-6 inline-block rounded-full bg-black px-8 py-3.2 text-sm font-medium text-white transition hover:bg-neutral-800">
                Book Infrastructure Consultation
              </a>
            </div>
          ) : result.estimatedSavings === 0 ? (
            <div className="mt-8 rounded-3xl border border-green-200 bg-green-100/70 p-8">
              <h3 className="text-2xl font-bold text-green-800">Your AI Infrastructure Looks Completely Optimized</h3>
              <p className="mt-2 text-black/70">Based on active market indices, your workspace configurations are capturing top utility execution efficiency models.</p>
            </div>
          ) : null}

          {/* Text Summary and Engine Explanations */}
          <div className="mt-8 rounded-3xl bg-white/90 p-8 border border-black/5">
            <h3 className="text-xl font-bold text-neutral-800">System Recommendation Analysis</h3>
            <p className="mt-4 text-lg leading-relaxed text-black/70">{result.reason}</p>
          </div>

          <div className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50/60 p-8">
            <h3 className="text-2xl font-bold text-neutral-800">AI Generated Insights Summary</h3>
            {loadingSummary ? (
              <p className="mt-4 text-black/50 animate-pulse">Running semantic parsing layers...</p>
            ) : (
              <p className="mt-4 text-lg leading-relaxed text-black/70">{summary}</p>
            )}
            <button
              onClick={downloadPDF}
              className="mt-8 rounded-full bg-green-400 px-8 py-3.5 text-md font-semibold text-black shadow-md transition hover:bg-green-300 active:scale-[0.99]"
            >
              Download Official PDF Document
            </button>
            <p className="mt-6 text-xs text-black/40 font-mono">System Secure Reference Token: {auditId}</p>
          </div>
        </div>

        {/* Share / Retention Action Box */}
        <div className="mt-8 rounded-[32px] bg-white/70 border border-white/40 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.04)] backdrop-blur-2xl">
          <h3 className="text-2xl font-bold text-neutral-800">Save Your Configuration Pipeline</h3>
          <p className="mt-2 text-black/60">Enter your email address to save this report directly into your workspace account dashboard portfolio.</p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@organization.com"
              className="w-full flex-1 rounded-2xl border border-black/10 bg-white px-5 py-4 focus:outline-none focus:border-green-400 text-black shadow-inner"
            />
            <button
              onClick={sendReport}
              className="rounded-2xl bg-neutral-900 px-8 py-4 font-semibold text-white transition hover:bg-black active:scale-[0.99] whitespace-nowrap"
            >
              Dispatch System Report
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}