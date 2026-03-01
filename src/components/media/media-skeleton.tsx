"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

type PosterSkeletonProps = {
  readonly count?: number
  readonly className?: string
}

export function PosterSkeleton({ count = 6, className }: PosterSkeletonProps) {
  return (
    <div className={cn("flex gap-3 overflow-hidden", className)}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex-shrink-0">
          <Skeleton className="aspect-[2/3] w-32 rounded-lg md:w-40" />
        </div>
      ))}
    </div>
  )
}

export function HeroSkeleton() {
  return (
    <div className="relative h-[70vh] w-full">
      <Skeleton className="absolute inset-0" />
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
        <Skeleton className="mb-3 h-10 w-72 md:w-96" />
        <Skeleton className="mb-2 h-4 w-48" />
        <Skeleton className="h-16 w-full max-w-xl" />
      </div>
    </div>
  )
}

export function MediaRowSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="mx-4 h-6 w-40 md:mx-0" />
      <PosterSkeleton />
    </div>
  )
}

export function DetailSkeleton() {
  return (
    <div className="space-y-8">
      <HeroSkeleton />
      <div className="mx-auto max-w-7xl space-y-4 px-4 md:px-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-24 w-full max-w-2xl" />
      </div>
    </div>
  )
}
