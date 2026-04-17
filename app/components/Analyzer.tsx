"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

interface AnalysisResult {
  score: number;
  verdict: "High Risk" | "Moderate Risk" | "Low Risk";
  reasons: string[];
  explanation: string;
}

const SCAM_EXAMPLES = [
  {
    label: "Fake prize",
    text: `Congratulations! You've won a $1,000 Amazon gift card. Click here to claim now before it expires: http://amzn-reward.xyz/claim`,
  },
  {
    label: "Fake KYC",
    text: `Dear Customer, your SBI account has been suspended due to incomplete KYC. Update immediately to avoid permanent blocking: http://sbi-kyc-update.xyz/verify`,
  },
  {
    label: "Fake job",
    text: `You have been selected for a work from home job. Earn Rs.50,000 per month. No experience needed. Send your Aadhar card and bank details to apply: jobs@earnmoney-india.tk`,
  },
  {
    label: "OTP scam",
    text: `Your OTP for UPI transaction of Rs.9,999 is 847321. If you did not request this, call our helpline immediately and share this OTP to cancel the transaction.`,
  },
];

function ScoreMeter({ score, color }: { score: number; color: string }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden mt-4">
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{ width: `${score}%`, backgroundColor: color }}
      />
    </div>
  );
}

function ResultCard({
  result,
  inputText,
}: {
  result: AnalysisResult;
  inputText: string;
}) {
  const [copied, setCopied] = useState(false);
  const isHigh = result.score >= 70;
  const isMed = result.score >= 35 && result.score < 70;
  const scoreColor = isHigh ? "#f09595" : isMed ? "#ef9f27" : "#5dcaa5";
  const verdictClasses = isHigh
    ? "text-red-300 bg-red-400/10"
    : isMed
    ? "text-amber-300 bg-amber-400/10"
    : "text-emerald-300 bg-emerald-400/10";

  const resultText = `ScamShield Analysis
-------------------
Message: ${inputText.slice(0, 100)}${inputText.length > 100 ? "..." : ""}

Scam Probability: ${result.score}%
Verdict: ${result.verdict}

Reasons:
${result.reasons.map((r, i) => `${i + 1}. ${r}`).join("\n")}

Explanation:
${result.explanation}

Analyzed by ScamShield — scamshield-beta.vercel.app`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `🛡️ *ScamShield Analysis*\n\n` +
      `*Message analyzed:* ${inputText.slice(0, 100)}${inputText.length > 100 ? "..." : ""}\n\n` +
      `*Scam Probability:* ${result.score}%\n` +
      `*Verdict:* ${result.verdict}\n\n` +
      `*Reasons:*\n${result.reasons.map((r) => `• ${r}`).join("\n")}\n\n` +
      `*Explanation:*\n${result.explanation}\n\n` +
      `_Analyzed by ScamShield — scamshield-beta.vercel.app_`
    );
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Score card */}
      <div className="bg-[#111318] border border-white/[0.07] rounded-2xl p-6">
        <p className="font-mono text-[11px] uppercase tracking-widest text-slate-500 mb-3">
          Risk Assessment
        </p>
        <div className="flex items-end gap-4">
          <div>
            <p className="font-mono text-[11px] text-slate-500 mb-1">
              Scam Probability
            </p>
            <p
              className="text-5xl font-semibold tracking-tighter leading-none"
              style={{ color: scoreColor }}
            >
              {result.score}%
            </p>
          </div>
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-md mb-1 ${verdictClasses}`}
          >
            {result.verdict}
          </span>
        </div>
        <ScoreMeter score={result.score} color={scoreColor} />
      </div>

      {/* Reasons */}
      <div className="bg-[#111318] border border-white/[0.07] rounded-2xl p-6">
        <p className="font-mono text-[11px] uppercase tracking-widest text-slate-500 mb-4">
          Why it looks suspicious
        </p>
        <ul className="flex flex-col gap-3">
          {result.reasons.map((reason, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-sm text-slate-300 leading-relaxed"
            >
              <span
                className="mt-0.5 w-4 h-4 shrink-0 rounded-full flex items-center justify-center text-[10px] font-mono font-medium"
                style={{
                  backgroundColor: scoreColor + "20",
                  color: scoreColor,
                }}
              >
                !
              </span>
              {reason}
            </li>
          ))}
        </ul>
      </div>

      {/* Explanation */}
      <div className="bg-[#111318] border border-white/[0.07] rounded-2xl p-6">
        <p className="font-mono text-[11px] uppercase tracking-widest text-slate-500 mb-4">
          AI Explanation
        </p>
        <p className="text-sm text-slate-400 leading-relaxed border-l-2 border-emerald-500/40 pl-4">
          {result.explanation}
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 flex-wrap">
        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 text-sm text-slate-400 border border-white/[0.08] rounded-xl px-4 py-2.5 hover:text-slate-200 hover:border-white/[0.14] transition-all duration-150 active:scale-95"
        >
          {copied ? (
            <>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7l3.5 3.5L12 3" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="4" y="4" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M2 10V3a1 1 0 011-1h7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              Copy result
            </>
          )}
        </button>

        {/* WhatsApp share button */}
        <button
          onClick={handleWhatsApp}
          className="inline-flex items-center gap-2 text-sm text-emerald-400 border border-emerald-500/20 bg-emerald-500/10 rounded-xl px-4 py-2.5 hover:bg-emerald-500/20 transition-all duration-150 active:scale-95"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1C3.69 1 1 3.69 1 7c0 1.07.27 2.08.75 2.96L1 13l3.13-.73A6 6 0 107 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
            <path d="M5 5.5c.5 1 1.5 2.5 3.5 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          Share on WhatsApp
        </button>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-14 rounded-2xl border border-dashed border-white/[0.07] text-center">
      <div className="w-12 h-12 rounded-xl border border-white/[0.07] flex items-center justify-center">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path
            d="M11 3L4 7v5c0 4 3.5 7.5 7 8 3.5-.5 7-4 7-8V7L11 3z"
            stroke="#334155"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <path
            d="M8 11l2 2 4-4"
            stroke="#334155"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <p className="text-sm text-slate-600">
        Analysis results will appear here.
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="bg-[#111318] border border-white/[0.07] rounded-2xl p-6">
      <div className="flex items-center gap-3 text-slate-500 font-mono text-sm">
        <div className="w-4 h-4 rounded-full border border-emerald-500/20 border-t-emerald-500 animate-spin" />
        Analyzing with AI...
      </div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="bg-[#111318] border border-red-500/20 rounded-2xl p-6">
      <div className="flex items-center gap-3 text-red-400 font-mono text-sm">
        <span>⚠</span>
        {message}
      </div>
    </div>
  );
}

export default function Analyzer() {
  const [inputText, setInputText] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    setStatus("loading");
    setResult(null);
    setErrorMsg("");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText, userId }),
      });
      const data = await response.json();
      if (!response.ok || data.error)
        throw new Error(data.error || "Something went wrong");
      setResult(data);
      setStatus("done");
    } catch (error) {
      setErrorMsg(
        error instanceof Error
          ? error.message
          : "Analysis failed. Please try again."
      );
      setStatus("error");
    }
  };

  const handleClear = () => {
    setInputText("");
    setStatus("idle");
    setResult(null);
    setErrorMsg("");
  };

  return (
    <section id="analyzer" className="py-20 px-5">
      <div className="mx-auto max-w-2xl">
        <div className="text-center mb-10">
          <p className="font-mono text-[11px] uppercase tracking-widest text-emerald-500 mb-3">
            Analyzer
          </p>
          <h2 className="text-3xl font-semibold text-slate-100 tracking-tight mb-3">
            Paste anything suspicious
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Messages, emails, URLs, WhatsApp texts — anything you are not
            sure about.
          </p>
        </div>

        {/* Scam examples */}
        <div className="mb-4">
          <p className="font-mono text-[11px] uppercase tracking-widest text-slate-600 mb-2">
            Try an example
          </p>
          <div className="flex gap-2 flex-wrap">
            {SCAM_EXAMPLES.map((example) => (
              <button
                key={example.label}
                onClick={() => {
                  setInputText(example.text);
                  setStatus("idle");
                  setResult(null);
                }}
                className="text-xs font-mono text-slate-500 bg-white/[0.03] border border-white/[0.07] rounded-lg px-3 py-1.5 hover:text-slate-300 hover:border-white/[0.14] transition-all duration-150"
              >
                {example.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input card */}
        <div className="bg-[#111318] border border-white/[0.07] rounded-2xl p-6 mb-4">
          <p className="font-mono text-[11px] uppercase tracking-widest text-slate-500 mb-3">
            Your input
          </p>
          <textarea
            className="w-full min-h-40 bg-white/[0.03] border border-white/10 rounded-xl text-slate-200 font-mono text-sm leading-relaxed p-4 resize-y outline-none placeholder-slate-700 focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/10 transition-colors duration-150"
            placeholder={`Paste the suspicious message here...\n\ne.g. "Congratulations! You've won a $1,000 gift card. Claim now: http://reward.xyz"`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <div className="flex items-center gap-3 mt-4 flex-wrap">
            <button
              onClick={handleAnalyze}
              disabled={status === "loading"}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm rounded-xl px-5 py-3 transition-all duration-150 active:scale-95"
            >
              {status === "loading" ? "Analyzing..." : "Analyze now"}
            </button>
            <button
              onClick={handleClear}
              className="text-sm text-slate-500 border border-white/[0.08] rounded-xl px-4 py-3 hover:text-slate-400 hover:border-white/[0.14] transition-colors duration-150"
            >
              Clear
            </button>
            <span className="ml-auto font-mono text-xs text-slate-600">
              {inputText.length > 0 ? `${inputText.length} chars` : "0 chars"}
            </span>
          </div>
        </div>

        {status === "idle" && <EmptyState />}
        {status === "loading" && <LoadingState />}
        {status === "error" && <ErrorState message={errorMsg} />}
        {status === "done" && result && (
          <ResultCard result={result} inputText={inputText} />
        )}
      </div>
    </section>
  );
}