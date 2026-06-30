import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { getSections, type Section } from "@/lib/content"

export function Contact() {
  const [section, setSection] = useState<Section | null>(null)

  useEffect(() => {
    getSections("about").then((sections) => {
      setSection(sections.find((s) => s.type === "contact") || null)
    })
  }, [])

  const badge = (section?.metadata?.badge as string) || "Subscribe"
  const title = section?.title || "Stay in the loop"
  const body = section?.body || "Join our newsletter to receive product updates, exclusive releases, and early access to upcoming features."
  const placeholder = (section?.metadata?.placeholder as string) || "Enter your email"
  const buttonText = (section?.metadata?.button_text as string) || "Join"
  const disclaimer = (section?.metadata?.disclaimer as string) || "No spam. Unsubscribe anytime."

  return (
    <section id="contact" className="bg-black py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.3em] text-[#F59E0B]">{badge}</span>
          <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-white md:text-5xl">
            {title}
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-white/50">
            {body}
          </p>

          <motion.form
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="relative mx-auto mt-10 max-w-xl"
          >
            <input
              type="email"
              placeholder={placeholder}
              className="h-14 w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] px-5 pr-36 text-sm text-white placeholder:text-white/30 outline-none transition-all duration-300 focus:border-[#F59E0B] focus:bg-white/[0.05] focus:ring-4 focus:ring-[#F59E0B]/10"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 flex h-11 -translate-y-1/2 items-center justify-center rounded-xl bg-[#F59E0B] px-5 text-sm font-semibold text-black transition-all duration-300 hover:bg-[#fbbf24] active:scale-95"
            >
              {buttonText}
            </button>
          </motion.form>

          <p className="mt-4 text-sm text-white/30">{disclaimer}</p>
        </motion.div>
      </div>
    </section>
  )
}
