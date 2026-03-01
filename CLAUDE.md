# CLAUDE.md — Movie Tracker

## Identità del Progetto

App web per scoprire, traccare e organizzare film e serie TV.
Usa TMDB (The Movie Database) come data source.
L'app deve sentirsi come un prodotto reale — un Letterboxd/Serializd in miniatura, non un progetto tutorial.
L'obiettivo è avere un posto personale dove tenere traccia di cosa hai visto, cosa vuoi vedere, e scoprire cose nuove.

---

## Stack

- **Next.js 15 (App Router) + TypeScript**
- **shadcn/ui + Tailwind CSS**
- **TanStack React Query** per data fetching e caching
- **Framer Motion** per animazioni
- **date-fns** per date
- **Zustand** per stato globale (watchlist, rating, tracking)
- Package manager: **pnpm**
- API: TMDB (themoviedb.org)
- Persistenza locale: **localStorage** via Zustand persist middleware

---

## Regole Dure (Ban)

- **No `let`**, **no `var`** → sempre `const`
- **No `else`** → early returns
- **No `switch`** → object maps o if/return chains
- **No loop imperativi**: `for`, `for...of`, `for...in`, `while`, `do...while` → `.map()`, `.filter()`, `.reduce()`, `.forEach()`
- **No `any`**, **no `unknown`**
- **No colori hex hardcoded** → tutto via CSS variables in `globals.css`
- **No colori Tailwind arbitrari** (es. `text-[#ff0000]`) → solo design tokens
- **No `console.log`** → logger utility se serve
- **No fetch in useEffect** → sempre TanStack Query
- **No default exports** (eccezione: Next.js pages/layouts)
- **No class components**

---

## Anti-Vibecodato — Regole di Design Obbligatorie

### Identità visiva
- L'app ha un mood cinematico, immersivo — i poster e i backdrop dei film SONO il design
- NON è un catalogo e-commerce. NON è una dashboard con tabelle. È un'esperienza editoriale
- Riferimenti: Letterboxd, Apple TV+, MUBI, Criterion Channel — come trattano i film visivamente
- Il contenuto visivo (poster, backdrop) deve dominare; la UI è al servizio delle immagini

### Tipografia
- Display font con personalità per titoli (Syne, Space Grotesk, Instrument Serif, o simile — NO Inter per i titoli)
- Body: sans-serif pulito e leggibile (Geist, Inter, o simile)
- Max 3-4 font size, coerenti
- Letter-spacing e line-height personalizzati

### Layout
- Dark mode ONLY — i film si guardano al buio, l'app deve riflettere questo
- I backdrop TMDB sono cinematici — usarli come hero full-bleed, non comprimerli in card
- Variare layout: hero grande per film featured, poster grid per le liste, layout orizzontale scrollabile per categorie
- NO la solita griglia uniforme di poster tutti uguali — creare gerarchia visiva

### Colori
- Palette scura e cinematica
- Background: nero profondo, non slate/zinc
- Foreground: bianco caldo
- Accent color: singolo, usato con parsimonia (ambra, rosso cinema, blu profondo)
- I colori dei poster/backdrop devono poter "respirare" — la UI non compete con le immagini
- Tutto via CSS variables

### Animazioni (Framer Motion)
- Transizioni pagina fluide — soprattutto dalla lista al dettaglio film
- Poster hover: reveal di info (rating, anno) con animazione sottile — NO scale-105
- Scroll-based animations per le sezioni nella home
- Stagger contenuto sulle griglie
- AnimatePresence per le transizioni tra stati (aggiunta/rimozione watchlist)
- Timing realistici con spring physics

### Micro-interazioni
- Star rating interattivo e animato
- Toggle watchlist con feedback visivo (icona che si anima)
- Hover su poster: overlay con info chiave
- Transizione smooth quando si cambia tab/filtro
- Focus-visible curato

### Cosa NON fare mai
- Griglia di card con shadow-lg e rounded-xl tutte uguali
- Sidebar con filtri a sinistra (troppo dashboard)
- Tabella per mostrare film
- Carousel generico con frecce sx/dx
- Badge colorati per ogni genere
- "No results found" come unico empty state

---

