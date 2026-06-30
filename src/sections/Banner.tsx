import { useEffect, useState } from "react"
import CurvedLoop from "@/components/CurvedLoop"
import { getSections, type Section } from "@/lib/content"

export function Banner() {
  const [section, setSection] = useState<Section | null>(null)

  useEffect(() => {
    getSections("about").then((sections) => {
      setSection(sections.find((s) => s.type === "banner") || null)
    })
  }, [])

  const text = section?.body || "Tirbeo \u2726 Tirbeo \u2726 Tirbeo \u2726 Tirbeo \u2726"
  const speed = (section?.metadata?.speed as number) || 2

  if (!section) return null

  return (
    <section id="banner" className="bg-black py-6 md:py-8 overflow-hidden">
      <CurvedLoop
        marqueeText={text}
        speed={speed}
        curveAmount={300}
        direction="left"
        interactive
        className="fill-[#F59E0B]/60"
      />
    </section>
  )
}
