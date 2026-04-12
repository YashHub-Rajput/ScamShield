export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Rule Engine",
      description: "Our rule based engine instantly checks for urgency words, suspicious patterns, and known scam phrases.",
      color: "text-emerald-400",
      border: "border-emerald-500/20",
      bg: "bg-emerald-500/10",
    },
    {
      number: "02",
      title: "URL Scanner",
      description: "Any URLs in your message are scanned against threat databases checking for phishing and malware.",
      color: "text-blue-400",
      border: "border-blue-500/20",
      bg: "bg-blue-500/10",
    },
    {
      number: "03",
      title: "AI Analysis",
      description: "A large language model reads the full context and generates a detailed risk score and plain English explanation.",
      color: "text-purple-400",
      border: "border-purple-500/20",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 px-5 border-t border-white/[0.06]">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-14">
          <p className="font-mono text-[11px] uppercase tracking-widest text-emerald-500 mb-3">
            How it works
          </p>
          <h2 className="text-3xl font-semibold text-slate-100 tracking-tight mb-3">
            Three layers of protection
          </h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
            Unlike simple keyword filters, ScamShield uses three independent detection layers working together.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div key={step.number} className="bg-[#111318] border border-white/[0.07] rounded-2xl p-6">
              <div className={`w-10 h-10 rounded-xl ${step.bg} border ${step.border} flex items-center justify-center mb-4`}>
                <span className={`font-mono text-sm font-medium ${step.color}`}>{step.number}</span>
              </div>
              <h3 className={`font-semibold text-base mb-2 ${step.color}`}>{step.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}