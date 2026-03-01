import { type Metadata } from "next"
import { tmdbServerFetch } from "@/lib/api/tmdb-server"
import { type TVShowDetail } from "@/types/tv"
import { TMDB_IMAGE_BASE, BACKDROP_SIZES } from "@/lib/constants"
import TVPageClient from "./tv-page-client"

type Props = {
  readonly params: Promise<{ readonly id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  try {
    const show = await tmdbServerFetch<TVShowDetail>(`tv/${id}`)
    const ogImage = show.backdrop_path
      ? `${TMDB_IMAGE_BASE}/${BACKDROP_SIZES.lg}${show.backdrop_path}`
      : undefined

    return {
      title: `${show.name} — Cinetrack`,
      description: show.overview.slice(0, 160),
      openGraph: {
        title: show.name,
        description: show.overview.slice(0, 160),
        images: ogImage ? [{ url: ogImage, width: 1280, height: 720 }] : [],
        type: "video.tv_show",
      },
      twitter: {
        card: "summary_large_image",
        title: show.name,
        description: show.overview.slice(0, 160),
        images: ogImage ? [ogImage] : [],
      },
    }
  } catch {
    return { title: "TV Show — Cinetrack" }
  }
}

export default function TVPage({ params }: Props) {
  return <TVPageClient params={params} />
}
