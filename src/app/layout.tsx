import { type Metadata } from "next"
import { Geist } from "next/font/google"
import { Space_Grotesk } from "next/font/google"
import { Providers } from "@/components/providers"
import { Navigation, ScrollToTop } from "@/components/layout"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: {
    default: "Cinetrack — Your Film & TV Diary",
    template: "%s",
  },
  description:
    "Discover, track, and organize the films and series you love.",
  metadataBase: new URL("https://cinetrack.app"),
  openGraph: {
    type: "website",
    siteName: "Cinetrack",
    title: "Cinetrack — Your Film & TV Diary",
    description: "Discover, track, and organize the films and series you love.",
  },
  twitter: {
    card: "summary_large_image",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  readonly children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://image.tmdb.org" />
        <link rel="dns-prefetch" href="https://image.tmdb.org" />
      </head>
      <body
        className={`${geistSans.variable} ${spaceGrotesk.variable} font-sans antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-cinema-amber focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-cinema-amber-foreground"
        >
          Skip to content
        </a>
        <Providers>
          <ScrollToTop />
          <Navigation />
          <main id="main-content" className="min-h-screen pb-20 md:pb-0 md:pt-16">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
