"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import {
  type LibraryEntry,
  type MediaStatus,
  type MediaType,
} from "@/types/library"

type LibraryState = {
  readonly entries: ReadonlyArray<LibraryEntry>
  readonly addToLibrary: (
    entry: Omit<LibraryEntry, "addedAt" | "watchedAt" | "rating">
  ) => void
  readonly removeFromLibrary: (id: number, mediaType: MediaType) => void
  readonly updateStatus: (
    id: number,
    mediaType: MediaType,
    status: MediaStatus
  ) => void
  readonly setRating: (
    id: number,
    mediaType: MediaType,
    rating: number | null
  ) => void
  readonly getByStatus: (status: MediaStatus) => ReadonlyArray<LibraryEntry>
  readonly getByMediaType: (mediaType: MediaType) => ReadonlyArray<LibraryEntry>
  readonly isInLibrary: (id: number, mediaType: MediaType) => boolean
  readonly getEntry: (
    id: number,
    mediaType: MediaType
  ) => LibraryEntry | undefined
  readonly getRating: (id: number, mediaType: MediaType) => number | null
}

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
      entries: [],

      addToLibrary: (entry) =>
        set((state) => ({
          entries: [
            ...state.entries,
            {
              ...entry,
              rating: null,
              addedAt: new Date().toISOString(),
              watchedAt:
                entry.status === "watched"
                  ? new Date().toISOString()
                  : null,
            },
          ],
        })),

      removeFromLibrary: (id, mediaType) =>
        set((state) => ({
          entries: state.entries.filter(
            (e) => !(e.id === id && e.mediaType === mediaType)
          ),
        })),

      updateStatus: (id, mediaType, status) =>
        set((state) => ({
          entries: state.entries.map((e) => {
            if (e.id !== id || e.mediaType !== mediaType) return e
            return {
              ...e,
              status,
              watchedAt:
                status === "watched"
                  ? new Date().toISOString()
                  : e.watchedAt,
            }
          }),
        })),

      setRating: (id, mediaType, rating) =>
        set((state) => ({
          entries: state.entries.map((e) => {
            if (e.id !== id || e.mediaType !== mediaType) return e
            return { ...e, rating }
          }),
        })),

      getByStatus: (status) =>
        get().entries.filter((e) => e.status === status),

      getByMediaType: (mediaType) =>
        get().entries.filter((e) => e.mediaType === mediaType),

      isInLibrary: (id, mediaType) =>
        get().entries.some(
          (e) => e.id === id && e.mediaType === mediaType
        ),

      getEntry: (id, mediaType) =>
        get().entries.find(
          (e) => e.id === id && e.mediaType === mediaType
        ),

      getRating: (id, mediaType) => {
        const entry = get().entries.find(
          (e) => e.id === id && e.mediaType === mediaType
        )
        return entry?.rating ?? null
      },
    }),
    {
      name: "cinetrack-library",
    }
  )
)
