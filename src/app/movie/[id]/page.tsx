import { type Metadata } from "next"
import { tmdbServerFetch } from "@/lib/api/tmdb-server"
import { type MovieDetail } from "@/types/movie"
import { TMDB_IMAGE_BASE, BACKDROP_SIZES } from "@/lib/constants"
import MoviePageClient from "./movie-page-client"

type Props = {
  readonly params: Promise<{ readonly id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  try {
    const movie = await tmdbServerFetch<MovieDetail>(`movie/${id}`)
    const ogImage = movie.backdrop_path
      ? `${TMDB_IMAGE_BASE}/${BACKDROP_SIZES.lg}${movie.backdrop_path}`
      : undefined

    return {
      title: `${movie.title} — Cinetrack`,
      description: movie.overview.slice(0, 160),
      openGraph: {
        title: movie.title,
        description: movie.overview.slice(0, 160),
        images: ogImage ? [{ url: ogImage, width: 1280, height: 720 }] : [],
        type: "video.movie",
      },
      twitter: {
        card: "summary_large_image",
        title: movie.title,
        description: movie.overview.slice(0, 160),
        images: ogImage ? [ogImage] : [],
      },
    }
  } catch {
    return { title: "Movie — Cinetrack" }
  }
}

export default function MoviePage({ params }: Props) {
  return <MoviePageClient params={params} />
}
