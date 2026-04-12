export default function WhatWeDetect() {
  const threats = [
    { title: "Phishing URLs", desc: "Fake links disguised as trusted brands like Amazon, Google, or your bank." },
    { title: "Fake giveaways", desc: "Prize and lottery scams designed to steal your personal information." },
    { title: "Urgency tricks", desc: "Pressure tactics that force you to act fast without thinking clearly." },
    { title: "Impersonation", desc: "Scammers pretending to be your bank, government, or a trusted company." },
    { title: "Financial scams", desc: "Advance fee fraud, investment scams, and fake loan offers." },
    { title: "Social engineering", desc: "Psychological manipulation designed to gain your trust before stealing." },
  ];

  return (
    <section id="what-we-detect" className="py-20 px-5 border-t border-white/[0.06]">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-14">
          <p className="font-mono text-[11px] uppercase tracking-widest text-emerald-500 mb-3">
            Threat coverage
          </p>
          <h2 className="text-3xl font-semibold text-slate-100 tracking-tight mb-3">
            What we detect
          </h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
            ScamShield recognizes the most common and dangerous scam patterns used today.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {threats.map((threat) => (
            <div key={threat.title} className="bg-[#111318] border border-white/[0.07] rounded-2xl p-5 flex gap-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1.5L1.5 4.5v3.5c0 2.5 2 4.5 5.5 5 3.5-.5 5.5-2.5 5.5-5V4.5L7 1.5z" stroke="#34d399" strokeWidth="1.1" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-200 mb-1">{threat.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{threat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}