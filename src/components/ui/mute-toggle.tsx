"use client"

import { useState, useCallback, useEffect } from "react"
import { cn } from "@/lib/utils"

type MuteToggleProps = {
  readonly iframeRef: React.RefObject<HTMLIFrameElement | null>
  readonly size?: "sm" | "md"
  readonly defaultMuted?: boolean
  readonly className?: string
}

export function MuteToggle({
  iframeRef,
  size = "md",
  defaultMuted = true,
  className,
}: MuteToggleProps) {
  const [isMuted, setIsMuted] = useState(defaultMuted)

  // When defaultMuted is false, unmute the iframe as soon as it's available
  useEffect(() => {
    if (defaultMuted) return
    const iframe = iframeRef.current
    if (!iframe?.contentWindow) return
    iframe.contentWindow.postMessage(
      JSON.stringify({ event: "command", func: "unMute", args: "" }),
      "*"
    )
    iframe.contentWindow.postMessage(
      JSON.stringify({ event: "command", func: "setVolume", args: [30] }),
      "*"
    )
  }, [defaultMuted, iframeRef])

  const toggle = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const iframe = iframeRef.current
      if (!iframe?.contentWindow) return
      const cmd = isMuted ? "unMute" : "mute"
      iframe.contentWindow.postMessage(
        JSON.stringify({ event: "command", func: cmd, args: "" }),
        "*"
      )
      if (isMuted) {
        iframe.contentWindow.postMessage(
          JSON.stringify({ event: "command", func: "setVolume", args: [30] }),
          "*"
        )
      }
      setIsMuted((m) => !m)
    },
    [iframeRef, isMuted]
  )

  const iconSize = size === "sm" ? "h-3 w-3" : "h-4 w-4"
  const btnSize = size === "sm" ? "h-6 w-6" : "h-9 w-9"

  return (
    <button
      onClick={toggle}
      className={cn(
        "flex items-center justify-center rounded-full bg-black/50 text-white/80 backdrop-blur-sm transition-colors hover:bg-black/70 hover:text-white",
        btnSize,
        className
      )}
      aria-label={isMuted ? "Unmute trailer" : "Mute trailer"}
    >
      {isMuted ? (
        <VolumeOffIcon className={iconSize} />
      ) : (
        <VolumeOnIcon className={iconSize} />
      )}
    </button>
  )
}

function VolumeOffIcon({ className }: { readonly className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  )
}

function VolumeOnIcon({ className }: { readonly className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  )
}
