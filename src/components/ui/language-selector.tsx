"use client"

import { useLanguageStore, type Language } from "@/lib/stores/language-store"
import { cn } from "@/lib/utils"

const OPTIONS: ReadonlyArray<{ readonly value: Language; readonly label: string }> = [
  { value: "it-IT", label: "IT" },
  { value: "en-US", label: "EN" },
]

export function LanguageSelector({ className }: { readonly className?: string }) {
  const language = useLanguageStore((s) => s.language)
  const setLanguage = useLanguageStore((s) => s.setLanguage)

  return (
    <div className={cn("flex items-center gap-0.5 rounded-lg bg-surface-elevated p-0.5", className)}>
      {OPTIONS.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => setLanguage(value)}
          className={cn(
            "rounded-md px-2.5 py-1 text-xs font-semibold transition-colors",
            language === value
              ? "bg-cinema-amber text-cinema-amber-foreground"
              : "text-text-secondary hover:text-foreground"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
