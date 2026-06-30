"use client";

import { useState, useEffect } from "react";

const sections = ["hero", "about", "manifesto", "team", "faq", "contact"];

export function SectionIndicator() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            const idx = sections.indexOf(id as string);
            if (idx !== -1) setActive(idx);
          }
        }
      },
      { rootMargin: "-40% 0px -40% 0px" }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="fixed right-5 md:right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-3">
      {sections.map((_, i) => (
        <a
          key={i}
          href={`#${sections[i]}`}
          className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
            i === active ? "bg-[#F59E0B] w-2 h-2" : "bg-white/20 hover:bg-white/40"
          }`}
        />
      ))}
      <span className="text-[10px] text-white/30 mt-2 font-mono tracking-wider">
        {String(active + 1).padStart(2, "0")}/{String(sections.length).padStart(2, "0")}
      </span>
    </div>
  );
}
