"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { ChevronDown, Menu, X, MessageCircle, Code, Palette, BookOpen, Rocket, Globe, HelpCircle, FileText, RefreshCw, BarChart, Users, Briefcase, Mail } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getSiteConfig } from "@/lib/content";

const iconMap: Record<string, LucideIcon> = {
  chat: MessageCircle,
  code: Code,
  palette: Palette,
  book: BookOpen,
  rocket: Rocket,
  globe: Globe,
  help: HelpCircle,
  file: FileText,
  blog: FileText,
  refresh: RefreshCw,
  changelog: RefreshCw,
  chart: BarChart,
  status: BarChart,
  community: MessageCircle,
  docs: BookOpen,
  story: BookOpen,
  team: Users,
  careers: Briefcase,
  contact: Mail,
};

interface NavLinkItem {
  icon?: string;
  title: string;
  description?: string;
  href: string;
}

interface NavEntry {
  label: string;
  items?: NavLinkItem[];
  href?: string;
  simple?: boolean;
}

function toFullUrl(href: string, base: string): string {
  if (href.startsWith("http://") || href.startsWith("https://")) return href;
  const sep = base.endsWith("/") ? "" : "/";
  return `${base}${sep}${href.replace(/^\//, "")}`;
}

const docsBase = "https://docs.tirbeo.bishnuneupane13.com.np";

function subHref(sub: string, path = ""): string {
  try {
    const url = new URL(docsBase);
    const parts = url.hostname.split(".");
    if (parts.length >= 3) {
      url.hostname = `${sub}.${parts.slice(1).join(".")}`;
    } else {
      url.hostname = `${sub}.${parts.join(".")}`;
    }
    url.pathname = path;
    return url.toString().replace(/\/$/, "");
  } catch {
    return `${docsBase.replace(/\/$/, "")}${path}`;
  }
}

const fallbackNav: NavEntry[] = [
  {
    label: "Products",
    items: [
      { icon: "chat", title: "Tirbeo Chat", description: "Real-time messaging with channels, threads, voice/video calls", href: `${docsBase}/products/chat` },
    ],
  },
  {
    label: "Solutions",
    items: [
      { icon: "code", title: "For Developers", description: "Open source collaboration, code reviews, hackathons", href: `${docsBase}/solutions/developers` },
      { icon: "palette", title: "For Designers", description: "Feedback rounds, resource sharing, critiques", href: `${docsBase}/solutions/designers` },
      { icon: "book", title: "For Educators", description: "Student communities, cohort management", href: `${docsBase}/solutions/educators` },
      { icon: "rocket", title: "For Startups", description: "Async updates, investor relations, hiring", href: `${docsBase}/solutions/startups` },
      { icon: "globe", title: "For DAOs", description: "Governance discussions, event coordination", href: `${docsBase}/solutions/daos` },
    ],
  },
  {
    label: "Resources",
    items: [
      { icon: "docs", title: "Documentation", description: "Complete guides and references", href: `${docsBase}/docs` },
      { icon: "help", title: "Help Center", description: "FAQs and support articles", href: subHref("help") },
      { icon: "blog", title: "Blog", description: "Product updates and community stories", href: `${docsBase}/blog` },
      { icon: "community", title: "Community", description: "Join our community", href: subHref("chats") },
      { icon: "changelog", title: "Changelog", description: "What's new at Tirbeo", href: `${docsBase}/changelog` },
      { icon: "status", title: "Status", description: "Platform status and uptime", href: `${docsBase}/status` },
    ],
  },
  {
    label: "About",
    items: [
      { icon: "story", title: "Our Story", description: "The Tirbeo journey", href: `${docsBase}/about` },
      { icon: "team", title: "Team", description: "Meet the people behind Tirbeo", href: `${docsBase}/team` },
      { icon: "careers", title: "Careers", description: "Join us and build the future", href: `${docsBase}/careers` },
      { icon: "contact", title: "Contact", description: "Get in touch with us", href: subHref("help", "/contact") },
    ],
  },
];

function NavIcon({ icon }: { icon?: string }) {
  if (!icon) return null;
  const IconComponent = iconMap[icon];
  if (!IconComponent) return null;
  return <IconComponent className="h-5 w-5 text-white/50 group-hover:text-white/90 transition-all duration-250" />;
}

