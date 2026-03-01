import { type Credits, type Genre, type PaginatedResponse, type VideoResults } from "./movie"

export type TVShow = {
  readonly id: number
  readonly name: string
  readonly original_name: string
  readonly overview: string
  readonly poster_path: string | null
  readonly backdrop_path: string | null
  readonly first_air_date: string
  readonly vote_average: number
  readonly vote_count: number
  readonly popularity: number
  readonly genre_ids: ReadonlyArray<number>
  readonly origin_country: ReadonlyArray<string>
  readonly original_language: string
  readonly media_type?: "tv"
}

export type Season = {
  readonly id: number
  readonly name: string
  readonly overview: string
  readonly poster_path: string | null
  readonly season_number: number
  readonly episode_count: number
  readonly air_date: string | null
}

export type TVShowDetail = {
  readonly id: number
  readonly name: string
  readonly original_name: string
  readonly overview: string
  readonly poster_path: string | null
  readonly backdrop_path: string | null
  readonly first_air_date: string
  readonly last_air_date: string
  readonly vote_average: number
  readonly vote_count: number
  readonly popularity: number
  readonly genres: ReadonlyArray<Genre>
  readonly number_of_seasons: number
  readonly number_of_episodes: number
  readonly episode_run_time: ReadonlyArray<number>
  readonly status: string
  readonly tagline: string
  readonly seasons: ReadonlyArray<Season>
  readonly credits: Credits
  readonly videos: VideoResults
  readonly similar: PaginatedResponse<TVShow>
  readonly recommendations: PaginatedResponse<TVShow>
}
