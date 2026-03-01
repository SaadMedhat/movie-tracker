"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { posterHover, staggerItem } from "@/lib/motion"
import { getPosterUrl, formatVoteAverage, getMediaTitle, getMediaDate, getTrailerKey } from "@/lib/utils/media"
import { getYear } from "@/lib/utils/date"
import { cn } from "@/lib/utils"
import { useMediaVideos } from "@/lib/api/queries"
import { MuteToggle } from "@/components/ui/mute-toggle"

// Global: only one mobile preview at a time.
// When a card activates, it sets itself as active;
// all other cards listen and close if they're not the active one.
let activeMobilePreviewId: number | null = null
const mobilePreviewListeners = new Set<(activeId: number | null) => void>()

function setActiveMobilePreview(id: number | null) {
  activeMobilePreviewId = id
  mobilePreviewListeners.forEach((fn) => fn(id))
}

// Suppress unused read — activeMobilePreviewId is read inside setActiveMobilePreview's closure
void activeMobilePreviewId

type PosterCardProps = {
  readonly id: number
  readonly title?: string
  readonly name?: string
  readonly posterPath: string | null
  readonly voteAverage?: number
  readonly releaseDate?: string
  readonly firstAirDate?: string
  readonly mediaType: "movie" | "tv"
  readonly className?: string
}

export function PosterCard({
  id,
  title,
  name,
  posterPath,
  voteAverage,
  releaseDate,
  firstAirDate,
  mediaType,
  className,
}: PosterCardProps) {
  const router = useRouter()
  const displayTitle = getMediaTitle({ title, name })
  const displayDate = getMediaDate({
    release_date: releaseDate,
    first_air_date: firstAirDate,
  })
  const year = getYear(displayDate)
  const posterUrl = getPosterUrl(posterPath, "md")
  const href = `/${mediaType}/${id}`

  const [isHovering, setIsHovering] = useState(false)
  const [iframeReady, setIframeReady] = useState(false)
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const { data: videoData } = useMediaVideos(mediaType, id, isHovering)
  const trailerKey = videoData ? getTrailerKey(videoData.results) : null

  const longPressRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const previewActiveRef = useRef(false)

  // Close this preview if another card becomes active on mobile
  useEffect(() => {
    const listener = (activeId: number | null) => {
      if (activeId !== null && activeId !== id && previewActiveRef.current) {
        previewActiveRef.current = false
        setIsHovering(false)
        setIframeReady(false)
      }
    }
    mobilePreviewListeners.add(listener)
    return () => { mobilePreviewListeners.delete(listener) }
  }, [id])

  // Close preview when card scrolls out of viewport
  useEffect(() => {
    if (!isHovering || !previewActiveRef.current || !cardRef.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry && !entry.isIntersecting && previewActiveRef.current) {
          previewActiveRef.current = false
          setActiveMobilePreview(null)
          setIsHovering(false)
          setIframeReady(false)
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(cardRef.current)
    return () => observer.disconnect()
  }, [isHovering])

  // Desktop hover
  const handleMouseEnter = useCallback(() => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current)
      leaveTimerRef.current = null
    }
    setIsHovering(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    leaveTimerRef.current = setTimeout(() => {
      setIsHovering(false)
      setIframeReady(false)
    }, 100)
  }, [])

  // Mobile long press (500ms) — activates preview; release does NOT close it
  const handleTouchStart = useCallback(() => {
    previewActiveRef.current = false
    longPressRef.current = setTimeout(() => {
      previewActiveRef.current = true
      setActiveMobilePreview(id)
      setIsHovering(true)
    }, 500)
  }, [id])

  const handleTouchEnd = useCallback(() => {
    // Only cancel if long press hasn't fired yet (short tap → navigate)
    if (longPressRef.current) {
      clearTimeout(longPressRef.current)
      longPressRef.current = null
    }
  }, [])

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      // If preview is active on mobile, block navigation
      if (previewActiveRef.current) {
        e.preventDefault()
        return
      }
      router.push(href)
    },
    [router, href]
  )

  const showProgress = isHovering && iframeReady && trailerKey

  return (
    <motion.div
      ref={cardRef}
      variants={staggerItem}
      initial="hidden"
      animate="visible"
      className={cn("group relative cursor-pointer", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      onClick={handleClick}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") router.push(href)
      }}
    >
      <motion.div
        initial="rest"
        whileHover="hover"
        className="relative aspect-[2/3] overflow-hidden rounded-lg bg-surface"
      >
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={displayTitle}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 200px"
            className="object-cover transition-opacity duration-500"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-surface-elevated">
            <FilmIcon className="h-10 w-10 text-text-ghost" />
          </div>
        )}

        {/* Trailer preview overlay */}
        <AnimatePresence>
          {isHovering && trailerKey ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: iframeReady ? 1 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-[-2px] z-10 overflow-hidden rounded-lg bg-black"
            >
              <iframe
                ref={iframeRef}
                src={`https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1&start=5&loop=1&playlist=${trailerKey}&enablejsapi=1`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                className="pointer-events-none absolute left-1/2 top-1/2 h-[400%] w-[400%] -translate-x-1/2 -translate-y-1/2"
                tabIndex={-1}
                aria-hidden
                onLoad={() => setIframeReady(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Mute toggle on preview */}
        {showProgress ? (
          <MuteToggle
            iframeRef={iframeRef}
            size="sm"
            className="absolute right-1.5 top-1.5 z-30"
          />
        ) : null}

        {/* YouTube-style progress bar while trailer plays */}
        <AnimatePresence>
          {showProgress ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-0 left-0 right-0 z-30 h-[3px] overflow-hidden rounded-b-lg bg-white/20"
            >
              <motion.div
                className="h-full origin-left bg-red-500"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 30, ease: "linear" }}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Hover info overlay */}
        <motion.div
          variants={posterHover}
          className="absolute inset-0 z-20 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3"
        >
          <p className="font-display text-sm font-semibold leading-tight text-white line-clamp-2">
            {displayTitle}
          </p>
          <div className="mt-1 flex items-center gap-2 text-xs text-text-secondary">
            {year ? <span>{year}</span> : null}
            {voteAverage && voteAverage > 0 ? (
              <>
                <span className="text-text-ghost">·</span>
                <span className="flex items-center gap-0.5 text-cinema-amber">
                  <StarSmallIcon className="h-3 w-3" />
                  {formatVoteAverage(voteAverage)}
                </span>
              </>
            ) : null}
          </div>
        </motion.div>
      </motion.div>
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
      <line x1="2" y1="7" x2="7" y2="7" />
      <line x1="2" y1="17" x2="7" y2="17" />
      <line x1="17" y1="7" x2="22" y2="7" />
      <line x1="17" y1="17" x2="22" y2="17" />
    </svg>
  )
}

function StarSmallIcon({ className }: IconProps) {
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
