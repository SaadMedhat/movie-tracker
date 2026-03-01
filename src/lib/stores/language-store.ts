"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Language = "it-IT" | "en-US"

type LanguageState = {
  readonly language: Language
  readonly setLanguage: (language: Language) => void
}

const setCookie = (language: Language): void => {
  document.cookie = `cinetrack-lang=${language};path=/;max-age=31536000;SameSite=Lax`
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: "it-IT",

      setLanguage: (language) => {
        setCookie(language)
        set({ language })
      },
    }),
    {
      name: "cinetrack-language",
      onRehydrateStorage: () => (state) => {
        if (state?.language) {
          setCookie(state.language)
        }
      },
    }
  )
)
