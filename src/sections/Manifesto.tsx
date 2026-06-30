import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { getSections, getTimelineEvents, type Section, type TimelineEvent } from "@/lib/content"

export function Manifesto() {
  const [section, setSection] = useState<Section | null>(null)
  const [events, setEvents] = useState<TimelineEvent[]>([])

  useEffect(() => {
    getSections("about").then((sections) => {
      setSection(sections.find((s) => s.type === "manifesto") || null)
    })
    getTimelineEvents().then(setEvents)
  }, [])

  const badge = (section?.metadata?.badge as string) || "The Spirit of Tirbeo"
  const blockquote = section?.body || "We didn't set out to build just another chat app. We set out to give communities a home."
  const sideHeading = (section?.metadata?.side_heading as string) || "Why we built it"
  const sideBody = (section?.metadata?.side_body as string[]) || []

  return (
    <section id="manifesto" className="bg-black py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-4xl mx-auto"
        >
          <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.3em] text-[#F59E0B] mb-6">
            {badge}
          </span>
          <blockquote className="text-2xl md:text-4xl lg:text-5xl font-display font-semibold tracking-tight text-white leading-[1.15]">
            &ldquo;{blockquote}&rdquo;
          </blockquote>
        </motion.div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <h3 className="text-2xl md:text-3xl font-display font-semibold tracking-tight text-white mb-6">
              {sideHeading}
            </h3>
            <div className="space-y-4 text-[15px] leading-relaxed text-white/50">
              {sideBody.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8"
          >
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
            {events.map((ev, i) => (
              <div key={ev.id || ev.year} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <div className={`w-2.5 h-2.5 rounded-full border ${i === events.length - 1 ? "bg-[#F59E0B] border-[#F59E0B]" : "border-white/20"}`} />
                  {i < events.length - 1 && <div className="w-px flex-1 bg-white/[0.06] mt-2" />}
                </div>
                <div className="pb-8">
                  <span className={`text-xs font-mono font-semibold ${i === events.length - 1 ? "text-[#F59E0B]" : "text-white/30"}`}>
                    {ev.year}
                  </span>
                  <p className="text-sm text-white/60 mt-1 leading-relaxed">{ev.event}</p>
                </div>
              </div>
            ))}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
