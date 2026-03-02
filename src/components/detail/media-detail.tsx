"use client"

import { type ReactNode, useRef, useState, useCallback, useEffect } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { type MovieDetail } from "@/types/movie"
import { type TVShowDetail } from "@/types/tv"
import {
  getBackdropUrl,
  getPosterUrl,
  formatRuntime,
  formatVoteAverage,
  getTrailerKey,
} from "@/lib/utils/media"
import { getYear, formatReleaseDate } from "@/lib/utils/date"
import { fadeInUp } from "@/lib/motion"
import { WatchlistToggle, RatingStars } from "@/components/library"
import { useLibraryStore } from "@/lib/stores/library-store"
import { useHydration } from "@/hooks/use-hydration"
import { CastRow } from "./cast-row"
import { TrailerDialog } from "./trailer-dialog"
import { SimilarMedia } from "./similar-media"
import { WatchProviders } from "./watch-providers"
import { MuteToggle } from "@/components/ui/mute-toggle"
import { useT } from "@/lib/i18n/translations"

type MediaDetailProps =
  | {
      readonly mediaType: "movie"
      readonly data: MovieDetail
    }
  | {
      readonly mediaType: "tv"
      readonly data: TVShowDetail
    }

type YouTubeStateMessage = {
  readonly event?: string
  readonly info?: number
}

