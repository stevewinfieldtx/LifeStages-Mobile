"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
}

const languages: Language[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇧🇷" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
  { code: "th", name: "Thai", nativeName: "ไทย", flag: "🇹🇭" },
]

// Languages with localized marketing pages
const localizedLanguages = ["es", "pt", "vi"]

interface LanguageDropdownProps {
  variant?: "light" | "dark"
  className?: string
}

export function LanguageDropdown({ variant = "dark", className = "" }: LanguageDropdownProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0])
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Detect current language from pathname
  useEffect(() => {
    const pathLang = pathname.split("/")[1]
    if (localizedLanguages.includes(pathLang)) {
      const lang = languages.find(l => l.code === pathLang)
      if (lang) setSelectedLanguage(lang)
    } else {
      setSelectedLanguage(languages[0]) // Default to English
    }
  }, [pathname])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (language: Language) => {
    setSelectedLanguage(language)
    setIsOpen(false)
    
    // Determine the base page (church or influencer)
    let basePage = ""
    if (pathname.includes("church")) basePage = "church"
    else if (pathname.includes("influencer")) basePage = "influencer"
    
    if (basePage) {
      // Navigate to localized route
      if (language.code === "en") {
        router.push(`/${basePage}`)
      } else if (localizedLanguages.includes(language.code)) {
        router.push(`/${language.code}/${basePage}`)
      } else {
        // Language not yet localized - stay on current page
        console.log(`${language.name} translation coming soon`)
      }
    } else {
      // Not on a marketing page - just store preference
      localStorage.setItem("userLanguage", language.code)
    }
  }

  const isDark = variant === "dark"

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
          isDark 
            ? "bg-white/10 hover:bg-white/20 border border-white/20 text-white" 
            : "bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-800"
        }`}
      >
        <span className="text-lg">{selectedLanguage.flag}</span>
        <span className="text-sm font-medium hidden sm:inline">{selectedLanguage.name}</span>
        <span className={`material-symbols-outlined text-base transition-transform ${isOpen ? "rotate-180" : ""}`}>
          expand_more
        </span>
      </button>

      {isOpen && (
        <div className={`absolute right-0 mt-2 w-56 rounded-xl shadow-xl z-50 overflow-hidden ${
          isDark 
            ? "bg-[#0f2137] border border-white/20" 
            : "bg-white border border-gray-200"
        }`}>
          <div className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider ${
            isDark ? "text-white/50 border-b border-white/10" : "text-gray-500 border-b border-gray-100"
          }`}>
            Select Language
          </div>
          <div className="max-h-80 overflow-y-auto">
            {languages.map((language) => {
              const isAvailable = language.code === "en" || localizedLanguages.includes(language.code)
              return (
                <button
                  key={language.code}
                  onClick={() => handleSelect(language)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                    selectedLanguage.code === language.code
                      ? isDark 
                        ? "bg-blue-500/20 text-white" 
                        : "bg-blue-50 text-blue-700"
                      : isDark 
                        ? "text-white/80 hover:bg-white/10 hover:text-white" 
                        : "text-gray-700 hover:bg-gray-50"
                  } ${!isAvailable ? "opacity-50" : ""}`}
                >
                  <span className="text-xl">{language.flag}</span>
                  <div className="flex-1">
                    <div className={`text-sm font-medium ${
                      selectedLanguage.code === language.code && !isDark ? "text-blue-700" : ""
                    }`}>
                      {language.name}
                      {!isAvailable && <span className="ml-2 text-xs opacity-60">(Soon)</span>}
                    </div>
                    <div className={`text-xs ${
                      isDark ? "text-white/50" : "text-gray-500"
                    }`}>
                      {language.nativeName}
                    </div>
                  </div>
                  {selectedLanguage.code === language.code && (
                    <span className={`material-symbols-outlined text-base ${
                      isDark ? "text-blue-400" : "text-blue-600"
                    }`}>
                      check
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
