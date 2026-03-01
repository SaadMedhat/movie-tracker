"use client"

import { motion, AnimatePresence } from "framer-motion"
import { type MultiSearchResult } from "@/lib/api/search"
import { staggerContainer } from "@/lib/motion"
import { PosterCard } from "@/components/media/poster-card"
import { useT } from "@/lib/i18n/translations"

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
    return null
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
        {results.map((result) => {
          const isMovie = result.media_type === "movie"
          const movieResult = result as MultiSearchResult & { readonly title: string; readonly release_date: string }
          const tvResult = result as MultiSearchResult & { readonly name: string; readonly first_air_date: string }
          return (
            <PosterCard
              key={`${result.media_type}-${result.id}`}
              id={result.id}
              {...(isMovie ? { title: movieResult.title, releaseDate: movieResult.release_date } : { name: tvResult.name, firstAirDate: tvResult.first_air_date })}
              posterPath={result.poster_path}
              voteAverage={result.vote_average}
              mediaType={result.media_type as "movie" | "tv"}
              className="w-full"
            />
          )
        })}
      </motion.div>
    </AnimatePresence>
  )
}

function EmptyState({ query }: { readonly query: string }) {
  const t = useT()
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
        {t.search.noResults} &ldquo;{query}&rdquo;
      </p>
      <p className="mt-1 text-sm text-text-tertiary">
        {t.search.tryDifferent}
      </p>
    </motion.div>
  )
}

function SearchEmptyIcon({ className }: { readonly className?: string }) {
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
