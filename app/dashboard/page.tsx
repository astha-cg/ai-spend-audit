"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {

  const [user, setUser] = useState<any>(null);

  useEffect(() => {

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

  }, []);

  return (
    <main className="min-h-screen bg-[#050816] p-10 text-white">

      <h1 className="text-4xl font-bold">
        Dashboard
      </h1>

      <p className="mt-4 text-gray-400">
        Logged in as: {user?.email}
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-3">

  <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

    <p className="text-gray-400">
      Total Savings
    </p>

    <h2 className="mt-3 text-4xl font-bold text-green-400">
      $12,400
    </h2>

  </div>

  <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

    <p className="text-gray-400">
      Audits Generated
    </p>

    <h2 className="mt-3 text-4xl font-bold text-purple-400">
      148
    </h2>

  </div>

  <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

    <p className="text-gray-400">
      Optimization Rate
    </p>

    <h2 className="mt-3 text-4xl font-bold text-cyan-400">
      82%
    </h2>

  </div>

</div>

    </main>
  );
}