export function MediaDetail(props: MediaDetailProps): ReactNode {
  // 1. Constants & props
  const { mediaType, data } = props
  const title = mediaType === "movie" ? data.title : data.name
  const date = mediaType === "movie" ? data.release_date : data.first_air_date
  const year = getYear(date)
  const formattedDate = formatReleaseDate(date)
  const backdropUrl = getBackdropUrl(data.backdrop_path, "original")
  const posterUrl = getPosterUrl(data.poster_path, "xl")
  const trailerKey = getTrailerKey(data.videos.results)

  // 2. Custom hooks
  const t = useT()
  const isHydrated = useHydration()

  // 3. Library hooks
  const getRating = useLibraryStore((s) => s.getRating)
  const setRating = useLibraryStore((s) => s.setRating)
  const isInLibrary = useLibraryStore((s) => s.isInLibrary(data.id, mediaType))
  const addToLibrary = useLibraryStore((s) => s.addToLibrary)
  const currentRating = isHydrated ? getRating(data.id, mediaType) : null

  // 4. useState / useRef
  const containerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [videoPlaying, setVideoPlaying] = useState(false)
  const [videoEnded, setVideoEnded] = useState(false)

  // Scroll-driven animations (depend on containerRef)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])
  const imageOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.2])

  const showBackdropVideo = trailerKey && videoPlaying && !videoEnded

  // 5. useRef for fallback timer
  const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 6. useCallback
  const handleIframeLoad = useCallback((): void => {
    const iframe = iframeRef.current
    if (!iframe?.contentWindow) return
    // Subscribe to YouTube state events
    iframe.contentWindow.postMessage(
      JSON.stringify({ event: "listening" }),
      "*"
    )
    // Fallback: if no postMessage state event arrives within 3s,
    // assume muted autoplay succeeded (it does on all modern browsers)
    fallbackTimerRef.current = setTimeout(() => {
      setVideoPlaying((prev) => {
        if (prev) return prev
        return true
      })
    }, 3000)
  }, [])

  const handleTrailerDialogChange = useCallback(
    (open: boolean): void => {
      const iframe = iframeRef.current
      if (!iframe?.contentWindow) return
      const cmd = open ? "mute" : "unMute"
      iframe.contentWindow.postMessage(
        JSON.stringify({ event: "command", func: cmd, args: "" }),
        "*"
      )
      if (!open) {
        iframe.contentWindow.postMessage(
          JSON.stringify({ event: "command", func: "setVolume", args: [30] }),
          "*"
        )
      }
    },
    []
  )

  const handleRate = useCallback(
    (rating: number): void => {
      if (!isInLibrary) {
        addToLibrary({
          id: data.id,
          mediaType,
          title,
          posterPath: data.poster_path,
          status: "watched",
        })
      }
      setRating(data.id, mediaType, rating)
    },
    [data.id, mediaType, title, data.poster_path, isInLibrary, addToLibrary, setRating]
  )

  // 7. useEffect
  useEffect(() => {
    if (!trailerKey) return
    const handleMessage = (e: MessageEvent): void => {
      if (typeof e.data !== "string") return
      try {
        const parsed: YouTubeStateMessage = JSON.parse(e.data)
        if (parsed.event === "onStateChange") {
          if (parsed.info === 1) {
            // Clear fallback timer since we got a real state event
            if (fallbackTimerRef.current) {
              clearTimeout(fallbackTimerRef.current)
              fallbackTimerRef.current = null
            }
            setVideoPlaying(true)
          }
          if (parsed.info === 0) setVideoEnded(true)
        }
      } catch {
        // ignore non-JSON messages
      }
    }
    window.addEventListener("message", handleMessage)
    return () => {
      window.removeEventListener("message", handleMessage)
      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current)
        fallbackTimerRef.current = null
      }
    }
  }, [trailerKey])

  return (
    <div className="-mt-16">
      {/* Hero backdrop */}
      <section
        ref={containerRef}
        className="relative h-[50vh] w-full overflow-hidden md:h-[60vh]"
      >
        {/* Static backdrop image (always present as fallback) */}
        {backdropUrl ? (
          <motion.div
            style={{ y: imageY, opacity: imageOpacity }}
            className="absolute inset-0 -top-[10%] h-[120%]"
          >
            <Image
              src={backdropUrl}
              alt={title}
              fill
              priority
              sizes="100vw"
              quality={85}
              className="object-cover object-[center_20%]"
            />
          </motion.div>
        ) : (
          <div className="absolute inset-0 bg-surface" />
        )}

        {/* Trailer video backdrop */}
        {trailerKey && !videoEnded ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: showBackdropVideo ? 1 : 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 -top-[10%] h-[120%]"
          >
            <iframe
              ref={iframeRef}
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1&start=5&enablejsapi=1&origin=${typeof window !== "undefined" ? window.location.origin : ""}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
              className="pointer-events-none absolute left-1/2 top-1/2 h-[200%] w-[200%] -translate-x-1/2 -translate-y-1/2"
              tabIndex={-1}
              aria-hidden
              onLoad={handleIframeLoad}
            />
          </motion.div>
        ) : null}

        {/* Mute/Unmute toggle */}
        {showBackdropVideo ? (
          <MuteToggle
            iframeRef={iframeRef}
            size="md"
            defaultMuted={false}
            className="absolute right-4 top-20 z-20"
          />
        ) : null}

        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-12 lg:px-16">
        <div className="flex flex-col gap-8 md:-mt-40 md:flex-row md:gap-10">
          {/* Poster */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="hidden flex-shrink-0 md:block"
          >
            <div className="relative aspect-[2/3] w-64 overflow-hidden rounded-lg shadow-2xl lg:w-72">
              {posterUrl ? (
                <Image
                  src={posterUrl}
                  alt={title}
                  fill
                  sizes="288px"
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full bg-surface-elevated" />
              )}
            </div>
          </motion.div>

          {/* Info */}
          <div className="min-w-0 flex-1 space-y-5 -mt-20 md:mt-0">
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.1,
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <h1 className="font-display text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl lg:text-5xl">
                {title}
              </h1>
              {data.tagline ? (
                <p className="mt-1 text-sm italic text-text-tertiary">
                  {data.tagline}
                </p>
              ) : null}
            </motion.div>

            {/* Meta */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.2,
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-text-secondary"
            >
              {year ? <span>{formattedDate}</span> : null}

              {mediaType === "movie" && data.runtime > 0 ? (
                <>
                  <Dot />
                  <span>{formatRuntime(data.runtime)}</span>
                </>
              ) : null}

              {mediaType === "tv" ? (
                <>
                  <Dot />
                  <span>
                    {data.number_of_seasons}{" "}
                    {data.number_of_seasons !== 1
                      ? t.detail.seasons
                      : t.detail.season}
                  </span>
                  <Dot />
                  <span>
                    {data.number_of_episodes} {t.detail.episodes}
                  </span>
                </>
              ) : null}

              {data.genres.length > 0 ? (
                <>
                  <Dot />
                  <span>{data.genres.map((g) => g.name).join(", ")}</span>
                </>
              ) : null}

              {data.vote_average > 0 ? (
                <>
                  <Dot />
                  <span className="flex items-center gap-1 text-cinema-amber">
                    <StarIcon className="h-3.5 w-3.5" />
                    {formatVoteAverage(data.vote_average)}
                  </span>
                </>
              ) : null}

              {data.status ? (
                <>
                  <Dot />
                  <span>{data.status}</span>
                </>
              ) : null}
            </motion.div>

            {/* TV-specific extra info */}
            {mediaType === "tv" ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.25,
                  duration: 0.5,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-text-tertiary"
              >
                {data.first_air_date ? (
                  <span>
                    {t.detail.firstAired}{" "}
                    {formatReleaseDate(data.first_air_date)}
                  </span>
                ) : null}
                {data.last_air_date ? (
                  <>
                    <Dot />
                    <span>
                      {t.detail.lastAired}{" "}
                      {formatReleaseDate(data.last_air_date)}
                    </span>
                  </>
                ) : null}
              </motion.div>
            ) : null}

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.3,
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="flex flex-wrap items-center gap-3"
            >
              <WatchlistToggle
                id={data.id}
                mediaType={mediaType}
                title={title}
                posterPath={data.poster_path}
                size="lg"
              />
              <TrailerDialog videos={data.videos} title={title} onOpenChange={handleTrailerDialogChange} />
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-tertiary">{t.detail.yourRating}</span>
                <RatingStars
                  rating={currentRating}
                  onRate={handleRate}
                  size="md"
                />
              </div>
            </motion.div>

            {/* Overview */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
            >
              {data.overview ? (
                <p className="max-w-2xl text-sm leading-relaxed text-text-secondary md:text-base">
                  {data.overview}
                </p>
              ) : null}
            </motion.div>

            {/* Director / Creator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <CrewHighlight {...props} />
            </motion.div>

            <WatchProviders id={data.id} mediaType={mediaType} />
          </div>
        </div>

        {/* Cast */}
        <div className="mt-12">
          <CastRow cast={data.credits.cast} />
        </div>

        {/* Similar / Recommendations */}
        <div className="mt-12 pb-12">
          <SimilarMedia
            similar={data.similar.results}
            recommendations={data.recommendations.results}
            mediaType={mediaType}
          />
        </div>
      </div>
    </div>
  )
}

