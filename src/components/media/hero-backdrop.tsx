"use client"

import { type ReactNode } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { getBackdropUrl } from "@/lib/utils/media"
import { cn } from "@/lib/utils"

type HeroBackdropProps = {
  readonly backdropPath: string | null
  readonly alt: string
  readonly children: ReactNode
  readonly className?: string
  readonly priority?: boolean
}

export function HeroBackdrop({
  backdropPath,
  alt,
  children,
  className,
  priority = false,
}: HeroBackdropProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.3])

  const backdropUrl = getBackdropUrl(backdropPath, "lg")

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full overflow-hidden",
        className
      )}
    >
      {/* Backdrop image with parallax */}
      {backdropUrl ? (
        <motion.div
          style={{ y, opacity }}
          className="absolute inset-0"
        >
          <Image
            src={backdropUrl}
            alt={alt}
            fill
            priority={priority}
            sizes="100vw"
            className="object-cover object-top"
          />
        </motion.div>
      ) : (
        <div className="absolute inset-0 bg-surface" />
      )}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
