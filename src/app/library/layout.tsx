import { type Metadata } from "next"

export const metadata: Metadata = {
  title: "My Library — Cinetrack",
  description: "Your personal collection of saved movies and TV shows.",
}

export default function LibraryLayout({
  children,
}: Readonly<{
  readonly children: React.ReactNode
}>) {
  return children
}
