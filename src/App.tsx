import { useEffect } from "react";
import Lenis from "lenis";
import Nav from "@/components/Nav";
import { Hero } from "@/sections/Hero";
import { About } from "@/sections/About";
import { Manifesto } from "@/sections/Manifesto";
import { Team } from "@/sections/Team";
import { Banner } from "@/sections/Banner";
import { FAQ } from "@/sections/FAQ";
import { Contact } from "@/sections/Contact";
import { Footer } from "@/sections/Footer";
import { SectionIndicator } from "@/components/SectionIndicator";
import TargetCursor from "@/components/TargetCursor";

export default function LandingPage() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return (
    <div className="min-h-screen w-full relative bg-black text-foreground">
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: "radial-gradient(125% 125% at 50% 90%, #000000 40%, #0b1220 100%)",
        }}
      />
      <div className="relative z-10">
        <Nav />
        <SectionIndicator />
        <TargetCursor spinDuration={3} cursorColor="#ffffff" cursorColorOnTarget="#F59E0B" />
        <Hero />
        <About />
        <Manifesto />
        <Team />
        <Banner />
        <FAQ />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}
