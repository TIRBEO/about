import { motion } from "framer-motion"
import FlowingMenu from "@/components/FlowingMenu"

export function Products() {
  return (
    <section id="products" className="bg-black min-h-dvh flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="text-center pt-10 pb-2 md:pt-14 md:pb-2"
      >
        <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.3em] text-[#F59E0B]">Product</span>
        <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight text-white md:text-5xl">
          Tirbeo Chat
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-base leading-relaxed text-white/50">
          Real-time chat platform designed for professional communities.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex-1"
        style={{ position: "relative" }}
      >
        <FlowingMenu
          items={[{ link: "https://tirbeo.com/chat", text: "Tirbeo Chat", image: "https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=600&q=80" }]}
          textColor="#ffffff"
          bgColor="#000000"
          marqueeBgColor="#F59E0B"
          marqueeTextColor="#000000"
          borderColor="rgba(255,255,255,0.1)"
          speed={12}
        />
      </motion.div>
    </section>
  )
}
