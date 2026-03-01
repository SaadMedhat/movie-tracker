"use client"

import { useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useT } from "@/lib/i18n/translations"

type SearchInputProps = {
  readonly value: string
  readonly onChange: (value: string) => void
  readonly isLoading?: boolean
  readonly className?: string
}

export function SearchInput({
  value,
  onChange,
  isLoading = false,
  className,
}: SearchInputProps) {
  const t = useT()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn("relative", className)}
    >
      <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-tertiary" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t.search.placeholder}
        aria-label={t.search.ariaLabel}
        className="h-14 w-full rounded-xl border border-border bg-surface pl-12 pr-12 text-base text-foreground placeholder:text-text-ghost transition-colors focus:border-cinema-amber/50 focus:outline-none focus:ring-2 focus:ring-cinema-glow md:h-16 md:text-lg"
      />
      {isLoading ? (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <LoadingSpinner />
        </div>
      ) : value.length > 0 ? (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-text-tertiary transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={t.search.clearSearch}
        >
          <ClearIcon className="h-4 w-4" />
        </button>
      ) : null}
    </motion.div>
  )
}

function LoadingSpinner() {
  return (
    <svg
      className="h-5 w-5 animate-spin text-text-tertiary"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

type IconProps = { readonly className?: string }

function SearchIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function ClearIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}
