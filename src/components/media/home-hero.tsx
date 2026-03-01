"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { type Movie } from "@/types/movie"
import { getBackdropUrl, formatVoteAverage } from "@/lib/utils/media"
import { getYear } from "@/lib/utils/date"
import { MOVIE_GENRES } from "@/lib/constants"
import { WatchlistToggle } from "@/components/library"

type HomeHeroProps = {
  readonly movie: Movie
}

export function HomeHero({ movie }: HomeHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"])
  const imageOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.2])
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const backdropUrl = getBackdropUrl(movie.backdrop_path, "original")
  const year = getYear(movie.release_date)
  const genreNames = movie.genre_ids
    .map((id) => MOVIE_GENRES[id])
    .filter(Boolean)
    .slice(0, 3)
  const truncatedOverview =
    movie.overview.length > 200
      ? `${movie.overview.slice(0, 200)}...`
      : movie.overview

  return (
    <section
      ref={containerRef}
      className="relative h-[85vh] w-full overflow-hidden md:h-[90vh]"
    >
      {/* Backdrop with parallax */}
      {backdropUrl ? (
        <motion.div
          style={{ y: imageY, opacity: imageOpacity }}
          className="absolute inset-0 -top-[10%] bottom-0 h-[120%]"
        >
          <Image
            src={backdropUrl}
            alt={movie.title}
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

      {/* Gradient overlays — cinematic depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />

      {/* Content */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="absolute inset-0 flex items-end"
      >
        <div className="w-full px-5 pb-16 md:px-12 md:pb-20 lg:px-16">
          <div className="mx-auto max-w-7xl">
            {/* Meta line */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mb-3 flex items-center gap-3 text-sm text-text-secondary"
            >
              {year ? <span>{year}</span> : null}
              {genreNames.length > 0 ? (
                <>
                  <span className="text-text-ghost">·</span>
                  <span>{genreNames.join(", ")}</span>
                </>
              ) : null}
              {movie.vote_average > 0 ? (
                <>
                  <span className="text-text-ghost">·</span>
                  <span className="flex items-center gap-1 text-cinema-amber">
                    <StarIcon className="h-3.5 w-3.5" />
                    {formatVoteAverage(movie.vote_average)}
                  </span>
                </>
              ) : null}
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-foreground md:text-6xl lg:text-7xl"
            >
              {movie.title}
            </motion.h1>

            {/* Overview */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mt-4 max-w-xl text-sm leading-relaxed text-text-secondary md:text-base"
            >
              {truncatedOverview}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mt-6 flex items-center gap-3"
            >
              <Link
                href={`/movie/${movie.id}`}
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-cinema-amber px-6 text-sm font-semibold text-cinema-amber-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <InfoIcon className="h-4 w-4" />
                Details
              </Link>
              <WatchlistToggle
                id={movie.id}
                mediaType="movie"
                title={movie.title}
                posterPath={movie.poster_path}
                size="lg"
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

type IconProps = { readonly className?: string }

function StarIcon({ className }: IconProps) {
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

function InfoIcon({ className }: IconProps) {
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
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  )
}