function DropdownMenu({
  label,
  items,
  baseUrl,
  open,
  onOpen,
  onClose,
}: {
  label: string;
  items: NavLinkItem[];
  baseUrl: string;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => onClose(), 200);
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose]);

  useEffect(() => {
    return () => { if (closeTimer.current) clearTimeout(closeTimer.current); };
  }, []);

  const isCompact = items.length <= 2;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); if (open) onClose(); else onOpen(); }}
        onMouseEnter={onOpen}
        onMouseLeave={scheduleClose}
        className={`flex items-center gap-1.5 px-8 py-2 text-sm rounded-xl transition-all duration-250 ${open
          ? "text-white/90 bg-white/5"
          : "text-white/55 hover:text-white/90 hover:bg-white/5"
          }`}
      >
        {label}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-250 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
          className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 ${isCompact ? "w-[380px]" : "w-[600px]"} rounded-3xl border border-white/[0.05] bg-black/70 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.6)] p-2 animate-nav-dropdown`}
        >
          <div className={`grid ${isCompact ? "grid-cols-1" : "grid-cols-2"} gap-1`}>
            {items.map((item, i) => (
              <a
                key={i}
                href={toFullUrl(item.href, baseUrl)}
                className="group relative flex items-start gap-4 rounded-2xl p-4 transition-all duration-250 hover:bg-white/[0.04]"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/[0.05] group-hover:bg-white/[0.08] transition-all duration-250 ring-1 ring-white/[0.04] group-hover:ring-white/[0.08]">
                  <NavIcon icon={item.icon} />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="text-sm font-semibold text-white/85 group-hover:text-white transition-colors duration-250">
                    {item.title}
                  </div>
                  <div className="text-xs text-white/40 leading-relaxed mt-1 group-hover:text-white/60 transition-colors duration-250 max-w-[220px]">
                    {item.description}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AccordionPanel({
  label,
  items,
  baseUrl,
  open,
  onToggle,
}: {
  label: string;
  items: NavLinkItem[];
  baseUrl: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        className={`flex items-center justify-between w-full px-4 py-3.5 text-sm rounded-xl transition-all duration-250 ${open ? "text-white/90 bg-white/5" : "text-white/55 hover:text-white/90 hover:bg-white/5"
          }`}
      >
        {label}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-250 ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? "max-h-[999px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="pl-4 pb-2 flex flex-col gap-0.5 mt-1">
          {items.map((item, i) => {
            const AccIcon = item.icon ? iconMap[item.icon] : null;
            return (
              <a
                key={i}
                href={toFullUrl(item.href, baseUrl)}
                onClick={() => { /* parent handles close */ }}
                className="group flex items-start gap-3.5 px-4 py-3 rounded-2xl transition-all duration-250 hover:bg-white/[0.04]"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] group-hover:bg-white/[0.08] transition-all duration-250 ring-1 ring-white/[0.04]">
                  {AccIcon && <AccIcon className="h-4 w-4 text-white/50 group-hover:text-white/90 transition-colors duration-250" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white/85 group-hover:text-white transition-colors duration-250">
                    {item.title}
                  </div>
                  {item.description && (
                    <div className="text-xs text-white/40 leading-relaxed mt-0.5 group-hover:text-white/60 transition-colors duration-250">
                      {item.description}
                    </div>
                  )}
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [config, setConfig] = useState<{
    siteName: string;
    logoUrl: string;
    siteUrl: string;
    nav: NavEntry[];
  } | null>(null);

  useEffect(() => {
    getSiteConfig().then((data) => {
      if (!data) return;
      setConfig({
        siteName: data.site_name,
        logoUrl: data.logo_url || "/logos.png",
        siteUrl: data.site_url || docsBase,
        nav: (data.nav as NavEntry[] | undefined)?.length ? (data.nav as NavEntry[]) : fallbackNav,
      });
    });
  }, []);

  const baseUrl = config?.siteUrl || docsBase;
  const rawNav = config?.nav || fallbackNav;
  const navLinks = rawNav.filter((item) => item.label !== "Developers" && item.label !== "Platform");
  const siteName = config?.siteName || "Tirbeo";
  const logoUrl = config?.logoUrl || "/logos.png";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setOpenDropdown(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const closeAll = useCallback(() => setOpenDropdown(null), []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
        ? "bg-transparent backdrop-blur-xl shadow-[0_1px_0_rgba(255,255,255,0.06)]"
        : "bg-transparent backdrop-blur-xl"
        }`}
    >
      <div className="mx-auto flex h-16 md:h-18 max-w-7xl items-center justify-between px-6 md:px-8">
        {/* Logo - icon only */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center gap-3 group shrink-0"
          aria-label={siteName}
        >
          <div className="flex h-8 w-8 md:h-9 md:w-9 items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105">
            <img src={logoUrl} alt={siteName} className="h-full w-full object-contain" />
          </div>
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((item) =>
            item.simple || !item.items ? (
              <a
                key={item.label}
                href={toFullUrl(item.href || "", baseUrl)}
                className="px-4 py-2 text-sm rounded-xl text-white/55 hover:text-white/90 hover:bg-white/5 transition-all duration-250"
              >
                {item.label}
              </a>
            ) : (
              <DropdownMenu
                key={item.label}
                label={item.label}
                items={item.items}
                baseUrl={baseUrl}
                open={openDropdown === item.label}
                onOpen={() => setOpenDropdown(item.label)}
                onClose={closeAll}
              />
            ),
          )}
        </nav>

        {/* CTAs */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href={toFullUrl("/getting-started", baseUrl)}
            className="inline-flex items-center rounded-2xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition-all duration-250 hover:bg-white/90 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]"
          >
            Get Started
          </a>
        </div>

        <button
          onClick={() => setMobileOpen((p) => !p)}
          className="lg:hidden flex h-9 w-9 items-center justify-center rounded-xl text-white/55 hover:text-white/90 hover:bg-white/5 transition-all duration-250"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-400 ease-in-out ${mobileOpen ? "max-h-[999px] opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <nav className="border-t border-white/5 bg-background/95 backdrop-blur-xl px-5 py-4 flex flex-col gap-0.5">
          {navLinks.map((item) =>
            item.simple || !item.items ? (
              <a
                key={item.label}
                href={toFullUrl(item.href || "", baseUrl)}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-sm text-white/55 hover:text-white/90 rounded-xl transition-all duration-250 hover:bg-white/5"
              >
                {item.label}
              </a>
            ) : (
              <AccordionPanel
                key={item.label}
                label={item.label}
                items={item.items}
                baseUrl={baseUrl}
                open={openAccordion === item.label}
                onToggle={() => setOpenAccordion(openAccordion === item.label ? null : item.label)}
              />
            ),
          )}

          <div className="flex flex-col gap-2.5 mt-4 pt-4 border-t border-white/5">
            <a
              href={toFullUrl("/getting-started", baseUrl)}
              onClick={() => setMobileOpen(false)}
              className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black transition-all duration-250 hover:bg-white/90"
            >
              Get Started
            </a>
          </div>
        </nav>
      </div>

      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 -z-10 bg-black/40"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
    </header>
  );
}
