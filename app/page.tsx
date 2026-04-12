import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Analyzer from "./components/Analyzer";
import HowItWorks from "./components/HowItWorks";
import WhatWeDetect from "./components/WhatWeDetect";
import Footer from "./components/Footer";
import Background from "./components/Background";

export default function ScamShieldPage() {
  return (
    <main className="relative min-h-screen bg-[#0a0c10] text-slate-200 overflow-x-hidden">
      <Background />
      <Navbar />
      <Hero />
      <Stats />
      <Analyzer />
      <HowItWorks />
      <WhatWeDetect />
      <Footer />
    </main>
  );
}