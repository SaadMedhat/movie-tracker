"use client"

import { useState, useEffect } from "react"

export const useHydration = (): boolean => {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  return isHydrated
}
