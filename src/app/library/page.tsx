"use client"

import { useMemo, useCallback } from "react"
import { useState } from "react"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"
import { useLibraryStore } from "@/lib/stores/library-store"
import { useHydration } from "@/hooks/use-hydration"
import { LibraryCard } from "@/components/library"
import { Skeleton } from "@/components/ui/skeleton"
import { type MediaStatus } from "@/types/library"
import { staggerContainer, fadeInUp } from "@/lib/motion"
import { cn } from "@/lib/utils"

/* ── Tab config ── */

type TabOption = {
  readonly value: MediaStatus | "all"
  readonly label: string
  readonly emptyTitle: string
  readonly emptyDescription: string
}

const TABS: ReadonlyArray<TabOption> = [
  {
    value: "all",
    label: "All",
    emptyTitle: "Your library is empty",
    emptyDescription: "Start exploring trending films and series to build your collection.",
  },
  {
    value: "watchlist",
    label: "Watchlist",
    emptyTitle: "Your watchlist is empty",
    emptyDescription: "Browse the discover page and add something you want to watch.",
  },
  {
    value: "watching",
    label: "Watching",
    emptyTitle: "Nothing in progress",
    emptyDescription: "When you start watching a series, it will appear here.",
  },
  {
    value: "watched",
    label: "Watched",
    emptyTitle: "No watched items yet",
    emptyDescription: "Mark a film or series as watched to keep track of what you've seen.",
  },
] as const

/* ── Page ── */

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState<MediaStatus | "all">("all")
  const isHydrated = useHydration()
  const entries = useLibraryStore((s) => s.entries)

  const handleTabChange = useCallback((value: MediaStatus | "all"): void => {
    setActiveTab(value)
  }, [])

  const filteredEntries = useMemo(() => {
    if (activeTab === "all") return entries
    return entries.filter((e) => e.status === activeTab)
  }, [entries, activeTab])

  const currentTab = useMemo(() => {
    const found = TABS.find((t) => t.value === activeTab)
    return found ?? { value: "all" as const, label: "All", emptyTitle: "Your library is empty", emptyDescription: "Start exploring trending films and series to build your collection." }
  }, [activeTab])

  const counts = useMemo(
    () => ({
      all: entries.length,
      watchlist: entries.filter((e) => e.status === "watchlist").length,
      watching: entries.filter((e) => e.status === "watching").length,
      watched: entries.filter((e) => e.status === "watched").length,
    }),
    [entries]
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6 font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl"
      >
        My Library
      </motion.h1>

      {/* Tabs */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="mb-8 flex flex-wrap items-center gap-2"
      >
        {TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => handleTabChange(tab.value)}
            className={cn(
              "relative rounded-full border px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              activeTab === tab.value
                ? "border-cinema-amber/50 bg-cinema-amber/10 text-cinema-amber"
                : "border-border bg-transparent text-text-secondary hover:border-text-ghost hover:text-foreground"
            )}
          >
            {tab.label}
            {isHydrated && counts[tab.value] > 0 ? (
              <span className="ml-1.5 text-xs opacity-70">
                {counts[tab.value]}
              </span>
            ) : null}
          </button>
        ))}
      </motion.div>

      {/* Content */}
      {!isHydrated ? (
        <LibrarySkeleton />
      ) : (
        <LayoutGroup>
          <AnimatePresence mode="popLayout">
            {filteredEntries.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="mb-4 rounded-full bg-surface-elevated p-4">
                  <BookmarkIcon className="h-8 w-8 text-text-ghost" />
                </div>
                <p className="text-base font-medium text-foreground">
                  {currentTab.emptyTitle}
                </p>
                <p className="mt-1 max-w-xs text-sm text-text-tertiary">
                  {currentTab.emptyDescription}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={activeTab}
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
              >
                <AnimatePresence>
                  {filteredEntries.map((entry) => (
                    <LibraryCard key={`${entry.mediaType}-${entry.id}`} entry={entry} />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </LayoutGroup>
      )}
    </div>
  )
}

/* ── Skeleton ── */

function LibrarySkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: 12 }, (_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="aspect-[2/3] rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  )
}

/* ── Icon ── */

function BookmarkIcon({ className }: { readonly className?: string }) {
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
