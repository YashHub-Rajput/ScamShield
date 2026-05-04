"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface Scan {
  id: string;
  created_at: string;
  input_text: string;
  score: number;
  verdict: string;
  reasons: string[];
  explanation: string;
  detected_urls: string[];
  flagged_categories: string[];
  url_threats: boolean;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

function ScoreBadge({ score, verdict }: { score: number; verdict: string }) {
  const isHigh = score >= 70;
  const isMed = score >= 35 && score < 70;
  const colorClass = isHigh
    ? "text-red-300 bg-red-400/10 border-red-400/20"
    : isMed
    ? "text-amber-300 bg-amber-400/10 border-amber-400/20"
    : "text-emerald-300 bg-emerald-400/10 border-emerald-400/20";

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border ${colorClass} shrink-0`}>
      <span className="font-mono text-sm font-medium">{score}%</span>
      <span className="text-xs hidden sm:block">{verdict}</span>
    </div>
  );
}

function ScanDetail({ scan, onClose }: { scan: Scan; onClose: () => void }) {
  const isHigh = scan.score >= 70;
  const isMed = scan.score >= 35 && scan.score < 70;
  const scoreColor = isHigh ? "#f09595" : isMed ? "#ef9f27" : "#5dcaa5";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(0,0,0,0.7)" }}
      onClick={onClose}
    >
      <div
        className="bg-[#111318] border border-white/[0.07] rounded-t-2xl sm:rounded-2xl p-6 w-full sm:max-w-lg max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar for mobile */}
        <div className="w-10 h-1 bg-white/10 rounded-full mx-auto mb-4 sm:hidden" />

        <div className="flex items-center justify-between mb-6">
          <p className="font-mono text-[11px] uppercase tracking-widest text-slate-500">
            Scan Detail
          </p>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/[0.05]"
          >
            ✕
          </button>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <p className="text-4xl font-semibold tracking-tighter" style={{ color: scoreColor }}>
            {scan.score}%
          </p>
          <ScoreBadge score={scan.score} verdict={scan.verdict} />
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-slate-500 mb-2">
              Message analyzed
            </p>
            <p className="text-sm text-slate-300 bg-white/[0.03] rounded-xl p-3 font-mono leading-relaxed break-words">
              {scan.input_text}
            </p>
          </div>

          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-slate-500 mb-2">
              Reasons
            </p>
            <ul className="flex flex-col gap-2">
              {scan.reasons.map((reason, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                  <span
                    className="mt-0.5 w-4 h-4 shrink-0 rounded-full flex items-center justify-center text-[10px]"
                    style={{ backgroundColor: scoreColor + "20", color: scoreColor }}
                  >
                    !
                  </span>
                  {reason}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-slate-500 mb-2">
              AI Explanation
            </p>
            <p className="text-sm text-slate-400 leading-relaxed border-l-2 border-emerald-500/40 pl-3">
              {scan.explanation}
            </p>
          </div>

          {scan.flagged_categories?.length > 0 && (
            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest text-slate-500 mb-2">
                Flagged by rule engine
              </p>
              <div className="flex flex-wrap gap-2">
                {scan.flagged_categories.map((cat) => (
                  <span
                    key={cat}
                    className="text-xs font-mono text-slate-400 bg-white/[0.04] border border-white/[0.07] rounded-md px-2 py-1"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          )}

          {scan.detected_urls?.length > 0 && (
            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest text-slate-500 mb-2">
                URLs detected
              </p>
              <div className="flex flex-col gap-1">
                {scan.detected_urls.map((url) => (
                  <p key={url} className="text-xs font-mono text-slate-400 bg-white/[0.03] rounded-lg px-3 py-2 break-all">
                    {url}
                  </p>
                ))}
              </div>
            </div>
          )}

          <p className="font-mono text-xs text-slate-600 mt-2">
            Scanned on {formatDate(scan.created_at)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function HistoryPage() {
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedScan, setSelectedScan] = useState<Scan | null>(null);

  useEffect(() => {
    async function fetchScans() {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      if (!user) {
        window.location.href = "/";
        return;
      }

      const { data, error } = await supabase
        .from("scans")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching scans:", error);
      } else {
        setScans(data || []);
      }
      setLoading(false);
    }

    fetchScans();
  }, []);

  return (
    <main className="relative min-h-screen bg-[#0a0c10] text-slate-200">
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(99,220,180,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,220,180,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-5 py-16">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-emerald-500 mb-2">
              Scan History
            </p>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-100 tracking-tight">
              Past analyses
            </h1>
          </div>
          
          <a
            href="/"
            className="text-sm text-slate-400 border border-white/[0.08] rounded-xl px-3 sm:px-4 py-2 hover:text-slate-200 hover:border-white/[0.14] transition-colors duration-150"
          >
            Back
          </a>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center gap-3 text-slate-500 font-mono text-sm">
            <div className="w-4 h-4 rounded-full border border-emerald-500/20 border-t-emerald-500 animate-spin" />
            Loading scan history...
          </div>
        )}

        {/* Empty */}
        {!loading && scans.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 py-24 rounded-2xl border border-dashed border-white/[0.07] text-center">
            <p className="text-slate-600 font-mono text-sm px-4">
              No scans yet. Go analyze something suspicious!
            </p>
            <a href="/" className="text-sm text-emerald-500 hover:text-emerald-400 transition-colors">
              Go to analyzer
            </a>
          </div>
        )}

        {/* Scans list */}
        {!loading && scans.length > 0 && (
          <div className="flex flex-col gap-3">

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-4">
              <div className="bg-[#111318] border border-white/[0.07] rounded-2xl p-3 sm:p-4 text-center">
                <p className="text-xl sm:text-2xl font-semibold text-emerald-400 mb-1">
                  {scans.length}
                </p>
                <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-slate-500">
                  Total
                </p>
              </div>
              <div className="bg-[#111318] border border-white/[0.07] rounded-2xl p-3 sm:p-4 text-center">
                <p className="text-xl sm:text-2xl font-semibold text-red-400 mb-1">
                  {scans.filter((s) => s.score >= 70).length}
                </p>
                <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-slate-500">
                  High risk
                </p>
              </div>
              <div className="bg-[#111318] border border-white/[0.07] rounded-2xl p-3 sm:p-4 text-center">
                <p className="text-xl sm:text-2xl font-semibold text-emerald-400 mb-1">
                  {scans.filter((s) => s.score < 35).length}
                </p>
                <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-slate-500">
                  Low risk
                </p>
              </div>
            </div>

            {/* Scan rows */}
            {scans.map((scan) => (
              <div
                key={scan.id}
                onClick={() => setSelectedScan(scan)}
                className="bg-[#111318] border border-white/[0.07] rounded-2xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 cursor-pointer hover:border-white/[0.14] transition-all duration-150 active:scale-[0.99]"
              >
                <ScoreBadge score={scan.score} verdict={scan.verdict} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-300 truncate">
                    {truncateText(scan.input_text, 60)}
                  </p>
                  <p className="font-mono text-xs text-slate-600 mt-1">
                    {formatDate(scan.created_at)}
                  </p>
                </div>
                <span className="text-slate-600 text-xs shrink-0">view</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedScan && (
        <ScanDetail
          scan={selectedScan}
          onClose={() => setSelectedScan(null)}
        />
      )}
    </main>
  );
}