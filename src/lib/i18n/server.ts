import "server-only"

import { cookies } from "next/headers"
import { getT } from "./translations"
import { type Language } from "@/lib/stores/language-store"

export const getServerT = async () => {
  const cookieStore = await cookies()
  const language = (cookieStore.get("cinetrack-lang")?.value ?? "it-IT") as Language
  return getT(language)
}
