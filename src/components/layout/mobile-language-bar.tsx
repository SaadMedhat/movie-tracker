"use client"

import { LanguageSelector } from "@/components/ui/language-selector"

export function MobileLanguageBar() {
  return (
    <div className="flex justify-end px-4 pt-3 md:hidden">
      <LanguageSelector />
    </div>
  )
}
