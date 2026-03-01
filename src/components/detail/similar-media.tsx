"use client"

import { type Movie } from "@/types/movie"
import { type TVShow } from "@/types/tv"
import { type MediaType } from "@/types/library"
import { PosterCard } from "@/components/media/poster-card"
import { MediaRow } from "@/components/media/media-row"
import { useT } from "@/lib/i18n/translations"

type SimilarMediaProps = {
  readonly similar: ReadonlyArray<Movie | TVShow>
  readonly recommendations: ReadonlyArray<Movie | TVShow>
  readonly mediaType: MediaType
}

const CARD_CLASS = "w-32 flex-shrink-0 md:w-40"

export function SimilarMedia({
  similar,
  recommendations,
  mediaType,
}: SimilarMediaProps) {
  const t = useT()
  const items = recommendations.length > 0 ? recommendations : similar

  if (items.length === 0) return null

  return (
    <MediaRow title={t.detail.moreLikeThis}>
      {items.slice(0, 20).map((item) => (
        <SimilarCard key={item.id} item={item} mediaType={mediaType} />
      ))}
    </MediaRow>
  )
}

function SimilarCard({
  item,
  mediaType,
}: {
  readonly item: Movie | TVShow
  readonly mediaType: MediaType
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
