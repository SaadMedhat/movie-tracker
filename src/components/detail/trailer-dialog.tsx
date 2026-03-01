"use client"

import { useState, useCallback } from "react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { type VideoResults } from "@/types/movie"
import { getTrailerKey } from "@/lib/utils/media"

type TrailerDialogProps = {
  readonly videos: VideoResults
  readonly title: string
}

export function TrailerDialog({ videos, title }: TrailerDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const trailerKey = getTrailerKey(videos.results)

  const handleOpen = useCallback((): void => {
    setIsOpen(true)
  }, [])

  if (!trailerKey) return null

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-surface-elevated px-5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <PlayIcon className="h-4 w-4" />
        Watch Trailer
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl border-border bg-background p-0 overflow-hidden">
          <DialogTitle className="sr-only">{title} — Trailer</DialogTitle>
          <div className="relative aspect-video w-full">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1&rel=0`}
              title={`${title} — Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

function PlayIcon({ className }: { readonly className?: string }) {
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
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  )
}
