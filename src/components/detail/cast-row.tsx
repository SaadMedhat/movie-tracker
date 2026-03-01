"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { type CastMember } from "@/types/movie"
import { getProfileUrl } from "@/lib/utils/media"
import { staggerContainer, staggerItem, fadeInUp } from "@/lib/motion"

type CastRowProps = {
  readonly cast: ReadonlyArray<CastMember>
  readonly maxCount?: number
}

const MAX_CAST = 20

export function CastRow({ cast, maxCount = MAX_CAST }: CastRowProps) {
  const visibleCast = cast.slice(0, maxCount)

  if (visibleCast.length === 0) return null

  return (
    <motion.section
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="space-y-4"
    >
      <h2 className="font-display text-lg font-semibold tracking-tight text-foreground md:text-xl">
        Cast
      </h2>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="scrollbar-hide flex gap-4 overflow-x-auto pb-2"
      >
        {visibleCast.map((member) => (
          <CastCard key={member.id} member={member} />
        ))}
      </motion.div>
    </motion.section>
  )
}

function CastCard({ member }: { readonly member: CastMember }) {
  const profileUrl = getProfileUrl(member.profile_path)

  return (
    <motion.div
      variants={staggerItem}
      className="flex w-24 flex-shrink-0 flex-col items-center gap-2 md:w-28"
    >
      <div className="relative h-24 w-24 overflow-hidden rounded-full bg-surface md:h-28 md:w-28">
        {profileUrl ? (
          <Image
            src={profileUrl}
            alt={member.name}
            fill
            sizes="112px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-surface-elevated">
            <PersonIcon className="h-8 w-8 text-text-ghost" />
          </div>
        )}
      </div>
      <div className="w-full text-center">
        <p className="text-xs font-medium text-foreground line-clamp-1">
          {member.name}
        </p>
        <p className="text-xs text-text-tertiary line-clamp-1">
          {member.character}
        </p>
      </div>
    </motion.div>
  )
}

function PersonIcon({ className }: { readonly className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}