/* ── Small helper components ── */

function Dot(): ReactNode {
  return <span className="text-text-ghost">·</span>
}

type CrewHighlightProps =
  | { readonly mediaType: "movie"; readonly data: MovieDetail }
  | { readonly mediaType: "tv"; readonly data: TVShowDetail }

function CrewHighlight(props: CrewHighlightProps): ReactNode {
  const { mediaType, data } = props
  const t = useT()

  if (mediaType === "movie") {
    const directors = data.credits.crew.filter(
      (c) => c.job === "Director"
    )
    if (directors.length === 0) return null
    return (
      <p className="text-sm text-text-secondary">
        <span className="text-text-tertiary">{t.detail.directedBy}</span>{" "}
        <span className="font-medium text-foreground">
          {directors.map((d) => d.name).join(", ")}
        </span>
      </p>
    )
  }

  const creators = data.credits.crew.filter(
    (c) => c.job === "Executive Producer"
  )
  if (creators.length === 0) return null
  return (
    <p className="text-sm text-text-secondary">
      <span className="text-text-tertiary">{t.detail.createdBy}</span>{" "}
      <span className="font-medium text-foreground">
        {creators
          .slice(0, 3)
          .map((c) => c.name)
          .join(", ")}
      </span>
    </p>
  )
}

type StarIconProps = {
  readonly className?: string
}

function StarIcon({ className }: StarIconProps): ReactNode {
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
