import "server-only"

import { cookies } from "next/headers"

const TMDB_BASE_URL = "https://api.themoviedb.org/3"

const getServerLanguage = async (): Promise<string> => {
  const cookieStore = await cookies()
  return cookieStore.get("cinetrack-lang")?.value ?? "it-IT"
}

export const tmdbServerFetch = async <T>(
  path: string,
  params: Record<string, string> = {},
  revalidate: number = 3600
): Promise<T> => {
  const apiKey = process.env.TMDB_API_KEY

  if (!apiKey) {
    throw new Error("TMDB_API_KEY is not configured")
  }

  const language = await getServerLanguage()

  const searchParams = new URLSearchParams({
    language,
    api_key: apiKey,
    ...params,
  })

  const url = `${TMDB_BASE_URL}/${path}?${searchParams.toString()}`

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    next: { revalidate },
  })

  if (!response.ok) {
    throw new Error(`TMDB server fetch failed: ${response.status} ${response.statusText}`)
  }

  const data = (await response.json()) as T
  return data
}
