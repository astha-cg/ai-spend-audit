import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-[#090e1f] to-[#050816] text-white overflow-hidden">
      {/* Navbar */}
<nav className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl">
  <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
    
    {/* Logo */}
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 font-bold text-white">
        SI
      </div>

      <div>
        <h1 className="text-lg font-bold">Spendit</h1>
        <p className="text-xs text-gray-400">
          by Credex
        </p>
      </div>
    </div>

    {/* Nav Button */}
    <Link
      href="/audit"
      className="rounded-xl bg-white px-5 py-2 font-medium text-black transition hover:bg-gray-200"
    >
      Start Audit
    </Link>

  </div>
</nav>

      {/* Hero Section */}
<section className="px-6 py-24">
  <div className="mx-auto flex max-w-7xl flex-col items-center gap-16 md:flex-row md:gap-32">
    
    {/* Left Content */}
    <div className="flex-1 text-center md:text-left ">
      <p className="mb-4 text-sm uppercase tracking-[0.3em] text-gray-400">
        Free AI Cost Optimization Tool
      </p>

      <h1 className="text-5xl md:text-7xl font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
        Stop Overspending on AI Tools
      </h1>

      <p className="mt-6 text-lg text-gray-300 md:text-xl max-w-2xl mx-auto md:mx-0">
        Get a free audit of your AI stack in 60 seconds.
        Discover cheaper plans, better alternatives,
        and hidden savings opportunities.
      </p>

      <div className="mt-10 flex flex-col sm:flex-row items-center md:items-start gap-4 justify-center md:justify-start">
        <Link
          href="/audit"
          className="rounded-xl bg-white px-8 py-4 text-lg font-semibold text-black hover:bg-gray-200 transition"
        >
          Start Free Audit
        </Link>

        <button className="rounded-xl border border-white/20 px-8 py-4 text-lg hover:bg-white/10 transition">
          View Example Report
        </button>
      </div>
    </div>

    {/* Right Image */}
    <div className="relative flex-1 flex justify-center items-center">
       {/* Glow Effect */}
  <div className="absolute h-[420px] w-[420px] rounded-full bg-purple-500/20 blur-3xl"></div>
  <div className="absolute h-[300px] w-[300px] rounded-full bg-blue-500/20 blur-3xl"></div>
      <Image
        src="/audit_hero.png"
        alt="AI Spend Audit Dashboard"
        width={500}
        height={500}
        priority
        className="relative z-10 object-contain drop-shadow-[0_0_40px_rgba(168,85,247,0.35)] mix-blend-lighten"
        
      />
    </div>
  </div>
  </section>
      {/* Footer */}
<footer className="border-t border-white/10 bg-black/40">
  <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-sm text-gray-400 md:flex-row">
    
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