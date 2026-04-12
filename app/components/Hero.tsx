export default function Hero() {
  return (
    <section className="pt-40 pb-16 text-center px-5">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 mb-6">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-mono text-[11px] font-medium tracking-widest uppercase text-emerald-400">
          AI-Powered · 3 Layer Detection
        </span>
      </div>
      <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.1] text-slate-100 mb-5">
        Detect scams<br />
        before they{" "}
        <span className="text-emerald-400">strike.</span>
      </h1>
      <p className="text-lg text-slate-400 leading-relaxed max-w-xl mx-auto mb-10">
        Paste any message, email, or URL. ScamShield analyzes it instantly
        and gives you a clear risk assessment — completely free.
      </p>
      <a href="#analyzer" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm rounded-xl px-6 py-3.5 transition-all duration-150 active:scale-95">
        Analyze a message
      </a>
    </section>
  );
}