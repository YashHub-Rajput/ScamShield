export default function Stats() {
  const stats = [
    { value: "3 Layers", label: "Detection system" },
    { value: "95%+", label: "Accuracy rate" },
    { value: "3 sec", label: "Analysis time" },
    { value: "100%", label: "Free to use" },
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