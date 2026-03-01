import { Suspense } from "react"
import { type Metadata } from "next"
import { tmdbServerFetch } from "@/lib/api/tmdb-server"
import { type Movie, type PaginatedResponse } from "@/types/movie"
import { HomeHero, HomeSections } from "@/components/media"
import { getServerT } from "@/lib/i18n/server"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Cinetrack — Your Film & TV Diary",
}

const pickHeroMovie = (movies: ReadonlyArray<Movie>): Movie => {
  const candidates = movies.filter((m) => m.backdrop_path).slice(0, 5)

  if (candidates.length === 0) return movies[0]!

  /* Rotate hero daily based on day-of-year */
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  )
  return candidates[dayOfYear % candidates.length]!
}

async function HeroSection() {
  const t = await getServerT()
  try {
    const data = await tmdbServerFetch<PaginatedResponse<Movie>>(
      "trending/movie/week",
      {},
      3600
    )

    if (!data.results || data.results.length === 0) {
      return <HomeError title={t.home.errorTitle} message={t.home.errorMessage} />
    }

    const heroMovie = pickHeroMovie(data.results)

    return (
      <>
        <HomeHero movie={heroMovie} />
        <HomeSections trendingMovies={[...data.results]} />
      </>
    )
  } catch {
    return <HomeError title={t.home.errorTitle} message={t.home.errorMessage} />
  }
}

function HomeError({ title, message }: { readonly title: string; readonly message: string }) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
        {title}
      </h1>
      <p className="mt-4 max-w-md text-text-secondary">
        {message}{" "}
        <code className="rounded bg-surface-elevated px-1.5 py-0.5 text-sm">.env.local</code>.
      </p>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="-mt-16">
      <Suspense fallback={null}>
        <HeroSection />
      </Suspense>
    </div>
  )
}
