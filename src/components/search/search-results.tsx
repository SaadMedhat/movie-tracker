"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { type MultiSearchResult } from "@/lib/api/search"
import { getPosterUrl, formatVoteAverage } from "@/lib/utils/media"
import { getYear } from "@/lib/utils/date"
import { staggerContainer, staggerItem, posterHover } from "@/lib/motion"
import { Skeleton } from "@/components/ui/skeleton"

type SearchResultsProps = {
  readonly results: ReadonlyArray<MultiSearchResult>
  readonly isLoading: boolean
  readonly query: string
}

export function SearchResults({
  results,
  isLoading,
  query,
}: SearchResultsProps) {
  if (isLoading) {
    return <SearchGridSkeleton />
  }

  if (query.length >= 2 && results.length === 0) {
    return <EmptyState query={query} />
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={query}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
      >
        {results.map((result) => (
          <SearchResultCard key={`${result.media_type}-${result.id}`} result={result} />
        ))}
      </motion.div>
    </AnimatePresence>
  )
}

function SearchResultCard({
  result,
}: {
  readonly result: MultiSearchResult
}) {
  const isMovie = result.media_type === "movie"
  const title = isMovie
    ? (result as MultiSearchResult & { readonly title: string }).title
    : (result as MultiSearchResult & { readonly name: string }).name
  const date = isMovie
    ? (result as MultiSearchResult & { readonly release_date: string }).release_date
    : (result as MultiSearchResult & { readonly first_air_date: string }).first_air_date
  const year = getYear(date ?? "")
  const posterUrl = getPosterUrl(result.poster_path, "md")
  const href = `/${result.media_type}/${result.id}`

  return (
    <motion.div variants={staggerItem} className="group relative">
      <Link href={href} className="block">
        <motion.div
          initial="rest"
          whileHover="hover"
          className="relative aspect-[2/3] overflow-hidden rounded-lg bg-surface"
        >
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={title ?? ""}
              fill
              sizes="(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 16vw"
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
              {isMovie ? "Film" : "Series"}
            </span>
          </div>

          {/* Hover overlay */}
          <motion.div
            variants={posterHover}
            className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3"
          >
            <p className="font-display text-sm font-semibold leading-tight text-white line-clamp-2">
              {title}
            </p>
            <div className="mt-1 flex items-center gap-2 text-xs text-text-secondary">
              {year ? <span>{year}</span> : null}
              {result.vote_average > 0 ? (
                <>
                  <span className="text-text-ghost">·</span>
                  <span className="flex items-center gap-0.5 text-cinema-amber">
                    <StarIcon className="h-3 w-3" />
                    {formatVoteAverage(result.vote_average)}
                  </span>
                </>
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      </Link>
    </motion.div>
  )
}

function EmptyState({ query }: { readonly query: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="mb-4 rounded-full bg-surface-elevated p-4">
        <SearchEmptyIcon className="h-8 w-8 text-text-ghost" />
      </div>
      <p className="text-base font-medium text-foreground">
        No results for &ldquo;{query}&rdquo;
      </p>
      <p className="mt-1 text-sm text-text-tertiary">
        Try a different title or check the spelling
      </p>
    </motion.div>
  )
}

function SearchGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: 12 }, (_, i) => (
        <Skeleton key={i} className="aspect-[2/3] rounded-lg" />
      ))}
    </div>
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

function SearchEmptyIcon({ className }: IconProps) {
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
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  )
}
