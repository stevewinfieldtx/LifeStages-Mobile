"use client"

import dynamic from "next/dynamic"

// Completely skip SSR for this page to avoid hydration issues
const VersePageContent = dynamic(() => import("@/components/verse-page-content"), {
  ssr: false,
  loading: () => (
    <div className="relative flex min-h-screen w-full flex-col max-w-md mx-auto bg-[#0c1929] shadow-2xl items-center justify-center">
      <div className="size-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  ),
})

export default function VerseInterpretationPage() {
  return <VersePageContent />
}
