import { useLanguageStore } from "@/lib/stores/language-store"

type TMDBError = {
  readonly error: string
  readonly status: number
  readonly details?: string
}

const isTMDBError = (value: unknown): value is TMDBError => {
  if (typeof value !== "object" || value === null) return false
  return "error" in value
}

export const tmdbFetch = async <T>(
  path: string,
  params: Record<string, string> = {}
): Promise<T> => {
  const searchParams = new URLSearchParams({
    language: useLanguageStore.getState().language,
    ...params,
  })

  const url = `/api/tmdb/${path}?${searchParams.toString()}`

  const response = await fetch(url)

  if (!response.ok) {
    const body: unknown = await response.json().catch(() => null)

    if (isTMDBError(body)) {
      throw new Error(`TMDB Error (${body.status}): ${body.error}`)
    }

    throw new Error(`API request failed: ${response.status}`)
  }

  const data = (await response.json()) as T
  return data
}
