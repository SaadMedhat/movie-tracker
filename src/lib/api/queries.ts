"use client"

import { useQuery } from "@tanstack/react-query"
import { getTrendingMovies, getPopularMovies, getTopRatedMovies, getUpcomingMovies, getNowPlayingMovies, getMovieDetail, discoverMovies, getMovieGenres } from "./movies"
import { getTrendingTV, getPopularTV, getTopRatedTV, getTVDetail, discoverTV, getTVGenres } from "./tv"
import { searchMulti } from "./search"
import { STALE_TIMES } from "@/lib/constants"

/* ── Movies ── */

export const useTrendingMovies = (timeWindow: "day" | "week" = "week") =>
  useQuery({
    queryKey: ["movies", "trending", timeWindow],
    queryFn: () => getTrendingMovies(timeWindow),
    staleTime: STALE_TIMES.TRENDING,
  })

export const usePopularMovies = (page: number = 1) =>
  useQuery({
    queryKey: ["movies", "popular", page],
    queryFn: () => getPopularMovies(page),
    staleTime: STALE_TIMES.TRENDING,
  })

export const useTopRatedMovies = (page: number = 1) =>
  useQuery({
    queryKey: ["movies", "top-rated", page],
    queryFn: () => getTopRatedMovies(page),
    staleTime: STALE_TIMES.TRENDING,
  })

export const useUpcomingMovies = (page: number = 1) =>
  useQuery({
    queryKey: ["movies", "upcoming", page],
    queryFn: () => getUpcomingMovies(page),
    staleTime: STALE_TIMES.TRENDING,
  })

export const useNowPlayingMovies = (page: number = 1) =>
  useQuery({
    queryKey: ["movies", "now-playing", page],
    queryFn: () => getNowPlayingMovies(page),
    staleTime: STALE_TIMES.TRENDING,
  })

export const useMovieDetail = (id: number) =>
  useQuery({
    queryKey: ["movie", id],
    queryFn: () => getMovieDetail(id),
    staleTime: STALE_TIMES.DETAIL,
    enabled: id > 0,
  })

export const useDiscoverMovies = (params: Record<string, string> = {}) =>
  useQuery({
    queryKey: ["movies", "discover", params],
    queryFn: () => discoverMovies(params),
    staleTime: STALE_TIMES.TRENDING,
  })

export const useMovieGenres = () =>
  useQuery({
    queryKey: ["genres", "movie"],
    queryFn: getMovieGenres,
    staleTime: STALE_TIMES.GENRES,
  })

/* ── TV Shows ── */

export const useTrendingTV = (timeWindow: "day" | "week" = "week") =>
  useQuery({
    queryKey: ["tv", "trending", timeWindow],
    queryFn: () => getTrendingTV(timeWindow),
    staleTime: STALE_TIMES.TRENDING,
  })

export const usePopularTV = (page: number = 1) =>
  useQuery({
    queryKey: ["tv", "popular", page],
    queryFn: () => getPopularTV(page),
    staleTime: STALE_TIMES.TRENDING,
  })

export const useTopRatedTV = (page: number = 1) =>
  useQuery({
    queryKey: ["tv", "top-rated", page],
    queryFn: () => getTopRatedTV(page),
    staleTime: STALE_TIMES.TRENDING,
  })

export const useTVDetail = (id: number) =>
  useQuery({
    queryKey: ["tv", id],
    queryFn: () => getTVDetail(id),
    staleTime: STALE_TIMES.DETAIL,
    enabled: id > 0,
  })

export const useDiscoverTV = (params: Record<string, string> = {}) =>
  useQuery({
    queryKey: ["tv", "discover", params],
    queryFn: () => discoverTV(params),
    staleTime: STALE_TIMES.TRENDING,
  })

export const useTVGenres = () =>
  useQuery({
    queryKey: ["genres", "tv"],
    queryFn: getTVGenres,
    staleTime: STALE_TIMES.GENRES,
  })

/* ── Search ── */

export const useSearchMulti = (query: string, page: number = 1) =>
  useQuery({
    queryKey: ["search", query, page],
    queryFn: () => searchMulti(query, page),
    staleTime: STALE_TIMES.SEARCH,
    enabled: query.length >= 2,
  })
