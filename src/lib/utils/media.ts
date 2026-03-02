import {
  TMDB_IMAGE_BASE,
  POSTER_SIZES,
  BACKDROP_SIZES,
  PROFILE_SIZES,
  LOGO_SIZES,
} from "@/lib/constants"

type PosterSize = keyof typeof POSTER_SIZES
type BackdropSize = keyof typeof BACKDROP_SIZES
type ProfileSize = keyof typeof PROFILE_SIZES
type LogoSize = keyof typeof LOGO_SIZES

export const getPosterUrl = (
  path: string | null,
  size: PosterSize = "md"
): string | null => {
  if (!path) return null
  return `${TMDB_IMAGE_BASE}/${POSTER_SIZES[size]}${path}`
}

export const getBackdropUrl = (
  path: string | null,
  size: BackdropSize = "lg"
): string | null => {
  if (!path) return null
  return `${TMDB_IMAGE_BASE}/${BACKDROP_SIZES[size]}${path}`
}

export const getProfileUrl = (
  path: string | null,
  size: ProfileSize = "sm"
): string | null => {
  if (!path) return null
  return `${TMDB_IMAGE_BASE}/${PROFILE_SIZES[size]}${path}`
}

export const formatRuntime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

export const formatVoteAverage = (vote: number): string =>
  vote.toFixed(1)

export const getTrailerKey = (
  videos: ReadonlyArray<{ readonly site: string; readonly type: string; readonly key: string }>
): string | null => {
  const trailer = videos.find(
    (v) => v.site === "YouTube" && v.type === "Trailer"
  )
  if (trailer) return trailer.key

  const teaser = videos.find(
    (v) => v.site === "YouTube" && v.type === "Teaser"
  )
  return teaser?.key ?? null
}

export const getMediaTitle = (
  media: { readonly title: string | undefined; readonly name: string | undefined }
): string => media.title ?? media.name ?? "Untitled"

export const getMediaDate = (
  media: { readonly release_date: string | undefined; readonly first_air_date: string | undefined }
): string => media.release_date ?? media.first_air_date ?? ""

export const getLogoUrl = (
  path: string | null,
  size: LogoSize = "md"
): string | null => {
  if (!path) return null
  return `${TMDB_IMAGE_BASE}/${LOGO_SIZES[size]}${path}`
}

export const getCountryFromLanguage = (language: string): string =>
  language.split("-").at(-1) ?? "US"
