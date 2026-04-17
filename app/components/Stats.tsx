"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Stats() {
  const [totalScans, setTotalScans] = useState<number>(0);
  const [highRisk, setHighRisk] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const { data, error } = await supabase
        .from("scans")
        .select("score");

      if (!error && data) {
        setTotalScans(data.length);
        setHighRisk(data.filter((s) => s.score >= 70).length);
      }
      setLoading(false);
    }
    fetchStats();
  }, []);

  const stats = [
    {
      value: loading ? "..." : `${totalScans}+`,
      label: "Scams analyzed",
    },
    {
      value: loading ? "..." : `${highRisk}+`,
      label: "High risk detected",
    },
    {
      value: "3",
      label: "Detection layers",
    },
    {
      value: "100%",
      label: "Free to use",
    },
  ];

  return (
    <section className="py-10 border-y border-white/[0.06]">
      <div className="mx-auto max-w-4xl px-5 grid grid-cols-2 sm:grid-cols-4 gap-8">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-2xl font-semibold text-emerald-400 tracking-tight mb-1">
              {stat.value}
            </p>
            <p className="text-xs text-slate-500 font-mono uppercase tracking-widest">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}