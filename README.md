# Cinetrack

A cinematic film & TV tracker inspired by Letterboxd and Serializd. Discover, search, rate, and organize the movies and series you love.

**[Live Demo](https://movie-tracker-itxb.vercel.app/)**

## Features

- **Homepage** — Parallax hero with daily-rotating trending film, 4 curated media rows (Trending, Trending TV, Top Rated, Coming Soon)
- **Detail Pages** — Movie & TV show pages with backdrop parallax, cast carousel, trailer dialog, similar recommendations, personal rating
- **Search** — Debounced multi-search with media type badges, trending fallback when idle
- **Discover** — Filter by type, genre, year, sort order, and minimum rating with inline chip UI and paginated results
- **Library** — Personal collection persisted in localStorage via Zustand, filterable by status (Watchlist / Watching / Watched), with ratings and status management
- **Responsive** — 2-column mobile grids scaling to 6 columns on desktop, bottom nav on mobile, horizontal scroll for filters and media rows
- **Accessible** — Skip-to-content link, full keyboard navigation, arrow key star rating, aria labels, `prefers-reduced-motion` support
- **SEO** — Dynamic metadata with OG images for every detail page, static metadata for all routes

## Tech Stack

- **Framework:** Next.js 15 (App Router, Turbopack)
- **Language:** TypeScript (strict mode with `exactOptionalPropertyTypes`)
- **Styling:** Tailwind CSS v4 + shadcn/ui, dark-only oklch cinema palette
- **Fonts:** Space Grotesk (display) + Geist (body)
- **Data:** TMDB API v3 via server-side proxy route + direct server fetch
- **State:** TanStack React Query (server cache) + Zustand with persist (local library)
- **Animation:** Framer Motion (parallax, stagger, layout animations, AnimatePresence)

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- A [TMDB API key](https://www.themoviedb.org/settings/api) (v3)

### Setup

```bash
git clone https://github.com/SaadMedhat/movie-tracker.git
cd movie-tracker
pnpm install
```

Create a `.env.local` file:

```
TMDB_API_KEY=your_tmdb_v3_api_key
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
pnpm build
```

## Project Structure

```
src/
  app/              # Next.js App Router pages & layouts
    api/tmdb/       # TMDB proxy route with caching
    movie/[id]/     # Movie detail (server metadata + client UI)
    tv/[id]/        # TV detail (server metadata + client UI)
    discover/       # Discover with filters
    search/         # Search with debounce
    library/        # Personal library with tabs
  components/
    detail/         # MediaDetail, CastRow, TrailerDialog, SimilarMedia
    layout/         # Navigation (desktop top bar + mobile bottom bar)
    library/        # RatingStars, WatchlistToggle, LibraryCard
    media/          # PosterCard, MediaRow, HomeHero, HeroBackdrop, skeletons
    search/         # SearchInput, SearchResults
    ui/             # shadcn/ui primitives
  hooks/            # useDebounce, useHydration
  lib/
    api/            # TMDB client/server fetch, movies, tv, search, React Query hooks
    stores/         # Zustand library store with persist
    utils/          # Media helpers, date formatters, cn()
    motion.ts       # Framer Motion variants
    constants.ts    # TMDB image sizes, genre maps, stale times
  types/            # Movie, TVShow, Library types (all readonly)
```

## License

MIT
