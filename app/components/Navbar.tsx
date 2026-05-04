"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = () => {
    window.location.href = "/signin";
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#0a0c10]/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between">

        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L2 4.5v4c0 3 2.5 5.5 6 6 3.5-.5 6-3 6-6v-4L8 1z" stroke="#34d399" strokeWidth="1.2" strokeLinejoin="round"/>
              <path d="M5.5 8l2 2 3-3" stroke="#34d399" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="font-semibold text-slate-100 tracking-tight text-lg">
            Scam<span className="text-emerald-400">Shield</span>
          </span>
        </a>

        {/* Desktop nav links */}
        <div className="hidden sm:flex items-center gap-6">
          <a href="#analyzer" className="text-sm text-slate-400 hover:text-slate-200 transition-colors duration-150">Analyze</a>
          <a href="#how-it-works" className="text-sm text-slate-400 hover:text-slate-200 transition-colors duration-150">How it works</a>
          <a href="#what-we-detect" className="text-sm text-slate-400 hover:text-slate-200 transition-colors duration-150">What we detect</a>
          {user && (
            <a href="/history" className="text-sm text-slate-400 hover:text-slate-200 transition-colors duration-150">History</a>
          )}
        </div>

        {/* Desktop auth */}
        <div className="hidden sm:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                  <span className="text-emerald-400 text-xs font-medium">
                    {user.email?.[0]?.toUpperCase()}
                  </span>
                </div>
                <span className="text-xs text-slate-400 max-w-[120px] truncate">
                  {user.email}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs text-slate-500 border border-white/[0.08] rounded-lg px-3 py-1.5 hover:text-slate-300 hover:border-white/[0.14] transition-colors duration-150"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-lg px-3 py-1.5 transition-all duration-150"
            >
              Sign in
            </button>
          )}
        </div>

        {/* Mobile right side */}
        <div className="flex sm:hidden items-center gap-3">
          {!user && (
            <button
              onClick={handleLogin}
              className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg px-3 py-1.5 transition-all duration-150"
            >
              Sign in
            </button>
          )}
          {/* Hamburger button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-8 h-8 flex flex-col items-center justify-center gap-1.5"
          >
            <span className={`block w-5 h-px bg-slate-400 transition-all duration-150 ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
            <span className={`block w-5 h-px bg-slate-400 transition-all duration-150 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-px bg-slate-400 transition-all duration-150 ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-white/[0.06] bg-[#0a0c10]/95 backdrop-blur-md px-5 py-4 flex flex-col gap-4">
          <a
            href="#analyzer"
            onClick={() => setMenuOpen(false)}
            className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
          >
            Analyze
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMenuOpen(false)}
            className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
          >
            How it works
          </a>
          <a
            href="#what-we-detect"
            onClick={() => setMenuOpen(false)}
            className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
          >
            What we detect
          </a>
          {user && (
            <a
              href="/history"
              onClick={() => setMenuOpen(false)}
              className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
            >
              History
            </a>
          )}
          {user && (
            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-xs text-slate-500 truncate max-w-[200px]">
                {user.email}
              </span>
              <button
                onClick={handleLogout}
                className="text-xs text-slate-500 border border-white/[0.08] rounded-lg px-3 py-1.5 hover:text-slate-300 transition-colors"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}