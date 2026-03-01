export type Movie = {
  readonly id: number
  readonly title: string
  readonly original_title: string
  readonly overview: string
  readonly poster_path: string | null
  readonly backdrop_path: string | null
  readonly release_date: string
  readonly vote_average: number
  readonly vote_count: number
  readonly popularity: number
  readonly genre_ids: ReadonlyArray<number>
  readonly adult: boolean
  readonly original_language: string
  readonly media_type?: "movie"
}

export type MovieDetail = {
  readonly id: number
  readonly title: string
  readonly original_title: string
  readonly overview: string
  readonly poster_path: string | null
  readonly backdrop_path: string | null
  readonly release_date: string
  readonly vote_average: number
  readonly vote_count: number
  readonly popularity: number
  readonly genres: ReadonlyArray<Genre>
  readonly runtime: number
  readonly status: string
  readonly tagline: string
  readonly budget: number
  readonly revenue: number
  readonly credits: Credits
  readonly videos: VideoResults
  readonly similar: PaginatedResponse<Movie>
  readonly recommendations: PaginatedResponse<Movie>
}

export type Genre = {
  readonly id: number
  readonly name: string
}

export type CastMember = {
  readonly id: number
  readonly name: string
  readonly character: string
  readonly profile_path: string | null
  readonly order: number
}

export type CrewMember = {
  readonly id: number
  readonly name: string
  readonly job: string
  readonly department: string
  readonly profile_path: string | null
}

export type Credits = {
  readonly cast: ReadonlyArray<CastMember>
  readonly crew: ReadonlyArray<CrewMember>
}

export type Video = {
  readonly id: string
  readonly key: string
  readonly name: string
  readonly site: string
  readonly type: string
  readonly official: boolean
}

export type VideoResults = {
  readonly results: ReadonlyArray<Video>
}

export type PaginatedResponse<T> = {
  readonly page: number
  readonly results: ReadonlyArray<T>
  readonly total_pages: number
  readonly total_results: number
}