## Struttura Repository

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    # Home — trending, discover, featured
│   ├── movie/
│   │   └── [id]/
│   │       └── page.tsx            # Dettaglio film
│   ├── tv/
│   │   └── [id]/
│   │       └── page.tsx            # Dettaglio serie TV
│   ├── search/
│   │   └── page.tsx                # Ricerca
│   ├── discover/
│   │   └── page.tsx                # Discover con filtri (genere, anno, rating)
│   └── library/
│       └── page.tsx                # Libreria personale (watchlist, visti, rating)
├── components/
│   ├── ui/                         # shadcn components
│   ├── layout/                     # Header, Navigation, Footer
│   ├── media/                      # MediaCard, PosterGrid, HeroBackdrop, MediaRow
│   ├── detail/                     # MediaDetail, CastList, SimilarMedia, TrailerButton
│   ├── library/                    # WatchlistToggle, RatingStars, StatusBadge
│   └── search/                     # SearchInput, SearchResults, FilterBar
├── hooks/
│   ├── use-media-search.ts         # Logica ricerca
│   └── use-debounce.ts             # Debounce per search input
├── lib/
│   ├── api/
│   │   ├── tmdb-client.ts          # Client base TMDB con API key
│   │   ├── movies.ts               # Query functions per film
│   │   ├── tv.ts                   # Query functions per serie TV
│   │   ├── search.ts               # Query functions per ricerca
│   │   └── queries.ts              # React Query hooks centralizzati
│   ├── stores/
│   │   └── library-store.ts        # Zustand store (watchlist, visti, rating)
│   ├── utils/
│   │   ├── date.ts                 # date-fns utilities
│   │   └── media.ts                # Helpers (poster URL, backdrop URL, runtime formatting)
│   ├── motion.ts                   # Framer Motion variants e presets
│   └── constants.ts                # Generi, configurazione, mapping
├── types/
│   ├── movie.ts
│   ├── tv.ts
│   └── library.ts                  # Tipi per watchlist/tracking
└── styles/
    └── globals.css
```

Cartelle: **kebab-case**. Componenti/Tipi: **PascalCase**. Variabili/funzioni: **camelCase**. Costanti: **SCREAMING_SNAKE_CASE** con `as const`.

---

## TypeScript

- `strict`, `noImplicitAny`, `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`
- Sempre `type` in favore di `interface`
- Sempre `readonly` per proprietà di primo livello
- Tipi espliciti per return di funzioni
- No prefisso `I` o `T`
- Boolean: prefisso `is` (es. `isInWatchlist`, `isWatched`, `isLoading`)
- Path aliases: `@/components`, `@/lib`, `@/types`, `@/hooks`

---

## TMDB API

Base URL: `https://api.themoviedb.org/3`
Auth: API key come query param `?api_key=KEY` oppure Bearer token in header (preferire header).
API key in `.env.local` come `TMDB_API_KEY` (no `NEXT_PUBLIC_` — usare API route come proxy per le chiamate client-side).
Immagini: `https://image.tmdb.org/t/p/{size}{path}`

### Endpoint principali

```
# Trending
GET /trending/movie/week
GET /trending/tv/week
GET /trending/all/week

# Discover (con filtri)
GET /discover/movie?sort_by=popularity.desc&with_genres=28&year=2024
GET /discover/tv?sort_by=popularity.desc&with_genres=18

# Dettaglio
GET /movie/{id}?append_to_response=credits,videos,similar,recommendations
GET /tv/{id}?append_to_response=credits,videos,similar,recommendations

# Ricerca
GET /search/multi?query={query}        # Cerca film + serie insieme
GET /search/movie?query={query}
GET /search/tv?query={query}

# Liste
GET /genre/movie/list
GET /genre/tv/list

# Immagini
GET /movie/{id}/images
GET /tv/{id}/images
```

### Size immagini
- Poster: `w185`, `w342`, `w500`, `w780`, `original`
- Backdrop: `w780`, `w1280`, `original`
- Profile (cast): `w185`, `h632`
Usare `w342` per poster in griglia, `w780` per dettaglio, `w1280` per backdrop hero.

### Attenzione
- `append_to_response` permette di prendere credits, videos, similar in una sola call — usarlo SEMPRE nel dettaglio
- I video sono su YouTube — filtrare per `type === "Trailer"` e `site === "YouTube"`
- La ricerca `multi` ritorna sia film che serie — distinguere con `media_type` nella response
- `genre_ids` nel listing sono array di numeri — serve il mapping con `genre/movie/list`
- Aggiungere `language=en-US` (o `it-IT` se vuoi localizzato) a tutte le chiamate
- Rate limit: 40 req / 10 secondi — generoso ma non abusarne

---

## API Route Proxy

Creare un API route Next.js per proxare le chiamate TMDB:

```
src/app/api/tmdb/[...path]/route.ts
```

Questo permette di:
- Tenere la API key solo server-side (sicurezza)
- Avere un singolo punto di uscita per tutte le chiamate
- Aggiungere caching/headers se serve

Il client chiama `/api/tmdb/trending/movie/week` → il route handler chiama TMDB con la key e ritorna la response.

---

## Data Fetching

