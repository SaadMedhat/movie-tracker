"use client"

import { use } from "react"
import { useMovieDetail } from "@/lib/api/queries"
import { MediaDetail } from "@/components/detail"
import { useT } from "@/lib/i18n/translations"

type MoviePageClientProps = {
  readonly params: Promise<{ readonly id: string }>
}

export default function MoviePageClient({ params }: MoviePageClientProps) {
  const { id } = use(params)
  const t = useT()
  const movieId = parseInt(id, 10)
  const { data, isLoading, isError } = useMovieDetail(movieId)

  if (isLoading) {
    return null
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <h1 className="font-display text-2xl font-bold text-foreground">
          {t.detail.filmNotFound}
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          {t.detail.filmNotFoundDesc}
        </p>
        <a
          href="/"
          className="mt-6 inline-flex h-10 items-center rounded-lg bg-cinema-amber px-5 text-sm font-semibold text-cinema-amber-foreground transition-opacity hover:opacity-90"
        >
          {t.detail.backToHome}
        </a>
      </div>
    )
  }

  return <MediaDetail mediaType="movie" data={data} />
}
