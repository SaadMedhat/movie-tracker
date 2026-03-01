import "server-only"

const TMDB_BASE_URL = "https://api.themoviedb.org/3"

export const tmdbServerFetch = async <T>(
  path: string,
  params: Record<string, string> = {},
  revalidate: number = 3600
): Promise<T> => {
  const apiKey = process.env.TMDB_API_KEY

  if (!apiKey) {
    throw new Error("TMDB_API_KEY is not configured")
  }

  const searchParams = new URLSearchParams({
    language: "en-US",
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
