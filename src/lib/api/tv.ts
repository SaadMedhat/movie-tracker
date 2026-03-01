import { tmdbFetch } from "./tmdb-client"
import { type PaginatedResponse, type Genre } from "@/types/movie"
import { type TVShow, type TVShowDetail } from "@/types/tv"

export const getTrendingTV = (
  timeWindow: "day" | "week" = "week"
): Promise<PaginatedResponse<TVShow>> =>
  tmdbFetch<PaginatedResponse<TVShow>>(`trending/tv/${timeWindow}`)

export const getPopularTV = (
  page: number = 1
): Promise<PaginatedResponse<TVShow>> =>
  tmdbFetch<PaginatedResponse<TVShow>>("tv/popular", {
    page: page.toString(),
  })

export const getTopRatedTV = (
  page: number = 1
): Promise<PaginatedResponse<TVShow>> =>
  tmdbFetch<PaginatedResponse<TVShow>>("tv/top_rated", {
    page: page.toString(),
  })

export const getTVDetail = (id: number): Promise<TVShowDetail> =>
  tmdbFetch<TVShowDetail>(`tv/${id}`, {
    append_to_response: "credits,videos,similar,recommendations",
  })

export const discoverTV = (
  params: Record<string, string> = {}
): Promise<PaginatedResponse<TVShow>> =>
  tmdbFetch<PaginatedResponse<TVShow>>("discover/tv", {
    sort_by: "popularity.desc",
    ...params,
  })

export const getTVGenres = (): Promise<{
  readonly genres: ReadonlyArray<Genre>
}> =>
  tmdbFetch<{ readonly genres: ReadonlyArray<Genre> }>("genre/tv/list")