- Homepage trending/featured: fetch server-side con `revalidate: 3600`
- Tutto il resto: client-side con TanStack React Query
- Mai fetch in useEffect
- `staleTime: 1000 * 60 * 10` (10 min) per trending — cambiano lentamente
- `staleTime: 1000 * 60 * 60` (1 ora) per dettagli film — non cambiano quasi mai
- `enabled` per query dipendenti (search solo quando c'è una query)
- Debounce 300ms sulla search input prima di triggerare la query

---

## Stato Locale — Zustand + Persist

### Library Store (`lib/stores/library-store.ts`)

```typescript
type MediaStatus = "watchlist" | "watched" | "watching"
type MediaType = "movie" | "tv"

type LibraryEntry = {
  readonly id: number
  readonly mediaType: MediaType
  readonly title: string
  readonly posterPath: string | null
  readonly status: MediaStatus
  readonly rating: number | null        // 1-5 stelle
  readonly addedAt: string              // ISO date
  readonly watchedAt: string | null     // ISO date
}
```

Usare Zustand con `persist` middleware per salvare in localStorage.
Actions: `addToLibrary`, `removeFromLibrary`, `updateStatus`, `setRating`.
Selectors: `getByStatus`, `getByMediaType`, `isInLibrary`, `getRating`.

---

## Componenti & React

### Ordine nel Componente
1. Costanti/props
2. Custom hooks
3. Library hooks
4. useState/useRef
5. useMemo
6. useCallback
7. useEffect
8. Helper functions
9. Return JSX

### Pattern
- Solo functional components
- Props type sopra la definizione, destrutturare nella signature
- Preferire composition su prop drilling (>3 livelli)
- Un componente = una responsabilità
- Barrel file (`index.ts`) per ogni cartella

---

## Tailwind & shadcn

- Mobile-first: base = mobile, poi `sm:`, `md:`, `lg:`, `xl:`
- `cn()` per classi condizionali
- Mai valori arbitrari per colori
- Customizzare shadcn via composition, estendere con `cva`
- Dark mode only: non serve il toggle, configurare Tailwind con `darkMode: "class"` e applicare `dark` alla root

---

## Immagini

- `next/image` per tutti i poster e backdrop
- Poster in griglia: `w342` come src, `w780` come srcset per retina
- Backdrop hero: `w1280` con `priority`
- Placeholder: colore scuro come fallback (non blur)
- Gestire `poster_path === null` con un placeholder elegante (non un'icona rotta)
- Alt text: titolo del film/serie

---

## Animazioni (Framer Motion)

- Variants riutilizzabili in `lib/motion.ts`
- AnimatePresence per transizioni pagina
- `layoutId` per shared element tra poster in lista → poster in dettaglio (se fattibile con App Router)
- Scroll-triggered: `useScroll` + `useTransform` per parallax su backdrop hero
- Stagger su griglie poster (0.03-0.05s delay)
- Spring physics per interazioni (star rating, watchlist toggle)
- Rispettare `prefers-reduced-motion`

---

## Date (date-fns)

- `parseISO()` per date da TMDB (formato `YYYY-MM-DD`)
- `format()` per display: anno (`yyyy`), data completa (`dd MMMM yyyy`)
- Centralizzare in `src/lib/utils/date.ts`
- Utility: `getYear(releaseDate)`, `formatReleaseDate(date)`

---

## Accessibilità

- WCAG AA contrast (4.5:1) — attenzione al testo su backdrop scuri, serve gradient overlay
- Keyboard: Tab navigation, Enter per azioni, Escape per chiudere
- Focus-visible coerente
- `aria-label` su pulsanti (watchlist toggle, star rating, ricerca)
- Star rating accessibile da tastiera (arrow keys)
- Screen reader: annunciare cambio stato watchlist
- HTML semantico: `<main>`, `<article>`, `<figure>`, `<nav>`

---

## Loading & Error States

- Homepage: skeleton per hero + poster rows
- Ricerca: skeleton grid durante il fetch
- Dettaglio: skeleton con layout che rispecchia il contenuto
- Errore: messaggio user-friendly + retry
- Film non trovato: 404 con suggerimento di tornare alla home
- Poster mancante: placeholder elegante

---

## Performance

- Tree-shakeable imports
- `React.lazy()` + `<Suspense>` per pagine
- API route con caching headers dove appropriato
- Debounce search 300ms
- No `useMemo`/`useCallback` senza motivo
- Preload immagini above-the-fold

---

## Git

- Conventional commits: `type(scope): description`
- Tipi: `feat`, `fix`, `refactor`, `chore`
- Subject < 72 char, imperativo

---

## Build

```bash
pnpm dev        # next dev
pnpm build      # next build
pnpm lint       # eslint
pnpm typecheck  # tsc --noEmit
```
