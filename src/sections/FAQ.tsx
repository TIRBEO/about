"use client"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { getFAQs, getSections, type Section, type FAQ as FAQType } from "@/lib/content"

export function FAQ() {
  const [section, setSection] = useState<Section | null>(null)
  const [faqs, setFaqs] = useState<FAQType[]>([])
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  useEffect(() => {
    getSections("about").then((sections) => {
      setSection(sections.find((s) => s.type === "faq") || null)
    })
    getFAQs().then(setFaqs)
  }, [])

  const badge = (section?.metadata?.badge as string) || "FAQ"
  const title = section?.title || "Frequently Asked Questions"
  const body = section?.body || "Everything you need to know about Tirbeo, our mission, and how we help communities build together."

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i)

  return (
    <section id="faq" className="bg-black py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.3em] text-[#F59E0B]">
            {badge}
          </span>
          <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-white md:text-5xl">
            {title}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/50">
            {body}
          </p>
        </motion.div>

        <div className="mt-14 space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i
            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="rounded-2xl border border-white/[0.06] bg-black overflow-hidden transition-colors duration-300 hover:border-white/[0.12]"
              >
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors duration-200 hover:bg-white/[0.02]"
                >
                  <span className="text-base font-medium text-white/80 group-hover:text-white">
                    {faq.question}
                  </span>
                  <motion.svg
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="w-5 h-5 flex-shrink-0 text-white/30"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div
                        className="border-t border-white/[0.06] px-6 py-5 text-sm leading-relaxed text-white/50 [&_strong]:text-white/70"
                        dangerouslySetInnerHTML={{ __html: faq.answer }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
