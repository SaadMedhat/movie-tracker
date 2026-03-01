"use client"

import { useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { scaleSpring } from "@/lib/motion"
import { useLibraryStore } from "@/lib/stores/library-store"
import { useHydration } from "@/hooks/use-hydration"
import { type MediaType } from "@/types/library"
import { cn } from "@/lib/utils"

type WatchlistToggleProps = {
  readonly id: number
  readonly mediaType: MediaType
  readonly title: string
  readonly posterPath: string | null
  readonly size?: "sm" | "md" | "lg"
  readonly className?: string
}

const SIZE_MAP = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
} as const

const ICON_SIZE_MAP = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
} as const

export function WatchlistToggle({
  id,
  mediaType,
  title,
  posterPath,
  size = "md",
  className,
}: WatchlistToggleProps) {
  const isHydrated = useHydration()
  const isInLibrary = useLibraryStore((s) => s.isInLibrary(id, mediaType))
  const addToLibrary = useLibraryStore((s) => s.addToLibrary)
  const removeFromLibrary = useLibraryStore((s) => s.removeFromLibrary)

  const handleToggle = useCallback((): void => {
    if (isInLibrary) {
      removeFromLibrary(id, mediaType)
      return
    }
    addToLibrary({ id, mediaType, title, posterPath, status: "watchlist" })
  }, [isInLibrary, id, mediaType, title, posterPath, addToLibrary, removeFromLibrary])

  if (!isHydrated) {
    return (
      <div
        className={cn(
          "rounded-full bg-surface-elevated",
          SIZE_MAP[size],
          className
        )}
      />
    )
  }

  return (
    <motion.button
      type="button"
      onClick={handleToggle}
      whileTap={{ scale: 0.9 }}
      className={cn(
        "flex items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isInLibrary
          ? "bg-cinema-amber text-cinema-amber-foreground"
          : "bg-surface-elevated text-text-secondary hover:text-foreground",
        SIZE_MAP[size],
        className
      )}
      aria-label={
        isInLibrary ? `Remove ${title} from watchlist` : `Add ${title} to watchlist`
      }
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={isInLibrary ? "added" : "not-added"}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={scaleSpring}
        >
          {isInLibrary ? (
            <BookmarkFilledIcon className={ICON_SIZE_MAP[size]} />
          ) : (
            <BookmarkIcon className={ICON_SIZE_MAP[size]} />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  )
}

type IconProps = { readonly className?: string }

function BookmarkIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
    </svg>
  )
}

function BookmarkFilledIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
    </svg>
  )
}
