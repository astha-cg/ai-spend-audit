import Link from "next/link";
import Image from "next/image"; 
import { supabase } from "@/lib/supabase";
import { SpeedInsights } from "@vercel/speed-insights/next"


export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f6f4ef] text-black">
      <SpeedInsights />

      {/* Background Glow */}
      <div className="absolute inset-0 -z-10 overflow-hidden">

        <div className="absolute right-[-120px] top-[-120px] h-[650px] w-[650px] rounded-full bg-lime-300 blur-[140px] opacity-80" />

        <div className="absolute right-[180px] top-[40px] h-[400px] w-[400px] rounded-full bg-emerald-300 blur-[120px] opacity-60" />

      </div>

      {/* Navbar */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">

        {/* Logo */}
        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-400 font-bold text-black">
            ⚡
          </div>

          <h1 className="text-lg font-semibold tracking-tight">
            Spendit
          </h1>

        </div>

        {/* Nav Links */}
        <div className="hidden items-center gap-10 text-sm text-black/40 md:flex">

          <Link href="/platform" className="transition hover:text-black">
            Platform
          </Link>

          <Link href="/products" className="transition hover:text-black">
            Products
          </Link>

          <Link href="/solutions" className="transition hover:text-black">
            Solutions
          </Link>

          <Link href="/pricing" className="transition hover:text-black">
            Pricing
          </Link>

          <Link href="/company" className="transition hover:text-black">
            Company
          </Link>

        </div>

        {/* CTA */}
        <Link
          href="/audit"
          className="rounded-full border border-black/20 bg-white/60 px-6 py-3 text-sm font-medium backdrop-blur-md transition hover:bg-white"
        >
          Get Started →
        </Link>

      </nav>

      {/* Hero Section */}
      <section className="mx-auto flex max-w-7xl flex-col items-center px-6 pb-24 pt-10 md:flex-row md:gap-10">

        {/* LEFT */}
        <div className="w-full md:w-1/2">

          <h1 className="max-w-2xl text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">

            Find Hidden Savings Across 
            <br />
            Your AI Stack

          </h1>

          <p className="mt-8 max-w-md text-lg leading-relaxed text-black/60">

            Analyze your AI subscriptions, identify wasted spend,
            and get personalized optimization recommendations
            in under 60 seconds.

          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">

            <Link
              href="/audit"
              className="rounded-full bg-green-400 px-8 py-4 text-center font-medium text-black transition hover:bg-green-300"
            >
              Start Free Audit →
            </Link>

            <Link
              href="/example-report"
              className="rounded-full px-8 py-4 font-medium text-black/70 transition hover:bg-black/5"
            >
              View Example Report →
            </Link>

          </div>

          {/* Trusted Logos */}
          

        </div>

        {/* RIGHT SIDE */}
        <div className="relative mt-20 flex w-full items-center justify-center md:mt-0 md:w-1/2">

          {/* Dashboard Background Card */}
          <div className="absolute right-0 top-10 h-[420px] w-[520px] rounded-[40px] bg-white/50 shadow-[0_20px_80px_rgba(0,0,0,0.08)] backdrop-blur-2xl" />

          {/* Main Dashboard */}
          <div className="relative z-10 w-full max-w-[520px] rounded-[40px] border border-white/40 bg-white/70 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.08)] backdrop-blur-2xl">

            {/* Top Search */}
            <div className="mb-8 flex items-center gap-3">

              <div className="h-3 w-3 rounded-full bg-green-400" />

              <div className="h-3 w-32 rounded-full bg-black/10" />

            </div>

            {/* Dashboard Content */}
            <div className="rounded-3xl bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-black/50">
                    Monthly Savings
                  </p>

                  <h2 className="mt-2 text-5xl font-bold">
                    $4,250
                  </h2>
                </div>

                <div className="rounded-2xl bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
                  +82%
                </div>

              </div>

              {/* Stats */}
              <div className="mt-10 grid grid-cols-3 gap-4">

                <div className="rounded-2xl bg-black/[0.03] p-4">

                  <p className="text-xs text-black/50">
                    AI Tools
                  </p>

                  <h3 className="mt-2 text-2xl font-bold">
                    14
                  </h3>

                </div>

                <div className="rounded-2xl bg-black/[0.03] p-4">

                  <p className="text-xs text-black/50">
                    Spend
                  </p>

                  <h3 className="mt-2 text-2xl font-bold">
                    $12K
                  </h3>

                </div>

                <div className="rounded-2xl bg-black/[0.03] p-4">

                  <p className="text-xs text-black/50">
                    Saved
                  </p>

                  <h3 className="mt-2 text-2xl font-bold">
                    35%
                  </h3>

                </div>

              </div>

            </div>

            {/* Floating Card */}
            <div className="absolute -bottom-10 left-10 rounded-3xl bg-black px-8 py-6 text-white shadow-2xl">

              <p className="text-sm text-white/60">
                AI Audit Score
              </p>

              <h3 className="mt-3 text-3xl font-bold">
                92%
              </h3>

            </div>

          </div>

        </div>

      </section>
      {/* Footer */}
<footer className="border-t border-white/10 bg-white/50 text-center backdrop-blur-md">
  <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-sm text-gray-800 md:flex-row">
    
    <p>
      © 2026 AI Spend Audit. All rights reserved.
    </p>

    <p>
      Built for the Credex Web Development Internship Assignment
    </p>

  </div>
</footer>

    </main>
  );
}
      
   
async function testConnection() {
  const { data, error } = await supabase
    .from("audits")
    .select("*");

  console.log(data, error);
}

testConnection();