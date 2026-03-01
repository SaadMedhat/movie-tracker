"use client"

import { useTopRatedMovies, useUpcomingMovies, useTrendingTV } from "@/lib/api/queries"
import { type Movie } from "@/types/movie"
import { type TVShow } from "@/types/tv"
import { PosterCard } from "./poster-card"
import { MediaRow } from "./media-row"
import { useT } from "@/lib/i18n/translations"
type HomeSectionData = {
  readonly trendingMovies: ReadonlyArray<Movie>
}

function MoviePosterCard({ movie, className }: { readonly movie: Movie; readonly className: string }) {
  return (
    <PosterCard
      key={movie.id}
      id={movie.id}
      title={movie.title}
      posterPath={movie.poster_path}
      voteAverage={movie.vote_average}
      releaseDate={movie.release_date}
      mediaType="movie"
      className={className}
    />
  )
}

function TVPosterCard({ show, className }: { readonly show: TVShow; readonly className: string }) {
  return (
    <PosterCard
      key={show.id}
      id={show.id}
      name={show.name}
      posterPath={show.poster_path}
      voteAverage={show.vote_average}
      firstAirDate={show.first_air_date}
      mediaType="tv"
      className={className}
    />
  )
}

const CARD_CLASS = "w-32 flex-shrink-0 md:w-40"

export function HomeSections({ trendingMovies }: HomeSectionData) {
  const trendingTV = useTrendingTV()
  const topRated = useTopRatedMovies()
  const upcoming = useUpcomingMovies()
  const t = useT()

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-0 py-8 md:px-6 md:py-12">
      {/* Trending Movies — pre-loaded from server */}
      <MediaRow title={t.home.trendingThisWeek}>
        {trendingMovies.map((movie) => (
          <MoviePosterCard key={movie.id} movie={movie} className={CARD_CLASS} />
        ))}
      </MediaRow>

      {/* Trending TV */}
      {trendingTV.data ? (
        <MediaRow title={t.home.trendingSeries}>
          {trendingTV.data.results.map((show) => (
            <TVPosterCard key={show.id} show={show} className={CARD_CLASS} />
          ))}
        </MediaRow>
      ) : null}

      {/* Top Rated */}
      {topRated.data ? (
        <MediaRow title={t.home.topRatedFilms}>
          {topRated.data.results.map((movie) => (
            <MoviePosterCard key={movie.id} movie={movie} className={CARD_CLASS} />
          ))}
        </MediaRow>
      ) : null}

      {/* Upcoming */}
      {upcoming.data ? (
        <MediaRow title={t.home.comingSoon}>
          {upcoming.data.results.map((movie) => (
            <MoviePosterCard key={movie.id} movie={movie} className={CARD_CLASS} />
          ))}
        </MediaRow>
      ) : null}
    </div>
  )
}
