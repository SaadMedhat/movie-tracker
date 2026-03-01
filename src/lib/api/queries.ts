"use client"

import { useQuery } from "@tanstack/react-query"
import { getTrendingMovies, getPopularMovies, getTopRatedMovies, getUpcomingMovies, getNowPlayingMovies, getMovieDetail, discoverMovies, getMovieGenres, getMovieVideos } from "./movies"
import { getTrendingTV, getPopularTV, getTopRatedTV, getTVDetail, discoverTV, getTVGenres, getTVVideos } from "./tv"
import { searchMulti } from "./search"
import { STALE_TIMES } from "@/lib/constants"
import { useLanguageStore } from "@/lib/stores/language-store"

const useLanguage = () => useLanguageStore((s) => s.language)

/* ── Movies ── */

export const useTrendingMovies = (timeWindow: "day" | "week" = "week") => {
  const language = useLanguage()
  return useQuery({
    queryKey: ["movies", "trending", timeWindow, language],
    queryFn: () => getTrendingMovies(timeWindow),
    staleTime: STALE_TIMES.TRENDING,
  })
}

export const usePopularMovies = (page: number = 1) => {
  const language = useLanguage()
  return useQuery({
    queryKey: ["movies", "popular", page, language],
    queryFn: () => getPopularMovies(page),
    staleTime: STALE_TIMES.TRENDING,
  })
}

export const useTopRatedMovies = (page: number = 1) => {
  const language = useLanguage()
  return useQuery({
    queryKey: ["movies", "top-rated", page, language],
    queryFn: () => getTopRatedMovies(page),
    staleTime: STALE_TIMES.TRENDING,
  })
}

export const useUpcomingMovies = (page: number = 1) => {
  const language = useLanguage()
  return useQuery({
    queryKey: ["movies", "upcoming", page, language],
    queryFn: () => getUpcomingMovies(page),
    staleTime: STALE_TIMES.TRENDING,
  })
}

export const useNowPlayingMovies = (page: number = 1) => {
  const language = useLanguage()
  return useQuery({
    queryKey: ["movies", "now-playing", page, language],
    queryFn: () => getNowPlayingMovies(page),
    staleTime: STALE_TIMES.TRENDING,
  })
}

export const useMovieDetail = (id: number) => {
  const language = useLanguage()
  return useQuery({
    queryKey: ["movie", id, language],
    queryFn: () => getMovieDetail(id),
    staleTime: STALE_TIMES.DETAIL,
    enabled: id > 0,
  })
}

export const useDiscoverMovies = (params: Record<string, string> = {}) => {
  const language = useLanguage()
  return useQuery({
    queryKey: ["movies", "discover", params, language],
    queryFn: () => discoverMovies(params),
    staleTime: STALE_TIMES.TRENDING,
  })
}

export const useMovieGenres = () => {
  const language = useLanguage()
  return useQuery({
    queryKey: ["genres", "movie", language],
    queryFn: getMovieGenres,
    staleTime: STALE_TIMES.GENRES,
  })
}

/* ── TV Shows ── */

export const useTrendingTV = (timeWindow: "day" | "week" = "week") => {
  const language = useLanguage()
  return useQuery({
    queryKey: ["tv", "trending", timeWindow, language],
    queryFn: () => getTrendingTV(timeWindow),
    staleTime: STALE_TIMES.TRENDING,
  })
}

export const usePopularTV = (page: number = 1) => {
  const language = useLanguage()
  return useQuery({
    queryKey: ["tv", "popular", page, language],
    queryFn: () => getPopularTV(page),
    staleTime: STALE_TIMES.TRENDING,
  })
}

export const useTopRatedTV = (page: number = 1) => {
  const language = useLanguage()
  return useQuery({
    queryKey: ["tv", "top-rated", page, language],
    queryFn: () => getTopRatedTV(page),
    staleTime: STALE_TIMES.TRENDING,
  })
}

export const useTVDetail = (id: number) => {
  const language = useLanguage()
  return useQuery({
    queryKey: ["tv", id, language],
    queryFn: () => getTVDetail(id),
    staleTime: STALE_TIMES.DETAIL,
    enabled: id > 0,
  })
}

export const useDiscoverTV = (params: Record<string, string> = {}) => {
  const language = useLanguage()
  return useQuery({
    queryKey: ["tv", "discover", params, language],
    queryFn: () => discoverTV(params),
    staleTime: STALE_TIMES.TRENDING,
  })
}

export const useTVGenres = () => {
  const language = useLanguage()
  return useQuery({
    queryKey: ["genres", "tv", language],
    queryFn: getTVGenres,
    staleTime: STALE_TIMES.GENRES,
  })
}

/* ── Videos (for hover preview) ── */

export const useMediaVideos = (
  mediaType: "movie" | "tv",
  id: number,
  enabled: boolean
) => {
  const language = useLanguage()
  return useQuery({
    queryKey: ["videos", mediaType, id, language],
    queryFn: () =>
      mediaType === "movie" ? getMovieVideos(id) : getTVVideos(id),
    staleTime: STALE_TIMES.DETAIL,
    enabled: enabled && id > 0,
  })
}

/* ── Search ── */

export const useSearchMulti = (query: string, page: number = 1) => {
  const language = useLanguage()
  return useQuery({
    queryKey: ["search", query, page, language],
    queryFn: () => searchMulti(query, page),
    staleTime: STALE_TIMES.SEARCH,
    enabled: query.length >= 2,
  })
}
