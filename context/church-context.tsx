"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { apiUrl } from "@/lib/api-base"

// =====================================================
// TYPES
// =====================================================

export interface ChurchConfig {
  id: string
  slug: string
  name: string
  logo_url: string | null
  primary_color: string
  secondary_color: string
  sermon_review_enabled: boolean
  sermon_prep_enabled: boolean
  last_sermon_title: string | null
  last_sermon_youtube_url: string | null
  last_sermon_summary: string | null
  current_sermon_title: string | null
  current_sermon_scripture: string | null
  current_sermon_theme: string | null
  trueteachings_enabled: boolean
  trueteachings_context: string | null
}

interface ChurchContextType {
  church: ChurchConfig | null
  isLoading: boolean
  hasChurch: boolean
  logo: string | null
  primaryColor: string
  secondaryColor: string
  showSermonRow: boolean
  lastSermon: { title: string; url: string; summary: string } | null
  thisSermon: { title: string; scripture: string; theme: string } | null
}

const DEFAULT_PRIMARY = "#f59e0b"
const DEFAULT_SECONDARY = "#0c1929"

const defaultContext: ChurchContextType = {
  church: null,
  isLoading: true,
  hasChurch: false,
  logo: null,
  primaryColor: DEFAULT_PRIMARY,
  secondaryColor: DEFAULT_SECONDARY,
  showSermonRow: false,
  lastSermon: null,
  thisSermon: null,
}

const ChurchContext = createContext<ChurchContextType>(defaultContext)

export function ChurchProvider({ children }: { children: ReactNode }) {
  const [church, setChurch] = useState<ChurchConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Mark as mounted (client-side only)
  useEffect(() => {
    setMounted(true)
  }, [])

  // Load church data only after mount
  useEffect(() => {
    if (!mounted) return
    loadChurchFromProfile()
  }, [mounted])

  const loadChurchFromProfile = async () => {
    try {
      const savedProfile = localStorage.getItem("userProfile")
      console.log("[ChurchContext] Profile:", savedProfile ? JSON.parse(savedProfile) : "none")
      
      if (!savedProfile) {
        console.log("[ChurchContext] No profile found")
        setIsLoading(false)
        return
      }

      const profile = JSON.parse(savedProfile)
      const churchCode = profile.churchId?.trim().toLowerCase()
      
      console.log("[ChurchContext] Church code from profile:", churchCode)
      
      if (!churchCode) {
        console.log("[ChurchContext] No church code in profile")
        setIsLoading(false)
        return
      }

      console.log("[ChurchContext] Fetching church config for:", churchCode)
      const res = await fetch(apiUrl(`/api/church?slug=${churchCode}&action=info`))
      
      console.log("[ChurchContext] API response status:", res.status)
      
      if (!res.ok) {
        const errorText = await res.text()
        console.log("[ChurchContext] API error:", errorText)
        setIsLoading(false)
        return
      }

      const data = await res.json()
      console.log("[ChurchContext] Church data loaded:", data)
      setChurch(data)
    } catch (err) {
      console.error("[ChurchContext] Error loading church:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // During SSR or before mount, return defaults
  if (!mounted) {
    return (
      <ChurchContext.Provider value={defaultContext}>
        {children}
      </ChurchContext.Provider>
    )
  }

  const hasChurch = !!church
  
  const showSermonRow = hasChurch && (
    (church.sermon_review_enabled && church.last_sermon_title) ||
    (church.sermon_prep_enabled && church.current_sermon_title)
  )

  const lastSermon = hasChurch && church.sermon_review_enabled && church.last_sermon_title
    ? {
        title: church.last_sermon_title,
        url: church.last_sermon_youtube_url || "",
        summary: church.last_sermon_summary || "",
      }
    : null

  const thisSermon = hasChurch && church.sermon_prep_enabled && church.current_sermon_title
    ? {
        title: church.current_sermon_title,
        scripture: church.current_sermon_scripture || "",
        theme: church.current_sermon_theme || "",
      }
    : null

  const value: ChurchContextType = {
    church,
    isLoading,
    hasChurch,
    logo: hasChurch ? church.logo_url : null,
    primaryColor: hasChurch ? (church.primary_color || DEFAULT_PRIMARY) : DEFAULT_PRIMARY,
    secondaryColor: hasChurch ? (church.secondary_color || DEFAULT_SECONDARY) : DEFAULT_SECONDARY,
    showSermonRow,
    lastSermon,
    thisSermon,
  }

  return (
    <ChurchContext.Provider value={value}>
      {children}
    </ChurchContext.Provider>
  )
}

export function useChurch() {
  const context = useContext(ChurchContext)
  if (!context) {
    throw new Error("useChurch must be used within a ChurchProvider")
  }
  return context
}
