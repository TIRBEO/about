"use client"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

interface PointerProps {
  className?: string
  children?: React.ReactNode
}

export function Pointer({ className, children }: PointerProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
      setIsVisible(true)
    }

    const handleScroll = () => {
      setHasScrolled(window.scrollY > 100)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const pointerStyle: React.CSSProperties = {
    position: "fixed",
    left: mousePos.x,
    top: mousePos.y,
    transform: "translate(-50%, -50%)",
    zIndex: 9999,
    pointerEvents: "none",
    opacity: isVisible ? 1 : 0,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    filter: hasScrolled ? "blur(2px) brightness(0.8)" : "none",
  }

  return (
    <motion.div
      style={pointerStyle}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
      className={className}
    >
      {children}
    </motion.div>
  )
}