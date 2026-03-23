"use client"


import { apiUrl } from "@/lib/api-base"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useDevotional } from "@/context/devotional-context"
import { HeaderDropdown } from "@/components/header-dropdown"

function DeepDiveContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { devotional } = useDevotional()
  
  // Check if we're in sermon mode
  const isSermonMode = searchParams.get('source') === 'sermon'
  const sermonTitle = searchParams.get('title') || ''
  const sermonSummary = searchParams.get('summary') || ''
  
  const topic = searchParams.get("topic") || (isSermonMode ? "Applying the Sermon" : "")
  const verseReference = isSermonMode ? sermonTitle : (devotional.verse?.reference || "")
  const verseText = isSermonMode ? sermonSummary : (devotional.verse?.text || "")
  
  const [reflection, setReflection] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [hasStarted, setHasStarted] = useState(false)

  // Get user profile for age
  const getAgeRange = () => {
    try {
      const saved = localStorage.getItem("userProfile")
      if (saved) {
        const parsed = JSON.parse(saved)
        return parsed.ageRange || "adult"
      }
    } catch (e) { /* ignore */ }
    return "adult"
  }

  // Generate immediately when we have the content
  useEffect(() => {
    if (hasStarted) return
    
    // For sermon mode, we don't need a topic
    if (!isSermonMode && !topic) return
    
    // If no content, show error
    if (!verseText) {
      setError("Please go back and try again")
      setIsLoading(false)
      return
    }

    setHasStarted(true)
    
    const generateReflection = async () => {
      const ageRange = getAgeRange()
      
      // Check cache first
      const cacheKey = isSermonMode 
        ? `bible3_sermon_lifeline_${sermonTitle}`.toLowerCase().replace(/[\s:]+/g, "_")
        : `bible3_lifeline_${topic}_${verseReference}`.toLowerCase().replace(/[\s:]+/g, "_")
      
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        try {
          const data = JSON.parse(cached)
          if (data.reflection && data.reflection.length > 30) {
            setReflection(data.reflection)
            setIsLoading(false)
            return
          }
        } catch (e) {
          localStorage.removeItem(cacheKey)
        }
      }

      try {
        const response = await fetch(apiUrl("/api/generate-deep-dive", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topic: isSermonMode ? "Applying the Sermon to Daily Life" : topic,
            verseReference: isSermonMode ? sermonTitle : verseReference,
            verseText: isSermonMode ? sermonSummary : verseText,
            ageRange,
            source: isSermonMode ? "sermon" : "verse",
            sermonTitle: isSermonMode ? sermonTitle : undefined,
            sermonSummary: isSermonMode ? sermonSummary : undefined,
          }),
        })

        if (!response.ok) throw new Error("Failed to generate")

        const data = await response.json()
        setReflection(data.reflection)
        
        // Cache it
        localStorage.setItem(cacheKey, JSON.stringify({ reflection: data.reflection }))
      } catch (err) {
        console.error("Lifeline error:", err)
        setError("Unable to generate. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    generateReflection()
  }, [topic, verseReference, verseText, hasStarted, isSermonMode, sermonTitle, sermonSummary])

  // Get icon for topic
  const getTopicIcon = (topicName: string): string => {
    if (isSermonMode) return "podium"
    const icons: Record<string, string> = {
      "Fighting Cancer": "healing",
      "Supporting Someone Sick": "volunteer_activism",
      "Grieving a Death": "sentiment_very_dissatisfied",
      "Going Through Divorce": "link_off",
      "Depression": "cloud",
      "Anxiety & Worry": "psychology",
      "Loneliness & Isolation": "person_off",
      "Financial Crisis": "money_off",
    }
    return icons[topicName] || "explore"
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col max-w-md mx-auto bg-[#0c1929] shadow-2xl">
      {/* Header */}
      <div className="sticky top-0 z-50 flex items-center bg-[#0c1929]/95 backdrop-blur-md p-4 justify-between border-b border-white/10">
        <button
          onClick={() => router.back()}
          className="flex size-10 shrink-0 items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h2 className="text-base font-bold text-purple-400">Lifelines</h2>
        <HeaderDropdown verseReference={verseReference} />
      </div>

      {/* Content */}
      <main className="flex-1 pb-10">
        {/* Topic Header */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="size-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white">
              <span className="material-symbols-outlined">{getTopicIcon(topic)}</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                {isSermonMode ? "Apply to Your Life" : topic}
              </h1>
              {verseReference && (
                <p className="text-sm text-blue-200/70">
                  {isSermonMode ? `From: ${sermonTitle}` : verseReference}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Context Card */}
        {verseText && (
          <div className="px-5 mb-6">
            <div className="bg-purple-500/20 rounded-xl p-4 border border-purple-500/30">
              <p className="text-sm text-purple-200 italic leading-relaxed">
                {isSermonMode ? sermonSummary : `"${verseText}"`}
              </p>
              <p className="text-xs text-purple-400 font-semibold mt-2">
                {isSermonMode ? "Sermon Summary" : verseReference}
              </p>
            </div>
          </div>
        )}

        {/* Reflection */}
        <div className="px-5">
          <div className="bg-white/5 rounded-2xl p-6 shadow-lg border border-white/10">
            {isLoading ? (
              <div className="flex flex-col items-center py-8">
                <div className="size-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-blue-200/70 text-sm">
                  {isSermonMode ? "Creating sermon application..." : "Creating your reflection..."}
                </p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <span className="material-symbols-outlined text-4xl text-rose-400 mb-2">error</span>
                <p className="text-rose-400">{error}</p>
                <button
                  onClick={() => router.back()}
                  className="mt-4 px-4 py-2 rounded-full bg-purple-500 text-white text-sm font-semibold"
                >
                  Go Back
                </button>
              </div>
            ) : (
              <p className="text-blue-100/90 leading-relaxed text-[17px] whitespace-pre-wrap">{reflection}</p>
            )}
          </div>
        </div>

        {/* Talk About It Button */}
        {!isLoading && !error && (
          <div className="px-5 mt-6">
            <button
              onClick={() => router.push(
                isSermonMode 
                  ? `/talk?context=sermon&title=${encodeURIComponent(sermonTitle)}`
                  : `/talk?deepDive=true&topic=${encodeURIComponent(topic)}`
              )}
              className="w-full flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-xl font-semibold shadow-lg active:scale-[0.98] transition-transform"
            >
              <span className="material-symbols-outlined">forum</span>
              Talk About This
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

export default function DeepDivePage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#0c1929]">
        <div className="size-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <DeepDiveContent />
    </Suspense>
  )
}
