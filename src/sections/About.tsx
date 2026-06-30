import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { getSections, type Section } from "@/lib/content"

export function About() {
  const [section, setSection] = useState<Section | null>(null)

  useEffect(() => {
    getSections("about").then((sections) => {
      setSection(sections.find((s) => s.type === "about") || null)
    })
  }, [])

  const badge = (section?.metadata?.badge as string) || "About"
  const title = section?.title || "What is Tirbeo?"
  const bodyRaw = section?.body || ""
  const paragraphs = bodyRaw.split("\n\n").filter(Boolean)
  const company = (section?.metadata?.company as Record<string, string>) || {}

  return (
    <section id="about" className="bg-black py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.3em] text-[#F59E0B]">{badge}</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-4 text-center font-display text-4xl font-semibold tracking-tight text-white md:text-5xl"
        >
          {title}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-3xl space-y-5 text-[15px] leading-relaxed text-white/60 text-center"
        >
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </motion.div>

        {company.name && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mx-auto mt-16 max-w-lg"
          >
            <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent p-8 text-center">
              <div className="font-display text-3xl font-semibold tracking-tight text-white">{company.name}</div>
              {company.tagline && <p className="mt-2 text-sm text-white/40">{company.tagline}</p>}
              <div className="mt-6 space-y-4">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-white/30 mb-1">Industry</div>
                  <div className="text-sm font-medium text-white">{company.industry || "SaaS / Collaboration Software"}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-white/30 mb-1">Mission</div>
                  <div className="text-sm text-white/70 leading-relaxed">{company.mission || "Empower communities to learn, build, and grow together"}</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
