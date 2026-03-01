import { type Metadata } from "next"

export const metadata: Metadata = {
  title: "Search — Cinetrack",
  description: "Search for movies and TV shows to add to your collection.",
}

export default function SearchLayout({
  children,
}: Readonly<{
  readonly children: React.ReactNode
}>) {
  return children
}
