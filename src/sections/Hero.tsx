import { useEffect, useRef, useState, useCallback } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import gsap from "gsap";
import { getSections, type Section } from "@/lib/content";
import { VideoText } from "@/components/VideoText";

function isTouchDevice() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function Hero() {
  const [section, setSection] = useState<Section | null>(null);
  const [videoReady, setVideoReady] = useState(false);
  const containerRef = useRef<HTMLElement>(null);
  const videoBgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const charsRef = useRef<HTMLSpanElement[]>([]);
  const dividerRef = useRef<HTMLDivElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getSections("about").then((sections) => {
      setSection(sections.find((s) => s.type === "hero") || null);
    });
  }, []);

  const raw = (section?.metadata?.badge as string) || "Welcome to Tirbeo";
  const label = raw.replace(/\bTirbeo\b/gi, "").trim() || "Welcome to";
  const videoSrc = (section?.metadata?.video_src as string) || "https://cdn.pixabay.com/video/2024/05/25/213616_large.mp4";
  const videoText = (section?.metadata?.video_text as string) || "Tirbeo";
  const ctaHref = (section?.metadata?.cta_href as string) || "#products";

  const setCharRef = useCallback(
    (el: HTMLSpanElement | null, idx: number) => {
      if (el) charsRef.current[idx] = el;
    },
    [],
  );

  useEffect(() => {
    const chars = charsRef.current.filter(Boolean);
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set([contentRef.current, scrollRef.current, dividerRef.current, paraRef.current, buttonsRef.current], {
          opacity: 1,
          clipPath: "inset(0 0 0% 0)",
          y: 0,
          scale: 1,
          filter: "blur(0px)",
        });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.set(contentRef.current, { opacity: 1 })
        .fromTo(
          videoBgRef.current,
          { scale: 0.9, filter: "blur(14px)" },
          { scale: 1, filter: "blur(0px)", duration: 2.5 },
        )
        .fromTo(
          chars,
          { y: 60, opacity: 0, rotateX: -85, filter: "blur(10px)" },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            filter: "blur(0px)",
            duration: 1.1,
            stagger: { each: 0.035, from: "center" },
            ease: "back.out(1.7)",
          },
          "-=0.8",
        )
        .fromTo(
          dividerRef.current,
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 0.9, ease: "power3.inOut" },
          "-=0.2",
        )
        .fromTo(
          paraRef.current,
          { clipPath: "inset(0 0 100% 0)", y: 24, opacity: 0 },
          {
            clipPath: "inset(0 0 0% 0)",
            y: 0,
            opacity: 1,
            duration: 1.1,
            ease: "power3.inOut",
          },
          "-=0.5",
        )
        .fromTo(
          buttonsRef.current,
          { scale: 0.85, opacity: 0, y: 20 },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "back.out(1.7)",
          },
          "-=0.5",
        )
        .fromTo(
          scrollRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.3",
        )
        .to(contentRef.current, {
          y: -3,
          duration: 3,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const el = videoBgRef.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.to(el, {
        scale: 1.08,
        duration: 12,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    }, el);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const wrap = parallaxRef.current;
    if (!wrap || isTouchDevice() || prefersReducedMotion()) return;

    const setX = gsap.quickSetter(wrap, "x", "px");
    const setY = gsap.quickSetter(wrap, "y", "px");

    const handleMouse = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      setX((clientX / innerWidth - 0.5) * 20);
      setY((clientY / innerHeight - 0.5) * 12);
    };

    window.addEventListener("mousemove", handleMouse, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  useEffect(() => {
    const wrapper = buttonsRef.current;
    if (!wrapper || isTouchDevice() || prefersReducedMotion()) return;

    const btns = wrapper.querySelectorAll<HTMLAnchorElement>("a");
    if (!btns.length) return;

    const onMove = (e: MouseEvent, btn: HTMLAnchorElement) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, {
        x: x * 0.15,
        y: y * 0.15,
        duration: 0.6,
        ease: "power2.out",
      });
    };
    const onLeave = (btn: HTMLAnchorElement) => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: "power2.out" });
    };

    const handlers = Array.from(btns).map((btn) => ({
      move: (e: MouseEvent) => onMove(e, btn),
      leave: () => onLeave(btn),
    }));

    btns.forEach((btn, i) => {
      btn.addEventListener("mousemove", handlers[i].move, { passive: true });
      btn.addEventListener("mouseleave", handlers[i].leave);
    });

    return () => {
      btns.forEach((btn, i) => {
        btn.removeEventListener("mousemove", handlers[i].move);
        btn.removeEventListener("mouseleave", handlers[i].leave);
      });
    };
  }, []);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-dvh flex items-center justify-center overflow-hidden bg-[#050505]"
      aria-label="Hero"
    >
      {/* Video background */}
      <div
        ref={videoBgRef}
        className="absolute inset-0 overflow-hidden"
        style={{ willChange: "transform" }}
      >
        <VideoText
          src={videoSrc}
          fontSize={16}
          fontWeight="700"
          fontFamily="Fraunces, serif"
          letterSpacing="0.06em"
          textTransform="uppercase"
          onVideoLoad={() => setVideoReady(true)}
        >
          {videoText}
        </VideoText>
      </div>

      {/* Loading */}
      {!videoReady && (
        <div className="absolute inset-0 z-[2] flex items-center justify-center bg-[#050505] transition-opacity duration-500">
          <div className="h-5 w-5 rounded-full border border-white/20 border-t-white/60 animate-spin md:h-6 md:w-6" />
        </div>
      )}

      {/* Gradient vignette */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, rgba(5,5,5,0.5) 50%, #050505 100%)",
        }}
      />

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 mx-auto w-full max-w-5xl px-5 text-center sm:px-8 md:px-12"
        style={{ opacity: 0 }}
      >
        <div ref={parallaxRef}>
          <h1
            className="flex items-center justify-center gap-x-1 text-[clamp(1.125rem,3.5vw,3rem)] font-bold uppercase tracking-[0.15em] text-white/90 whitespace-nowrap sm:gap-x-1.5 md:gap-x-2 lg:gap-x-3 lg:tracking-[0.2em] font-display"
            style={{ perspective: "900px" }}
          >
            {label.split("").map((char, i) => (
              <span
                key={`${char}-${i}`}
                ref={(el) => setCharRef(el, i)}
                className="inline-block shrink-0"
                style={{
                  textShadow:
                    "0 2px 20px rgba(0,0,0,0.7), 0 4px 40px rgba(0,0,0,0.4)",
                }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h1>

          {/* Divider */}
          <div
            ref={dividerRef}
            className="mx-auto mt-6 h-px w-10 bg-white/15 sm:mt-8 sm:w-12 md:mt-10 md:w-16"
            style={{ transformOrigin: "center" }}
          />

          {/* Paragraph */}
          <p
            ref={paraRef}
            className="mx-auto mt-6 max-w-[460px] text-sm font-light leading-[1.75] tracking-wide text-white/70 sm:mt-8 sm:text-base md:mt-10 md:max-w-[520px] md:leading-[1.85] lg:text-lg"
            style={{ textShadow: "0 2px 30px rgba(0,0,0,0.7)" }}
          >
            {section?.body ||
              "Tirbeo is a technology company that builds innovative digital products across multiple domains. From professional communities to productivity and collaboration platforms, we create solutions that empower people and organizations to connect, work, and grow more effectively."}
          </p>

          {/* Buttons */}
          <div
            ref={buttonsRef}
            className="mt-8 flex flex-wrap justify-center gap-3 sm:mt-10 sm:gap-4 md:mt-12 lg:mt-14"
          >
            <a
              href={ctaHref}
              className="group inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-xs font-semibold text-black transition-all duration-300 hover:bg-white/90 sm:gap-2.5 sm:rounded-2xl sm:px-7 sm:py-3.5 sm:text-sm md:px-8 md:py-4"
              style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}
            >
              {(section?.metadata?.cta_label as string) ||
                "Explore Our Products"}
              <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
            </a>
            <a
              href="#about"
              className="inline-flex items-center gap-2 px-6 py-3 text-xs font-medium text-white/80 transition-all duration-300 hover:text-white sm:px-7 sm:py-3.5 sm:text-sm md:px-8 md:py-4"
            >
              {(section?.metadata?.cta_secondary as string) ||
                "Learn About Us"}
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 opacity-0 sm:bottom-8 md:bottom-10"
      >
        <div className="flex flex-col items-center gap-1.5 sm:gap-2">
          <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-white/25">
            Scroll
          </span>
          <ChevronDown className="h-3 w-3 animate-bounce text-white/25 sm:h-3.5 sm:w-3.5" />
        </div>
      </div>
    </section>
  );
}
