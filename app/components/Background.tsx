export default function Background() {
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(99,220,180,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,220,180,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div
        className="pointer-events-none fixed left-1/2 -top-28 -translate-x-1/2 w-[600px] h-72"
        style={{
          background: "radial-gradient(ellipse at center, rgba(29,158,117,0.12) 0%, transparent 70%)",
        }}
      />
    </>
  );
}