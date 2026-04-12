export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-10 px-5">
      <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L2 4.5v4c0 3 2.5 5.5 6 6 3.5-.5 6-3 6-6v-4L8 1z" stroke="#34d399" strokeWidth="1.2" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-sm font-medium text-slate-400">
            Scam<span className="text-emerald-400">Shield</span>
          </span>
        </div>
        <p className="font-mono text-xs text-slate-600">
          Don&apos;t get scammed. Get ScamShield · Powered by Groq AI
        </p>
        <p className="font-mono text-xs text-slate-600">
          © 2026 ScamShield
        </p>
      </div>
    </footer>
  );
}