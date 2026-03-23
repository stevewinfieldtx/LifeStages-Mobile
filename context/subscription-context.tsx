"use client"

import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from "react"
import {
  initializeIAP,
  getProducts,
  purchaseProduct,
  restorePurchases,
  getSubscriptionInfo,
  type IAPProduct,
  type IAPSubscriptionInfo,
  type SubscriptionStatus,
  PRODUCT_IDS,
} from "@/lib/native-iap"

type SubscriptionTier = "free" | "trial" | "premium"

interface VoiceUsage {
  checkInsUsed: number
  checkInsLimit: number
  lastResetDate: string
}

interface SubscriptionContextType {
  // Subscription state
  tier: SubscriptionTier
  isLoading: boolean
  subscriptionStatus: SubscriptionStatus
  userEmail: string | null

  // Products from the store
  products: IAPProduct[]

  // Computed properties
  isPremium: boolean
  canAccessPremium: boolean
  canAccessCore: boolean
  canSearchCustomVerse: boolean

  // Voice usage
  voiceUsage: VoiceUsage
  canUseVoice: boolean
  useVoiceCheckIn: () => boolean

  // Trial state
  isTrialActive: boolean
  daysLeftInTrial: number
  trialEndsAt: number | null

  // Actions
  setUserEmail: (email: string) => void
  purchase: (productId: string) => Promise<boolean>
  restore: () => Promise<boolean>
  refreshSubscription: () => Promise<void>

  // Legacy compatibility
  canStartTrial: boolean
  trialBlockedReason: string | null
  customerId: string | null
  checkout: (priceType: "monthly" | "yearly", email?: string) => Promise<void>
  openPortal: () => Promise<void>
  startTrial: () => void
  upgradeToPaid: (plan: "core" | "premium" | "premium-yearly") => void
  offerings: null
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

const STORAGE_KEYS = {
  USER_EMAIL: "bible_user_email",
  VOICE_USAGE: "voiceUsage",
}

const VOICE_LIMITS = {
  free: 1,
  trial: 999,
  premium: 999,
}

function isNewWeek(lastDate: string, currentDate: string): boolean {
  const last = new Date(lastDate)
  const current = new Date(currentDate)
  const lastMonday = new Date(last)
  lastMonday.setDate(last.getDate() - last.getDay() + 1)
  const currentMonday = new Date(current)
  currentMonday.setDate(current.getDate() - current.getDay() + 1)
  return currentMonday > lastMonday
}

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [userEmail, setUserEmailState] = useState<string | null>(null)
  const [subscriptionInfo, setSubscriptionInfo] = useState<IAPSubscriptionInfo>({
    status: "none",
    productId: null,
    expiresAt: null,
    isTrialing: false,
    willRenew: false,
  })
  const [products, setProducts] = useState<IAPProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [voiceUsage, setVoiceUsage] = useState<VoiceUsage>({
    checkInsUsed: 0,
    checkInsLimit: VOICE_LIMITS.free,
    lastResetDate: new Date().toISOString().split("T")[0],
  })

  // Set user email and persist
  const setUserEmail = useCallback((email: string) => {
    const normalized = email.toLowerCase().trim()
    setUserEmailState(normalized)
    localStorage.setItem(STORAGE_KEYS.USER_EMAIL, normalized)
  }, [])

  // Initialize IAP and load products + current subscription
  useEffect(() => {
    const init = async () => {
      setIsLoading(true)

      // Load stored email
      const storedEmail = localStorage.getItem(STORAGE_KEYS.USER_EMAIL)
      let profileEmail = null
      try {
        const savedProfile = localStorage.getItem("userProfile")
        if (savedProfile) {
          const parsed = JSON.parse(savedProfile)
          profileEmail = parsed.email
        }
      } catch {}
      const email = storedEmail || profileEmail
      if (email) {
        setUserEmailState(email)
        localStorage.setItem(STORAGE_KEYS.USER_EMAIL, email)
      }

      // Initialize store
      await initializeIAP()

      // Load products
      const storeProducts = await getProducts()
      setProducts(storeProducts)

      // Check current subscription
      const info = await getSubscriptionInfo()
      setSubscriptionInfo(info)

      setIsLoading(false)
    }

    init()
  }, [])

  // Determine tier
  const tier = useMemo((): SubscriptionTier => {
    if (subscriptionInfo.status === "trialing") return "trial"
    if (subscriptionInfo.status === "active") return "premium"
    return "free"
  }, [subscriptionInfo])

  // Computed
  const isPremium = tier === "premium"
  const isTrialActive = tier === "trial"
  const canAccessPremium = isPremium || isTrialActive
  const canAccessCore = canAccessPremium
  const canSearchCustomVerse = canAccessCore
  const subscriptionStatus = subscriptionInfo.status

