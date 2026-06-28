import { useEffect, useState } from "react";
import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion";
import { Sparkles, ArrowUpRight } from "lucide-react";
import { getIcon } from "@/lib/icons";
import { getSections, getFeatures, getTeamMembers, getTimelineEvents, getSiteConfig, getFooterTree, type Section, type Feature, type TeamMember, type TimelineEvent, type SiteConfig, type FooterSection } from "@/lib/content";
import { ACCOUNTS_URL } from "@/lib/config";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUp}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Mark() {
  return (
    <motion.span
      whileHover={{ rotate: -8, scale: 1.08 }}
      className="grid h-8 w-8 place-items-center rounded-lg bg-primary"
    >
      <img src="/logo.png" alt="" className="h-6 w-6 object-contain brightness-0 invert" />
    </motion.span>
  );
}

export default function About() {
  const { scrollY } = useScroll();
  const gradY = useTransform(scrollY, [0, 600], [0, 120]);
  const gradX = useTransform(scrollY, [0, 600], [50, 55]);

  const [sections, setSections] = useState<Section[]>([]);
  const [values, setValues] = useState<Feature[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [footerSections, setFooterSections] = useState<FooterSection[]>([]);

  useEffect(() => {
    getSections("about").then(setSections);
    getTeamMembers().then(setTeam);
    getTimelineEvents().then(setTimeline);
    getSiteConfig().then(setConfig);
    getFooterTree().then(setFooterSections);
  }, []);

  useEffect(() => {
    const valuesSec = sections.find((s) => s.type === "values");
    if (valuesSec) getFeatures(valuesSec.id).then(setValues);
  }, [sections]);

  const heroSec = sections.find((s) => s.type === "hero");
  const storySec = sections.find((s) => s.type === "story");
  const statsSec = sections.find((s) => s.type === "stats");
  const ctaSec = sections.find((s) => s.type === "cta");

  const siteName = config?.site_name || "tirbeo";
  const tagline = config?.tagline || "Connect. Create. Collaborate. A modern workspace for the communities you care about.";

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-clip">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="/" className="flex items-center gap-2">
            <Mark />
            <span className="font-display text-lg font-semibold tracking-tight">{siteName}</span>
          </a>
          <div className="flex items-center gap-6 text-sm">
            <a href="/" className="text-ink-soft hover:text-foreground transition-colors">Home</a>
            <a href="/about" className="text-foreground font-medium">About</a>
            <a href="#" className="text-ink-soft hover:text-foreground transition-colors">Blog</a>
            <a href="#" className="text-ink-soft hover:text-foreground transition-colors">Contact</a>
            <a href={`${ACCOUNTS_URL}/signup`} className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lift transition-transform hover:-translate-y-0.5">
              Join Tirbeo <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </nav>

      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-60"
        style={{
          background: useMotionTemplate`radial-gradient(80% 50% at ${gradX}% ${gradY}px, oklch(0.06 0 0 / 0.6), transparent 60%)`,
        }}
      />

      <div className="relative z-10">
        <section className="relative overflow-hidden pt-36 pb-24">
          <motion.div
            aria-hidden
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="pointer-events-none absolute inset-x-0 top-0 h-[120%] opacity-30"
          >
            <div className="h-full bg-[radial-gradient(ellipse_at_center,_var(--clay)_0%,_transparent_60%)]" />
          </motion.div>
          <div className="relative mx-auto max-w-7xl px-6 pt-10">
            <Reveal>
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-ink-soft"
              >
                <Sparkles className="h-3.5 w-3.5 text-[var(--clay)]" />
                {heroSec?.metadata?.badge as string || "Our story"}
              </motion.span>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="mt-8 font-display text-[clamp(3rem,8vw,6rem)] font-medium leading-[1.02] tracking-tight max-w-4xl">
                {heroSec?.title || "A warmer place to"}
                <br />
                <span className="italic text-ink-soft">{heroSec?.subtitle || "build together."}</span>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
                {heroSec?.body || "Tirbeo was born from a simple belief: the tools we use shape how we relate. Most community platforms optimise for engagement at the cost of depth. We optimise for meaning."}
              </p>
            </Reveal>
          </div>
        </section>

        <section className="border-y border-border bg-card/40 py-28">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
              <Reveal>
                <p className="text-xs uppercase tracking-[0.22em] text-ink-soft">{storySec?.metadata?.label as string || "Origin"}</p>
                <h2 className="mt-4 font-display text-4xl font-medium tracking-tight sm:text-5xl">
                  {storySec?.title || "From a frustration"}
                  {storySec?.subtitle ? <><br /><span className="italic text-[var(--clay)]">{storySec.subtitle}</span></> : <><br /><span className="italic text-[var(--clay)]">to a mission.</span></>}
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="space-y-5 text-base leading-relaxed text-ink-soft">
                  {(storySec?.body || "").split("\n").filter(Boolean).map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                  {!storySec?.body && (
                    <>
                      <p>In 2023, our founders were running a design community across three different platforms — chat in one app, projects in another, knowledge scattered across a wiki that nobody updated. The experience was fragmented, noisy, and exhausting.</p>
                      <p>We realised the problem wasn't us — it was the tools. Every platform was built for engagement metrics, not for the people using them. So we decided to build our own.</p>
                      <p>Tirbeo (from the old word for "tribe" and "being") is our answer: one calm, considered workspace where communities can learn, build and grow together without the noise getting in the way.</p>
                    </>
                  )}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="py-28">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {((statsSec?.metadata?.stats as Array<{ number: string; label: string }>) || [
                { number: "1,200+", label: "Communities" },
                { number: "80,000+", label: "Members" },
                { number: "4.9★", label: "Average rating" },
                { number: "99.9%", label: "Uptime" },
              ]).map((stat, i) => (
                <Reveal key={stat.label} delay={i * 0.08}>
                  <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-soft">
                    <div className="font-display text-4xl font-medium tracking-tight text-foreground">{stat.number}</div>
                    <div className="mt-2 text-xs uppercase tracking-[0.16em] text-ink-soft">{stat.label}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-card/30 py-28">
          <div className="mx-auto max-w-7xl px-6">
            <Reveal className="text-center">
              <p className="text-xs uppercase tracking-[0.22em] text-ink-soft">{sections.find((s) => s.type === "values")?.metadata?.label as string || "What we believe"}</p>
              <h2 className="mt-4 font-display text-4xl font-medium tracking-tight sm:text-5xl">
                {sections.find((s) => s.type === "values")?.title || "Principles that"} <span className="italic text-ink-soft">{sections.find((s) => s.type === "values")?.subtitle || "guide every decision."}</span>
              </h2>
            </Reveal>
            <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {values.map((v, i) => {
                const Icon = getIcon(v.icon);
                return (
                  <Reveal key={v.id} delay={i * 0.06}>
                    <motion.div
                      whileHover={{ y: -6 }}
                      transition={{ type: "spring", stiffness: 220, damping: 18 }}
                      className="group relative flex h-full flex-col rounded-2xl border border-border bg-card p-7 shadow-soft hover:shadow-lift"
                    >
                      <span className="grid h-11 w-11 place-items-center rounded-xl bg-muted text-foreground transition-colors group-hover:bg-[var(--clay)] group-hover:text-background">
                        <Icon className="h-5 w-5" strokeWidth={1.6} />
                      </span>
                      <h3 className="mt-6 font-display text-2xl font-medium tracking-tight">{v.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{v.description}</p>
                    </motion.div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-28">
          <div className="mx-auto max-w-5xl px-6">
            <Reveal className="text-center">
              <p className="text-xs uppercase tracking-[0.22em] text-ink-soft">Timeline</p>
              <h2 className="mt-4 font-display text-4xl font-medium tracking-tight sm:text-5xl">
                The road <span className="italic text-ink-soft">so far.</span>
              </h2>
            </Reveal>
            <div className="mt-16 relative">
              <div className="absolute left-[17px] top-2 bottom-2 w-px bg-border" />
              <div className="space-y-10">
                {(timeline.length ? timeline : [
                  { id: "1", year: "2023", event: "The idea — a calmer workspace for communities.", description: null, sort_order: 0 },
                  { id: "2", year: "2024 Q1", event: "First prototype with chat, wikis and projects.", description: null, sort_order: 1 },
                  { id: "3", year: "2024 Q3", event: "Private beta with 12 communities.", description: null, sort_order: 2 },
                  { id: "4", year: "2025 Q1", event: "Public launch. 400+ communities join.", description: null, sort_order: 3 },
                  { id: "5", year: "2025 Q3", event: "Events, leaderboards and API released.", description: null, sort_order: 4 },
                  { id: "6", year: "2026", event: "Tirbeo powers 1,200+ communities worldwide.", description: null, sort_order: 5 },
                ]).map((t, i) => (
                  <Reveal key={t.id} delay={i * 0.08}>
                    <div className="relative flex items-start gap-6 pl-12">
                      <span className="absolute left-0 top-1 grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-[10px] font-mono tracking-wider text-ink-soft">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <span className="font-mono text-xs tracking-widest text-[var(--clay)]">{t.year}</span>
                        <p className="mt-1 font-display text-xl font-medium tracking-tight">{t.event}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-card/40 py-28">
          <div className="mx-auto max-w-7xl px-6">
            <Reveal className="text-center">
              <p className="text-xs uppercase tracking-[0.22em] text-ink-soft">Team</p>
              <h2 className="mt-4 font-display text-4xl font-medium tracking-tight sm:text-5xl">
                Built by a small team
                <br />
                <span className="italic text-ink-soft">with a large ambition.</span>
              </h2>
            </Reveal>
            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {(team.length ? team : [
                { id: "1", name: "Ada Lindqvist", role: "Design & Product", bio: null, avatar_url: null, color: "var(--clay)", social_links: {}, sort_order: 0 },
                { id: "2", name: "Ren Nakamura", role: "Engineering", bio: null, avatar_url: null, color: "var(--moss)", social_links: {}, sort_order: 1 },
                { id: "3", name: "Mira Reyes", role: "Community & Ops", bio: null, avatar_url: null, color: "var(--clay)", social_links: {}, sort_order: 2 },
                { id: "4", name: "Jamie Duval", role: "Infrastructure", bio: null, avatar_url: null, color: "var(--moss)", social_links: {}, sort_order: 3 },
              ]).map((p, i) => (
                <Reveal key={p.id} delay={i * 0.08}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    className="rounded-2xl border border-border bg-card p-7 shadow-soft text-center"
                  >
                    <span
                      className="mx-auto grid h-16 w-16 place-items-center rounded-full font-display text-xl font-semibold text-background"
                      style={{ background: p.color || "var(--clay)" }}
                    >
                      {p.name.split(" ").map((n) => n[0]).join("")}
                    </span>
                    <h3 className="mt-5 font-display text-xl font-medium tracking-tight">{p.name}</h3>
                    <p className="mt-1 text-sm text-ink-soft">{p.role}</p>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-28">
          <Reveal className="mx-auto max-w-5xl">
            <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-12 text-foreground shadow-lift sm:p-16 text-center">
              <motion.div
                aria-hidden
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute -right-24 -top-24 h-80 w-80 rounded-full opacity-20 blur-3xl"
                style={{ background: "conic-gradient(from 0deg, var(--clay), var(--moss), var(--clay))" }}
              />
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-ink-soft">
                {ctaSec?.metadata?.label as string || "Join the movement"}
              </p>
              <h2 className="mt-4 max-w-2xl mx-auto font-display text-4xl font-medium leading-tight tracking-tight sm:text-6xl">
                {ctaSec?.title || "Ready to build a warmer community?"}
              </h2>
              <div className="mt-10 flex flex-wrap justify-center gap-3">
                <a
                  href={`${ACCOUNTS_URL}/signup`}
                  className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground shadow-lift transition-transform hover:-translate-y-0.5"
                >
                  {ctaSec?.metadata?.cta_label as string || "Get started free"}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-medium text-ink-soft transition-colors hover:bg-muted"
                >
                  {ctaSec?.metadata?.cta_secondary as string || "Talk to the team"}
                </a>
              </div>
            </div>
          </Reveal>
        </section>

        <footer className="border-t border-border bg-muted/40 px-6 py-14">
          <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-5">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2">
                <Mark />
                <span className="font-display text-lg font-semibold tracking-tight">{siteName}</span>
              </div>
              <p className="mt-4 max-w-xs text-sm text-ink-soft">{tagline}</p>
            </div>
            {footerSections.map((s) => (
              <div key={s.id}>
                <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">{s.title}</h4>
                <ul className="mt-4 space-y-2 text-sm">
                  {s.links.map((link) => (
                    <li key={link.id}>
                      <a href={link.href} className="hover:text-[var(--clay)]">{link.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mx-auto mt-12 flex max-w-7xl flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-ink-soft sm:flex-row sm:items-center">
            <span>&copy; 2026 {siteName}. All rights reserved.</span>
            <span className="font-mono">{config?.seo_title || siteName}</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
