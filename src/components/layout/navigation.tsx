"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { LanguageSelector } from "@/components/ui/language-selector"
import { useT } from "@/lib/i18n/translations"

const NAV_ICONS = [
  { href: "/", key: "home", icon: HomeIcon },
  { href: "/discover", key: "discover", icon: CompassIcon },
  { href: "/library", key: "library", icon: BookmarkIcon },
  { href: "/search", key: "search", icon: SearchIcon },
] as const

export function Navigation() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const t = useT()

  useEffect(() => {
    const handleScroll = (): void => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      {/* Desktop nav — fixed top */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 hidden md:block transition-colors duration-300",
          isScrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border"
            : "bg-transparent"
        )}
      >
        <nav aria-label="Main navigation" className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display text-xl font-bold tracking-tight text-foreground">
              Cinetrack
            </span>
          </Link>

          <div className="flex items-center gap-1">
            {NAV_ICONS.map(({ href, key, icon: Icon }) => {
              const isActive =
                href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "text-foreground"
                      : "text-text-secondary hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{t.nav[key]}</span>
                  {isActive ? (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-lg bg-surface-elevated"
                      style={{ zIndex: -1 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 25,
                      }}
                    />
                  ) : null}
                </Link>
              )
            })}
            <LanguageSelector className="ml-4" />
          </div>
        </nav>
      </motion.header>

      {/* Mobile nav — fixed bottom */}
      <nav aria-label="Main navigation" className="fixed bottom-0 left-0 right-0 z-50 block border-t border-border bg-background/90 backdrop-blur-xl md:hidden">
        <div className="flex h-16 items-center justify-around px-2">
          {NAV_ICONS.map(({ href, key, icon: Icon }) => {
            const isActive =
              href === "/"
                ? pathname === "/"
                : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-1 text-xs transition-colors",
                  isActive
                    ? "text-cinema-amber"
                    : "text-text-tertiary hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{t.nav[key]}</span>
              </Link>
            )
          })}
          <LanguageSelector />
        </div>
      </nav>
    </>
  )
}

/* ── Inline SVG icons to avoid extra dependencies ── */

type IconProps = {
  readonly className?: string
}

function HomeIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  )
}

function CompassIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  )
}

function BookmarkIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
    </svg>
  )
}

function SearchIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}
