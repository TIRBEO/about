import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import ChromaGrid from "@/components/ChromaGrid"
import { getTeamMembers, getSections, type TeamMember, type Section } from "@/lib/content"

const defaultGradients = [
  "linear-gradient(145deg, #4F46E5, #000)",
  "linear-gradient(210deg, #10B981, #000)",
  "linear-gradient(165deg, #F59E0B, #000)",
  "linear-gradient(195deg, #EF4444, #000)",
  "linear-gradient(225deg, #8B5CF6, #000)",
  "linear-gradient(135deg, #06B6D4, #000)",
]

const defaultColors = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"]

export function Team() {
  const [section, setSection] = useState<Section | null>(null)
  const [members, setMembers] = useState<TeamMember[]>([])

  useEffect(() => {
    getSections("about").then((sections) => {
      setSection(sections.find((s) => s.type === "team") || null)
    })
    getTeamMembers().then(setMembers)
  }, [])

  const badge = (section?.metadata?.badge as string) || "Team"
  const title = section?.title || "Meet the Team"
  const body = section?.body || "The people building Tirbeo \u2014 a distributed team of engineers, designers, and builders."

  const items = members.map((m, i) => ({
    image: m.avatar_url || `https://i.pravatar.cc/300?img=${(i * 7 + 8) % 70}`,
    title: m.name,
    subtitle: m.role || "Team Member",
    handle: (m.social_links?.github as string) || "",
    borderColor: m.color || defaultColors[i % defaultColors.length],
    gradient: defaultGradients[i % defaultGradients.length],
    url: (m.social_links?.github as string) || (m.social_links?.linkedin as string) || "",
  }))

  if (!members.length) return null

  return (
    <section id="team" className="bg-black py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.3em] text-[#F59E0B]">{badge}</span>
          <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-white md:text-5xl">
            {title}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/50">
            {body}
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{ height: "650px", position: "relative" }}
      >
        <ChromaGrid
          items={items}
          radius={300}
          damping={0.45}
          fadeOut={0.6}
          ease="power3.out"
        />
      </motion.div>
    </section>
  )
}
