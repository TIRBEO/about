import { useEffect, useState } from "react"
import { getFooterTree, getSiteConfig, type FooterSection, type SiteConfig } from "@/lib/content"

export function Footer() {
  const [config, setConfig] = useState<SiteConfig | null>(null)
  const [footerSections, setFooterSections] = useState<FooterSection[]>([])

  useEffect(() => {
    getSiteConfig().then(setConfig)
    getFooterTree().then(setFooterSections)
  }, [])

  const siteName = config?.site_name || "Tirbeo"
  const tagline = config?.tagline || "Building tools that help communities learn, collaborate, and build together."

  return (
    <footer className="border-t border-white/[0.06] bg-black">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <span className="text-lg font-semibold tracking-tight text-white">{siteName}</span>
            <p className="text-sm leading-relaxed text-white/40 max-w-xs">{tagline}</p>
          </div>
          {footerSections.map((s) => (
            <div key={s.id} className="space-y-3">
              <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/30">{s.title}</span>
              <div className="flex flex-col gap-2">
                {s.links?.map((link) => (
                  <a
                    key={link.id || link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white/50 hover:text-white/80 transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-white/[0.06] text-center">
          <p className="text-xs text-white/30">&copy; {new Date().getFullYear()} {siteName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
