export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#0a0c10]/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L2 4.5v4c0 3 2.5 5.5 6 6 3.5-.5 6-3 6-6v-4L8 1z" stroke="#34d399" strokeWidth="1.2" strokeLinejoin="round"/>
              <path d="M5.5 8l2 2 3-3" stroke="#34d399" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="font-semibold text-slate-100 tracking-tight text-lg">
            Scam<span className="text-emerald-400">Shield</span>
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-6">
          <a href="#analyzer" className="text-sm text-slate-400 hover:text-slate-200 transition-colors duration-150">Analyze</a>
          <a href="#how-it-works" className="text-sm text-slate-400 hover:text-slate-200 transition-colors duration-150">How it works</a>
          <a href="#what-we-detect" className="text-sm text-slate-400 hover:text-slate-200 transition-colors duration-150">What we detect</a>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[10px] text-emerald-400 tracking-wider uppercase">Live</span>
        </div>
      </div>
    </nav>
  );
}