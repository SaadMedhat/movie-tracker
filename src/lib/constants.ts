export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p" as const

export const POSTER_SIZES = {
  sm: "w185",
  md: "w342",
  lg: "w500",
  xl: "w780",
  original: "original",
} as const

export const BACKDROP_SIZES = {
  md: "w780",
  lg: "w1280",
  original: "original",
} as const

export const PROFILE_SIZES = {
  sm: "w185",
  lg: "h632",
} as const

export const MOVIE_GENRES: Readonly<Record<number, string>> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
} as const

export const TV_GENRES: Readonly<Record<number, string>> = {
  10759: "Action & Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  10762: "Kids",
  9648: "Mystery",
  10763: "News",
  10764: "Reality",
  10765: "Sci-Fi & Fantasy",
  10766: "Soap",
  10767: "Talk",
  10768: "War & Politics",
  37: "Western",
} as const

export const STALE_TIMES = {
  TRENDING: 1000 * 60 * 10,
  DETAIL: 1000 * 60 * 60,
  SEARCH: 1000 * 60 * 5,
  GENRES: 1000 * 60 * 60 * 24,
  PROVIDERS: 1000 * 60 * 60 * 24,
} as const

export const LOGO_SIZES = {
  sm: "w92",
  md: "w154",
  lg: "w185",
} as const
