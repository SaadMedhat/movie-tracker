export type MediaStatus = "watchlist" | "watched" | "watching"

export type MediaType = "movie" | "tv"

export type LibraryEntry = {
  readonly id: number
  readonly mediaType: MediaType
  readonly title: string
  readonly posterPath: string | null
  readonly status: MediaStatus
  readonly rating: number | null
  readonly addedAt: string
  readonly watchedAt: string | null
}
