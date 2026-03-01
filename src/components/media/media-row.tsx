"use client"

import { type ReactNode } from "react"
import { motion } from "framer-motion"
import { fadeInUp, staggerContainer } from "@/lib/motion"
import { cn } from "@/lib/utils"

type MediaRowProps = {
  readonly title: string
  readonly children: ReactNode
  readonly className?: string
  readonly action?: ReactNode
}

export function MediaRow({ title, children, className, action }: MediaRowProps) {
  return (
    <motion.section
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className={cn("space-y-4", className)}
    >
      <div className="flex items-end justify-between px-4 md:px-0">
        <h2 className="font-display text-lg font-semibold tracking-tight text-foreground md:text-xl">
          {title}
        </h2>
        {action ?? null}
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="scrollbar-hide flex gap-3 overflow-x-auto px-4 pb-2 md:px-0"
      >
        {children}
      </motion.div>
    </motion.section>
  )
}