  // Trial info
  const trialEndsAt = subscriptionInfo.isTrialing ? subscriptionInfo.expiresAt : null
  const daysLeftInTrial = useMemo(() => {
    if (!trialEndsAt) return 0
    const diff = trialEndsAt - Date.now()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }, [trialEndsAt])

  // Voice usage
  useEffect(() => {
    const savedVoiceUsage = localStorage.getItem(STORAGE_KEYS.VOICE_USAGE)
    if (savedVoiceUsage) {
      try {
        const parsed = JSON.parse(savedVoiceUsage)
        const today = new Date().toISOString().split("T")[0]
        if (isNewWeek(parsed.lastResetDate, today)) {
          const newUsage = { checkInsUsed: 0, checkInsLimit: VOICE_LIMITS.free, lastResetDate: today }
          setVoiceUsage(newUsage)
          localStorage.setItem(STORAGE_KEYS.VOICE_USAGE, JSON.stringify(newUsage))
        } else {
          setVoiceUsage(parsed)
        }
      } catch {}
    }
  }, [])

  useEffect(() => {
    const newLimit = VOICE_LIMITS[tier] ?? VOICE_LIMITS.free
    setVoiceUsage((prev) => {
      const updated = { ...prev, checkInsLimit: newLimit }
      localStorage.setItem(STORAGE_KEYS.VOICE_USAGE, JSON.stringify(updated))
      return updated
    })
  }, [tier])

  const canUseVoice = isPremium || isTrialActive || voiceUsage.checkInsUsed < voiceUsage.checkInsLimit

  const useVoiceCheckIn = useCallback((): boolean => {
    if (isPremium || isTrialActive) return true
    if (voiceUsage.checkInsUsed >= voiceUsage.checkInsLimit) return false
    const newUsage = { ...voiceUsage, checkInsUsed: voiceUsage.checkInsUsed + 1 }
    setVoiceUsage(newUsage)
    localStorage.setItem(STORAGE_KEYS.VOICE_USAGE, JSON.stringify(newUsage))
    return true
  }, [isPremium, isTrialActive, voiceUsage])

  // Purchase a product via native IAP
  const purchase = useCallback(async (productId: string): Promise<boolean> => {
    try {
      const success = await purchaseProduct(productId)
      if (success) {
        // Refresh subscription info
        const info = await getSubscriptionInfo()
        setSubscriptionInfo(info)
      }
      return success
    } catch (e) {
      console.error("[Subscription] Purchase failed:", e)
      return false
    }
  }, [])

  // Restore purchases
  const restore = useCallback(async (): Promise<boolean> => {
    try {
      const info = await restorePurchases()
      setSubscriptionInfo(info)
      return info.status === "active" || info.status === "trialing"
    } catch {
      return false
    }
  }, [])

  // Refresh subscription info
  const refreshSubscription = useCallback(async () => {
    setIsLoading(true)
    const info = await getSubscriptionInfo()
    setSubscriptionInfo(info)
    setIsLoading(false)
  }, [])

  // Legacy compatibility — these map to native IAP now
  const checkout = useCallback(async (priceType: "monthly" | "yearly") => {
    const productId = priceType === "yearly" ? PRODUCT_IDS.YEARLY : PRODUCT_IDS.MONTHLY
    await purchase(productId)
  }, [purchase])

  const startTrial = useCallback(() => {
    checkout("monthly")
  }, [checkout])

  const upgradeToPaid = useCallback(
    (plan: "core" | "premium" | "premium-yearly") => {
      checkout(plan === "premium-yearly" ? "yearly" : "monthly")
    },
    [checkout]
  )

  const openPortal = useCallback(async () => {
    // On native, manage subscriptions through the OS settings
    // iOS: Settings > Apple ID > Subscriptions
    // Android: Play Store > Subscriptions
    console.log("[Subscription] Manage subscription — directing user to OS settings")
  }, [])

  return (
    <SubscriptionContext.Provider
      value={{
        tier,
        isLoading,
        subscriptionStatus,
        userEmail,
        products,
        isPremium,
        canAccessPremium,
        canAccessCore,
        canSearchCustomVerse,
        voiceUsage,
        canUseVoice,
        useVoiceCheckIn,
        isTrialActive,
        daysLeftInTrial,
        trialEndsAt,
        canStartTrial: true,
        trialBlockedReason: null,
        customerId: null,
        setUserEmail,
        purchase,
        restore,
        refreshSubscription,
        checkout,
        openPortal,
        startTrial,
        upgradeToPaid,
        offerings: null,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (!context) {
    throw new Error("useSubscription must be used within a SubscriptionProvider")
  }
  return context
}
