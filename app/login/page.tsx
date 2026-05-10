"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {

  const [email, setEmail] = useState("");

  async function handleLogin() {

    await supabase.auth.signInWithOtp({
      email,
    });

    alert("Check your email for login link.");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050816] text-white">

      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-10">

        <h1 className="text-4xl font-bold">
          Login
        </h1>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="mt-6 w-full rounded-xl border border-white/10 bg-black/20 p-4 outline-none"
        />

        <button
          onClick={handleLogin}
          className="mt-6 w-full rounded-xl bg-white px-6 py-4 font-semibold text-black transition hover:bg-gray-200"
        >
          Send Magic Link
        </button>

      </div>

    </main>
  );
}