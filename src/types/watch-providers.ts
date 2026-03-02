export type WatchProvider = {
  readonly logo_path: string
  readonly provider_id: number
  readonly provider_name: string
  readonly display_priority: number
}

export type CountryWatchProviders = {
  readonly link: string
  readonly flatrate?: ReadonlyArray<WatchProvider>
  readonly rent?: ReadonlyArray<WatchProvider>
  readonly buy?: ReadonlyArray<WatchProvider>
}

export type WatchProvidersResponse = {
  readonly id: number
  readonly results: Readonly<Record<string, CountryWatchProviders>>
}
