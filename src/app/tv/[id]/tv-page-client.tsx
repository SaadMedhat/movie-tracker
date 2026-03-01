"use client"

import { use } from "react"
import { useTVDetail } from "@/lib/api/queries"
import { MediaDetail } from "@/components/detail"
import { useT } from "@/lib/i18n/translations"

type TVPageClientProps = {
  readonly params: Promise<{ readonly id: string }>
}

export default function TVPageClient({ params }: TVPageClientProps) {
  const { id } = use(params)
  const t = useT()
  const tvId = parseInt(id, 10)
  const { data, isLoading, isError } = useTVDetail(tvId)

  if (isLoading) {
    return null
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <h1 className="font-display text-2xl font-bold text-foreground">
          {t.detail.seriesNotFound}
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          {t.detail.seriesNotFoundDesc}
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

  return <MediaDetail mediaType="tv" data={data} />
}
