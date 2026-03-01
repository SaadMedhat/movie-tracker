import { tmdbFetch } from "./tmdb-client"
import {
  type Movie,
  type MovieDetail,
  type PaginatedResponse,
  type Genre,
  type VideoResults,
} from "@/types/movie"

export const getTrendingMovies = (
  timeWindow: "day" | "week" = "week"
): Promise<PaginatedResponse<Movie>> =>
  tmdbFetch<PaginatedResponse<Movie>>(`trending/movie/${timeWindow}`)

export const getPopularMovies = (
  page: number = 1
): Promise<PaginatedResponse<Movie>> =>
  tmdbFetch<PaginatedResponse<Movie>>("movie/popular", {
    page: page.toString(),
  })

export const getTopRatedMovies = (
  page: number = 1
): Promise<PaginatedResponse<Movie>> =>
  tmdbFetch<PaginatedResponse<Movie>>("movie/top_rated", {
    page: page.toString(),
  })

export const getUpcomingMovies = (
  page: number = 1
): Promise<PaginatedResponse<Movie>> =>
  tmdbFetch<PaginatedResponse<Movie>>("movie/upcoming", {
    page: page.toString(),
  })

export const getNowPlayingMovies = (
  page: number = 1
): Promise<PaginatedResponse<Movie>> =>
  tmdbFetch<PaginatedResponse<Movie>>("movie/now_playing", {
    page: page.toString(),
  })

export const getMovieDetail = (id: number): Promise<MovieDetail> =>
  tmdbFetch<MovieDetail>(`movie/${id}`, {
    append_to_response: "credits,videos,similar,recommendations",
  })

export const discoverMovies = (
  params: Record<string, string> = {}
): Promise<PaginatedResponse<Movie>> =>
  tmdbFetch<PaginatedResponse<Movie>>("discover/movie", {
    sort_by: "popularity.desc",
    ...params,
  })

export const getMovieVideos = (id: number): Promise<VideoResults> =>
  tmdbFetch<VideoResults>(`movie/${id}/videos`)

export const getMovieGenres = (): Promise<{
  readonly genres: ReadonlyArray<Genre>
}> =>
  tmdbFetch<{ readonly genres: ReadonlyArray<Genre> }>("genre/movie/list")
