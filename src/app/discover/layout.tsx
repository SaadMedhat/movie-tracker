import { type Metadata } from "next"

export const metadata: Metadata = {
  title: "Discover — Cinetrack",
  description: "Discover new movies and TV shows by genre, year, rating, and more.",
}

export default function DiscoverLayout({
  children,
}: Readonly<{
  readonly children: React.ReactNode
}>) {
  return children
}
