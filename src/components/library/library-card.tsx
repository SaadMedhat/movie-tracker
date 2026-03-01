"use client"

import { useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { type LibraryEntry, type MediaStatus } from "@/types/library"
import { useLibraryStore } from "@/lib/stores/library-store"
import { RatingStars } from "./rating-stars"
import { getPosterUrl } from "@/lib/utils/media"
import { formatShortDate } from "@/lib/utils/date"
import { staggerItem } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { useT } from "@/lib/i18n/translations"

type LibraryCardProps = {
  readonly entry: LibraryEntry
}

export function LibraryCard({ entry }: LibraryCardProps) {
  const t = useT()

  const STATUS_OPTIONS: ReadonlyArray<{
    readonly value: MediaStatus
    readonly label: string
  }> = [
    { value: "watchlist", label: t.library.watchlist },
    { value: "watching", label: t.library.watching },
    { value: "watched", label: t.library.watched },
  ]
  const updateStatus = useLibraryStore((s) => s.updateStatus)
  const setRating = useLibraryStore((s) => s.setRating)
  const removeFromLibrary = useLibraryStore((s) => s.removeFromLibrary)

  const posterUrl = getPosterUrl(entry.posterPath, "md")
  const href = `/${entry.mediaType}/${entry.id}`

  const handleStatusChange = useCallback(
    (status: MediaStatus): void => {
      updateStatus(entry.id, entry.mediaType, status)
    },
    [entry.id, entry.mediaType, updateStatus]
  )

  const handleRate = useCallback(
    (rating: number): void => {
      setRating(entry.id, entry.mediaType, rating)
    },
    [entry.id, entry.mediaType, setRating]
  )

  const handleRemove = useCallback((): void => {
    removeFromLibrary(entry.id, entry.mediaType)
  }, [entry.id, entry.mediaType, removeFromLibrary])

  return (
    <motion.div
      variants={staggerItem}
      layout
      layoutId={`library-${entry.mediaType}-${entry.id}`}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className="group relative"
    >
      {/* Poster link */}
      <Link href={href} className="block">
        <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-surface">
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={entry.title}
              fill
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 180px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-surface-elevated">
              <FilmIcon className="h-8 w-8 text-text-ghost" />
            </div>
          )}

          {/* Media type badge */}
          <div className="absolute left-2 top-2">
            <span className="rounded bg-background/80 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-text-secondary backdrop-blur-sm">
              {entry.mediaType === "movie" ? t.library.film : t.library.series}
            </span>
          </div>
        </div>
      </Link>

      {/* Info below poster */}
      <div className="mt-2 space-y-1.5">
        <Link href={href}>
          <p className="text-sm font-medium leading-tight text-foreground line-clamp-1 hover:text-cinema-amber transition-colors">
            {entry.title}
          </p>
        </Link>

        {/* Rating */}
        <RatingStars rating={entry.rating} onRate={handleRate} size="sm" />

        {/* Added date */}
        <p className="text-[11px] text-text-ghost">
          {t.library.added} {formatShortDate(entry.addedAt)}
        </p>

        {/* Status + Remove */}
        <div className="flex items-center gap-1.5">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleStatusChange(opt.value)}
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                entry.status === opt.value
                  ? "bg-cinema-amber/15 text-cinema-amber"
                  : "bg-surface-elevated text-text-ghost hover:text-text-secondary"
              )}
            >
              {opt.label}
            </button>
          ))}
          <button
            type="button"
            onClick={handleRemove}
            className="ml-auto rounded-full p-1 text-text-ghost transition-colors hover:text-destructive focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            aria-label={`Remove ${entry.title}`}
          >
            <TrashIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

type IconProps = { readonly className?: string }

function FilmIcon({ className }: IconProps) {
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
      <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
      <line x1="7" y1="2" x2="7" y2="22" />
      <line x1="17" y1="2" x2="17" y2="22" />
      <line x1="2" y1="12" x2="22" y2="12" />
    </svg>
  )
}

function TrashIcon({ className }: IconProps) {
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
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
  )
}
