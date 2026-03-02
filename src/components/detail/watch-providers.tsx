"use client"

import { type ReactNode } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { useWatchProviders } from "@/lib/api/queries"
import { getLogoUrl, getCountryFromLanguage } from "@/lib/utils/media"
import { useLanguageStore } from "@/lib/stores/language-store"
import { useT } from "@/lib/i18n/translations"
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/motion"
import { type WatchProvider, type CountryWatchProviders } from "@/types/watch-providers"

type WatchProvidersProps = {
  readonly id: number
  readonly mediaType: "movie" | "tv"
}

type ProviderGroupProps = {
  readonly label: string
  readonly providers: ReadonlyArray<WatchProvider>
  readonly link: string
}

type ProviderLogoProps = {
  readonly provider: WatchProvider
  readonly link: string
}

function ProviderLogo({ provider, link }: ProviderLogoProps): ReactNode {
  const logoUrl = getLogoUrl(provider.logo_path, "md")

  if (!logoUrl) return null

  return (
    <motion.a
      variants={staggerItem}
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      title={provider.provider_name}
      className="group relative"
    >
      <div className="h-10 w-10 overflow-hidden rounded-lg transition-shadow group-hover:shadow-lg group-hover:shadow-cinema-amber/10 md:h-12 md:w-12">
        <Image
          src={logoUrl}
          alt={provider.provider_name}
          width={48}
          height={48}
          className="h-full w-full object-cover"
        />
      </div>
    </motion.a>
  )
}

const ADS_SUFFIX = /\s+with\s+ads$/i

const deduplicateProviders = (
  providers: ReadonlyArray<WatchProvider>
): ReadonlyArray<WatchProvider> => {
  const baseNames = new Set(
    providers
      .filter((p) => !ADS_SUFFIX.test(p.provider_name))
      .map((p) => p.provider_name.toLowerCase())
  )

  return providers.filter((p) => {
    if (!ADS_SUFFIX.test(p.provider_name)) return true
    const baseName = p.provider_name.replace(ADS_SUFFIX, "").toLowerCase()
    return !baseNames.has(baseName)
  })
}

function ProviderGroup({ label, providers, link }: ProviderGroupProps): ReactNode {
  const sorted = deduplicateProviders(providers).toSorted(
    (a, b) => a.display_priority - b.display_priority
  )

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wider text-text-tertiary">
        {label}
      </p>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap gap-2"
      >
        {sorted.map((provider) => (
          <ProviderLogo
            key={provider.provider_id}
            provider={provider}
            link={link}
          />
        ))}
      </motion.div>
    </div>
  )
}

function WatchProvidersSkeleton(): ReactNode {
  return (
    <div className="space-y-3">
      <div className="h-4 w-32 animate-pulse rounded bg-surface-elevated" />
      <div className="flex gap-2">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className="h-10 w-10 animate-pulse rounded-lg bg-surface-elevated md:h-12 md:w-12"
          />
        ))}
      </div>
    </div>
  )
}

export function WatchProviders({ id, mediaType }: WatchProvidersProps): ReactNode {
  const t = useT()
  const language = useLanguageStore((s) => s.language)
  const country = getCountryFromLanguage(language)
  const { data, isLoading } = useWatchProviders(mediaType, id)

  if (isLoading) {
    return <WatchProvidersSkeleton />
  }

  const countryData: CountryWatchProviders | undefined = data?.results[country]

  const hasProviders =
    countryData &&
    ((countryData.flatrate && countryData.flatrate.length > 0) ||
      (countryData.rent && countryData.rent.length > 0) ||
      (countryData.buy && countryData.buy.length > 0))

  if (!hasProviders) {
    return (
      <motion.div variants={fadeInUp} initial="hidden" animate="visible">
        <p className="text-sm text-text-tertiary">{t.detail.notAvailable}</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="space-y-3"
    >
      <h3 className="text-sm font-semibold text-foreground">
        {t.detail.whereToWatch}
      </h3>

      <div className="space-y-3">
        {countryData.flatrate && countryData.flatrate.length > 0 ? (
          <ProviderGroup
            label={t.detail.streaming}
            providers={countryData.flatrate}
            link={countryData.link}
          />
        ) : null}

        {countryData.rent && countryData.rent.length > 0 ? (
          <ProviderGroup
            label={t.detail.rent}
            providers={countryData.rent}
            link={countryData.link}
          />
        ) : null}

        {countryData.buy && countryData.buy.length > 0 ? (
          <ProviderGroup
            label={t.detail.buy}
            providers={countryData.buy}
            link={countryData.link}
          />
        ) : null}
      </div>

      <a
        href="https://www.justwatch.com"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block text-xs text-text-ghost transition-colors hover:text-text-tertiary"
      >
        {t.detail.justWatchAttribution}
      </a>
    </motion.div>
  )
}
