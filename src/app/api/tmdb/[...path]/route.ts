import { NextRequest, NextResponse } from "next/server"

const TMDB_BASE_URL = "https://api.themoviedb.org/3"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: ReadonlyArray<string> }> }
): Promise<NextResponse> {
  const apiKey = process.env.TMDB_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: "TMDB API key is not configured" },
      { status: 500 }
    )
  }

  const { path } = await params
  const tmdbPath = path.join("/")
  const searchParams = new URLSearchParams(request.nextUrl.searchParams)
  searchParams.set("api_key", apiKey)
  const queryString = searchParams.toString()

  const url = `${TMDB_BASE_URL}/${tmdbPath}?${queryString}`

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      next: { revalidate: 600 },
    })

    if (!response.ok) {
      const errorBody = await response.text()
      return NextResponse.json(
        { error: "TMDB API error", status: response.status, details: errorBody },
        { status: response.status }
      )
    }

    const data: unknown = await response.json()

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=300",
      },
    })
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch from TMDB" },
      { status: 502 }
    )
  }
}
