import { useLanguageStore, type Language } from "@/lib/stores/language-store"

const translations = {
  "it-IT": {
    // Navigation
    nav: {
      home: "Home",
      discover: "Esplora",
      library: "Libreria",
      search: "Cerca",
    },

    // Home page
    home: {
      trendingThisWeek: "Tendenze della settimana",
      trendingSeries: "Serie in tendenza",
      topRatedFilms: "Film pi\u00f9 votati",
      comingSoon: "Prossimamente",
      details: "Dettagli",
      errorTitle: "Cinetrack",
      errorMessage: "Impossibile caricare i film in tendenza. Verifica che la chiave API TMDB sia configurata in",
    },

    // Discover page
    discover: {
      title: "Esplora",
      type: "Tipo",
      films: "Film",
      tvSeries: "Serie TV",
      genre: "Genere",
      all: "Tutti",
      year: "Anno",
      sort: "Ordina",
      rating: "Voto",
      popularity: "Popolarit\u00e0",
      ratingSort: "Voto",
      newest: "Pi\u00f9 recenti",
      oldest: "Pi\u00f9 vecchi",
      any: "Tutti",
      classics: "Classici",
      noResults: "Nessun risultato",
      adjustFilters: "Prova a modificare i filtri",
      loading: "Caricamento...",
      loadMore: "Carica altri",
    },

    // Library page
    library: {
      title: "La mia libreria",
      all: "Tutti",
      watchlist: "Da vedere",
      watching: "In corso",
      watched: "Visti",
      emptyAll: "La tua libreria \u00e8 vuota",
      emptyAllDesc: "Inizia a esplorare film e serie in tendenza per costruire la tua collezione.",
      emptyWatchlist: "La tua lista \u00e8 vuota",
      emptyWatchlistDesc: "Esplora la pagina Esplora e aggiungi qualcosa che vuoi guardare.",
      emptyWatching: "Niente in corso",
      emptyWatchingDesc: "Quando inizi a guardare una serie, apparir\u00e0 qui.",
      emptyWatched: "Nessun contenuto visto",
      emptyWatchedDesc: "Segna un film o una serie come visto per tenere traccia di ci\u00f2 che hai visto.",
      added: "Aggiunto",
      film: "Film",
      series: "Serie",
    },

    // Search page
    search: {
      title: "Cerca",
      placeholder: "Cerca film e serie TV...",
      ariaLabel: "Cerca film e serie TV",
      clearSearch: "Cancella ricerca",
      popularNow: "Popolari adesso",
      noResults: "Nessun risultato per",
      tryDifferent: "Prova un titolo diverso o controlla l'ortografia",
    },

    // Detail pages
    detail: {
      cast: "Cast",
      moreLikeThis: "Simili",
      watchTrailer: "Guarda il trailer",
      trailer: "Trailer",
      season: "Stagione",
      seasons: "Stagioni",
      episodes: "Episodi",
      firstAired: "Prima messa in onda:",
      lastAired: "Ultima messa in onda:",
      yourRating: "Il tuo voto",
      directedBy: "Diretto da",
      createdBy: "Creato da",
      filmNotFound: "Film non trovato",
      filmNotFoundDesc: "Non abbiamo trovato questo film. Potrebbe essere stato rimosso o l'ID non \u00e8 valido.",
      seriesNotFound: "Serie non trovata",
      seriesNotFoundDesc: "Non abbiamo trovato questa serie TV. Potrebbe essere stata rimossa o l'ID non \u00e8 valido.",
      backToHome: "Torna alla Home",
      whereToWatch: "Dove guardarlo",
      streaming: "Streaming",
      rent: "Noleggio",
      buy: "Acquisto",
      notAvailable: "Non disponibile in streaming nel tuo paese",
      justWatchAttribution: "Dati forniti da JustWatch",
    },
  },

  "en-US": {
    nav: {
      home: "Home",
      discover: "Discover",
      library: "Library",
      search: "Search",
    },

    home: {
      trendingThisWeek: "Trending This Week",
      trendingSeries: "Trending Series",
      topRatedFilms: "Top Rated Films",
      comingSoon: "Coming Soon",
      details: "Details",
      errorTitle: "Cinetrack",
      errorMessage: "Could not load trending movies. Make sure your TMDB API key is configured in",
    },

    discover: {
      title: "Discover",
      type: "Type",
      films: "Films",
      tvSeries: "TV Series",
      genre: "Genre",
      all: "All",
      year: "Year",
      sort: "Sort",
      rating: "Rating",
      popularity: "Popularity",
      ratingSort: "Rating",
      newest: "Newest",
      oldest: "Oldest",
      any: "Any",
      classics: "Classics",
      noResults: "No results found",
      adjustFilters: "Try adjusting your filters",
      loading: "Loading...",
      loadMore: "Load More",
    },

    library: {
      title: "My Library",
      all: "All",
      watchlist: "Watchlist",
      watching: "Watching",
      watched: "Watched",
      emptyAll: "Your library is empty",
      emptyAllDesc: "Start exploring trending films and series to build your collection.",
      emptyWatchlist: "Your watchlist is empty",
      emptyWatchlistDesc: "Browse the discover page and add something you want to watch.",
      emptyWatching: "Nothing in progress",
      emptyWatchingDesc: "When you start watching a series, it will appear here.",
      emptyWatched: "No watched items yet",
      emptyWatchedDesc: "Mark a film or series as watched to keep track of what you've seen.",
      added: "Added",
      film: "Film",
      series: "Series",
    },

    search: {
      title: "Search",
      placeholder: "Search movies and TV shows...",
      ariaLabel: "Search movies and TV shows",
      clearSearch: "Clear search",
      popularNow: "Popular right now",
      noResults: "No results for",
      tryDifferent: "Try a different title or check the spelling",
    },

    detail: {
      cast: "Cast",
      moreLikeThis: "More Like This",
      watchTrailer: "Watch Trailer",
      trailer: "Trailer",
      season: "Season",
      seasons: "Seasons",
      episodes: "Episodes",
      firstAired: "First aired:",
      lastAired: "Last aired:",
      yourRating: "Your rating",
      directedBy: "Directed by",
      createdBy: "Created by",
      filmNotFound: "Film not found",
      filmNotFoundDesc: "We couldn't find this movie. It may have been removed or the ID is invalid.",
      seriesNotFound: "Series not found",
      seriesNotFoundDesc: "We couldn't find this TV show. It may have been removed or the ID is invalid.",
      backToHome: "Back to Home",
      whereToWatch: "Where to Watch",
      streaming: "Stream",
      rent: "Rent",
      buy: "Buy",
      notAvailable: "Not available for streaming in your country",
      justWatchAttribution: "Data provided by JustWatch",
    },
  },
} satisfies Record<Language, Record<string, Record<string, string>>>

type TranslationStrings = typeof translations

type DeepString<T> = {
  readonly [K in keyof T]: T[K] extends Record<string, unknown> ? DeepString<T[K]> : string
}

export type Translations = DeepString<TranslationStrings["en-US"]>

export const useT = (): Translations => {
  const language = useLanguageStore((s) => s.language)
  return translations[language]
}

export const getT = (language: Language): Translations => translations[language]
