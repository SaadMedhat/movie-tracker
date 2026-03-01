"use client"

import { useMemo, useCallback } from "react"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"
import { useQuery } from "@tanstack/react-query"
import { useQueryState, parseAsString, parseAsInteger } from "nuqs"
import { discoverMovies, getMovieGenres } from "@/lib/api/movies"
import { discoverTV, getTVGenres } from "@/lib/api/tv"
import { type Movie, type Genre } from "@/types/movie"
import { type TVShow } from "@/types/tv"
import { PosterCard } from "@/components/media"
import { staggerContainer, staggerItem, fadeInUp } from "@/lib/motion"
import { STALE_TIMES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { useT } from "@/lib/i18n/translations"
import { useLanguageStore } from "@/lib/stores/language-store"

/* ── Filter types ── */

type SortOption = {
  readonly label: string
  readonly value: string
}

const YEAR_VALUES = [
  "Any", "2026", "2025", "2024", "2023", "2022", "2021", "2020",
  "2010s", "2000s", "90s", "Classics",
] as const

const RATING_VALUES: ReadonlyArray<{ readonly label: string; readonly value: string }> = [
  { label: "7+", value: "7" },
  { label: "8+", value: "8" },
  { label: "9+", value: "9" },
] as const

const CARD_CLASS = "w-full"

/* ── Page ── */

export default function DiscoverPage() {
  const t = useT()
  const language = useLanguageStore((s) => s.language)
  const [mediaType, setMediaType] = useQueryState("type", parseAsString.withDefault("movie"))
  const [genreId, setGenreId] = useQueryState("genre", parseAsString.withDefault(""))
  const [year, setYear] = useQueryState("year", parseAsString.withDefault("Any"))
  const [sortBy, setSortBy] = useQueryState("sort", parseAsString.withDefault("popularity.desc"))
  const [minRating, setMinRating] = useQueryState("rating", parseAsString.withDefault(""))
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1))

  const sortOptions: ReadonlyArray<SortOption> = mediaType === "movie"
    ? [
        { label: t.discover.popularity, value: "popularity.desc" },
        { label: t.discover.ratingSort, value: "vote_average.desc" },
        { label: t.discover.newest, value: "primary_release_date.desc" },
        { label: t.discover.oldest, value: "primary_release_date.asc" },
      ]
    : [
        { label: t.discover.popularity, value: "popularity.desc" },
        { label: t.discover.ratingSort, value: "vote_average.desc" },
        { label: t.discover.newest, value: "first_air_date.desc" },
        { label: t.discover.oldest, value: "first_air_date.asc" },
      ]

  const yearLabels: Record<string, string> = {
    Any: t.discover.any,
    Classics: t.discover.classics,
  }

  /* Reset page when filters change */
  const changeMediaType = useCallback((value: string): void => {
    void setMediaType(value)
    void setGenreId("")
    void setSortBy("popularity.desc")
    void setPage(1)
  }, [setMediaType, setGenreId, setSortBy, setPage])

  const changeGenre = useCallback((value: string): void => {
    void setGenreId(value)
    void setPage(1)
  }, [setGenreId, setPage])

  const changeYear = useCallback((value: string): void => {
    void setYear(value)
    void setPage(1)
  }, [setYear, setPage])

  const changeSort = useCallback((value: string): void => {
    void setSortBy(value)
    void setPage(1)
  }, [setSortBy, setPage])

  const changeRating = useCallback((value: string): void => {
    void setMinRating(value)
    void setPage(1)
  }, [setMinRating, setPage])

  /* Genres */
  const movieGenres = useQuery({
    queryKey: ["genres", "movie", language],
    queryFn: getMovieGenres,
    staleTime: STALE_TIMES.GENRES,
  })

  const tvGenres = useQuery({
    queryKey: ["genres", "tv", language],
    queryFn: getTVGenres,
    staleTime: STALE_TIMES.GENRES,
  })

  const genres: ReadonlyArray<Genre> =
    mediaType === "movie"
      ? movieGenres.data?.genres ?? []
      : tvGenres.data?.genres ?? []

  /* Build params */
  const discoverParams = useMemo((): Record<string, string> => {
    const params: Record<string, string> = {
      sort_by: sortBy,
      page: page.toString(),
    }

    if (genreId) {
      params.with_genres = genreId
    }

    if (minRating) {
      params["vote_average.gte"] = minRating
      params["vote_count.gte"] = "50"
    }

    const yearParams = getYearParams(year, mediaType)
    Object.entries(yearParams).forEach(([k, v]) => {
      params[k] = v
    })

    return params
  }, [sortBy, page, genreId, minRating, year, mediaType])

  /* Fetch */
  const movieResults = useQuery({
    queryKey: ["movies", "discover", discoverParams, language],
    queryFn: () => discoverMovies(discoverParams),
    staleTime: STALE_TIMES.TRENDING,
    enabled: mediaType === "movie",
  })

  const tvResults = useQuery({
    queryKey: ["tv", "discover", discoverParams, language],
    queryFn: () => discoverTV(discoverParams),
    staleTime: STALE_TIMES.TRENDING,
    enabled: mediaType === "tv",
  })

  const isLoading =
    mediaType === "movie" ? movieResults.isLoading : tvResults.isLoading
  const totalPages =
    mediaType === "movie"
      ? movieResults.data?.total_pages ?? 0
      : tvResults.data?.total_pages ?? 0
  const results: ReadonlyArray<Movie | TVShow> =
    mediaType === "movie"
      ? movieResults.data?.results ?? []
      : tvResults.data?.results ?? []

  const hasMore = page < totalPages && page < 500

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6 font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl"
      >
        {t.discover.title}
      </motion.h1>

      {/* Filters */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="mb-8 space-y-4"
      >
        {/* Media toggle */}
        <div className="flex flex-wrap items-center gap-2">
          <FilterLabel>{t.discover.type}</FilterLabel>
          <Chip
            isSelected={mediaType === "movie"}
            onClick={() => {
              changeMediaType("movie")
            }}
          >
            {t.discover.films}
          </Chip>
          <Chip
            isSelected={mediaType === "tv"}
            onClick={() => {
              changeMediaType("tv")
            }}
          >
            {t.discover.tvSeries}
          </Chip>
        </div>

        {/* Genre pills */}
        <div className="space-y-2">
          <FilterLabel>{t.discover.genre}</FilterLabel>
          <div className="scrollbar-hide flex gap-1.5 overflow-x-auto pb-1 md:flex-wrap">
            <Chip
              isSelected={genreId === ""}
              onClick={() => changeGenre("")}
            >
              {t.discover.all}
            </Chip>
            {genres.map((g) => (
              <Chip
                key={g.id}
                isSelected={genreId === g.id.toString()}
                onClick={() =>
                  changeGenre(g.id.toString())
                }
              >
                {g.name}
              </Chip>
            ))}
          </div>
        </div>

        {/* Year */}
        <div className="space-y-2">
          <FilterLabel>{t.discover.year}</FilterLabel>
          <div className="scrollbar-hide flex gap-1.5 overflow-x-auto pb-1">
            {YEAR_VALUES.map((y) => (
              <Chip
                key={y}
                isSelected={year === y}
                onClick={() => changeYear(y)}
                size="sm"
              >
                {yearLabels[y] ?? y}
              </Chip>
            ))}
          </div>
        </div>

        {/* Sort / Rating */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Sort */}
          <div className="flex flex-wrap items-center gap-2">
            <FilterLabel>{t.discover.sort}</FilterLabel>
            {sortOptions.map((opt) => (
              <Chip
                key={opt.value}
                isSelected={sortBy === opt.value}
                onClick={() => changeSort(opt.value)}
                size="sm"
              >
                {opt.label}
              </Chip>
            ))}
          </div>

          {/* Min rating */}
          <div className="flex flex-wrap items-center gap-2">
            <FilterLabel>{t.discover.rating}</FilterLabel>
            <Chip
              isSelected={minRating === ""}
              onClick={() => changeRating("")}
              size="sm"
            >
              {t.discover.any}
            </Chip>
            {RATING_VALUES.map((opt) => (
              <Chip
                key={opt.label}
                isSelected={minRating === opt.value}
                onClick={() =>
                  changeRating(opt.value)
                }
                size="sm"
              >
                {opt.label}
              </Chip>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Results */}
      <LayoutGroup>
        <AnimatePresence mode="wait">
          {isLoading ? null : results.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="mb-4 rounded-full bg-surface-elevated p-4">
                <FilmIcon className="h-8 w-8 text-text-ghost" />
              </div>
              <p className="text-base font-medium text-foreground">
                {t.discover.noResults}
              </p>
              <p className="mt-1 text-sm text-text-tertiary">
                {t.discover.adjustFilters}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={`${mediaType}-${genreId}-${year}-${sortBy}-${minRating}`}
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
            >
              {results.map((item) => (
                <motion.div key={item.id} variants={staggerItem} layout>
                  <ResultCard item={item} mediaType={mediaType} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </LayoutGroup>

      {/* Load more */}
      {hasMore && results.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-10 flex justify-center"
        >
          <button
            type="button"
            onClick={() => void setPage(page + 1)}
            disabled={isLoading}
            className="inline-flex h-11 items-center rounded-lg border border-border bg-surface-elevated px-8 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
          >
            {isLoading ? t.discover.loading : t.discover.loadMore}
          </button>
        </motion.div>
      ) : null}
    </div>
  )
}

/* ── Filter helpers ── */

function getYearParams(
  year: string,
  mediaType: string
): Record<string, string> {
  const dateGte = mediaType === "movie" ? "primary_release_date.gte" : "first_air_date.gte"
  const dateLte = mediaType === "movie" ? "primary_release_date.lte" : "first_air_date.lte"

  if (year === "Any") return {}
  if (year === "2010s") return { [dateGte]: "2010-01-01", [dateLte]: "2019-12-31" }
  if (year === "2000s") return { [dateGte]: "2000-01-01", [dateLte]: "2009-12-31" }
  if (year === "90s") return { [dateGte]: "1990-01-01", [dateLte]: "1999-12-31" }
  if (year === "Classics") return { [dateLte]: "1989-12-31" }

  return { [dateGte]: `${year}-01-01`, [dateLte]: `${year}-12-31` }
}

/* ── Chip component ── */

type ChipProps = {
  readonly children: React.ReactNode
  readonly isSelected: boolean
  readonly onClick: () => void
  readonly size?: "sm" | "md"
}

function Chip({ children, isSelected, onClick, size = "md" }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative rounded-full border font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        size === "sm" ? "px-3 py-1 text-xs" : "px-4 py-1.5 text-sm",
        isSelected
          ? "border-cinema-amber/50 bg-cinema-amber/10 text-cinema-amber"
          : "border-border bg-transparent text-text-secondary hover:border-text-ghost hover:text-foreground"
      )}
    >
      {children}
    </button>
  )
}

function FilterLabel({ children }: { readonly children: React.ReactNode }) {
  return (
    <span className="mr-1 text-xs font-medium uppercase tracking-wider text-text-ghost">
      {children}
    </span>
  )
}

/* ── Result card ── */

function ResultCard({
  item,
  mediaType,
}: {
  readonly item: Movie | TVShow
  readonly mediaType: string
}) {
  if (mediaType === "movie") {
    const movie = item as Movie
    return (
      <PosterCard
        id={movie.id}
        title={movie.title}
        posterPath={movie.poster_path}
        voteAverage={movie.vote_average}
        releaseDate={movie.release_date}
        mediaType="movie"
        className={CARD_CLASS}
      />
    )
  }

  const show = item as TVShow
  return (
    <PosterCard
      id={show.id}
      name={show.name}
      posterPath={show.poster_path}
      voteAverage={show.vote_average}
      firstAirDate={show.first_air_date}
      mediaType="tv"
      className={CARD_CLASS}
    />
  )
}

/* ── Icons ── */

function FilmIcon({ className }: { readonly className?: string }) {
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
