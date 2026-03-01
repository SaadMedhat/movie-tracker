"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { gentleSpring } from "@/lib/motion"
import { cn } from "@/lib/utils"

type RatingStarsProps = {
  readonly rating: number | null
  readonly onRate: (rating: number) => void
  readonly size?: "sm" | "md" | "lg"
  readonly isReadOnly?: boolean
  readonly className?: string
}

const SIZE_MAP = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
} as const

const STAR_COUNT = 5

export function RatingStars({
  rating,
  onRate,
  size = "md",
  isReadOnly = false,
  className,
}: RatingStarsProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null)

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, star: number): void => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        onRate(star)
        return
      }
      if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        e.preventDefault()
        const next = Math.min(star + 1, STAR_COUNT)
        onRate(next)
        const nextButton = (e.currentTarget as HTMLElement).nextElementSibling as HTMLElement | null
        nextButton?.focus()
        return
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        e.preventDefault()
        const prev = Math.max(star - 1, 1)
        onRate(prev)
        const prevButton = (e.currentTarget as HTMLElement).previousElementSibling as HTMLElement | null
        prevButton?.focus()
      }
    },
    [onRate]
  )

  const displayRating = hoverRating ?? rating ?? 0

  return (
    <div
      className={cn("flex items-center gap-0.5", className)}
      role="radiogroup"
      aria-label="Rating"
    >
      {Array.from({ length: STAR_COUNT }, (_, i) => {
        const starValue = i + 1
        const isFilled = starValue <= displayRating
        const isCurrentRating = starValue === rating

        return (
          <button
            key={starValue}
            type="button"
            disabled={isReadOnly}
            onClick={() => onRate(starValue)}
            onMouseEnter={() => {
              if (!isReadOnly) setHoverRating(starValue)
            }}
            onMouseLeave={() => setHoverRating(null)}
            onKeyDown={(e) => handleKeyDown(e, starValue)}
            role="radio"
            aria-checked={isCurrentRating}
            aria-label={`${starValue} star${starValue > 1 ? "s" : ""}`}
            className={cn(
              "relative transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background rounded-sm",
              !isReadOnly && "cursor-pointer hover:scale-110"
            )}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isFilled ? "filled" : "empty"}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={gentleSpring}
              >
                {isFilled ? (
                  <StarFilledIcon
                    className={cn(SIZE_MAP[size], "text-cinema-amber")}
                  />
                ) : (
                  <StarEmptyIcon
                    className={cn(
                      SIZE_MAP[size],
                      "text-text-ghost"
                    )}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </button>
        )
      })}
    </div>
  )
}

type IconProps = { readonly className?: string }

function StarFilledIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

function StarEmptyIcon({ className }: IconProps) {
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
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}
