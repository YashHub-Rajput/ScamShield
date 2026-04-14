"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

type Mode = "signin" | "signup";

export default function SignInPage() {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleEmailAuth = async () => {
    if (!email || !password) {
      setMessage("Please fill in all fields");
      setStatus("error");
      return;
    }

    if (mode === "signup" && !name) {
      setMessage("Please enter your name");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setMessage("");

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setMessage(error.message);
        setStatus("error");
      } else {
        window.location.href = "/";
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
        setStatus("error");
      } else {
        window.location.href = "/";
      }
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0c10] text-slate-200 flex items-center justify-center px-5">

      {/* Background grid */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(99,220,180,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,220,180,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Glow */}
      <div
        className="pointer-events-none fixed left-1/2 -top-28 -translate-x-1/2 w-[600px] h-72"
        style={{
          background: "radial-gradient(ellipse at center, rgba(29,158,117,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="relative w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L2 4.5v4c0 3 2.5 5.5 6 6 3.5-.5 6-3 6-6v-4L8 1z" stroke="#34d399" strokeWidth="1.2" strokeLinejoin="round"/>
                <path d="M5.5 8l2 2 3-3" stroke="#34d399" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-semibold text-slate-100 tracking-tight text-xl">
              Scam<span className="text-emerald-400">Shield</span>
            </span>
          </a>
          <h1 className="text-2xl font-semibold text-slate-100 tracking-tight mb-2">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-sm text-slate-400">
            {mode === "signin"
              ? "Sign in to access your scan history"
              : "Join ScamShield and stay protected"}
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#111318] border border-white/[0.07] rounded-2xl p-6">

          {/* Mode tabs */}
          <div className="flex gap-1 bg-white/[0.03] rounded-xl p-1 mb-6">
            <button
              onClick={() => { setMode("signin"); setMessage(""); }}
              className={`flex-1 text-sm font-medium py-2 rounded-lg transition-all duration-150 ${
                mode === "signin"
                  ? "bg-emerald-600 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Sign in
            </button>
            <button
              onClick={() => { setMode("signup"); setMessage(""); }}
              className={`flex-1 text-sm font-medium py-2 rounded-lg transition-all duration-150 ${
                mode === "signup"
                  ? "bg-emerald-600 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Sign up
            </button>
          </div>

          {/* Google button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl py-3 text-sm font-medium text-slate-200 transition-all duration-150 mb-4"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M15.68 8.18c0-.57-.05-1.11-.14-1.64H8v3.1h4.3a3.67 3.67 0 01-1.6 2.41v2h2.58c1.51-1.39 2.4-3.44 2.4-5.87z" fill="#4285F4"/>
              <path d="M8 16c2.16 0 3.97-.72 5.3-1.94l-2.59-2a4.77 4.77 0 01-2.71.75 4.77 4.77 0 01-4.48-3.3H.85v2.06A8 8 0 008 16z" fill="#34A853"/>
              <path d="M3.52 9.51A4.8 4.8 0 013.27 8c0-.52.09-1.03.25-1.51V4.43H.85A8 8 0 000 8c0 1.29.31 2.51.85 3.57l2.67-2.06z" fill="#FBBC05"/>
              <path d="M8 3.18c1.22 0 2.31.42 3.17 1.24l2.38-2.38A8 8 0 008 0 8 8 0 00.85 4.43L3.52 6.5A4.77 4.77 0 018 3.18z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-xs text-slate-600 font-mono">or</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          {/* Form */}
          <div className="flex flex-col gap-3">
            {mode === "signup" && (
              <div>
                <label className="font-mono text-[11px] uppercase tracking-widest text-slate-500 mb-1.5 block">
                  Full name
                </label>
                <input
                  type="text"
                  placeholder="Yash Rajput"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl text-slate-200 text-sm px-4 py-3 outline-none placeholder-slate-700 focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/10 transition-colors duration-150"
                />
              </div>
            )}

            <div>
              <label className="font-mono text-[11px] uppercase tracking-widest text-slate-500 mb-1.5 block">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl text-slate-200 text-sm px-4 py-3 outline-none placeholder-slate-700 focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/10 transition-colors duration-150"
              />
            </div>

            <div>
              <label className="font-mono text-[11px] uppercase tracking-widest text-slate-500 mb-1.5 block">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl text-slate-200 text-sm px-4 py-3 outline-none placeholder-slate-700 focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/10 transition-colors duration-150"
              />
            </div>

            {/* Error or success message */}
            {message && (
              <div className={`text-xs font-mono px-3 py-2 rounded-lg ${
                status === "error"
                  ? "text-red-400 bg-red-400/10 border border-red-400/20"
                  : "text-emerald-400 bg-emerald-400/10 border border-emerald-400/20"
              }`}>
                {message}
              </div>
            )}

            <button
              onClick={handleEmailAuth}
              disabled={status === "loading"}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm rounded-xl py-3 transition-all duration-150 active:scale-95 mt-1"
            >
              {status === "loading"
                ? "Please wait..."
                : mode === "signin"
                ? "Sign in"
                : "Create account"}
            </button>
          </div>
        </div>

        {/* Back link */}
        <p className="text-center text-xs text-slate-600 mt-6">
          <a href="/" className="hover:text-slate-400 transition-colors">
            Back to ScamShield
          </a>
        </p>

      </div>
    </main>
  );
}