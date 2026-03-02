"use client"

import { motion } from "framer-motion"
import { useQueryState, parseAsString } from "nuqs"
import { useDebounce } from "@/hooks/use-debounce"
import { useSearchMulti, useTrendingMovies } from "@/lib/api/queries"
import { type MultiSearchResult } from "@/lib/api/search"
import { SearchInput, SearchResults } from "@/components/search"
import { PosterCard } from "@/components/media"
import { type Movie } from "@/types/movie"
import { staggerContainer, staggerItem, fadeInUp } from "@/lib/motion"
import { useT } from "@/lib/i18n/translations"
const CARD_CLASS = "w-full"

export default function SearchPage() {
  const t = useT()
  const [query, setQuery] = useQueryState("q", parseAsString.withDefault(""))
  const debouncedQuery = useDebounce(query, 300)

  const searchResults = useSearchMulti(debouncedQuery)
  const trending = useTrendingMovies()

  const filteredResults: ReadonlyArray<MultiSearchResult> = (
    searchResults.data?.results ?? []
  ).filter((r) => r.media_type === "movie" || r.media_type === "tv")

  const isSearching = debouncedQuery.length >= 2
  const isShowingTrending = !isSearching

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-2"
      >
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          {t.search.title}
        </h1>
      </motion.div>

      <SearchInput
        value={query}
        onChange={setQuery}
        isLoading={searchResults.isFetching && isSearching}
        className="mb-8"
      />

      {isSearching ? (
        <SearchResults
          results={filteredResults}
          isLoading={searchResults.isLoading}
          query={debouncedQuery}
        />
      ) : (
        <TrendingFallback
          movies={trending.data?.results ?? []}
          isLoading={trending.isLoading}
        />
      )}
    </div>
  )
}

function TrendingFallback({
  movies,
  isLoading,
}: {
  readonly movies: ReadonlyArray<Movie>
  readonly isLoading: boolean
}) {
  const t = useT()
  if (isLoading) {
    return null
  }

  if (movies.length === 0) return null

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <p className="text-sm font-medium text-text-tertiary">
        {t.search.popularNow}
      </p>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
      >
        {movies.slice(0, 18).map((movie) => (
          <motion.div key={movie.id} variants={staggerItem}>
            <PosterCard
              id={movie.id}
              title={movie.title}
              posterPath={movie.poster_path}
              voteAverage={movie.vote_average}
              releaseDate={movie.release_date}
              mediaType="movie"
              className={CARD_CLASS}
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}
