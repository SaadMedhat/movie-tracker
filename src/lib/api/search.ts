import { tmdbFetch } from "./tmdb-client"
import { type Movie, type PaginatedResponse } from "@/types/movie"
import { type TVShow } from "@/types/tv"

export type MultiSearchResult = (Movie | TVShow) & {
  readonly media_type: "movie" | "tv" | "person"
}

export const searchMulti = (
  query: string,
  page: number = 1
): Promise<PaginatedResponse<MultiSearchResult>> =>
  tmdbFetch<PaginatedResponse<MultiSearchResult>>("search/multi", {
    query,
    page: page.toString(),
  })

export const searchMovies = (
  query: string,
  page: number = 1
): Promise<PaginatedResponse<Movie>> =>
  tmdbFetch<PaginatedResponse<Movie>>("search/movie", {
    query,
    page: page.toString(),
  })

export const searchTV = (
  query: string,
  page: number = 1
): Promise<PaginatedResponse<TVShow>> =>
  tmdbFetch<PaginatedResponse<TVShow>>("search/tv", {
    query,
    page: page.toString(),
  })
